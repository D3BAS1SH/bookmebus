'use client';

import { PassengerTicket } from '../types/boarding';
import { User, MapPin, Armchair, CheckCircle2, XCircle } from 'lucide-react';

interface PassengerDetailCardProps {
  passenger: PassengerTicket;
  onConfirm: () => void;
  onScanNext: () => void;
  isConfirming: boolean;
}

export function PassengerDetailCard({ 
  passenger, 
  onConfirm, 
  onScanNext,
  isConfirming 
}: PassengerDetailCardProps) {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="bg-blue-50 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <User size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{passenger.travelerName}</h3>
            <p className="text-sm font-medium text-blue-600">Booking Code: {passenger.bookingCode}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-start space-x-3">
          <Armchair className="mt-1 text-gray-400" size={18} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Seat Number</p>
            <p className="text-base font-medium text-gray-900">{passenger.seatNumber}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="mt-1 text-gray-400" size={18} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Boarding & Dropoff</p>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-900">
                <span className="text-green-600">From:</span> {passenger.boardingStopName}
              </p>
              <p className="text-sm font-medium text-gray-900">
                <span className="text-red-600">To:</span> {passenger.dropoffStopName}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="mb-4 text-sm font-medium text-gray-700">
            Status: {passenger.didBoard ? (
              <span className="inline-flex items-center text-green-600">
                <CheckCircle2 size={16} className="mr-1" /> Already Boarded
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-600">
                <XCircle size={16} className="mr-1" /> Not Yet Boarded
              </span>
            )}
          </p>

          {!passenger.didBoard ? (
            <button
              onClick={onConfirm}
              disabled={isConfirming}
              className="flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-4 text-lg font-bold text-white transition-all hover:bg-green-700 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {isConfirming ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} className="mr-2" />
                  Confirm Boarding
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onScanNext}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
            >
              Scan Next Passenger
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
