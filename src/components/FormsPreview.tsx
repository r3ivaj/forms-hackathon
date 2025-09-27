import { EmptySection } from '@/components/EmptySection'
import { Box } from 'lucide-react'
import { FormRenderer } from './FormRenderer'
import { FormSchema } from '@/lib/tools/validateFormSchema'

export function FormsPreview({
  formSchema,
}: {
  formSchema: FormSchema | null
}) {
  if (formSchema) {
    return (
      <EmptySection
        title="No hay algún formulario para mostrar"
        description="Chatea con el asistente para crear uno"
        icon={Box}
      />
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <FormRenderer
        formSchema={{
          id: 'form_basico_2_pasos',
          title: 'Formulario básico - 2 pasos',
          description:
            'Formulario simple en dos pasos con un campo para subir archivos.',
          steps: [
            {
              id: 'paso_1',
              title: 'Información personal',
              fields: [
                {
                  id: 'nombre',
                  label: 'Nombre completo',
                  type: 'text',
                  required: true,
                },
                {
                  id: 'email',
                  label: 'Correo electrónico',
                  type: 'text',
                  required: true,
                },
                {
                  id: 'medio_contacto',
                  label: 'Medio de contacto',
                  type: 'select',
                  required: true,
                  options: ['Email', 'Teléfono', 'Whatsapp'],
                },
              ],
            },
            {
              id: 'paso_2',
              title: 'Adjuntar archivo',
              fields: [
                {
                  id: 'archivo',
                  label: 'Subir archivo',
                  type: 'file',
                  required: true,
                },
                {
                  id: 'comentarios',
                  label: 'Comentarios',
                  type: 'textarea',
                  required: false,
                },
              ],
            },
          ],
        }}
      />
    </div>
  )
}
