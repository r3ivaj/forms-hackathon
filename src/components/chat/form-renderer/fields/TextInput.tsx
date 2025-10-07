import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getInputAttributes } from '@/utils/chat/validationUtils'
import { FieldValidation } from '@/utils/chat/validationUtils'

interface TextInputProps {
  id: string
  label: string
  type: 'text' | 'email' | 'number'
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  placeholder?: string
  validation?: FieldValidation
  required?: boolean
  errors?: string[]
}

export function TextInput({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  validation,
  required = false,
  errors = [],
}: TextInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Ingresa ${label.toLowerCase()}`}
        {...getInputAttributes(type, validation)}
      />
      {errors && errors.length > 0 && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  )
}
