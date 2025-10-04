import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings, EyeOff, Globe } from 'lucide-react'
import { FormSettingsDialog } from './FormSettingsDialog'
import { FormHideDialog } from './FormHideDialog'
import { FormUrlCopyButton } from './FormUrlCopyButton'
import { useParams } from '@tanstack/react-router'
import { useFormOptions } from '@/hooks/useFormOptions'
import { useMutateFormOptions } from '@/hooks/useMutateFormOptions'

export function FormToolbar() {
  const { chatId } = useParams({ from: '/c/$chatId' })
  const { mutateAsync: mutateFormOptionsAsync } = useMutateFormOptions()

  const { data: formOptions, isLoading: isFormOptionsLoading } = useFormOptions(chatId)

  const handlePublish = async () => {
    console.log('Publishing form...', formOptions)
    await mutateFormOptionsAsync({
      chatId: chatId as any,
      status: 'published',
    })
  }

  return (
    <div className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Estado del formulario */}
        <div className="flex items-center gap-3">
          {!isFormOptionsLoading && formOptions && (
            <>
              <div className="flex items-center gap-2">
                {formOptions.status === 'published' ? (
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
              {formOptions.status === 'published' && (
                <FormUrlCopyButton formOptions={formOptions} />
              )}
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {isFormOptionsLoading ? (
            <>
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-32" />
            </>
          ) : (
            <>
              <FormSettingsDialog formOptions={formOptions}>
                <Button variant="outline" size="icon" title="Configuración">
                  <Settings className="h-4 w-4" />
                </Button>
              </FormSettingsDialog>

              {formOptions?.status === 'draft' ? (
                <Button onClick={handlePublish}>
                  <Globe className="h-4 w-4" />
                  Publicar
                </Button>
              ) : (
                <FormHideDialog>
                  <Button variant="outline">
                    <EyeOff className="h-4 w-4" />
                    Ocultar
                  </Button>
                </FormHideDialog>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
