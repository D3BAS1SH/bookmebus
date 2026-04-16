package com.transit.service.domain.bus;

import com.transit.service.domain.bus.dto.BusRequest;
import com.transit.service.domain.bus.dto.BusResponse;
import com.transit.service.domain.bus.dto.BusStatusUpdateRequest;
import com.transit.service.domain.bus.mapper.BusMapper;
import com.transit.service.domain.user.User;
import com.transit.service.domain.user.UserRepository;
import com.transit.service.shared.exception.DuplicateResourceException;
import com.transit.service.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusServiceImpl implements BusService {
    private final BusRepository busRepository;
    private final UserRepository userRepository;
    private final BusMapper busMapper;

    @Override
    @Transactional
    public BusResponse createBus(BusRequest busRequest, UUID ownerId){
        if(busRepository.existsByRegistrationNumber(busRequest.getRegistrationNumber())){
            throw new DuplicateResourceException("Bus with registration number '" + busRequest.getRegistrationNumber() + "' already exists");
        }

        if(busRepository.existsByVehicleNumber(busRequest.getVehicleNumber())){
            throw new DuplicateResourceException("Bus with vehicle number '" + busRequest.getVehicleNumber() + "' already exists");
        }

        User owner = userRepository.findById(ownerId).orElseThrow(()-> new ResourceNotFoundException("Owner",ownerId));

        Bus bus = busMapper.toEntity(busRequest);
        bus.setOwner(owner);

        Bus savedBus = busRepository.save(bus);
        log.info("Bus created | busId={} reg={} ownerId={}", savedBus.getId(), savedBus.getRegistrationNumber(), ownerId);
        return busMapper.toResponse(savedBus);
    }

    @Override
    @Transactional(readOnly = true)
    public BusResponse getBusById(UUID busId, UUID ownerId) {
        Bus bus = findBusOwnedBy(busId, ownerId);
        return busMapper.toResponse(bus);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusResponse> getAllBusesByOwner(UUID ownerId) {
        return busRepository.findAllByOwner_Id(ownerId)
                .stream()
                .map(busMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public BusResponse updateBus(UUID busId, BusRequest request, UUID ownerId) {
        Bus bus = findBusOwnedBy(busId, ownerId);

        // Uniqueness guards — exclude the current bus from the check
        if (busRepository.existsByRegistrationNumberAndIdNot(request.getRegistrationNumber(), busId)) {
            throw new DuplicateResourceException(
                    "Registration number '" + request.getRegistrationNumber() + "' is already taken"
            );
        }
        if (busRepository.existsByVehicleNumberAndIdNot(request.getVehicleNumber(), busId)) {
            throw new DuplicateResourceException(
                    "Vehicle number '" + request.getVehicleNumber() + "' is already taken"
            );
        }

        busMapper.updateEntity(request, bus);
        Bus updated = busRepository.save(bus);
        log.info("Bus updated | busId={} ownerId={}", busId, ownerId);
        return busMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public BusResponse updateBusStatus(UUID busId, BusStatusUpdateRequest request, UUID ownerId) {
        Bus bus = findBusOwnedBy(busId, ownerId);
        bus.setBusStatus(request.getBusStatus());
        Bus updated = busRepository.save(bus);
        log.info("Bus status updated | busId={} newStatus={} ownerId={}", busId, request.getBusStatus(), ownerId);
        return busMapper.toResponse(updated);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Fetches a bus by ID and enforces owner scope.
     * Throws ResourceNotFoundException if the bus does not exist OR belongs to a different owner.
     * This deliberately avoids leaking whether the bus exists at all to other owners.
     */
    private Bus findBusOwnedBy(UUID busId, UUID ownerId) {
        return busRepository.findByIdAndOwner_Id(busId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Bus", busId));
    }
}
