import { TextInput } from './fields/TextInput'
import { TextArea } from './fields/TextArea'
import { SelectField } from './fields/SelectField'
import { FileInput } from './fields/FileInput'
import { FieldValidation } from '@/utils/chat/validationUtils'

interface FieldSelectorProps {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'number'
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  validation?: FieldValidation
  required?: boolean
  errors?: string[]
  options?: string[]
}

export function FieldSelector({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  validation,
  required = false,
  errors = [],
  options = [],
}: FieldSelectorProps) {
  switch (type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'number':
      return (
        <TextInput
          id={id}
          label={label}
          type={type}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          validation={validation}
          required={required}
          errors={errors}
        />
      )

    case 'textarea':
      return (
        <TextArea
          id={id}
          label={label}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          validation={validation}
          required={required}
          errors={errors}
        />
      )

    case 'select':
      return (
        <SelectField
          id={id}
          label={label}
          value={value || ''}
          onChange={onChange}
          options={options}
          required={required}
          errors={errors}
        />
      )

    case 'file':
      return (
        <FileInput
          id={id}
          label={label}
          onChange={onChange}
          validation={validation}
          required={required}
          errors={errors}
        />
      )

    default:
      return null
  }
}
