'use client';

import { useState } from 'react';

interface ManualInputTabProps {
  onSubmit: (code: string) => void;
  isActive: boolean;
}

export function ManualInputTab({ onSubmit, isActive }: ManualInputTabProps) {
  const [code, setCode] = useState('');

  if (!isActive) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 8) {
      onSubmit(code.toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-6">
      <div className="space-y-2">
        <label htmlFor="bookingCode" className="text-sm font-medium text-gray-700">
          Booking Code
        </label>
        <input
          id="bookingCode"
          type="text"
          placeholder="Enter 8-character code"
          maxLength={8}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-lg font-mono uppercase tracking-widest focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={code.length !== 8}
        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Search Booking
      </button>

      <p className="text-center text-xs text-gray-500">
        Enter the 8-character alphanumeric code from the traveler's ticket.
      </p>
    </form>
  );
}
