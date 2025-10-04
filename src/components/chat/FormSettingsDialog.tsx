import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from '@tanstack/react-form'
import { useMutateFormOptions } from '@/hooks/useMutateFormOptions'
import { useParams } from '@tanstack/react-router'
import { wait } from '@/utils/wait'

interface FormOptions {
  slug?: string
  status: 'draft' | 'published'
  sessionDuration: 'unlimited' | 'custom'
  customDuration?: number
  nipValidation: boolean
}

interface FormSettingsDialogProps {
  children: React.ReactNode
  formOptions?: FormOptions | null
}

export function FormSettingsDialog({ children, formOptions }: FormSettingsDialogProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { chatId } = useParams({ from: '/c/$chatId' })
  const { mutateAsync: mutateFormOptionsAsync } = useMutateFormOptions()

  const form = useForm({
    defaultValues: {
      sessionDuration: formOptions?.sessionDuration || 'unlimited',
      customDuration: formOptions?.customDuration?.toString() || '',
      slug: formOptions?.slug || '',
      nipValidation: formOptions?.nipValidation || false,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateFormOptionsAsync({
          chatId: chatId as any,
          slug: value.slug,
          sessionDuration: value.sessionDuration,
          customDuration: value.sessionDuration === 'custom' && value.customDuration
            ? parseInt(value.customDuration)
            : undefined,
          nipValidation: value.nipValidation,
        })
        setOpen(false)
      } catch (error) {
        console.error('Error saving form settings:', error)
        // You might want to show a toast notification here
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuración del Formulario</DialogTitle>
          <DialogDescription>
            Configura las opciones básicas del formulario.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-settings"
          className="space-y-6 py-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          {/* Duración de sesión */}
          <form.Field
            name="sessionDuration"
            children={(fieldApi) => {
              const { value } = fieldApi.state
              return (
                <div className="space-y-3">
                  <Label htmlFor="session-duration">Duración de sesión</Label>
                  <Select
                    value={value}
                    onValueChange={(newValue) => {
                      fieldApi.setValue(newValue as 'unlimited' | 'custom')
                    }}
                  >
                    <SelectTrigger id="session-duration">
                      <SelectValue placeholder="Seleccionar duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">Tiempo ilimitado</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )
            }}
          />

          {/* Custom Duration - only show when custom is selected */}
          <form.Field
            name="sessionDuration"
            children={(fieldApi) => {
              const { value } = fieldApi.state
              return value === 'custom' ? (
                <form.Field
                  name="customDuration"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || value === '') {
                        return 'La duración personalizada es requerida'
                      }
                      const num = parseInt(value)
                      if (isNaN(num) || num < 1 || num > 1440) {
                        return 'La duración debe estar entre 1 y 1440 minutos'
                      }
                      return undefined
                    },
                  }}
                  children={(customFieldApi) => {
                    const { handleChange, handleBlur } = customFieldApi
                    const { value } = customFieldApi.state
                    const { errors } = customFieldApi.state.meta
                    return (
                      <div className="space-y-2">
                        <Label htmlFor="custom-duration">Duración (minutos)</Label>
                        <Input
                          id="custom-duration"
                          type="number"
                          min="1"
                          max="1440"
                          value={value || ''}
                          onChange={(e) => handleChange(e.target.value)}
                          onBlur={handleBlur}
                          placeholder="30"
                        />
                        {errors && errors.length > 0 && (
                          <p className="text-sm text-red-500">{errors[0]}</p>
                        )}
                      </div>
                    )
                  }}
                />
              ) : null
            }}
          />

          {/* Slug del formulario */}
          <form.Field
            name="slug"
            validators={{
              onChange: ({ value }) => {
                if (value && !/^[a-z0-9-]+$/.test(value)) {
                  return 'El slug solo puede contener letras minúsculas, números y guiones'
                }
                return undefined
              },
            }}
            children={(fieldApi) => {
              const { handleChange, handleBlur } = fieldApi
              const { value } = fieldApi.state
              const { errors } = fieldApi.state.meta
              return (
                <div className="space-y-3">
                  <Label htmlFor="form-slug">Slug del formulario</Label>
                  <Input
                    id="form-slug"
                    value={value || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="mi-formulario-personalizado"
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional. Se genera automáticamente si se deja vacío.
                  </p>
                  {errors && errors.length > 0 && (
                    <p className="text-sm text-red-500">{errors[0]}</p>
                  )}
                </div>
              )
            }}
          />

          {/* Validación de NIP */}
          <form.Field
            name="nipValidation"
            children={(fieldApi) => {
              const { handleChange } = fieldApi
              const { value } = fieldApi.state
              return (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="nip-validation">Validación de NIP</Label>
                    <p className="text-sm text-muted-foreground">
                      Requerir validación de NIP
                    </p>
                  </div>
                  <Switch
                    id="nip-validation"
                    checked={value}
                    onCheckedChange={handleChange}
                  />
                </div>
              )
            }}
          />
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit]) => (
              <Button
                type="submit"
                form="form-settings"
                disabled={!canSubmit}
              >
                Guardar configuración
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
