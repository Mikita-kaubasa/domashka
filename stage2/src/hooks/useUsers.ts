/**
 * @fileoverview Custom React hook for managing user data fetching and state.
 * This hook provides a complete solution for fetching, caching, and managing user data
 * with built-in loading states, error handling, and retry functionality.
 * 
 * @module useUsers
 * @requires React
 * @requires ../constants/api
 * @requires ../services/api
 * @requires ../types/types
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ERROR_MESSAGES } from '../constants/api';
import { apiService } from '../services/api';
import { User } from '../types/types';

/**
 * Return type for the useUsers hook.
 * 
 * @interface UseUsersReturn
 * @property {User[]} users - Array of user objects
 * @property {boolean} loading - Whether the data is currently being fetched
 * @property {string | null} error - Error message if the fetch failed, null otherwise
 * @property {() => Promise<void>} refetch - Function to manually trigger a data refetch
 */
interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom React hook for managing user data.
 * 
 * This hook provides a complete solution for fetching and managing user data with:
 * - Automatic data fetching on mount
 * - Loading state management
 * - Error handling with user-friendly messages
 * - Manual refetch capability
 * - Memoized return values to prevent unnecessary re-renders
 * 
 * @function useUsers
 * @returns {UseUsersReturn} Object containing users data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * import { useUsers } from './hooks/useUsers';
 * 
 * function UserList() {
 *   const { users, loading, error, refetch } = useUsers();
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 * 
 *   return (
 *     <div>
 *       {users.map(user => <UserCard key={user.id} user={user} />)}
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches user data from the API.
   * 
   * This function handles the complete data fetching process including:
   * - Setting loading state
   * - Clearing previous errors
   * - Making API request
   * - Handling success and error responses
   * - Updating state accordingly
   * 
   * @async
   * @function fetchUsers
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * await fetchUsers();
   * ```
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getUsers();

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setUsers(response.data);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Manually triggers a data refetch.
   * 
   * This function is a wrapper around fetchUsers that can be called
   * by components to refresh the data, typically in response to user actions.
   * 
   * @async
   * @function refetch
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * const handleRefresh = async () => {
   *   await refetch();
   * };
   * ```
   */
  const refetch = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoize the return object to prevent unnecessary re-renders
  const result = useMemo(() => ({
    users,
    loading,
    error,
    refetch,
  }), [users, loading, error, refetch]);

  return result;
}; 