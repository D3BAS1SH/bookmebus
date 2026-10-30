package com.transit.service.domain.booking;

import com.transit.service.domain.route.Location;
import com.transit.service.domain.trip.Trip;
import com.transit.service.domain.trip.TripSeat;
import com.transit.service.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "booking")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "booking_id")
    private UUID bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User traveler;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_seat_id", nullable = false)
    private TripSeat tripSeat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boarding_stop_id", nullable = false)
    private Location boardingPoint;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "dropoff_stop_id", nullable = false)
    private Location dropoffPoint;

    @Positive
    @Column(name = "boarding_seq",nullable = false)
    private int boardingSequence;

    @Positive
    @Column(name = "dropoff_seq", nullable = false)
    private int dropoffSequence;

    @Positive
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "booking_code", nullable = false, length = 8, unique = true)
    private String bookingCode;

    @Column(name = "qr_code_path", length = 500)
    private String qrCodepath;

    @Column(name = "ticket_pdf_path", length = 500)
    private String ticketPdfPath;

    @Column(name = "payment_txn_id", nullable = false, length = 100)
    private String paymentTransactionId;

    @Column(name = "did_board", nullable = false)
    @Builder.Default
    private boolean didBoard = false;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private BookingStatus bookingStatus;

    @CreationTimestamp
    @Column(name = "booked_at", nullable = false, updatable = false)
    private Instant bookingAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
