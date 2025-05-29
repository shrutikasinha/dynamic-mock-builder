export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'fileType'
    value?: string | number | string[] // string[] for file extensions
    message: string
  }
  
  export interface FormField {
    id: string
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file'
    label: string
    placeholder?: string
    required: boolean
    options?: string[]
    validation: ValidationRule[]
    order: number
    accept?: string // For file input accept attribute
  }
  
  export interface FormSchema {
    id: string
    title: string
    description: string
    fields: FormField[]
    createdAt: string
    updatedAt: string
  }