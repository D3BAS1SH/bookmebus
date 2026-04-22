'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Bus as BusIcon, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tabs, type Tab } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { BusTable } from './BusTable'
import { BusTableSkeleton } from './BusTable.skeleton'
import { BusFormModal } from './BusFormModal'
import { useBuses, useCreateBus, useUpdateBus, useUpdateBusStatus } from '@/features/fleet/hooks/useBuses'
import type { Bus, BusStatus, CreateBusInput } from '@/features/fleet/types'
import { BUS_STATUSES } from '@/features/fleet/types'

const STATUS_TABS: Tab[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Idle', value: 'IDLE' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Retired', value: 'RETIRED' },
]

export function FleetPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)

  // ─── Data ──────────────────────────────────────────────────
  const { data: buses, isLoading, isError, error, refetch } = useBuses()
  const createBusMutation = useCreateBus()
  const updateBusMutation = useUpdateBus()
  const statusMutation = useUpdateBusStatus()

  // ─── Filtered list ─────────────────────────────────────────
  const filteredBuses = useMemo(() => {
    if (!buses) return []
    if (activeTab === 'ALL') return buses
    return buses.filter((b) => b.status === activeTab)
  }, [buses, activeTab])

  // ─── Tab counts ────────────────────────────────────────────
  const tabsWithCounts: Tab[] = useMemo(() => {
    if (!buses) return STATUS_TABS
    return STATUS_TABS.map((tab) => ({
      ...tab,
      count:
        tab.value === 'ALL'
          ? buses.length
          : buses.filter((b) => b.status === tab.value).length,
    }))
  }, [buses])

  // ─── Handlers ──────────────────────────────────────────────
  function handleOpenCreate() {
    setEditingBus(null)
    setIsModalOpen(true)
  }

  function handleOpenEdit(bus: Bus) {
    setEditingBus(bus)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setEditingBus(null)
  }

  function handleSubmit(data: CreateBusInput) {
    if (editingBus) {
      updateBusMutation.mutate(
        { busId: editingBus.busId, ...data },
        { onSuccess: () => handleCloseModal() }
      )
    } else {
      createBusMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      })
    }
  }

  function handleStatusChange(busId: string, status: BusStatus) {
    statusMutation.mutate({ busId, status })
  }

  // ─── Error State ───────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <FleetHeader onAdd={handleOpenCreate} />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/5 mb-6">
            <BusIcon className="h-8 w-8 text-error/40" />
          </div>
          <h3 className="text-lg font-display font-bold text-on-surface mb-2">
            Failed to load fleet
          </h3>
          <p className="text-sm text-on-surface-variant max-w-sm mb-6">
            {error?.message || 'Something went wrong while fetching your buses. Please try again.'}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FleetHeader onAdd={handleOpenCreate} />

      {/* Stats bar */}
      {buses && buses.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Fleet',
              value: buses.length,
              color: 'text-primary',
              bg: 'bg-primary/8',
            },
            {
              label: 'Active',
              value: buses.filter((b) => b.status === 'ACTIVE').length,
              color: 'text-emerald-600',
              bg: 'bg-emerald-500/8',
            },
            {
              label: 'Idle',
              value: buses.filter((b) => b.status === 'IDLE').length,
              color: 'text-amber-600',
              bg: 'bg-amber-500/8',
            },
            {
              label: 'Maintenance',
              value: buses.filter((b) => b.status === 'MAINTENANCE').length,
              color: 'text-rose-600',
              bg: 'bg-rose-500/8',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-surface-container-lowest p-4 shadow-ambient"
            >
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <Tabs
          tabs={tabsWithCounts}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <BusTableSkeleton />
      ) : filteredBuses.length === 0 ? (
        <EmptyState
          icon={BusIcon}
          title={
            activeTab === 'ALL'
              ? 'No buses in your fleet'
              : `No ${activeTab.toLowerCase()} buses`
          }
          description={
            activeTab === 'ALL'
              ? 'Register your first bus to start managing your fleet.'
              : `There are no buses with status "${activeTab.toLowerCase()}" in your fleet.`
          }
          actionLabel={activeTab === 'ALL' ? 'Register Bus' : undefined}
          onAction={activeTab === 'ALL' ? handleOpenCreate : undefined}
        />
      ) : (
        <BusTable
          buses={filteredBuses}
          onEdit={handleOpenEdit}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create / Edit Modal */}
      <BusFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={createBusMutation.isPending || updateBusMutation.isPending}
        editBus={editingBus}
      />
    </div>
  )
}

// ─── Sub-component: Page Header ────────────────────────────────────

function FleetHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-display font-bold text-on-surface">
          Fleet Management
        </h1>
        <p className="text-on-surface-variant font-medium">
          Register, monitor, and manage your bus fleet.
        </p>
      </div>
      <Button onClick={onAdd} size="sm" className="self-start md:self-auto">
        <Plus className="h-4 w-4 mr-2" />
        Register Bus
      </Button>
    </div>
  )
}
