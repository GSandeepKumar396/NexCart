package com.nexcart.exception;

public class InvalidCredentialsException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 4861913925292323501L;

	public InvalidCredentialsException(String message) {
        super(message);
    }
} 