import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";
import { getFormSchema } from "../src/utils/chat/getFormSchema";

export const createChat = mutation({
  args: {
    initialMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create the chat first
    const chatId = await ctx.db.insert("chats", {
      title: "Nuevo chat",
      createdAt: now,
      updatedAt: now,
      ...(args.initialMessage && { initialMessage: args.initialMessage }),
    });

    // Generate a short ID (6 characters)
    const short_id = nanoid(6);

    // Create formSettings with default configuration
    const formSettingsId = await ctx.db.insert("formSettings", {
      chatId: chatId,
      short_id: short_id,
      status: "draft",
      sessionDuration: "unlimited",
      nipValidation: false,
      createdAt: now,
      updatedAt: now,
    });

    // Update the chat to link the formSettings
    await ctx.db.patch(chatId, {
      formSettingsId: formSettingsId,
      updatedAt: now,
    });

    return chatId;
  },
});

export const getChat = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chatId);
  },
});

export const patchChatMessages = mutation({
  args: {
    chatId: v.id("chats"),
    messages: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(
      args.chatId,
      { messages: args.messages, updatedAt: Date.now() }
    );
  },
});

export const getFormSettings = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat?.formSettingsId) {
      return null;
    }
    return await ctx.db.get(chat.formSettingsId);
  },
});


export const patchFormSettings = mutation({
  args: {
    chatId: v.id("chats"),
    sessionDuration: v.optional(v.union(v.literal("unlimited"), v.literal("custom"))),
    customDuration: v.optional(v.number()),
    nipValidation: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    formSchema: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat?.formSettingsId) {
      throw new Error("Form settings not found for this chat");
    }

    // Build update data with only provided fields
    const updateData: Record<string, any> = { updatedAt: Date.now() };

    Object.entries(args).forEach(([key, value]) => {
      if (key !== 'chatId' && value !== undefined) {
        updateData[key] = value;
      }
    });

    return await ctx.db.patch(chat.formSettingsId, updateData);
  },
});

export const getFormSettingsByShortId = query({
  args: {
    shortId: v.string(),
  },
  handler: async (ctx, args) => {
    // First, get the formSettings by short_id
    const formSettings = await ctx.db
      .query("formSettings")
      .withIndex("by_short_id", (q) => q.eq("short_id", args.shortId))
      .first();

    if (!formSettings) {
      return null;
    }

    try {
      return formSettings;
    } catch (error) {
      console.error("Error parsing messages or getting form schema:", error);
      return null;
    }
  },
});
