import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EyeOff, Globe } from 'lucide-react'
import { FormCancelDialog } from './FormCancelDialog'
import { FormUrlCopyButton } from './FormUrlCopyButton'
import { useParams } from '@tanstack/react-router'
import { useFormSettings } from '@/hooks/useFormSettings'
import { useMutateFormSettings } from '@/hooks/useMutateFormSettings'
import { FormSchema } from '@/lib/tools/validateFormSchema'

export function FormToolbar({
  latestFormSchema,
  isSchemaDifferent
}: {
  latestFormSchema: FormSchema
  isSchemaDifferent?: boolean
}) {
  const { chatId } = useParams({ from: '/c/$chatId' })
  const { mutateAsync: mutateFormSettingsAsync } = useMutateFormSettings()

  const { data: formSettings, isLoading: isFormSettingsLoading } = useFormSettings(chatId)

  const handlePublish = async () => {
    await mutateFormSettingsAsync({
      chatId: chatId as any,
      status: 'published',
      formSchema: JSON.stringify(latestFormSchema),
    })
  }

  return (
    <div className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Estado del formulario */}
        <div className="flex items-center gap-3">
          {!isFormSettingsLoading && formSettings && (
            <>
              <div className="flex items-center gap-2">
                {formSettings.status === 'published' ? (
                  <>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Público</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Borrador</span>
                  </>
                )}
              </div>
              {formSettings.status === 'published' && (
                <FormUrlCopyButton formOptions={formSettings} />
              )}
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {isFormSettingsLoading ? (
            <>
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-32" />
            </>
          ) : (
            <>
              {formSettings?.status === 'draft' ? (
                <Button onClick={handlePublish}>
                  <Globe className="h-4 w-4" />
                  Publicar
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <FormCancelDialog>
                    <Button variant="outline" title="Cancelar publicación">
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </FormCancelDialog>
                  {isSchemaDifferent && (
                    <Button onClick={handlePublish} variant="default">
                      <Globe className="h-4 w-4" />
                      Publicar cambios
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
