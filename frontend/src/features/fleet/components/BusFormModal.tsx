'use client'

import React, { useState, useEffect } from 'react'
import { Hash, IndianRupee, Rows3, Car } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import {
  createBusSchema,
  SEAT_TYPE_OPTIONS,
  type CreateBusInput,
  type Bus,
} from '@/features/fleet/types'
import { z } from 'zod/v4'

interface BusFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateBusInput) => void
  isLoading: boolean
  /** If provided, the modal is in edit mode */
  editBus?: Bus | null
}

interface FieldError {
  vehicleNumber?: string
  registrationNumber?: string
  pricePerKm?: string
  seatType?: string
  rows?: string
}

export function BusFormModal({
  open,
  onClose,
  onSubmit,
  isLoading,
  editBus,
}: BusFormModalProps) {
  const isEditMode = !!editBus

  const [vehicleNumber, setVehicleNumber] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [pricePerKm, setPricePerKm] = useState('')
  const [seatType, setSeatType] = useState('2+2')
  const [rows, setRows] = useState('')
  const [errors, setErrors] = useState<FieldError>({})
  const [generalError, setGeneralError] = useState('')

  // Populate form when editing
  useEffect(() => {
    if (editBus) {
      setVehicleNumber(editBus.vehicleNumber || '')
      setRegistrationNumber(editBus.registrationNumber || '')
      setPricePerKm(String(editBus.pricePerKm || ''))
      setSeatType(editBus.seatLayout?.seatType || '2+2')
      setRows(String(editBus.seatLayout?.rows || ''))
    } else {
      resetForm()
    }
  }, [editBus, open])

  function resetForm() {
    setVehicleNumber('')
    setRegistrationNumber('')
    setPricePerKm('')
    setSeatType('2+2')
    setRows('')
    setErrors({})
    setGeneralError('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setGeneralError('')

    const parsed = createBusSchema.safeParse({
      vehicleNumber: vehicleNumber.trim(),
      registrationNumber: registrationNumber.trim(),
      pricePerKm: pricePerKm ? Number(pricePerKm) : undefined,
      seatLayout: {
        seatType: seatType,
        rows: rows ? Number(rows) : undefined,
      },
    })

    if (!parsed.success) {
      const fieldErrors: FieldError = {}
      const flat = z.flattenError(parsed.error)
      if (flat.fieldErrors.vehicleNumber?.[0])
        fieldErrors.vehicleNumber = flat.fieldErrors.vehicleNumber[0]
      if (flat.fieldErrors.registrationNumber?.[0])
        fieldErrors.registrationNumber = flat.fieldErrors.registrationNumber[0]
      if (flat.fieldErrors.pricePerKm?.[0])
        fieldErrors.pricePerKm = flat.fieldErrors.pricePerKm[0]

      // Nested seatLayout errors — check raw issues
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.')
        if (path === 'seatLayout.seatType') fieldErrors.seatType = issue.message
        if (path === 'seatLayout.rows') fieldErrors.rows = issue.message
      }

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

  // Derive column preview from seat type
  const seatPreview = getSeatPreview(seatType)

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? 'Edit Bus' : 'Register New Bus'}
      description={
        isEditMode
          ? 'Update the details for this bus.'
          : 'Add a new bus to your fleet.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {generalError && (
          <div className="rounded-xl bg-error-container/10 border border-error/20 px-4 py-3 text-sm text-error font-medium">
            {generalError}
          </div>
        )}

        {/* Vehicle Number */}
        <div className="space-y-1">
          <Input
            icon={<Car className="h-5 w-5" />}
            label="Vehicle Number"
            placeholder="e.g. OD02AB1234"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            disabled={isLoading}
          />
          {errors.vehicleNumber && (
            <p className="text-xs text-error pl-6 font-medium">
              {errors.vehicleNumber}
            </p>
          )}
        </div>

        {/* Registration Number */}
        <div className="space-y-1">
          <Input
            icon={<Hash className="h-5 w-5" />}
            label="Registration Number"
            placeholder="e.g. OD02AB1234"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            disabled={isLoading}
          />
          {errors.registrationNumber && (
            <p className="text-xs text-error pl-6 font-medium">
              {errors.registrationNumber}
            </p>
          )}
        </div>

        {/* Price per KM */}
        <div className="space-y-1">
          <Input
            icon={<IndianRupee className="h-5 w-5" />}
            label="Price per KM (₹)"
            type="number"
            step="0.01"
            placeholder="e.g. 4.50"
            value={pricePerKm}
            onChange={(e) => setPricePerKm(e.target.value)}
            disabled={isLoading}
            min={0}
          />
          {errors.pricePerKm && (
            <p className="text-xs text-error pl-6 font-medium">
              {errors.pricePerKm}
            </p>
          )}
        </div>

        {/* Seat Layout Section */}
        <div className="rounded-xl bg-surface-container-low p-4 space-y-3">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Seat Layout
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Seat Type */}
            <div className="space-y-1">
              <Select
                label="Seat Type"
                options={SEAT_TYPE_OPTIONS.map((t) => ({
                  label: t,
                  value: t,
                }))}
                value={seatType}
                onChange={(e) => setSeatType(e.target.value)}
                disabled={isLoading}
              />
              {errors.seatType && (
                <p className="text-xs text-error font-medium">
                  {errors.seatType}
                </p>
              )}
            </div>

            {/* Rows */}
            <div className="space-y-1">
              <Input
                icon={<Rows3 className="h-5 w-5" />}
                label="Rows"
                type="number"
                placeholder="e.g. 12"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                disabled={isLoading}
                min={1}
                max={30}
              />
              {errors.rows && (
                <p className="text-xs text-error font-medium">{errors.rows}</p>
              )}
            </div>
          </div>

          {/* Seat Preview */}
          {rows && Number(rows) > 0 && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant pt-1">
              <span className="font-semibold">
                Total seats: {Number(rows) * seatPreview.totalCols}
              </span>
              <span className="text-outline-variant">
                ({seatPreview.leftLabel} | {seatPreview.rightLabel})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditMode
                ? 'Saving…'
                : 'Registering…'
              : isEditMode
                ? 'Save Changes'
                : 'Register Bus'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Helper: Parse seat type to column info ──────────────────────

function getSeatPreview(seatType: string) {
  const parts = seatType.split('+').map(Number)
  const left = parts[0] || 2
  const right = parts[1] || 2
  return {
    totalCols: left + right,
    leftLabel: `${left} left`,
    rightLabel: `${right} right`,
  }
}
