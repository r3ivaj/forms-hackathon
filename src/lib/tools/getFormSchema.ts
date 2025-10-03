import { tool } from "ai"
import { formSchema } from "./validateFormSchema"
import * as z from "zod";

export const getFormSchema = tool({
  description: 'Get a form schema',
  inputSchema: z.object({}),
  execute: async () => {
    return z.toJSONSchema(formSchema)
  },
})
