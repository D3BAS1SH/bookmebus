'use client';

import { PassengerTicket } from '../types/boarding';
import { CheckCircle2, User, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BoardingSuccessProps {
  passenger: PassengerTicket | null;
  onScanNext: () => void;
}

export function BoardingSuccess({ passenger, onScanNext }: BoardingSuccessProps) {
  if (!passenger) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-green-100 bg-white p-8 shadow-xl text-center"
    >
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Boarded Successfully</h2>
        <p className="text-gray-500">Boarding has been confirmed</p>
      </div>

      <div className="mb-8 rounded-xl bg-gray-50 p-6 text-left">
        <div className="mb-4 flex items-center space-x-3">
          <User className="text-gray-400" size={18} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Passenger</p>
            <p className="text-base font-bold text-gray-900">{passenger.travelerName} — Seat {passenger.seatNumber}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="text-gray-400" size={18} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location</p>
            <p className="text-sm font-medium text-gray-900">{passenger.boardingStopName}</p>
          </div>
        </div>
      </div>

      <button
        onClick={onScanNext}
        className="group flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
      >
        Scan Next Passenger
        <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
}
