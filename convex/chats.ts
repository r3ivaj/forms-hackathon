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

    // Generate a short ID (6 characters)
    const short_id = nanoid(6);

    // Create formSettings with default configuration
    const formSettingsId = await ctx.db.insert("formSettings", {
      chatId: chatId,
      short_id: short_id,
      status: "draft",
      publishedOnce: false,
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
    // Get chat first
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      return null;
    }

    // Get formSettings in a single query using the formSettingsId
    const formSettings = chat.formSettingsId
      ? await ctx.db.get(chat.formSettingsId)
      : null;

    return {
      ...chat,
      formSettings,
    };
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

