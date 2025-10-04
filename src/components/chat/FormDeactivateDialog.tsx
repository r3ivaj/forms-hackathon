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
import { useMutateFormOptions } from '@/hooks/useMutateFormOptions'

interface FormDeactivateDialogProps {
  children: React.ReactNode
}

export function FormDeactivateDialog({ children }: FormDeactivateDialogProps) {
  const [open, setOpen] = useState(false)
  const { chatId } = useParams({ from: '/c/$chatId' })
  const { mutateAsync: mutateFormOptionsAsync } = useMutateFormOptions()

  const handleDeactivate = async () => {
    await mutateFormOptionsAsync({
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
          <DialogTitle>Desactivar formulario</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres desactivar este formulario?
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
            onClick={handleDeactivate}
            variant="destructive"
          >
            <EyeOff className="h-4 w-4" />
            Desactivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
