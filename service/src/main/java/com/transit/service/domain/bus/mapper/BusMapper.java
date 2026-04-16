package com.transit.service.domain.bus.mapper;

import com.transit.service.domain.bus.Bus;
import com.transit.service.domain.bus.dto.BusRequest;
import com.transit.service.domain.bus.dto.BusResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BusMapper {
    /**
     * Maps a BusRequest to a new Bus entity.
     * owner and busId are intentionally ignored — set by the service layer.
     */
    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "owner",     ignore = true)
    @Mapping(target = "busStatus", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Bus toEntity(BusRequest request);

    /**
     * Maps Bus entity to BusResponse DTO.
     * Flattens owner → ownerId and ownerEmail.
     */
    @Mapping(source = "owner.id",    target = "ownerId")
    @Mapping(source = "owner.email", target = "ownerEmail")
    @Mapping(source = "busStatus",   target = "status")
    BusResponse toResponse(Bus bus);

    /**
     * Applies non-null fields from BusRequest onto an existing Bus entity (for PUT).
     * owner, busId, status, and audit fields are never overwritten here.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "owner",     ignore = true)
    @Mapping(target = "busStatus", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(BusRequest request, @MappingTarget Bus bus);
}
