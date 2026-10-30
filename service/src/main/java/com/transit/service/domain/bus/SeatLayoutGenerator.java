package com.transit.service.domain.bus;

import com.transit.service.domain.bus.SeatLayoutConfig;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

/**
 * Generates an ordered list of seat name strings from a {@link com.transit.service.domain.bus.SeatLayoutConfig}.
 *
 * <p>Given the config:
 * <pre>
 * { "type": "2+2", "rows": 3, "left_cols": ["A","B"], "right_cols": ["C","D"] }
 * </pre>
 * The output is:
 * <pre>
 * ["1A","1B","1C","1D", "2A","2B","2C","2D", "3A","3B","3C","3D"]
 * </pre>
 *
 * <p>Column order per row: all left columns first (in order), then all right columns (in order).
 * This list is consumed by the Trip creation logic in Phase 3 to pre-generate TripSeat rows.
 */
@UtilityClass
@Slf4j
public class SeatLayoutGenerator {

    /**
     * @param layout the SeatLayoutConfig from a Bus entity
     * @return ordered list of seat name strings, e.g. ["1A","1B","1C","1D",...]
     */
    public List<String> generate(SeatLayoutConfig layout) {
        List<String> seats = new ArrayList<>();

        for (int row = 1; row <= layout.getRows(); row++) {
            for (String col : layout.getLeftCols()) {
                seats.add(row + col);
            }
            for (String col : layout.getRightCols()) {
                seats.add(row + col);
            }
        }

        log.debug("Generated {} seats for layout type={} rows={}",
                seats.size(), layout.getSeatType(), layout.getRows());
        return seats;
    }

    /**
     * Convenience method — returns the total seat count without building the full list.
     */
    public int countSeats(SeatLayoutConfig layout) {
        return layout.getRows() * (layout.getLeftCols().size() + layout.getRightCols().size());
    }
}