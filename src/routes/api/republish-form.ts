import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'
import { transformFormSchemaToCustomPagesConfig } from '../../utils/publish/transformFormSchemaToCustomPagesConfig'
import { moffinApiCall } from '../../utils/publish/moffinApiCall'

export const Route = createFileRoute('/api/republish-form')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ========================================
          // STEP 1: VALIDATE INPUT PARAMETERS
          // ========================================
          const { chatId, formSchema } = await request.json()

          const missingParams = {
            chatId: !chatId,
            formSchema: !formSchema,
          }

          if (Object.values(missingParams).some(Boolean)) {
            return json(
              {
                error: {
                  message: 'Missing required parameters for republishing',
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

          // Get externalFormConfigId to use in the update
          const currentFormSettings = await convex.query(
            api.formSettings.getFormSettings,
            { chatId: chatId },
          )

          if (!currentFormSettings?.externalFormConfigId) {
            return json(
              {
                error: {
                  message: 'External configuration ID not found',
                  details:
                    'The form does not have a valid externalFormConfigId',
                },
              },
              { status: 400 },
            )
          }

          console.log('♻️ REPUBLISHING - Updating existing form')

          const moffinFormConfigId = currentFormSettings.externalFormConfigId!

          // ========================================
          // STEP 3: UPDATE CUSTOM PAGES CONFIGURATION (if needed)
          // ========================================
          console.log('📄 Checking for custom fields...')

          // Transform form schema to Moffin required format
          const customPagesConfig =
            transformFormSchemaToCustomPagesConfig(formSchema)

          let customPagesData = null

          // Only update custom pages if there are custom fields
          if (customPagesConfig.fields.length > 0) {
            console.log('📄 Updating custom pages configuration...')

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
                      'Error updating custom pages',
                    details: customPagesResult.error?.details,
                  },
                },
                { status: customPagesResult.error?.status || 500 },
              )
            }

            customPagesData = customPagesResult.data!
            console.log('✅ Custom pages configuration updated:')
            console.log(JSON.stringify(customPagesData, null, 2))
          } else {
            console.log(
              '⏭️ No custom fields found, skipping custom pages configuration',
            )
          }

          // ========================================
          // STEP 4: UPDATE TIMESTAMP IN LOCAL DATABASE
          // ========================================
          console.log('💾 Updating republish timestamp in Convex...')

          await convex.mutation(api.formSettings.republishForm, {
            chatId: chatId,
            formSchema: JSON.stringify(formSchema),
          })

          console.log('🎉 Form republished successfully!')

          // ========================================
          // STEP 5: FINAL RESPONSE
          // ========================================
          return json({
            success: true,
            formConfig: {
              id: moffinFormConfigId,
              message: 'Existing form configuration reused',
            },
            customPagesConfig: customPagesData,
            message: customPagesData
              ? 'Form republished successfully with custom fields'
              : 'Form republished successfully without custom fields',
            republishedAt: new Date().toISOString(),
          })
        } catch (error) {
          console.error('❌ Error in republish endpoint:', error)
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
