/**
 * @fileoverview Error boundary component for catching and handling React component errors.
 * This component provides error handling for React components by catching JavaScript errors
 * anywhere in the child component tree and displaying a fallback UI instead of crashing.
 * 
 * @module ErrorBoundary
 * @requires React
 */

import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props for the ErrorBoundary component.
 * 
 * @interface Props
 * @property {ReactNode} children - The child components to render and monitor for errors
 * @property {ReactNode} [fallback] - Optional custom fallback UI to display when an error occurs
 */
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 * 
 * @interface State
 * @property {boolean} hasError - Whether an error has been caught
 * @property {Error} [error] - The error that was caught (if any)
 */
interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Error boundary component for catching and handling React component errors.
 * 
 * This class component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * Error boundaries catch errors during rendering, in lifecycle methods, and in constructors
 * of the whole tree below them.
 * 
 * Features:
 * - Catches JavaScript errors in child components
 * - Logs error information for debugging
 * - Displays fallback UI when errors occur
 * - Supports custom fallback components
 * - Provides refresh functionality for recovery
 * 
 * @class ErrorBoundary
 * @extends {Component<Props, State>}
 * 
 * @example
 * ```tsx
 * import ErrorBoundary from './components/ui/ErrorBoundary';
 * 
 * function App() {
 *   return (
 *     <ErrorBoundary>
 *       <UserList users={users} />
 *     </ErrorBoundary>
 *   );
 * }
 * 
 * // With custom fallback
 * function AppWithCustomFallback() {
 *   return (
 *     <ErrorBoundary fallback={<CustomErrorComponent />}>
 *       <UserList users={users} />
 *     </ErrorBoundary>
 *   );
 * }
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
    /**
     * Initializes the ErrorBoundary component.
     * 
     * Sets up the initial state with no errors.
     * 
     * @param {Props} props - Component props
     */
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    /**
     * Static method called when an error is thrown in a child component.
     * 
     * This method is called during the "render" phase, so side-effects are not permitted.
     * It should return an object to update the state, or null to update nothing.
     * 
     * @static
     * @param {Error} error - The error that was thrown
     * @returns {State} New state object indicating an error occurred
     * 
     * @example
     * ```typescript
     * // This method is called automatically when an error occurs
     * // No manual calls needed
     * ```
     */
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    /**
     * Lifecycle method called when an error is caught.
     * 
     * This method is called during the "commit" phase, so side-effects are permitted.
     * It's used for logging error information and can be used to send error reports
     * to error reporting services.
     * 
     * @param {Error} error - The error that was thrown
     * @param {ErrorInfo} errorInfo - Additional error information
     * 
     * @example
     * ```typescript
     * // This method is called automatically when an error occurs
     * // Error information is logged to console
     * ```
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    /**
     * Renders the component.
     * 
     * If an error has occurred, renders either the custom fallback or the default
     * error UI. Otherwise, renders the children normally.
     * 
     * @returns {ReactNode} The rendered component
     */
    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided, otherwise use default error UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h2>Something went wrong</h2>
                        <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="retry-button"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        // Render children normally if no error
        return this.props.children;
    }
}

export default ErrorBoundary; 