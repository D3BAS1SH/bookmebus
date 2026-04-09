# WebSocket / Real-time Reference

## When to read this file
Read when the user answers **yes** to real-time support during the runtime interview.

## Directory Additions

```
src/
├── lib/
│   └── socket.ts                        # Singleton socket client
├── features/
│   └── [feature]/
│       ├── hooks/
│       │   └── use[Feature]Socket.ts    # Feature-scoped socket hook
│       └── store/
│           └── socketSlice.ts           # Zustand slice for socket state (if Zustand used)
```

## `src/lib/socket.ts` — Singleton Client

```typescript
import { io, type Socket } from 'socket.io-client'
import { env } from '@/lib/env'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.NEXT_PUBLIC_WS_URL, {
      autoConnect: false,
      withCredentials: true,
    })
  }
  return socket
}

export function connectSocket() {
  getSocket().connect()
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
```

Add to `t3-env`:
```typescript
client: {
  NEXT_PUBLIC_WS_URL: z.string().url(),
}
```

## Feature Hook Pattern

```typescript
// src/features/notifications/hooks/useNotificationSocket.ts
'use client'
import { useEffect } from 'react'
import { getSocket, connectSocket } from '@/lib/socket'
import { useNotificationStore } from '../store'
import type { Notification } from '../types'

export function useNotificationSocket() {
  const addNotification = useNotificationStore(s => s.addNotification)

  useEffect(() => {
    const socket = getSocket()
    connectSocket()

    socket.on('notification:new', (data: Notification) => {
      addNotification(data)
    })

    return () => {
      socket.off('notification:new')
    }
  }, [addNotification])
}
```

## Supabase Realtime (if Supabase backend)
Use Supabase's built-in realtime channels instead of socket.io:

```typescript
// src/features/[feature]/hooks/use[Feature]Realtime.ts
'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useFeatureRealtime(onUpdate: (payload: unknown) => void) {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('feature-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feature' }, onUpdate)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [onUpdate])
}
```

No `lib/socket.ts` needed when using Supabase realtime.
