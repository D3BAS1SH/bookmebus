'use client'

import React, { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createLocationSchema, type CreateLocationInput } from '@/features/routes/types'
import { z } from 'zod/v4'

interface LocationFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateLocationInput) => void
  isLoading: boolean
}

interface FieldError {
  locationName?: string
  latitude?: string
  longitude?: string
}

export function LocationFormModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: LocationFormModalProps) {
  const [locationName, setLocationName] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [errors, setErrors] = useState<FieldError>({})

  function resetForm() {
    setLocationName('')
    setLatitude('')
    setLongitude('')
    setErrors({})
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const parsed = createLocationSchema.safeParse({
      locationName: locationName.trim(),
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    })

    if (!parsed.success) {
      const fieldErrors: FieldError = {}
      const flat = z.flattenError(parsed.error)
      if (flat.fieldErrors.locationName?.[0]) fieldErrors.locationName = flat.fieldErrors.locationName[0]
      if (flat.fieldErrors.latitude?.[0]) fieldErrors.latitude = flat.fieldErrors.latitude[0]
      if (flat.fieldErrors.longitude?.[0]) fieldErrors.longitude = flat.fieldErrors.longitude[0]
      setErrors(fieldErrors)
      return
    }

    onSubmit(parsed.data)
  }

  function handleClose() {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create Location"
      description="Add a new bus stop, station, or terminal."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Input
            icon={<MapPin className="h-5 w-5" />}
            label="Location Name"
            placeholder="e.g. Bhubaneswar Bus Stand"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            disabled={isLoading}
          />
          {errors.locationName && (
            <p className="text-xs text-error pl-6 font-medium">{errors.locationName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Input
              icon={<Navigation className="h-5 w-5" />}
              label="Latitude"
              type="number"
              step="any"
              placeholder="e.g. 20.2961"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              disabled={isLoading}
            />
            {errors.latitude && (
              <p className="text-xs text-error font-medium">{errors.latitude}</p>
            )}
          </div>
          <div className="space-y-1">
            <Input
              icon={<Navigation className="h-5 w-5" />}
              label="Longitude"
              type="number"
              step="any"
              placeholder="e.g. 85.8245"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              disabled={isLoading}
            />
            {errors.longitude && (
              <p className="text-xs text-error font-medium">{errors.longitude}</p>
            )}
          </div>
        </div>


        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating…' : 'Create Location'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
