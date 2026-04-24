'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerTabProps {
  onScanSuccess: (decodedText: string) => void;
  isActive: boolean;
}

export function ScannerTab({ onScanSuccess, isActive }: ScannerTabProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      /* verbose= */ false
    );
    
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        // Important: Stop scanner after success
        scanner.clear().catch(error => {
          console.error('Failed to clear scanner after success', error);
        });
      },
      (error) => {
        // Ignore scan errors silently as per requirements
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          // Ignore clear errors on cleanup
        });
      }
    };
  }, [isActive, onScanSuccess]);

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        id="qr-reader" 
        className="w-full max-w-md overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50"
      />
      <p className="mt-4 text-center text-sm text-gray-500">
        Align the QR code within the frame to scan
      </p>
    </div>
  );
}
