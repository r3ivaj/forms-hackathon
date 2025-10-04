import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { FormSettingsDialog } from './FormSettingsDialog'

export function FormToolbar() {
  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing form...')
  }

  return (
    <div className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-end gap-2">
        <FormSettingsDialog>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </FormSettingsDialog>
        <Button onClick={handlePublish}>Publicar</Button>
      </div>
    </div>
  )
}
