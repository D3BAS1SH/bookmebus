// Routes feature barrel exports
export { RoutesPage } from './components/RoutesPage'
export { RouteTable } from './components/RouteTable'
export { RouteTableSkeleton } from './components/RouteTable.skeleton'
export { RouteFormModal } from './components/RouteFormModal'
export { LocationFormModal } from './components/LocationFormModal'
export { LocationList } from './components/LocationList'
export { StopsModal } from './components/StopsModal'
export { RouteCard } from './components/RouteCard'

// Re-export types
export type {
  Route,
  Location,
  RouteStopResponse,
  RouteStopRequest,
  CreateRouteInput,
  CreateLocationInput,
  AddStopsInput,
} from './types'

// Re-export hooks
export {
  useOwnerRoutes,
  useRouteDetail,
  useCreateRoute,
  useCreateLocation,
  useAddStops,
  useAllLocations,
} from './hooks/useRoutes'
