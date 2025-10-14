import { FormSchema } from '@/utils/schemas/formSchema'

export const onboardingPfSchema: FormSchema = {
  id: 'onboarding-pf',
  title: 'Onboarding Persona Física',
  description: 'Formulario para el proceso de onboarding de personas físicas',
  accountType: 'PF',
  sessionDuration: {
    type: 'unlimited',
  },
  steps: [
    {
      id: 'personal-identity',
      title: 'Identidad Personal',
      fields: [
        {
          id: 'firstName',
          label: 'Nombre',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'middleName',
          label: 'Segundo nombre',
          type: 'text',
          validation: { required: false },
        },
        {
          id: 'firstLastName',
          label: 'Primer apellido',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'secondLastName',
          label: 'Segundo apellido',
          type: 'text',
          validation: { required: false },
        },
      ],
    },
    {
      id: 'fiscal-identity',
      title: 'Identidad Fiscal',
      fields: [
        {
          id: 'rfc',
          label: 'RFC',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'curp',
          label: 'CURP',
          type: 'text',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'contact-info',
      title: 'Información de Contacto',
      fields: [
        {
          id: 'email',
          label: 'Correo electrónico',
          type: 'email',
          validation: { required: true },
        },
        {
          id: 'phone',
          label: 'Teléfono',
          type: 'tel',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'address-info',
      title: 'Domicilio',
      fields: [
        {
          id: 'address',
          label: 'Calle',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'exteriorNumber',
          label: 'Número exterior',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'interiorNumber',
          label: 'Número interior',
          type: 'text',
          validation: { required: false },
        },
        {
          id: 'neighborhood',
          label: 'Colonia',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'municipality',
          label: 'Municipio o delegación',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'city',
          label: 'Ciudad',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'state',
          label: 'Estado',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'zipCode',
          label: 'Código postal',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'country',
          label: 'País',
          type: 'text',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'personal-situation',
      title: 'Situación Personal',
      fields: [
        {
          id: 'marital-status',
          label: 'Estado civil',
          type: 'select',
          options: [
            'Soltero(a)',
            'Casado(a)',
            'Divorciado(a)',
            'Viudo(a)',
            'Unión libre',
          ],
          validation: { required: true },
        },
        {
          id: 'economic-dependents',
          label: 'Número de dependientes económicos',
          type: 'number',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'identity-documents',
      title: 'Documentos de Identidad',
      fields: [
        {
          id: 'ine-photo',
          label: 'Foto de INE (anverso y reverso)',
          type: 'file',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'fiscal-documents',
      title: 'Documentos Fiscales',
      fields: [
        {
          id: 'fiscal-situation',
          label: 'Constancia de Situación Fiscal',
          type: 'file',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'address-documents',
      title: 'Comprobantes de Domicilio',
      fields: [
        {
          id: 'address-proof',
          label: 'Comprobante de domicilio',
          type: 'file',
          validation: { required: true },
        },
      ],
    },
  ],
}
