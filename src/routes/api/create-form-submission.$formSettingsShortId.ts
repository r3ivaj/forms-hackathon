import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { moffinApiCall } from '../../utils/publish/moffinApiCall'
import { PREDEFINED_FIELD_IDS } from '../../utils/constants'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../convex/_generated/api'
import { jwtDecode } from 'jwt-decode'

export const Route = createFileRoute(
  '/api/create-form-submission/$formSettingsShortId',
)({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        console.log('🔍 Creating form submission...')
        try {
          // ========================================
          // STEP 1: PARSE FORM DATA AND GET FORM SETTINGS
          // ========================================
          const formData = await request.formData()

          // Get formSettingsShortId from URL params
          const { formSettingsShortId } = params

          // Initialize Convex client
          const convex = new ConvexHttpClient(process.env.CONVEX_URL!)

          // Get form settings from database
          const formSettings = await convex.query(
            api.formSettings.getFormSettingsByShortId,
            {
              shortId: formSettingsShortId,
            },
          )

          if (!formSettings) {
            return json(
              {
                error: {
                  message: 'Form not found',
                },
              },
              { status: 404 },
            )
          }

          // Extract predefined fields and custom answers
          const predefinedFields: Record<string, any> = {}
          const customAnswers: Record<string, any> = {}

          // Process all form data
          for (const [key, value] of formData.entries()) {
            if (PREDEFINED_FIELD_IDS.includes(key as any)) {
              predefinedFields[key] = value
            } else {
              customAnswers[key] = value
            }
          }

          console.log('📝 Predefined fields:', predefinedFields)
          console.log('📄 Custom answers:', customAnswers)

          // ========================================
          // STEP 2: CREATE FORM IN MOFFIN
          // ========================================
          console.log('🆕 Creating form submission in Moffin...')

          // Parse formSchema to get accountType
          const formSchema = formSettings.formSchema
            ? JSON.parse(formSettings.formSchema)
            : null
          const accountType = formSchema?.accountType as 'PM' | 'PF'

          console.log('📋 Account type from form schema:', accountType)

          const formCreationData = {
            ...predefinedFields,
            accountType,
          }

          console.log('📋 Form creation data:', formCreationData)

          // Use the form short_id as slug
          const formSlug = formSettings.slug
          const formResult = await moffinApiCall({
            method: 'POST',
            endpoint: `/v1/customer/hackaton-javi-y-nico/form/${formSlug}`,
            body: formCreationData,
          })

          if (!formResult.success) {
            return json(
              {
                error: {
                  message: formResult.error?.message || 'Error creating form',
                  details: formResult.error?.details,
                },
              },
              { status: 500 },
            )
          }

          const token = formResult.data!.token

          // Decode JWT token to get form ID
          const decodedToken = jwtDecode(token) as { form: number }
          const formId = decodedToken.form

          console.log('✅ Form submission created with ID:', formId)
          console.log('🔑 Token obtained:', token)
          console.log('📋 Decoded token:', decodedToken)

          // ========================================
          // STEP 3: UPLOAD FILES
          // ========================================
          const fileUploadResults: Array<{
            field: string
            fileId: number
            associationId: number
            fileName: string
          }> = []

          // Iterate over customAnswers to find files
          for (const [field, value] of Object.entries(customAnswers)) {
            if (value instanceof File) {
              console.log(`📤 Uploading file for field: ${field}`)

              // Create FormData for file upload
              const fileFormData = new FormData()
              fileFormData.append('file', value)
              fileFormData.append('fieldSlug', field)

              // Use moffinApiCall for file upload with Bearer token
              const fileResult = await moffinApiCall({
                method: 'POST',
                endpoint: `/v1/customer/hackaton-javi-y-nico/form/${formId}/file`,
                bearerToken: token,
                body: fileFormData,
              })

              if (fileResult.success && fileResult.data) {
                fileUploadResults.push({
                  field,
                  fileId: fileResult.data.fileId,
                  associationId: fileResult.data.associationId,
                  fileName: value.name,
                })
                console.log(`✅ File uploaded for ${field}:`, fileResult.data)
              } else {
                console.error(
                  `❌ Failed to upload file for ${field}:`,
                  fileResult.error,
                )
              }
            }
          }

          // ========================================
          // STEP 4: UPDATE CUSTOM ANSWERS
          // ========================================
          console.log('📝 Updating custom answers...')

          // Prepare custom pages answers, filtering out files and adding file data
          const customPagesAnswers: Record<string, any> = {}

          // Add non-file custom answers
          for (const [field, value] of Object.entries(customAnswers)) {
            if (!(value instanceof File)) {
              customPagesAnswers[field] = { value }
            }
          }

          // Add file data to custom answers
          for (const fileResult of fileUploadResults) {
            customPagesAnswers[fileResult.field] = {
              value: {
                fileId: fileResult.fileId,
                associationId: fileResult.associationId,
                fileName: fileResult.fileName,
              },
            }
          }

          // Use moffinApiCall for PATCH with Bearer token
          console.log('customPagesAnswers', customPagesAnswers)
          console.log('token', token)
          console.log('formId', formId)
          const updateResult = await moffinApiCall({
            method: 'PATCH',
            endpoint: `/v1/customer/hackaton-javi-y-nico/form/${formId}`,
            bearerToken: token,
            body: {
              customPagesAnswers,
            },
          })

          console.log('updateResult', updateResult)

          if (!updateResult.success) {
            return json(
              {
                error: {
                  message:
                    updateResult.error?.message ||
                    'Error updating form answers',
                  details: updateResult.error?.details,
                },
              },
              { status: updateResult.error?.status || 500 },
            )
          }

          console.log('✅ Form submission answers updated successfully')

          // ========================================
          // STEP 5: MARK FORM AS COMPLETED
          // ========================================
          console.log('🏁 Marking form as completed...')

          const completeResult = await moffinApiCall({
            method: 'POST',
            endpoint: `/v1/customer/hackaton-javi-y-nico/form/${formId}/complete`,
            bearerToken: token,
            body: {
              nip: null,
            },
          })

          if (!completeResult.success) {
            console.warn(
              '⚠️ Failed to mark form as completed:',
              completeResult.error,
            )
            // Don't fail the entire request if completion fails
            // The form is still submitted successfully
          } else {
            console.log('✅ Form marked as completed successfully')
          }

          // ========================================
          // STEP 6: FINAL RESPONSE
          // ========================================
          return json({
            success: true,
            formId,
            message: 'Form submission created and submitted successfully',
            fileUploads: fileUploadResults,
            customAnswers,
            completed: completeResult.success,
          })
        } catch (error) {
          console.error('❌ Error in create-form-submission endpoint:', error)
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
