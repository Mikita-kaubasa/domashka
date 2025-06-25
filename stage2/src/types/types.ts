/**
 * @fileoverview TypeScript type definitions for the user management application.
 * This module contains all the core interfaces and types used throughout the application,
 * including user data structures, address information, and company details.
 * 
 * @module types
 */

/**
 * Geographic coordinates for a location.
 * 
 * @interface Geo
 * @property {string} lat - Latitude coordinate as a string
 * @property {string} lng - Longitude coordinate as a string
 * 
 * @example
 * ```typescript
 * const coordinates: Geo = {
 *   lat: "40.7128",
 *   lng: "-74.0060"
 * };
 * ```
 */
export interface Geo {
  lat: string;
  lng: string;
}

/**
 * Complete address information for a user.
 * 
 * @interface Address
 * @property {string} street - Street name and number
 * @property {string} suite - Suite, apartment, or unit number
 * @property {string} city - City name
 * @property {string} zipcode - Postal/ZIP code
 * @property {Geo} geo - Geographic coordinates of the address
 * 
 * @example
 * ```typescript
 * const address: Address = {
 *   street: "123 Main St",
 *   suite: "Apt 4B",
 *   city: "New York",
 *   zipcode: "10001",
 *   geo: { lat: "40.7128", lng: "-74.0060" }
 * };
 * ```
 */
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

/**
 * Company information associated with a user.
 * 
 * @interface Company
 * @property {string} name - Company name
 * @property {string} catchPhrase - Company slogan or catchphrase
 * @property {string} bs - Business strategy or description
 * 
 * @example
 * ```typescript
 * const company: Company = {
 *   name: "Acme Corp",
 *   catchPhrase: "Making the world a better place",
 *   bs: "harness real-time e-markets"
 * };
 * ```
 */
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

/**
 * Complete user information structure.
 * 
 * This is the main data structure representing a user in the application.
 * It contains all personal, contact, and professional information.
 * 
 * @interface User
 * @property {number} id - Unique identifier for the user
 * @property {string} name - Full name of the user
 * @property {string} username - Unique username for the user
 * @property {string} email - Email address of the user
 * @property {Address} address - Complete address information
 * @property {string} phone - Phone number (can be in various formats)
 * @property {string} website - Personal or company website URL
 * @property {Company} company - Associated company information
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: 1,
 *   name: "John Doe",
 *   username: "johndoe",
 *   email: "john@example.com",
 *   address: {
 *     street: "123 Main St",
 *     suite: "Apt 4B",
 *     city: "New York",
 *     zipcode: "10001",
 *     geo: { lat: "40.7128", lng: "-74.0060" }
 *   },
 *   phone: "1-770-736-8031 x56442",
 *   website: "johndoe.org",
 *   company: {
 *     name: "Acme Corp",
 *     catchPhrase: "Making the world a better place",
 *     bs: "harness real-time e-markets"
 *   }
 * };
 * ```
 */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
} 