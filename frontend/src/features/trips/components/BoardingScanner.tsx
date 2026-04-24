'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, QrCode, Keyboard, Loader2, AlertCircle } from 'lucide-react';
import { ScannerTab } from './ScannerTab';
import { ManualInputTab } from './ManualInputTab';
import { PassengerDetailCard } from './PassengerDetailCard';
import { BoardingSuccess } from './BoardingSuccess';
import { PassengerTicket, BoardingStep, BoardingResponse } from '../types/boarding';
import { cn } from '@/lib/utils';

export function BoardingScanner() {
  const router = useRouter();
  const params = useParams();
  const tripId = params?.tripId as string;

  // State management
  const [step, setStep] = useState<BoardingStep>('INPUT');
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passenger, setPassenger] = useState<PassengerTicket | null>(null);

  const handleCodeSubmit = async (bookingCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tickets/resolve?code=${bookingCode}`);

      const result: BoardingResponse = await response.json();

      if (result.success && result.data) {
        setPassenger(result.data);
        setStep('VERIFY');
      } else {
        setError('Invalid booking code. Try again.');
      }
    } catch (err) {
      console.error('Resolve error:', err);
      setError('Failed to resolve booking code. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBoarding = async () => {
    if (!passenger) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${passenger.bookingId}/board`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setStep('SUCCESS');
      } else {
        throw new Error('Failed to confirm boarding');
      }
    } catch (err) {
      console.error('Boarding error:', err);
      setError('Failed to confirm boarding. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('INPUT');
    setPassenger(null);
    setError(null);
    setLoading(false);
  };

  const steps = [
    { id: 'INPUT', label: 'Input Code' },
    { id: 'VERIFY', label: 'Verify Passenger' },
    { id: 'SUCCESS', label: 'Confirmed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
        <button 
          onClick={() => router.push(`/driver/trips/${tripId}`)}
          className="flex items-center text-gray-600 transition-colors hover:text-gray-900"
        >
          <ChevronLeft size={24} />
          <span className="ml-1 font-medium">Back to Trip</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Verify Boarding</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.id} className="relative flex flex-1 flex-col items-center">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
                  step === s.id ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-100" : 
                  (steps.findIndex(x => x.id === step) > idx ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500")
                )}>
                  {steps.findIndex(x => x.id === step) > idx ? "✓" : idx + 1}
                </div>
                <span className={cn(
                  "mt-2 text-[10px] font-bold uppercase tracking-wider",
                  step === s.id ? "text-blue-600" : "text-gray-400"
                )}>
                  {s.label}
                </span>
                {idx < steps.length - 1 && (
                  <div className={cn(
                    "absolute left-[calc(50%+1.5rem)] top-4 h-[2px] w-[calc(100%-3rem)]",
                    steps.findIndex(x => x.id === step) > idx ? "bg-green-500" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Loading Overlay for resolving/confirming */}
        {loading && step !== 'INPUT' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="mt-4 font-bold text-gray-900">
                {step === 'VERIFY' ? 'Confirming boarding...' : 'Looking up booking...'}
              </p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {step === 'INPUT' && (
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
              {/* Tab Toggle */}
              <div className="flex border-b border-gray-100 p-2">
                <button
                  onClick={() => setActiveTab('scan')}
                  className={cn(
                    "flex flex-1 items-center justify-center space-x-2 rounded-2xl py-3 font-bold transition-all",
                    activeTab === 'scan' ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <QrCode size={20} />
                  <span>QR Scan</span>
                </button>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={cn(
                    "flex flex-1 items-center justify-center space-x-2 rounded-2xl py-3 font-bold transition-all",
                    activeTab === 'manual' ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <Keyboard size={20} />
                  <span>Manual</span>
                </button>
              </div>

              <div className="relative min-h-[300px]">
                {loading && (
                   <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                      <p className="mt-2 text-sm font-bold text-gray-900">Looking up booking...</p>
                    </div>
                  </div>
                )}

                <ScannerTab 
                  isActive={activeTab === 'scan'} 
                  onScanSuccess={handleCodeSubmit} 
                />
                <ManualInputTab 
                  isActive={activeTab === 'manual'} 
                  onSubmit={handleCodeSubmit} 
                />
              </div>
            </div>
          )}

          {step === 'VERIFY' && passenger && (
            <PassengerDetailCard 
              passenger={passenger}
              onConfirm={handleConfirmBoarding}
              onScanNext={handleReset}
              isConfirming={loading}
            />
          )}

          {step === 'SUCCESS' && (
            <BoardingSuccess 
              passenger={passenger} 
              onScanNext={handleReset} 
            />
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-auto max-w-md rounded-2xl bg-red-50 p-6 text-center shadow-md">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle size={28} />
              </div>
              <p className="mb-6 font-bold text-red-800">{error}</p>
              <button
                onClick={step === 'VERIFY' ? handleConfirmBoarding : handleReset}
                className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition-colors hover:bg-red-700"
              >
                {step === 'VERIFY' ? 'Retry Confirmation' : 'Try Again'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
