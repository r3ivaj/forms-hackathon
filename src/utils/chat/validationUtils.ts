// Validation utilities for form fields
export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  regex?: string
  email?: boolean
  min?: number
  max?: number
  maxSize?: number
  extensions?: string[]
}

export interface ValidationResult {
  isValid: boolean
  errorMessage?: string
}

/**
 * Validates a field value based on its validation rules
 * @param value - The value to validate
 * @param type - The field type
 * @param validation - The validation rules
 * @param label - The field label for error messages
 * @returns ValidationResult with isValid and optional errorMessage
 */
export function validateField(
  value: any,
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'number',
  validation: FieldValidation | undefined,
  label: string,
): ValidationResult {
  // Required validation
  if (
    validation?.required &&
    (!value || (typeof value === 'string' && value.trim() === ''))
  ) {
    return {
      isValid: false,
      errorMessage: `${label} es requerido`,
    }
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true }
  }

  const stringValue = String(value)

  // Text/Email/Tel/Textarea validations
  if (
    type === 'text' ||
    type === 'email' ||
    type === 'tel' ||
    type === 'textarea'
  ) {
    // Min length validation
    if (validation?.minLength && stringValue.length < validation.minLength) {
      return {
        isValid: false,
        errorMessage: `${label} debe tener al menos ${validation.minLength} caracteres`,
      }
    }

    // Max length validation
    if (validation?.maxLength && stringValue.length > validation.maxLength) {
      return {
        isValid: false,
        errorMessage: `${label} no puede tener más de ${validation.maxLength} caracteres`,
      }
    }

    // Email validation
    if (validation?.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(stringValue)) {
        return {
          isValid: false,
          errorMessage: `${label} debe ser un email válido`,
        }
      }
    }

    // Regex validation
    if (validation?.regex) {
      try {
        const regex = new RegExp(validation.regex)
        if (!regex.test(stringValue)) {
          return {
            isValid: false,
            errorMessage: `${label} no cumple con el formato requerido`,
          }
        }
      } catch (error) {
        console.error('Invalid regex pattern:', validation.regex)
        return {
          isValid: false,
          errorMessage: `${label} tiene un patrón de validación inválido`,
        }
      }
    }
  }

  // Number validations
  if (type === 'number') {
    const numValue = Number(value)
    if (isNaN(numValue)) {
      return {
        isValid: false,
        errorMessage: `${label} debe ser un número válido`,
      }
    }

    if (validation?.min !== undefined && numValue < validation.min) {
      return {
        isValid: false,
        errorMessage: `${label} debe ser mayor o igual a ${validation.min}`,
      }
    }

    if (validation?.max !== undefined && numValue > validation.max) {
      return {
        isValid: false,
        errorMessage: `${label} debe ser menor o igual a ${validation.max}`,
      }
    }
  }

  // File validations
  if (type === 'file' && value instanceof File) {
    // Max size validation (in KB)
    if (validation?.maxSize && value.size > validation.maxSize * 1024) {
      return {
        isValid: false,
        errorMessage: `${label} no puede ser mayor a ${validation.maxSize} KB`,
      }
    }

    // File extension validation
    if (validation?.extensions && validation.extensions.length > 0) {
      const fileExtension = value.name.split('.').pop()?.toLowerCase()
      if (!fileExtension || !validation.extensions.includes(fileExtension)) {
        return {
          isValid: false,
          errorMessage: `${label} debe ser uno de los siguientes tipos: ${validation.extensions.join(', ')}`,
        }
      }
    }
  }

  return { isValid: true }
}

/**
 * Gets HTML attributes for form inputs based on validation rules
 * @param type - The field type
 * @param validation - The validation rules
 * @returns Object with HTML attributes
 */
export function getInputAttributes(
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'file' | 'number',
  validation: FieldValidation | undefined,
) {
  const attributes: Record<string, any> = {}

  if (
    type === 'text' ||
    type === 'email' ||
    type === 'tel' ||
    type === 'textarea'
  ) {
    if (validation?.minLength) {
      attributes.minLength = validation.minLength
    }
    if (validation?.maxLength) {
      attributes.maxLength = validation.maxLength
    }
  }

  if (type === 'number') {
    if (validation?.min !== undefined) {
      attributes.min = validation.min
    }
    if (validation?.max !== undefined) {
      attributes.max = validation.max
    }
  }

  if (type === 'file' && validation?.extensions) {
    attributes.accept = validation.extensions.map((ext) => `.${ext}`).join(',')
  }

  return attributes
}
