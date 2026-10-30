package com.transit.service.domain.bus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatLayoutConfig implements Serializable {

    @NotBlank(message = "Seat layout is require")
    private String seatType;

    @NotBlank(message = "Number of rows is require")
    @Positive(message = "Rows must be greater than 0")
    private Integer rows;

    @NotEmpty(message = "Left Column must not be empty")
    private List<String> leftCols;

    @NotEmpty(message = "Right Column must notbe empty")
    private List<String> rightCols;
}
