import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { getInputAttributes } from '@/utils/chat/validationUtils'
import { FieldValidation } from '@/utils/chat/validationUtils'

interface TextAreaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  placeholder?: string
  validation?: FieldValidation
  required?: boolean
  errors?: string[]
  rows?: number
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  validation,
  required = false,
  errors = [],
  rows = 4,
}: TextAreaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={id}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Ingresa ${label.toLowerCase()}`}
        rows={rows}
        {...getInputAttributes('textarea', validation)}
      />
      {errors && errors.length > 0 && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  )
}
