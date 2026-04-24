export interface PassengerTicket {
  bookingId: string;
  bookingCode: string;
  travelerName: string;
  seatNumber: string;
  boardingStopName: string;
  dropoffStopName: string;
  didBoard: boolean;
  bookingStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export type BoardingStep = 'INPUT' | 'VERIFY' | 'SUCCESS';

export interface BoardingResponse {
  success: boolean;
  data: PassengerTicket;
}
