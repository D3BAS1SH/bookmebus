package com.transit.service.domain.bus;

import com.transit.service.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "bus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {
    @Id
    @Column(name = "bus_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "registration_number",nullable = false, length = 20,unique = true)
    private String registrationNumber;

    @Column(name = "vehicle_number", nullable = false, length = 20,unique = true)
    private String vehicleNumber;

    @Column(name = "price_per_km",nullable = false)
    private BigDecimal pricePerKm;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "seat_layout", columnDefinition = "jsonb", nullable = false)
    private SeatLayoutConfig seatLayout;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private BusStatus busStatus = BusStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
