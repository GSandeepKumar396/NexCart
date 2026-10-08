package com.nexcart.exception;

public class ResourceNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = -7530525317514092155L;

	public ResourceNotFoundException(String message) {
        super(message);
    }
}