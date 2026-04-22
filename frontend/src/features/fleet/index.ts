// Fleet feature barrel exports
export { FleetPage } from './components/FleetPage'
export { BusTable } from './components/BusTable'
export { BusTableSkeleton } from './components/BusTable.skeleton'
export { BusFormModal } from './components/BusFormModal'
export { BusStatusBadge } from './components/BusStatusBadge'
export { BusCard } from './components/BusCard'

// Re-export types
export type {
  Bus,
  BusStatus,
  CreateBusInput,
  UpdateBusInput,
  UpdateBusStatusInput,
} from './types'

// Re-export hooks
export {
  useBuses,
  useBusDetail,
  useCreateBus,
  useUpdateBus,
  useUpdateBusStatus,
} from './hooks/useBuses'
