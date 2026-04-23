'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// --- Custom Icon for the Bus Marker ---
const createBusIcon = () => {
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`
  return L.divIcon({
    html: `<div class="bg-blue-600 rounded-full p-2 shadow-lg border-2 border-white flex items-center justify-center w-10 h-10">${svgIcon}</div>`,
    className: '', 
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  })
}

interface LocationMessage {
  tripId: string
  latitude: number
  longitude: number
  timestamp: string
}

interface TrackBusClientProps {
  tripId: string
}

function MapCenterer({ location }: { location: LocationMessage | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], map.getZoom(), {
        animate: true,
        duration: 1.5
      })
    }
  }, [location, map])

  return null
}

export default function TrackBusClient({ tripId }: TrackBusClientProps) {
  const [location, setLocation] = useState<LocationMessage | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const [busIcon, setBusIcon] = useState<L.DivIcon | null>(null)

  useEffect(() => {
    setBusIcon(createBusIcon())
  }, [])

  useEffect(() => {
    let stompClient: Client | null = null;

    const initConnection = async () => {
      try {
        // Fetch JWT from BFF session bridge
        const tokenRes = await fetch('/api/auth/token')
        const tokenData = await tokenRes.json()
        const token = tokenData.token

        if (!token) {
          setError('Authentication required for tracking.')
          return
        }

        stompClient = new Client({
          webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          reconnectDelay: 5000,
          onConnect: () => {
            setIsConnected(true)
            setError('')
            
            stompClient?.subscribe(`/topic/trip.${tripId}.location`, (message) => {
              try {
                const parsedLocation: LocationMessage = JSON.parse(message.body)
                setLocation(parsedLocation)
              } catch (e) {
                console.error('Failed to parse location message', e)
              }
            })
          },
          onStompError: (frame) => {
            setError('Connection to tracking server lost.')
            setIsConnected(false)
          },
          onWebSocketError: () => {
            setError('Network error. Trying to reconnect...')
            setIsConnected(false)
          },
          onDisconnect: () => {
            setIsConnected(false)
          }
        })

        stompClient.activate()
      } catch (err) {
        setError('Failed to initialize tracking connection.')
        console.error(err)
      }
    }

    initConnection()

    return () => {
      if (stompClient) {
        stompClient.deactivate()
      }
    }
  }, [tripId])

  const center: [number, number] = location ? [location.latitude, location.longitude] : [22.5726, 88.3639]

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans relative">
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-4 w-full max-w-lg pointer-events-auto border border-gray-100">
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-lg font-bold text-gray-800">Live Bus Tracker</h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                {isConnected ? 'Connected' : 'Reconnecting'}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-3 truncate">Trip ID: {tripId}</div>
          {error && <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 mb-2">{error}</div>}
          {location ? (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-sm text-blue-900 font-medium">{new Date(location.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-3 text-center border border-gray-200">
              <p className="text-sm text-gray-600 font-medium animate-pulse">Waiting for bus location...</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 w-full relative z-0">
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {location && busIcon && (
            <Marker position={[location.latitude, location.longitude]} icon={busIcon}>
              <Popup className="font-sans text-center font-bold">Bus Location</Popup>
            </Marker>
          )}
          <MapCenterer location={location} />
        </MapContainer>
      </div>
    </div>
  )
}
