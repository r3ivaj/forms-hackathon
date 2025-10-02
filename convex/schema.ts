import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    // Chat title to identify the form
    title: v.string(),
    // Reference to form configuration
    formOptionsId: v.id("formOptions"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Each row stores an array of messages
  messages: defineTable({
    chatId: v.id("chats"),
    // Array of messages [{ id, role, metadata, parts }]
    messages: v.array(v.any()),
    createdAt: v.number(),
  }).index("by_chat", ["chatId", "createdAt"]),

  // Form configuration linked to a chat
  formOptions: defineTable({
    chatId: v.id("chats"),
    // Fixed or auto-suggested slug
    slug: v.string(),
    // Form status (draft / published)
    status: v.union(v.literal("draft"), v.literal("published")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  // End-user sessions when filling the form
  sessions: defineTable({
    chatId: v.id("chats"),
    // Unique identifier for the session (e.g. UUID)
    sessionKey: v.string(),
    // Answers stored as flexible JSON
    answers: v.optional(v.any()),
    // Session status
    status: v.union(v.literal("in-progress"), v.literal("completed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_chat", ["chatId"]),
});
