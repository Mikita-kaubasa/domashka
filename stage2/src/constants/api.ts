/**
 * @fileoverview API configuration constants for the user management application.
 * This module contains all API-related constants including base URLs, endpoints,
 * HTTP status codes, and error messages used throughout the application.
 * 
 * @module api-constants
 */

/**
 * Base URL for the JSONPlaceholder API.
 * 
 * This is the root URL for all API requests in the application.
 * JSONPlaceholder is a free fake API for testing and prototyping.
 * 
 * @constant {string}
 * @example
 * ```typescript
 * console.log(API_BASE_URL); // "https://jsonplaceholder.typicode.com"
 * ```
 */
export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * API endpoints used throughout the application.
 * 
 * Contains all the specific endpoints for different API operations.
 * Each endpoint is constructed using the base URL and specific path.
 * 
 * @constant {Object}
 * @property {string} USERS - Endpoint for fetching all users
 * 
 * @example
 * ```typescript
 * console.log(API_ENDPOINTS.USERS); // "https://jsonplaceholder.typicode.com/users"
 * 
 * // Fetch users
 * const response = await fetch(API_ENDPOINTS.USERS);
 * 
 * // Fetch specific user
 * const userResponse = await fetch(`${API_ENDPOINTS.USERS}/1`);
 * ```
 */
export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
} as const;

/**
 * Standard HTTP status codes used in API responses.
 * 
 * These constants provide a centralized reference for HTTP status codes
 * used throughout the application for error handling and response validation.
 * 
 * @constant {Object}
 * @property {number} OK - 200: Request succeeded
 * @property {number} CREATED - 201: Resource created successfully
 * @property {number} BAD_REQUEST - 400: Invalid request
 * @property {number} UNAUTHORIZED - 401: Authentication required
 * @property {number} NOT_FOUND - 404: Resource not found
 * @property {number} INTERNAL_SERVER_ERROR - 500: Server error
 * 
 * @example
 * ```typescript
 * if (response.status === HTTP_STATUS.OK) {
 *   // Handle successful response
 * } else if (response.status === HTTP_STATUS.NOT_FOUND) {
 *   // Handle not found error
 * }
 * ```
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Standardized error messages for API operations.
 * 
 * These messages provide consistent error handling across the application
 * and can be easily localized or customized as needed.
 * 
 * @constant {Object}
 * @property {string} FETCH_FAILED - Generic fetch failure message
 * @property {string} NETWORK_ERROR - Network connectivity error message
 * @property {string} UNKNOWN_ERROR - Fallback error message for unknown errors
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await fetch('/api/users');
 *   if (!response.ok) {
 *     throw new Error(ERROR_MESSAGES.FETCH_FAILED);
 *   }
 * } catch (error) {
 *   console.error(ERROR_MESSAGES.NETWORK_ERROR);
 * }
 * ```
 */
export const ERROR_MESSAGES = {
  FETCH_FAILED: 'Failed to fetch users',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const; 