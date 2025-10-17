import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getFormSettings = query({
  args: {
    chatId: v.id('chats'),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId)
    if (!chat?.formSettingsId) {
      return null
    }
    return await ctx.db.get(chat.formSettingsId)
  },
})

export const patchFormSettings = mutation({
  args: {
    chatId: v.id('chats'),
    sessionDuration: v.optional(
      v.union(v.literal('unlimited'), v.literal('custom')),
    ),
    customDuration: v.optional(v.number()),
    status: v.optional(v.union(v.literal('draft'), v.literal('published'))),
    formSchema: v.optional(v.string()),
    publishedOnce: v.optional(v.boolean()),
    externalFormConfigId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId)
    if (!chat?.formSettingsId) {
      throw new Error('Form settings not found for this chat')
    }

    // Build update data with only provided fields
    const updateData: Record<string, any> = { updatedAt: Date.now() }

    Object.entries(args).forEach(([key, value]) => {
      if (key !== 'chatId' && value !== undefined) {
        updateData[key] = value
      }
    })

    return await ctx.db.patch(chat.formSettingsId, updateData)
  },
})

export const publishForm = mutation({
  args: {
    chatId: v.id('chats'),
    externalFormConfigId: v.number(),
    formSchema: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId)
    if (!chat?.formSettingsId) {
      throw new Error('Form settings not found for this chat')
    }

    // Check that it's not already published
    const currentFormSettings = await ctx.db.get(chat.formSettingsId)
    if (
      currentFormSettings?.publishedOnce &&
      currentFormSettings?.externalFormConfigId
    ) {
      throw new Error('This form has already been published')
    }

    // Update with publication data
    return await ctx.db.patch(chat.formSettingsId, {
      externalFormConfigId: args.externalFormConfigId,
      publishedOnce: true,
      slug: args.slug,
      status: 'published',
      formSchema: args.formSchema,
      updatedAt: Date.now(),
    })
  },
})

export const republishForm = mutation({
  args: {
    chatId: v.id('chats'),
    formSchema: v.string(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId)
    if (!chat?.formSettingsId) {
      throw new Error('Form settings not found for this chat')
    }

    // Check that it's already published
    const currentFormSettings = await ctx.db.get(chat.formSettingsId)
    if (
      !currentFormSettings?.publishedOnce ||
      !currentFormSettings?.externalFormConfigId
    ) {
      throw new Error('This form has not been published yet')
    }

    // Update only schema and timestamp
    return await ctx.db.patch(chat.formSettingsId, {
      status: 'published',
      formSchema: args.formSchema,
      updatedAt: Date.now(),
    })
  },
})

export const getFormSettingsByShortId = query({
  args: {
    shortId: v.string(),
  },
  handler: async (ctx, args) => {
    // First, get the formSettings by short_id
    const formSettings = await ctx.db
      .query('formSettings')
      .withIndex('by_short_id', (q) => q.eq('short_id', args.shortId))
      .first()

    if (!formSettings) {
      return null
    }

    try {
      return formSettings
    } catch (error) {
      console.error('Error parsing messages or getting form schema:', error)
      return null
    }
  },
})
