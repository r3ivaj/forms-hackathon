import { FormSchema } from '@/utils/schemas/formSchema'

export const onboardingPmSchema: FormSchema = {
  id: 'onboarding-pm',
  title: 'Onboarding Persona Moral',
  description:
    'Formulario para el proceso de onboarding de empresas y organizaciones',
  accountType: 'PM',
  sessionDuration: {
    type: 'unlimited',
  },
  steps: [
    {
      id: 'basic-company-info',
      title: 'Información Básica de la Empresa',
      fields: [
        {
          id: 'tradeName',
          label: 'Nombre de la empresa',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'rfc',
          label: 'RFC',
          type: 'text',
          validation: { required: true },
        },
        {
          id: 'legalRepresentativeName',
          label: 'Nombre del representante legal',
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
      title: 'Dirección Fiscal',
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
      id: 'legal-documents',
      title: 'Documentos Legales',
      fields: [
        {
          id: 'constitutiveAct',
          label: 'Acta Constitutiva',
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
          id: 'addressProof',
          label: 'Comprobante de domicilio',
          type: 'file',
          validation: { required: true },
        },
      ],
    },
  ],
}
