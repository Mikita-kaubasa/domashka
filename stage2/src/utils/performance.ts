/**
 * @fileoverview Performance utility functions for optimizing React applications.
 * This module provides various utilities for debouncing, throttling, array manipulation,
 * performance measurement, and intersection observer creation to improve application performance.
 * 
 * @module performance
 */

/**
 * Creates a debounced version of a function.
 * 
 * Debouncing delays the execution of a function until after a specified wait time
 * has elapsed since the last time it was invoked. This is useful for optimizing
 * performance on frequently called functions like search inputs or scroll handlers.
 * 
 * @template T - The type of the function to debounce
 * @param {T} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {(...args: Parameters<T>) => void} Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Only the last call will execute after 300ms
 * debouncedSearch('a');
 * debouncedSearch('ab');
 * debouncedSearch('abc'); // Only this will execute
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Creates a throttled version of a function.
 * 
 * Throttling limits the rate at which a function can be called. The function will
 * only execute once per specified time limit, regardless of how many times it's called.
 * This is useful for scroll events, resize handlers, or any frequently triggered events.
 * 
 * @template T - The type of the function to throttle
 * @param {T} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds between executions
 * @returns {(...args: Parameters<T>) => void} Throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 100);
 * 
 * // Will only execute once every 100ms
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Splits an array into smaller chunks of a specified size.
 * 
 * This is useful for processing large arrays in batches, implementing pagination,
 * or optimizing performance when dealing with large datasets.
 * 
 * @template T - The type of array elements
 * @param {T[]} array - The array to split into chunks
 * @param {number} chunkSize - The size of each chunk
 * @returns {T[][]} Array of chunks
 * 
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * const chunks = chunkArray(numbers, 3);
 * console.log(chunks); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 * 
 * // Process large arrays in batches
 * const largeArray = Array.from({ length: 1000 }, (_, i) => i);
 * const batches = chunkArray(largeArray, 100);
 * batches.forEach(batch => processBatch(batch));
 * ```
 */
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * Measures the execution time of a function and logs it to the console.
 * 
 * This utility is useful for performance profiling and identifying bottlenecks
 * in your application. It measures the time taken to execute a function and
 * logs the result with a custom label.
 * 
 * @template T - The return type of the function
 * @param {() => T} fn - The function to measure
 * @param {string} label - Label for the performance measurement
 * @returns {T} The result of the function execution
 * 
 * @example
 * ```typescript
 * const result = measurePerformance(() => {
 *   // Expensive operation
 *   return heavyComputation();
 * }, 'Heavy Computation');
 * // Console: "Heavy Computation took 150.25 milliseconds"
 * 
 * // For async functions
 * const asyncResult = await measurePerformance(async () => {
 *   return await fetchData();
 * }, 'Data Fetch');
 * ```
 */
export const measurePerformance = <T>(fn: () => T, label: string): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${label} took ${end - start} milliseconds`);
  return result;
};

/**
 * Creates an Intersection Observer for lazy loading and performance optimization.
 * 
 * Intersection Observer is used for lazy loading images, infinite scrolling,
 * and triggering animations when elements come into view. This utility provides
 * a convenient way to create observers with sensible defaults.
 * 
 * @param {IntersectionObserverCallback} callback - Function called when intersection changes
 * @param {IntersectionObserverInit} options - Observer options (optional)
 * @returns {IntersectionObserver} Configured Intersection Observer instance
 * 
 * @example
 * ```typescript
 * // Lazy load images
 * const imageObserver = createIntersectionObserver((entries) => {
 *   entries.forEach(entry => {
 *     if (entry.isIntersecting) {
 *       const img = entry.target as HTMLImageElement;
 *       img.src = img.dataset.src!;
 *       imageObserver.unobserve(img);
 *     }
 *   });
 * });
 * 
 * // Observe all lazy images
 * document.querySelectorAll('img[data-src]').forEach(img => {
 *   imageObserver.observe(img);
 * });
 * 
 * // Custom options
 * const customObserver = createIntersectionObserver(callback, {
 *   rootMargin: '50px',
 *   threshold: 0.5
 * });
 * ```
 */
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  });
}; 