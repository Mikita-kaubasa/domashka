/**
 * @fileoverview Main application component that serves as the entry point for the user management application.
 * This component handles the overall application state, loading states, error handling, and renders the main user interface.
 * 
 * @module App
 * @requires React
 * @requires ./App.css
 * @requires ./components/UserList
 * @requires ./components/ui/ErrorBoundary
 * @requires ./hooks/useUsers
 */

import './App.css';
import UserList from './components/UserList';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useUsers } from './hooks/useUsers';

/**
 * Main application component that renders the user management interface.
 * 
 * This component:
 * - Manages the application's main state through the useUsers hook
 * - Handles loading states with a spinner and loading message
 * - Displays error states with retry functionality
 * - Renders the UserList component wrapped in an ErrorBoundary
 * 
 * @component
 * @returns {JSX.Element} The main application interface
 * 
 * @example
 * ```tsx
 * import App from './App';
 * 
 * function Root() {
 *   return <App />;
 * }
 * ```
 */
function App() {
  const { users, loading, error, refetch } = useUsers();

  // Show loading state while fetching users
  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="App">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={refetch}>Try Again</button>
        </div>
      </div>
    );
  }

  // Render main application with user list
  return (
    <ErrorBoundary>
      <div className="App">
        <UserList users={users} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
