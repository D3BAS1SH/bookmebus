package com.transit.service.domain.bus;

import com.transit.service.domain.bus.dto.BusRequest;
import com.transit.service.domain.bus.dto.BusResponse;
import com.transit.service.domain.bus.dto.BusStatusUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface BusService {

    BusResponse createBus(BusRequest request, UUID ownerId);

    BusResponse getBusById(UUID busId, UUID ownerId);

    BusResponse getBusById(UUID busId);

    List<BusResponse> getAllBusesByOwner(UUID ownerId);

    BusResponse updateBus(UUID busId, BusRequest request, UUID ownerId);

    BusResponse updateBusStatus(UUID busId, BusStatusUpdateRequest request, UUID ownerId);
}
