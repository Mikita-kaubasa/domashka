/**
 * @fileoverview Utility functions for formatting and displaying user data.
 * This module provides various formatting utilities for addresses, phone numbers,
 * websites, and other user-related data to ensure consistent display across the application.
 * 
 * @module formatters
 * @requires ../types/types
 */

import { User } from '../types/types';

/**
 * Formats a user's address into a readable string.
 * 
 * Combines all address components (street, suite, city, zipcode) into a single
 * comma-separated string for display purposes.
 * 
 * @param {User['address']} address - The address object to format
 * @returns {string} Formatted address string
 * 
 * @example
 * ```typescript
 * const address = {
 *   street: "123 Main St",
 *   suite: "Apt 4B",
 *   city: "New York",
 *   zipcode: "10001",
 *   geo: { lat: "40.7128", lng: "-74.0060" }
 * };
 * 
 * const formatted = formatAddress(address);
 * console.log(formatted); // "123 Main St, Apt 4B, New York, 10001"
 * ```
 */
export const formatAddress = (address: User['address']): string => {
  return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
};

/**
 * Formats a phone number into a standardized format.
 * 
 * Supports various input formats and converts them to readable formats:
 * - 10 digits: (123) 456-7890
 * - 11 digits starting with 1: +1 (123) 456-7890
 * - Other formats: returns original
 * 
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 * 
 * @example
 * ```typescript
 * formatPhoneNumber("1234567890");     // "(123) 456-7890"
 * formatPhoneNumber("11234567890");    // "+1 (123) 456-7890"
 * formatPhoneNumber("123-456-7890");   // "(123) 456-7890"
 * formatPhoneNumber("+1-123-456-7890"); // "+1 (123) 456-7890"
 * ```
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Ensures a website URL has the proper protocol.
 * 
 * Adds 'https://' to URLs that don't already have a protocol.
 * This ensures all website links are clickable and secure by default.
 * 
 * @param {string} website - The website URL to format
 * @returns {string} Website URL with proper protocol
 * 
 * @example
 * ```typescript
 * formatWebsite("example.com");        // "https://example.com"
 * formatWebsite("http://example.com"); // "http://example.com"
 * formatWebsite("https://example.com"); // "https://example.com"
 * ```
 */
export const formatWebsite = (website: string): string => {
  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    return `https://${website}`;
  }
  return website;
};

/**
 * Generates a Google Maps URL for given coordinates.
 * 
 * Creates a clickable link that opens Google Maps at the specified
 * latitude and longitude coordinates.
 * 
 * @param {string} lat - Latitude coordinate
 * @param {string} lng - Longitude coordinate
 * @returns {string} Google Maps URL
 * 
 * @example
 * ```typescript
 * const mapUrl = getMapUrl("40.7128", "-74.0060");
 * console.log(mapUrl); // "https://www.google.com/maps?q=40.7128,-74.0060"
 * ```
 */
export const getMapUrl = (lat: string, lng: string): string => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

/**
 * Truncates text to a specified maximum length.
 * 
 * If the text is longer than the specified maximum length, it truncates
 * the text and adds an ellipsis (...) to indicate truncation.
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 * 
 * @example
 * ```typescript
 * truncateText("This is a very long text", 10); // "This is a..."
 * truncateText("Short text", 20);               // "Short text"
 * truncateText("", 10);                         // ""
 * ```
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}; 