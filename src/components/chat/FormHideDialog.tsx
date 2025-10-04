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

interface FormHideDialogProps {
  children: React.ReactNode
}

export function FormHideDialog({ children }: FormHideDialogProps) {
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
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ocultar formulario</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres ocultar este formulario?
            Ya no será visible al público y volverá al estado de borrador.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleHide}
            variant="destructive"
          >
            <EyeOff className="h-4 w-4" />
            Ocultar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
