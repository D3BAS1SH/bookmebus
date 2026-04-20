package com.transit.service.shared.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Object error;

    @Builder.Default
    private Instant timestamp = Instant.now();

    /**
     *  Use when request succeeded, and you have data to return
     *  Example: return ApiResponse.ok(userResponse);
     */
    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder().success(true).data(data).build();
    }

    /**
     * Use when request succeeded but there's nobody to return
     * Example: DELETE endpoints — 204 No Content
     */
    public static <T> ApiResponse<T> ok(String message) {
        return ApiResponse.<T>builder().success(true).message(message).build();
    }

    /**
     * Use when request failed with a simple message
     * Example: return ApiResponse.fail("Seat already booked");
     */
    public static <T> ApiResponse<T> fail(String message) {
        return ApiResponse.<T>builder().success(false).message(message).build();
    }

    /**
     * Use when request failed with structured validation errors
     * Example: return ApiResponse.fail("Validation failed", errorsMap);
     * */
    public static <T> ApiResponse<T> fail(String message, Object error) {
        return ApiResponse.<T>builder().success(false).message(message).error(error).build();
    }
}
