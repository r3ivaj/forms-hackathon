import { FormSchema } from '../tools/validateFormSchema'

export const templateFormSchemas: Record<string, FormSchema> = {
  'onboarding-pm': {
    id: 'onboarding-pm',
    title: 'Onboarding Persona Moral',
    description:
      'Formulario para el proceso de onboarding de empresas y organizaciones',
    steps: [
      {
        id: 'company-info',
        title: 'Información de la Empresa',
        fields: [
          {
            id: 'company-name',
            label: 'Nombre de la empresa',
            type: 'text',
            required: true,
          },
          {
            id: 'legal-representative',
            label: 'Nombre del representante legal',
            type: 'text',
            required: true,
          },
          {
            id: 'rfc',
            label: 'RFC',
            type: 'text',
            required: true,
          },
          {
            id: 'address',
            label: 'Domicilio',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'documents',
        title: 'Documentos Requeridos',
        fields: [
          {
            id: 'constitutive-act',
            label: 'Acta Constitutiva',
            type: 'file',
            required: true,
          },
          {
            id: 'address-proof',
            label: 'Comprobante de domicilio',
            type: 'file',
            required: true,
          },
          {
            id: 'rfc-document',
            label: 'RFC',
            type: 'file',
            required: true,
          },
        ],
      },
    ],
  },
  'onboarding-pf': {
    id: 'onboarding-pf',
    title: 'Onboarding Persona Física',
    description: 'Formulario para el proceso de onboarding de personas físicas',
    steps: [
      {
        id: 'personal-info',
        title: 'Información Personal',
        fields: [
          {
            id: 'full-name',
            label: 'Nombre completo',
            type: 'text',
            required: true,
          },
          {
            id: 'rfc',
            label: 'RFC',
            type: 'text',
            required: true,
          },
          {
            id: 'curp',
            label: 'CURP',
            type: 'text',
            required: true,
          },
          {
            id: 'address',
            label: 'Domicilio',
            type: 'textarea',
            required: true,
          },
          {
            id: 'marital-status',
            label: 'Estado civil',
            type: 'select',
            required: true,
            options: [
              'Soltero(a)',
              'Casado(a)',
              'Divorciado(a)',
              'Viudo(a)',
              'Unión libre',
            ],
          },
          {
            id: 'economic-dependents',
            label: 'Número de dependientes económicos',
            type: 'number',
            required: true,
          },
        ],
      },
      {
        id: 'documents',
        title: 'Documentos Requeridos',
        fields: [
          {
            id: 'ine-photo',
            label: 'Foto de INE (anverso y reverso)',
            type: 'file',
            required: true,
          },
          {
            id: 'address-proof',
            label: 'Comprobante de domicilio',
            type: 'file',
            required: true,
          },
          {
            id: 'rfc-document',
            label: 'RFC',
            type: 'file',
            required: true,
          },
          {
            id: 'curp-document',
            label: 'CURP',
            type: 'file',
            required: true,
          },
          {
            id: 'fiscal-situation',
            label: 'Constancia de Situación Fiscal',
            type: 'file',
            required: true,
          },
        ],
      },
    ],
  },
}
