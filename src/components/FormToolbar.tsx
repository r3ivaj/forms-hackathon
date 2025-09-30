import { Button } from '@/components/ui/button'

export function FormToolbar() {
  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log('Publishing form...')
  }

  return (
    <div className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-end">
        <Button onClick={handlePublish}>Publicar</Button>
      </div>
    </div>
  )
}
