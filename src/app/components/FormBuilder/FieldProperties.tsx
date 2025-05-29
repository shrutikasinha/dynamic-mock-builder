import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { FormField, ValidationRule } from './types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface FieldPropertiesProps {
  field: FormField
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void
}

// Document type presets
const DOCUMENT_TYPES = [
  {
    label: 'Images Only',
    extensions: ['.jpg', '.jpeg', '.png', '.gif'],
    accept: 'image/*',
    message: 'Please upload an image file (JPG, JPEG, PNG, GIF)'
  },
  {
    label: 'Documents Only',
    extensions: ['.pdf', '.doc', '.docx', '.txt'],
    accept: '.pdf,.doc,.docx,.txt',
    message: 'Please upload a document file (PDF, DOC, DOCX, TXT)'
  },
  {
    label: 'Excel Files Only',
    extensions: ['.xls', '.xlsx', '.csv'],
    accept: '.xls,.xlsx,.csv',
    message: 'Please upload an Excel file (XLS, XLSX, CSV)'
  },
  {
    label: 'All Documents',
    extensions: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.csv', '.jpg', '.jpeg', '.png', '.gif'],
    accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv,image/*',
    message: 'Please upload a valid document'
  }
]

// Predefined regex patterns
const REGEX_PATTERNS = [
  {
    label: 'Numbers Only',
    pattern: '^[0-9]*$',
    message: 'Please enter numbers only'
  },
  {
    label: 'English Alphabets Only',
    pattern: '^[A-Za-z]+(?:\\s[A-Za-z]+)*$',
    message: 'Please enter English alphabets only (spaces allowed between words)'
  },
  {
    label: 'Arabic Text Only',
    pattern: '^[\u0600-\u06FF\s]*$',
    message: 'Please enter Arabic text only'
  },
  {
    label: 'Email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    message: 'Please enter a valid email address'
  },
  {
    label: 'Phone Number',
    pattern: '^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$',
    message: 'Please enter a valid phone number'
  },
  {
    label: 'URL',
    pattern: '^(https?:\\/\\/)?[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-\\.,@?^=%&:/~\\+#]*$',
    message: 'Please enter a valid URL'
  },
  {
    label: 'Password (8+ chars, with uppercase, lowercase, number, special char)',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
  }
]

const FieldProperties = ({ field, onUpdate }: FieldPropertiesProps) => {
  const addValidation = (type: ValidationRule['type'], preset?: { value: string | string[]; message: string }) => {
    const newValidation: ValidationRule = {
      type,
      message: preset?.message || `Field ${type} validation failed`,
      value: preset?.value || (type === 'pattern' ? '' : undefined)
    }
    onUpdate(field.id, {
      validation: [...(field.validation || []), newValidation]
    })
  }

  const updateValidation = (index: number, updates: Partial<ValidationRule>) => {
    const newValidation = [...field.validation]
    newValidation[index] = { ...newValidation[index], ...updates }
    onUpdate(field.id, { validation: newValidation })
  }

  const removeValidation = (index: number) => {
    const newValidation = field.validation.filter((_, i) => i !== index)
    onUpdate(field.id, { validation: newValidation })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <Input
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Placeholder</label>
        <Input
          value={field.placeholder || ''}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">Required</span>
        </label>
      </div>

      {field.type === 'file' && (
        <div>
          <label className="block text-sm font-medium mb-2">Allowed File Types</label>
          <Select
            value={field.accept || ''}
            onChange={(e) => {
              const selected = DOCUMENT_TYPES.find(d => d.label === e.target.value)
              if (selected) {
                onUpdate(field.id, { accept: selected.accept })
                // Add file type validation
                const existingFileValidation = field.validation.findIndex(v => v.type === 'fileType')
                if (existingFileValidation >= 0) {
                  updateValidation(existingFileValidation, {
                    value: selected.extensions,
                    message: selected.message
                  })
                } else {
                  addValidation('fileType', {
                    value: selected.extensions,
                    message: selected.message
                  })
                }
              }
            }}
          >
            <option value="">Select allowed file types</option>
            {DOCUMENT_TYPES.map((docType, i) => (
              <option key={i} value={docType.label}>
                {docType.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      {(field.type === 'select' || field.type === 'radio') && (
        <div>
          <label className="block text-sm font-medium mb-1">Options</label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])]
                    newOptions[index] = e.target.value
                    onUpdate(field.id, { options: newOptions })
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = field.options?.filter((_, i) => i !== index)
                    onUpdate(field.id, { options: newOptions })
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`]
                onUpdate(field.id, { options: newOptions })
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Option
            </Button>
          </div>
        </div>
      )}

      {/* Validation Rules Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Validation Rules</label>
        <div className="space-y-3">
          {field.validation.map((rule, index) => (
            <div key={index} className="space-y-2 p-3 border rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{rule.type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeValidation(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {rule.type === 'pattern' && (
                <>
                  <Input
                    placeholder="Regular expression pattern"
                    value={rule.value as string || ''}
                    onChange={(e) => updateValidation(index, { value: e.target.value })}
                  />
                  <Select
                    value=""
                    onChange={(e) => {
                      const selected = REGEX_PATTERNS.find(p => p.label === e.target.value)
                      if (selected) {
                        updateValidation(index, {
                          value: selected.pattern,
                          message: selected.message
                        })
                      }
                    }}
                  >
                    <option value="">Select a predefined pattern</option>
                    {REGEX_PATTERNS.map((pattern, i) => (
                      <option key={i} value={pattern.label}>
                        {pattern.label}
                      </option>
                    ))}
                  </Select>
                </>
              )}

              <Input
                placeholder="Error message"
                value={rule.message}
                onChange={(e) => updateValidation(index, { message: e.target.value })}
              />
            </div>
          ))}

          {/* Add validation buttons */}
          <div className="space-y-2">
            {field.type === 'text' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addValidation('pattern', REGEX_PATTERNS[0])}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Number Only Pattern
              </Button>
            )}

            {field.type === 'number' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addValidation('pattern', REGEX_PATTERNS[0])}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Number Only Pattern
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addValidation('pattern')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Regex
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FieldProperties