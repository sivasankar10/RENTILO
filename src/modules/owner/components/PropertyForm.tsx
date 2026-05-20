import React, { useState } from 'react'
import { Button, Input } from '@shared/ui'

interface PropertyFormProps {
  onSubmit: (data: Record<string, string>) => void
  isLoading?: boolean
}

export function PropertyForm({ onSubmit, isLoading }: PropertyFormProps) {
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, address, city, price })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Property Title"
        placeholder="e.g. Modern 2BHK Apartment"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        label="Address"
        placeholder="Full property address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <Input
          label="Monthly Rent (₹)"
          type="number"
          placeholder="25000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Add Property
      </Button>
    </form>
  )
}
