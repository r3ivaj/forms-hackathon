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
      id: 'personalIdentity',
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
      id: 'fiscalIdentity',
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
      id: 'contactInfo',
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
      id: 'addressInfo',
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
      id: 'personalSituation',
      title: 'Situación Personal',
      fields: [
        {
          id: 'maritalStatus',
          label: 'Estado civil',
          type: 'select',
          options: [
            { label: 'Soltero(a)', value: 'soltero' },
            { label: 'Casado(a)', value: 'casado' },
            { label: 'Divorciado(a)', value: 'divorciado' },
            { label: 'Viudo(a)', value: 'viudo' },
            { label: 'Unión libre', value: 'union_libre' },
          ],
          validation: { required: true },
        },
        {
          id: 'economicDependents',
          label: 'Número de dependientes económicos',
          type: 'number',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'identityDocuments',
      title: 'Documentos de Identidad',
      fields: [
        {
          id: 'inePhoto',
          label: 'Foto de INE (anverso y reverso)',
          type: 'file',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'fiscalDocuments',
      title: 'Documentos Fiscales',
      fields: [
        {
          id: 'fiscalSituation',
          label: 'Constancia de Situación Fiscal',
          type: 'file',
          validation: { required: true },
        },
      ],
    },
    {
      id: 'addressDocuments',
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
