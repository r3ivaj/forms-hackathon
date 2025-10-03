import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChat = mutation({
  args: {
    initialMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const chatId = await ctx.db.insert("chats", {
      title: "Nuevo chat",
      createdAt: now,
      updatedAt: now,
      ...(args.initialMessage && { initialMessage: args.initialMessage }),
    });

    return chatId;
  },
});

export const updateMessages = mutation({
  args: {
    chatId: v.id("chats"),
    messages: v.string(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    await ctx.db.patch(args.chatId, {
      messages: args.messages,
      updatedAt: Date.now(),
    });

    return true;
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

export const updateChatMessages = mutation({
  args: {
    chatId: v.id("chats"),
    messages: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.chatId, { messages: args.messages });
  },
});
