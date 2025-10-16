import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'
import { transformFormSchemaToCustomPagesConfig } from '../../utils/publish/transformFormSchema'
import { moffinApiCall } from '../../utils/publish/moffinApiCall'
import { FormSchema } from '@/utils/schemas/formSchema'

export const Route = createFileRoute('/api/publish-form')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ========================================
          // STEP 1: VALIDATE INPUT PARAMETERS
          // ========================================
          const {
            name,
            slug,
            chatId,
            formSchema,
          }: {
            name: string
            slug: string
            chatId: string
            formSchema: FormSchema
          } = await request.json()

          const missingParams = {
            name: !name,
            slug: !slug,
            chatId: !chatId,
            formSchema: !formSchema,
          }

          if (Object.values(missingParams).some(Boolean)) {
            return json(
              {
                error: {
                  message: 'Missing required parameters',
                  details: missingParams,
                },
              },
              { status: 400 },
            )
          }

          // ========================================
          // STEP 2: INITIALIZE CONVEX CLIENT
          // ========================================
          const convex = new ConvexHttpClient(process.env.CONVEX_URL!)

          console.log('🆕 FIRST TIME PUBLICATION - Creating new form')

          // ========================================
          // STEP 3: CREATE FORM CONFIGURATION
          // ========================================
          console.log('🆕 Creating form configuration in Moffin...')

          const formConfigResult = await moffinApiCall({
            method: 'POST',
            endpoint: '/v1/formconfigs',
            body: {
              name,
              slug,
              configuration: { isActive: true },
              accountType: formSchema.accountType,
            },
          })

          if (!formConfigResult.success) {
            return json(
              {
                error: {
                  message:
                    formConfigResult.error?.message ||
                    'Error al crear configuración de formulario',
                  details: formConfigResult.error?.details,
                },
              },
              { status: formConfigResult.error?.status || 500 },
            )
          }

          const formConfigData = formConfigResult.data!
          const moffinFormConfigId = formConfigData.id
          console.log('✅ Form configuration created:', formConfigData)

          // ========================================
          // STEP 4: CREATE CUSTOM PAGES CONFIGURATION
          // ========================================
          console.log('📄 Creating custom pages configuration...')

          // Transform form schema to Moffin required format
          const customPagesConfig =
            transformFormSchemaToCustomPagesConfig(formSchema)

          const customPagesResult = await moffinApiCall({
            method: 'POST',
            endpoint: `/admin/custom-pages-config/${moffinFormConfigId}`,
            body: customPagesConfig,
            apiKey: process.env.MOFFIN_ADMIN_API_KEY,
          })

          if (!customPagesResult.success) {
            return json(
              {
                error: {
                  message:
                    customPagesResult.error?.message ||
                    'Error creating custom pages',
                  details: customPagesResult.error?.details,
                },
              },
              { status: customPagesResult.error?.status || 500 },
            )
          }

          const customPagesData = customPagesResult.data!
          console.log('✅ Custom pages configuration created:', customPagesData)

          // ========================================
          // STEP 5: UPDATE LOCAL DATABASE
          // ========================================
          console.log('💾 Updating local configuration in Convex...')

          await convex.mutation(api.formSettings.publishForm, {
            chatId: chatId as any,
            externalFormConfigId: moffinFormConfigId,
            formSchema: JSON.stringify(formSchema),
          })
          console.log('🎉 Form published successfully for the first time!')

          // ========================================
          // STEP 6: FINAL RESPONSE
          // ========================================
          return json({
            success: true,
            formConfig: formConfigData,
            customPagesConfig: customPagesData,
            message: 'Form published successfully for the first time',
          })
        } catch (error) {
          console.error('❌ Error in publish endpoint:', error)
          return json(
            {
              error: {
                message: 'Internal server error',
                details:
                  error instanceof Error ? error.message : 'Unknown error',
              },
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
