import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createChat = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    const chatId = await ctx.db.insert("chats", {
      title: "Nuevo chat",
      createdAt: now,
      updatedAt: now,
    });

    return chatId;
  },
});

export const updateMessages = mutation({
  args: {
    chatId: v.id("chats"),
    messages: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }

    await ctx.db.patch(args.chatId, {
      messages: JSON.stringify(args.messages),
      updatedAt: Date.now(),
    });

    return true;
  },
});
