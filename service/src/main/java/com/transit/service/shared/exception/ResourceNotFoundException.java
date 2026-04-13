package com.transit.service.shared.exception;

/**
 * Thrown when a requested entity does not exist in the database.
 * <p>
 * GlobalExceptionHandler catches this and returns HTTP 404.
 * </p>
 * <b>Usage examples:</b>
 * <ul>
 *   <li>{@code throw new ResourceNotFoundException("Bus", busId);}</li>
 *   <li>{@code throw new ResourceNotFoundException("User", "email", email);}</li>
 * </ul>
 */
public class ResourceNotFoundException extends RuntimeException{

    /**
     * Single field lookup — "Bus not found with id: abc-123"
     */
    public ResourceNotFoundException(String resource, Object id){
        super("Resource " + resource + " not found with id " + id);
    }

    /**
     * Field-specific lookup — "User not found with email: john@mail.com"
     */
    public ResourceNotFoundException(String resource, String field, Object value){
        super("Resource " + resource + " not found with id " + field + " " + value);
    }
}
