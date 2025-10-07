import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getInputAttributes } from '@/utils/chat/validationUtils'
import { FieldValidation } from '@/utils/chat/validationUtils'

interface FileInputProps {
  id: string
  label: string
  onChange: (file: File | null) => void
  validation?: FieldValidation
  required?: boolean
  errors?: string[]
}

export function FileInput({
  id,
  label,
  onChange,
  validation,
  required = false,
  errors = [],
}: FileInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type="file"
        onChange={(e) =>
          onChange(
            e.target.files && e.target.files.length > 0
              ? e.target.files[0]
              : null,
          )
        }
        {...getInputAttributes('file', validation)}
      />
      {errors && errors.length > 0 && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  )
}
