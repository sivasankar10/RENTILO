import React, { useState } from 'react'
import { Button, Input } from '@shared/ui'

interface MaintenanceRequestFormProps {
  onSubmit: (data: {
    propertyId: string
    category: string
    description: string
    priority: string
  }) => void
  isLoading?: boolean
}

export function MaintenanceRequestForm({ onSubmit, isLoading }: MaintenanceRequestFormProps) {
  const [propertyId, setPropertyId] = useState('')
  const [category, setCategory] = useState('other')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ propertyId, category, description, priority })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Property ID"
        placeholder="Enter property ID"
        value={propertyId}
        onChange={(e) => setPropertyId(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-label font-medium text-text-primary">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-input bg-surface text-text-primary text-body border border-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
        >
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="structural">Structural</option>
          <option value="appliance">Appliance</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-label font-medium text-text-primary">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-3 rounded-input bg-surface text-text-primary text-body border border-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-label font-medium text-text-primary">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue..."
          rows={4}
          required
          className="w-full px-4 py-3 rounded-input bg-surface text-text-primary text-body border border-outline placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Submit Request
      </Button>
    </form>
  )
}
