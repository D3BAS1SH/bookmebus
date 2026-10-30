package com.transit.service.domain.trip;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "trip_seat")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "trip_seat_id")
    private UUID tripSeatId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "seat_number",nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private int version = 0;

    @CreationTimestamp
    @Column(name = "created_at",updatable = false)
    private Instant createdAt;
}
