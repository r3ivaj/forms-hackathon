import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Settings } from 'lucide-react'
import { FormSettingsDialog } from './FormSettingsDialog'
import { useParams } from '@tanstack/react-router'
import { useFormOptions } from '@/hooks/useFormOptions'

export function FormToolbar() {
  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing form...')
  }
  const { chatId } = useParams({ from: '/c/$chatId' })
  const { data: formOptions, isLoading: isFormOptionsLoading } = useFormOptions(chatId)

  return (
    <div className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-end gap-2">
        {isFormOptionsLoading ? (
          <>
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-32" />
          </>
        ) : (
          <>
            <FormSettingsDialog
              formOptions={formOptions}
            >
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </FormSettingsDialog>
            <Button onClick={handlePublish}>
              {formOptions?.status === 'draft' ? 'Publicar' : 'Guardar borrador'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
