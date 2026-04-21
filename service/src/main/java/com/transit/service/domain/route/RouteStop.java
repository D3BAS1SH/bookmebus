package com.transit.service.domain.route;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "route_stop",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_route_sequence",
                columnNames = {"route_id","sequence_order"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteStop {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "route_stop_id")
    private UUID routeStopId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Column(name = "distance_from_origin", nullable = false, precision = 10, scale = 2)
    private BigDecimal distanceFromOrigin;

    @Column(name = "is_boarding_point", nullable = false)
    @Builder.Default
    private boolean boardingPoint = true;

    @Column(name = "is_dropping_point", nullable = false)
    @Builder.Default
    private boolean droppingPoint = true;

    @CreationTimestamp()
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
