'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Plus, Trash2, GripVertical, Eye, Code, Download, Upload, Settings } from 'lucide-react'
import { FormSchema, FormField } from './types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import FieldRenderer from './FieldRenderer'
import FieldProperties from './FieldProperties'
import FormPreview from './FormPreview'

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio Button' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'Document Upload' }
]

const FormBuilder = () => {
  const [formSchema, setFormSchema] = useState<FormSchema>({
    id: crypto.randomUUID(),
    title: 'Untitled Form',
    description: '',
    fields: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'builder' | 'preview' | 'code'>('builder')
  const [draggedField, setDraggedField] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addField = useCallback((type: FormField['type']) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
      validation: [],
      order: formSchema.fields.length
    }
    
    setFormSchema(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
      updatedAt: new Date().toISOString()
    }))
    setSelectedField(newField.id)
  }, [formSchema.fields.length])

  const deleteField = useCallback((fieldId: string) => {
    setFormSchema(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId).map((f, index) => ({ ...f, order: index })),
      updatedAt: new Date().toISOString()
    }))
    setSelectedField(null)
  }, [])

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFormSchema(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f),
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedField(fieldId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault()
    if (!draggedField || draggedField === targetFieldId) return

    const draggedIndex = formSchema.fields.findIndex(f => f.id === draggedField)
    const targetIndex = formSchema.fields.findIndex(f => f.id === targetFieldId)
    
    const newFields = [...formSchema.fields]
    const [removed] = newFields.splice(draggedIndex, 1)
    newFields.splice(targetIndex, 0, removed)
    
    setFormSchema(prev => ({
      ...prev,
      fields: newFields.map((f, index) => ({ ...f, order: index })),
      updatedAt: new Date().toISOString()
    }))
    setDraggedField(null)
  }

  const exportForm = () => {
    const dataStr = JSON.stringify(formSchema, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${formSchema.title.replace(/\s+/g, '-').toLowerCase()}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setFormSchema(imported)
        setSelectedField(null)
      } catch (error) {
        alert('Invalid form file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Form Builder</h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'builder' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('builder')}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Builder
                </Button>
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant={viewMode === 'code' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('code')}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Code
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportForm}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importForm}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {viewMode === 'builder' && (
          <>
            <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
              <h3 className="font-medium mb-4">Add Fields</h3>
              <div className="space-y-2">
                {FIELD_TYPES.map((fieldType) => (
                  <Button
                    key={fieldType.value}
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => addField(fieldType.value as FormField['type'])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {fieldType.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <Input
                      value={formSchema.title}
                      onChange={(e) => setFormSchema(prev => ({ ...prev, title: e.target.value }))}
                      className="text-xl font-semibold border-none px-0 focus:ring-0"
                      placeholder="Form Title"
                    />
                    <Input
                      value={formSchema.description}
                      onChange={(e) => setFormSchema(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-2 border-none px-0 focus:ring-0 text-gray-600"
                      placeholder="Form Description (optional)"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {formSchema.fields.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <p>No fields added yet.</p>
                        <p className="text-sm">Start by adding fields from the sidebar.</p>
                      </div>
                    ) : (
                      formSchema.fields.map((field) => (
                        <FieldRenderer
                          key={field.id}
                          field={field}
                          isSelected={selectedField === field.id}
                          onSelect={() => setSelectedField(field.id)}
                          onDelete={() => deleteField(field.id)}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {selectedField && (
                <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-medium mb-4">Field Properties</h3>
                  <FieldProperties 
                    field={formSchema.fields.find(f => f.id === selectedField)!} 
                    onUpdate={updateField}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === 'preview' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <FormPreview formSchema={formSchema} />
            </div>
          </div>
        )}

        {viewMode === 'code' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{JSON.stringify(formSchema, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormBuilder