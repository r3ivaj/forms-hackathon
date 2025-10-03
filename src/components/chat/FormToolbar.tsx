import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

export function FormToolbar() {
  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing form...')
  }

  const handleSettings = () => {
    // TODO: Implement engine functionality
    console.log('Opening engine...')
  }

  return (
    <div className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="icon" onClick={handleSettings}>
          <Settings className="h-4 w-4" />
        </Button>
        <Button onClick={handlePublish}>Publicar</Button>
      </div>
    </div>
  )
}
