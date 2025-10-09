import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm } from '@tanstack/react-form'
import { Globe } from 'lucide-react'
import { useFormConfig } from '@/hooks/useFormConfig'
import { customAlphabet } from 'nanoid'

interface FirstTimePublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: { slug: string; personType: string }) => void
  formTitle?: string
  chatId: string
}


export function FirstTimePublishDialog({
  open,
  onOpenChange,
  onConfirm,
  formTitle,
  chatId,
}: FirstTimePublishDialogProps) {
  const formConfigMutation = useFormConfig()

  const form = useForm({
    defaultValues: {
      personType: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Map personType to Moffin API values
        const accountTypeMap: Record<string, string> = {
          'Persona Física': 'PF',
          'Persona Moral': 'PM',
        }

        // Generate title and slug directly
        const title = formTitle || 'Mi Formulario'
        const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)
        const slug = nanoid() // Generate random 8-character slug with allowed characters only

        // Call the formconfig API
        await formConfigMutation.mutateAsync({
          accountType: accountTypeMap[value.personType],
          name: title,
          slug: slug,
          chatId: chatId,
        })

        // If successful, call the original onConfirm
        await onConfirm({ slug: slug, personType: value.personType })
        onOpenChange(false)
      } catch (error) {
        console.error('Error creating form config:', error)
        // You might want to show an error message to the user here
      }
    },
  })


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">Selecciona el tipo de persona</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Elige el tipo de persona para el formulario antes de publicarlo
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-6 py-4">
            <form.Field
              name="personType"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim() === '') {
                    return 'El tipo de persona es requerido'
                  }
                  return undefined
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Tipo de persona
                  </Label>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Persona Física" id="persona-fisica" />
                      <Label htmlFor="persona-fisica" className="text-sm font-normal cursor-pointer">
                        Persona Física
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Persona Moral" id="persona-moral" />
                      <Label htmlFor="persona-moral" className="text-sm font-normal cursor-pointer">
                        Persona Moral
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    El tipo de persona no se puede cambiar una vez publicado
                  </p>
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={formConfigMutation.isPending}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || formConfigMutation.isPending}
                  className="min-w-[140px]"
                >
                  {formConfigMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      Publicar
                    </>
                  )}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
