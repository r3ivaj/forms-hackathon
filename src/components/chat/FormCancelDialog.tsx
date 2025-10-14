import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EyeOff } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { useMutateFormSettings } from '@/hooks/useMutateFormSettings'

interface FormCancelDialogProps {
  children: React.ReactNode
}

export function FormCancelDialog({ children }: FormCancelDialogProps) {
  const [open, setOpen] = useState(false)
  const { chatId } = useParams({ from: '/c/$chatId' })
  const { mutateAsync: mutateFormSettingsAsync } = useMutateFormSettings()

  const handleHide = async () => {
    await mutateFormSettingsAsync({
      chatId: chatId as any,
      status: 'draft',
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar publicación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres cancelar la publicación de este
            formulario? Ya no será visible al público y volverá al estado de
            borrador.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleHide} variant="destructive">
            <EyeOff className="h-4 w-4" />
            Cancelar publicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
