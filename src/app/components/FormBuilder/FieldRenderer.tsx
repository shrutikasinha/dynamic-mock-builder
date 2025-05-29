import React from 'react'
import { GripVertical, Trash2 } from 'lucide-react'
import { FormField } from './types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface FieldRendererProps {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDragStart: (e: React.DragEvent, fieldId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetFieldId: string) => void
}

const FieldRenderer = ({ 
  field, 
  isSelected, 
  onSelect, 
  onDelete,
  onDragStart,
  onDragOver,
  onDrop 
}: FieldRendererProps) => {
  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            className="w-full h-20 rounded-md border border-gray-300 px-3 py-2 text-sm resize-none"
            disabled
          />
        )
      case 'select':
        return (
          <Select disabled>
            <option>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </Select>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <label key={i} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled className="rounded" />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <label className="flex items-center space-x-2">
            <input type="checkbox" disabled className="rounded" />
            <span className="text-sm">{field.label}</span>
          </label>
        )
      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            disabled
          />
        )
    }
  }

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
      draggable
      onDragStart={(e) => onDragStart(e, field.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, field.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {field.type !== 'checkbox' && renderInput()}
      {field.type === 'checkbox' && renderInput()}
    </div>
  )
}

export default FieldRenderer