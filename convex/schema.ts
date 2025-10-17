import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  chats: defineTable({
    // Chat title to identify the form
    title: v.string(),
    // Reference to form configuration
    formSettingsId: v.optional(v.id('formSettings')),
    messages: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Form configuration linked to a chat
  formSettings: defineTable({
    chatId: v.id('chats'),
    // Short ID for friendly URLs (auto-generated)
    short_id: v.string(),
    // Form status (draft / published)
    status: v.union(v.literal('draft'), v.literal('published')),
    // Form schema stored as a string
    formSchema: v.optional(v.string()),
    // Track if this form has been published at least once
    publishedOnce: v.optional(v.boolean()),
    // External form configuration data
    externalFormConfigId: v.optional(v.number()),
    slug: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_short_id', ['short_id']),

  // End-user sessions when filling the form
  sessions: defineTable({
    chatId: v.id('chats'),
    // Unique identifier for the session (e.g. UUID)
    sessionKey: v.string(),
    // Answers stored as flexible JSON
    answers: v.optional(v.any()),
    // Session status
    status: v.union(v.literal('in-progress'), v.literal('completed')),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_chat', ['chatId']),
})
