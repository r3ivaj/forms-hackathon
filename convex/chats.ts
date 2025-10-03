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
