import { useState, useEffect } from 'react'
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
import { useFormConfig } from '@/hooks/useFormConfig'

interface FirstTimePublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: { slug: string; personType: string }) => void
  formTitle?: string
}

// Function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

export function FirstTimePublishDialog({
  open,
  onOpenChange,
  onConfirm,
  formTitle,
}: FirstTimePublishDialogProps) {
  const formConfigMutation = useFormConfig()

  const form = useForm({
    defaultValues: {
      title: formTitle || '',
      slug: formTitle ? generateSlug(formTitle) : '',
      personType: '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Call the formconfig API
        await formConfigMutation.mutateAsync({
          accountType: value.personType,
          name: value.title,
          slug: value.slug,
        })

        // If successful, call the original onConfirm
        await onConfirm({ slug: value.slug, personType: value.personType })
        onOpenChange(false)
      } catch (error) {
        console.error('Error creating form config:', error)
        // You might want to show an error message to the user here
      }
    },
  })

  // Auto-update slug when title changes
  useEffect(() => {
    const titleValue = form.getFieldValue('title')
    if (titleValue && titleValue.trim() !== '') {
      const newSlug = generateSlug(titleValue)
      form.setFieldValue('slug', newSlug)
    }
  }, [form.getFieldValue('title')])

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
            {/* Form Title Field */}
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim() === '') {
                    return 'El nombre del formulario es requerido'
                  }
                  return undefined
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    Nombre del formulario
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ingresa el nombre del formulario"
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="slug"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim() === '') {
                    return 'El slug es requerido'
                  }
                  if (!/^[a-zA-Z0-9\-]*$/.test(value)) {
                    return 'La URL sólo puede contener letras, números y guiones'
                  }
                  return undefined
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    URL del formulario
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
