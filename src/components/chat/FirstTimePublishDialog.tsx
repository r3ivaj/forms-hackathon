import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

interface FirstTimePublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: { slug: string; personType: string }) => void
}

export function FirstTimePublishDialog({
  open,
  onOpenChange,
  onConfirm,
}: FirstTimePublishDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false)

  const form = useForm({
    defaultValues: {
      slug: '',
      personType: '',
    },
    onSubmit: async ({ value }) => {
      setIsPublishing(true)
      try {
        await onConfirm({ slug: value.slug, personType: value.personType })
        onOpenChange(false)
      } finally {
        setIsPublishing(false)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">Primera publicación</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configura la información básica antes de publicar el formulario
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
              name="slug"
              validators={{
                onChange: ({ value }) => {
                  if (value && value.trim() !== '' && !/^[a-zA-Z0-9-_]+$/.test(value)) {
                    return 'El slug solo puede contener letras, números, guiones y guiones bajos'
                  }
                  return undefined
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    URL del formulario (opcional)
                  </Label>
                  <div className="flex items-center rounded-md border border-input bg-background">
                    <span className="px-3 py-2 text-sm text-muted-foreground border-r border-input">
                      /formulario/
                    </span>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="mi-formulario"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

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
              disabled={isPublishing}
            >
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isPublishing}
                  className="min-w-[140px]"
                >
                  {isPublishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
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
