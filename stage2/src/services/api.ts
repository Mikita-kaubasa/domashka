/**
 * @fileoverview API service for handling HTTP requests with caching, retry logic, and error handling.
 * This service provides a robust interface for making API calls with built-in caching,
 * request deduplication, automatic retries, and comprehensive error handling.
 * 
 * @module api
 * @requires ../constants/api
 * @requires ../types/types
 */

import { API_ENDPOINTS, ERROR_MESSAGES } from '../constants/api';
import { User } from '../types/types';

/**
 * Standard API response structure.
 * 
 * @interface ApiResponse
 * @template T - The type of data returned by the API
 * @property {T | null} data - The response data, null if request failed
 * @property {string | null} error - Error message, null if request succeeded
 */
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Comprehensive API service with caching and retry capabilities.
 * 
 * This service provides:
 * - HTTP request handling with proper error management
 * - Request caching with configurable expiration
 * - Automatic retry logic for failed requests
 * - Request deduplication to prevent duplicate calls
 * - Type-safe API responses
 * 
 * @class ApiService
 * 
 * @example
 * ```typescript
 * import { apiService } from './services/api';
 * 
 * // Fetch all users
 * const response = await apiService.getUsers();
 * if (response.data) {
 *   console.log(response.data);
 * } else {
 *   console.error(response.error);
 * }
 * 
 * // Fetch specific user
 * const userResponse = await apiService.getUserById(1);
 * if (userResponse.data) {
 *   console.log(userResponse.data.name);
 * }
 * ```
 */
class ApiService {
  /** Cache for storing API responses with timestamps */
  private cache = new Map<string, { data: any; timestamp: number }>();
  
  /** Map to track pending requests and prevent duplicates */
  private pendingRequests = new Map<string, Promise<ApiResponse<any>>>();
  
  /** Cache duration in milliseconds (5 minutes) */
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  /**
   * Makes a generic HTTP request with error handling.
   * 
   * @async
   * @template T - The expected response data type
   * @param {string} url - The URL to make the request to
   * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response
   * 
   * @example
   * ```typescript
   * const response = await this.makeRequest<User[]>('/api/users');
   * ```
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      return { data: null, error: errorMessage };
    }
  }

  /**
   * Retries a request with exponential backoff.
   * 
   * @async
   * @template T - The expected response data type
   * @param {() => Promise<ApiResponse<T>>} requestFn - Function that makes the request
   * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
   * @param {number} delay - Base delay between retries in milliseconds (default: 1000)
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response after retries
   * 
   * @example
   * ```typescript
   * const response = await this.retryRequest(
   *   () => this.makeRequest<User[]>('/api/users'),
   *   3,
   *   1000
   * );
   * ```
   */
  private async retryRequest<T>(
    requestFn: () => Promise<ApiResponse<T>>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<ApiResponse<T>> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await requestFn();
      
      if (result.data) {
        return result;
      }

      if (attempt === maxRetries) {
        return result;
      }

      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }

    return { data: null, error: ERROR_MESSAGES.NETWORK_ERROR };
  }

  /**
   * Retrieves cached data if it exists and is not expired.
   * 
   * @template T - The type of cached data
   * @param {string} key - Cache key to retrieve
   * @returns {T | null} Cached data or null if not found/expired
   * 
   * @example
   * ```typescript
   * const cachedUsers = this.getCachedData<User[]>('users');
   * ```
   */
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Stores data in the cache with current timestamp.
   * 
   * @template T - The type of data to cache
   * @param {string} key - Cache key
   * @param {T} data - Data to cache
   * 
   * @example
   * ```typescript
   * this.setCachedData('users', userData);
   * ```
   */
  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Makes a request with caching and deduplication.
   * 
   * This method:
   * - Checks cache first for existing data
   * - Prevents duplicate requests for the same data
   * - Caches successful responses
   * - Handles request lifecycle management
   * 
   * @async
   * @template T - The expected response data type
   * @param {string} url - The URL to request
   * @param {string} cacheKey - Key for caching the response
   * @returns {Promise<ApiResponse<T>>} Promise resolving to API response
   * 
   * @example
   * ```typescript
   * const response = await this.makeCachedRequest<User[]>('/api/users', 'users');
   * ```
   */
  private async makeCachedRequest<T>(url: string, cacheKey: string): Promise<ApiResponse<T>> {
    // Check cache first
    const cachedData = this.getCachedData<T>(cacheKey);
    if (cachedData) {
      return { data: cachedData, error: null };
    }

    // Check if there's already a pending request
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Make the request
    const requestPromise = this.retryRequest(() => this.makeRequest<T>(url));
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      
      // Cache successful responses
      if (result.data) {
        this.setCachedData(cacheKey, result.data);
      }
      
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Fetches all users from the API.
   * 
   * @async
   * @returns {Promise<ApiResponse<User[]>>} Promise resolving to users array or error
   * 
   * @example
   * ```typescript
   * const response = await apiService.getUsers();
   * if (response.data) {
   *   response.data.forEach(user => console.log(user.name));
   * }
   * ```
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.makeCachedRequest<User[]>(API_ENDPOINTS.USERS, 'users');
  }

  /**
   * Fetches a specific user by ID from the API.
   * 
   * @async
   * @param {number} id - The user ID to fetch
   * @returns {Promise<ApiResponse<User>>} Promise resolving to user object or error
   * 
   * @example
   * ```typescript
   * const response = await apiService.getUserById(1);
   * if (response.data) {
   *   console.log(response.data.name);
   * }
   * ```
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.makeCachedRequest<User>(`${API_ENDPOINTS.USERS}/${id}`, `user-${id}`);
  }

  /**
   * Clears all cached data.
   * 
   * This method removes all entries from the cache, forcing fresh API requests
   * on subsequent calls.
   * 
   * @example
   * ```typescript
   * apiService.clearCache();
   * ```
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clears a specific cache entry.
   * 
   * @param {string} key - The cache key to remove
   * 
   * @example
   * ```typescript
   * apiService.clearCacheEntry('users');
   * ```
   */
  clearCacheEntry(key: string): void {
    this.cache.delete(key);
  }
}

/** Singleton instance of the API service */
export const apiService = new ApiService(); 