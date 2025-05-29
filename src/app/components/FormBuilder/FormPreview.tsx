import React, { useState } from 'react'
import { FormSchema, FormField } from './types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface FormPreviewProps {
  formSchema: FormSchema
}

type FormDataValue = string | boolean | File | null

const FormPreview = ({ formSchema }: FormPreviewProps) => {
  const [formData, setFormData] = useState<Record<string, FormDataValue>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: FormField, value: FormDataValue): string | null => {
    // Check required field
    if (field.required && !value) {
      return 'This field is required'
    }

    // Check validation rules
    for (const rule of field.validation) {
      if (rule.type === 'pattern' && rule.value && typeof value === 'string') {
        const regex = new RegExp(rule.value as string)
        if (!regex.test(value)) {
          return rule.message
        }
      } else if (rule.type === 'fileType' && field.type === 'file' && value instanceof File) {
        const fileExtension = '.' + value.name.split('.').pop()?.toLowerCase()
        const allowedExtensions = rule.value as string[]
        
        if (!allowedExtensions.includes(fileExtension)) {
          return rule.message
        }
      }
    }

    return null
  }

  const handleChange = (field: FormField, value: FormDataValue) => {
    setFormData(prev => ({ ...prev, [field.id]: value }))
    
    const error = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field.id]: error || ''
    }))
  }

  const handleFileChange = (field: FormField, files: FileList | null) => {
    if (!files || files.length === 0) {
      handleChange(field, null)
      return
    }

    const file = files[0]
    handleChange(field, file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    formSchema.fields.forEach(field => {
      const value = formData[field.id]
      const error = validateField(field, value)
      if (error) {
        newErrors[field.id] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)

    if (!hasErrors) {
      // Handle form submission
      console.log('Form data:', formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{formSchema.title}</h2>
        {formSchema.description && (
          <p className="text-gray-600 mt-2">{formSchema.description}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {formSchema.fields.map((field) => (
          <div key={field.id}>
            {field.type !== 'checkbox' && (
              <label className="block text-sm font-medium mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            
            {field.type === 'textarea' && (
              <textarea
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full h-20 rounded-md border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
              />
            )}
            
            {field.type === 'select' && (
              <Select
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                className={errors[field.id] ? 'border-red-500' : ''}
              >
                <option value="">{field.placeholder || 'Select an option'}</option>
                {field.options?.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </Select>
            )}
            
            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options?.map((option, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      checked={formData[field.id] === option}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}
            
            {field.type === 'checkbox' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field.id] || false}
                  onChange={(e) => handleChange(field, e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">{field.label}</span>
              </label>
            )}

            {field.type === 'file' && (
              <div>
                <input
                  type="file"
                  accept={field.accept}
                  onChange={(e) => handleFileChange(field, e.target.files)}
                  className={`w-full ${errors[field.id] ? 'text-red-500' : ''}`}
                />
                {formData[field.id] && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected file: {(formData[field.id] as File).name}
                  </p>
                )}
              </div>
            )}
            
            {!['textarea', 'select', 'radio', 'checkbox', 'file'].includes(field.type) && (
              <Input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                className={errors[field.id] ? 'border-red-500' : ''}
              />
            )}

            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
        
        <Button type="submit" className="w-full">
          Submit Form
        </Button>
      </div>
    </form>
  )
}

export default FormPreview