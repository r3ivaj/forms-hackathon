import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { nanoid } from "nanoid";

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

    // Create formOption with default configuration
    const formOptionsId = await ctx.db.insert("formOptions", {
      chatId: chatId,
      slug: nanoid(),
      status: "draft",
      sessionDuration: "unlimited",
      nipValidation: false,
      createdAt: now,
      updatedAt: now,
    });

    // Update the chat to link the formOption
    await ctx.db.patch(chatId, {
      formOptionsId: formOptionsId,
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

export const getFormOptions = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat?.formOptionsId) {
      return null;
    }
    return await ctx.db.get(chat.formOptionsId);
  },
});

export const updateFormOptions = mutation({
  args: {
    chatId: v.id("chats"),
    slug: v.string(),
    sessionDuration: v.union(v.literal("unlimited"), v.literal("custom")),
    customDuration: v.optional(v.number()),
    nipValidation: v.boolean(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat?.formOptionsId) {
      throw new Error("Form options not found for this chat");
    }

    const now = Date.now();
    return await ctx.db.patch(chat.formOptionsId, {
      slug: args.slug,
      sessionDuration: args.sessionDuration,
      customDuration: args.customDuration,
      nipValidation: args.nipValidation,
      updatedAt: now,
    });
  },
});
