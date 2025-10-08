import { tool } from 'ai'
import { z } from 'zod'

// 🔹 Common validations shared by all fields
const baseValidation = z.object({
  required: z.boolean().optional(),
})

// 🔹 Specific validations per field type
const textValidation = baseValidation.extend({
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().positive().optional(),
  regex: z.string().optional(),
})

const emailValidation = baseValidation.extend({
  email: z.boolean().optional(),
})

const numberValidation = baseValidation.extend({
  min: z.number().optional(),
  max: z.number().optional(),
})

const fileValidation = baseValidation.extend({
  maxSize: z.number().optional(), // max size in KB/MB
  extensions: z.array(z.string()).optional(),
})

const selectValidation = baseValidation.extend({
  // placeholder for future select-specific validations
})

// 🔹 Field definitions discriminated by "type"
const textFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal('text'),
  validation: textValidation.optional(),
})

const emailFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal('email'),
  validation: emailValidation.optional(),
})

const textareaFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal('textarea'),
  validation: textValidation.optional(),
})

const numberFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal('number'),
  validation: numberValidation.optional(),
})

const fileFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal('file'),
  validation: fileValidation.optional(),
})

const selectFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.literal('select'),
  options: z.array(z.string()),
  validation: selectValidation.optional(),
})

// 🔹 Union of all field types
const fieldSchema = z.discriminatedUnion('type', [
  emailFieldSchema,
  textFieldSchema,
  textareaFieldSchema,
  numberFieldSchema,
  fileFieldSchema,
  selectFieldSchema,
])

// 🔹 Session duration schema
const sessionDurationSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('unlimited'),
  }),
  z.object({
    type: z.literal('custom'),
    customMinutes: z.number().int().positive(),
  }),
])

// 🔹 Step and form schemas
const stepSchema = z.object({
  id: z.string(),
  title: z.string(),
  fields: z.array(fieldSchema).min(1),
})

export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1),
  sessionDuration: sessionDurationSchema,
})

export type FormSchema = z.infer<typeof formSchema>

export const validateFormSchema = tool({
  description: 'Validate a form schema',
  inputSchema: formSchema,
  execute: async (schema: FormSchema) => {
    const result = formSchema.safeParse(schema)

    if (!result.success) {
      return {
        isValid: false,
        issues: result.error.issues,
        schema: null,
      }
    }

    return {
      isValid: true,
      issues: [],
      schema: result.data,
    }
  },
})
