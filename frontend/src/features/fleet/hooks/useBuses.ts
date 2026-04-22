import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  Bus,
  BusApiResponse,
  CreateBusInput,
  UpdateBusInput,
  UpdateBusStatusInput,
} from '@/features/fleet/types'

// ─── Query Keys ───────────────────────────────────────────────────

export const busKeys = {
  all: ['buses'] as const,
  detail: (id: string) => ['buses', id] as const,
}

// ─── Payload Transformer ──────────────────────────────────────────

/** Derive leftCols/rightCols from seatType before sending to backend */
function buildBusPayload(input: CreateBusInput) {
  const parts = input.seatLayout.seatType.split('+').map(Number)
  const leftCount = parts[0] || 2
  const rightCount = parts[1] || 2
  const COLS = ['A', 'B', 'C', 'D', 'E', 'F']

  return {
    vehicleNumber: input.vehicleNumber,
    registrationNumber: input.registrationNumber,
    pricePerKm: input.pricePerKm,
    seatLayout: {
      seatType: input.seatLayout.seatType,
      rows: input.seatLayout.rows,
      leftCols: COLS.slice(0, leftCount),
      rightCols: COLS.slice(leftCount, leftCount + rightCount),
    },
  }
}

// ─── Fetch Helpers ────────────────────────────────────────────────

async function fetchBuses(): Promise<Bus[]> {
  const res = await fetch('/api/buses', { credentials: 'include' })
  const json: BusApiResponse<Bus[]> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch buses')
  }
  return json.data ?? []
}

async function fetchBusById(busId: string): Promise<Bus> {
  const res = await fetch(`/api/buses/${busId}`, { credentials: 'include' })
  const json: BusApiResponse<Bus> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch bus')
  }
  return json.data
}

async function createBus(input: CreateBusInput): Promise<Bus> {
  // Derive column arrays from seatType (e.g. "2+2" → leftCols: ["A","B"], rightCols: ["C","D"])
  const body = buildBusPayload(input)

  const res = await fetch('/api/buses', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json: BusApiResponse<Bus> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create bus')
  }
  return json.data
}

async function updateBus({
  busId,
  ...input
}: CreateBusInput & { busId: string }): Promise<Bus> {
  const body = buildBusPayload(input)

  const res = await fetch(`/api/buses/${busId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json: BusApiResponse<Bus> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update bus')
  }
  return json.data
}

async function updateBusStatus({
  busId,
  status,
}: UpdateBusStatusInput & { busId: string }): Promise<Bus> {
  const res = await fetch(`/api/buses/${busId}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const json: BusApiResponse<Bus> = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update bus status')
  }
  return json.data
}

// ─── Query Hooks ──────────────────────────────────────────────────

export function useBuses() {
  return useQuery({
    queryKey: busKeys.all,
    queryFn: fetchBuses,
  })
}

export function useBusDetail(busId: string) {
  return useQuery({
    queryKey: busKeys.detail(busId),
    queryFn: () => fetchBusById(busId),
    enabled: !!busId,
  })
}

// ─── Mutation Hooks ───────────────────────────────────────────────

export function useCreateBus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: busKeys.all })
      toast.success('Bus registered successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register bus')
    },
  })
}

export function useUpdateBus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: busKeys.all })
      if (data?.busId) {
        queryClient.invalidateQueries({ queryKey: busKeys.detail(data.busId) })
      }
      toast.success('Bus updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update bus')
    },
  })
}

export function useUpdateBusStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateBusStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: busKeys.all })
      if (data?.busId) {
        queryClient.invalidateQueries({ queryKey: busKeys.detail(data.busId) })
      }
      toast.success('Bus status updated')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update status')
    },
  })
}
