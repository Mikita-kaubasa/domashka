/**
 * @fileoverview User list component that displays users in a table format with interactive features.
 * This component provides a comprehensive user management interface with the ability to view,
 * delete users, and open detailed user information in modals.
 * 
 * @module UserList
 * @requires React
 * @requires ../types/types
 * @requires ../utils/formatters
 * @requires ./ConfirmDeleteModal
 * @requires ./UserDetailsModal
 * @requires ./UserList.css
 */

import React, { Suspense, lazy, memo, useCallback, useMemo, useState } from 'react';
import { User } from '../types/types';
import { formatAddress, formatWebsite } from '../utils/formatters';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './UserList.css';

// Lazy load the modal component for better performance
const UserDetailsModal = lazy(() => import('./UserDetailsModal'));

/**
 * Props for the UserList component.
 * 
 * @interface UserListProps
 * @property {User[]} users - Array of user objects to display
 */
interface UserListProps {
    users: User[];
}

/**
 * User list component with interactive features.
 * 
 * This component provides:
 * - Tabular display of user information
 * - Click-to-view user details in a modal
 * - Delete user functionality with confirmation
 * - Responsive design with modern styling
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Lazy loading of modal components
 * 
 * @component
 * @param {UserListProps} props - Component props
 * @returns {JSX.Element} User list interface
 * 
 * @example
 * ```tsx
 * import UserList from './components/UserList';
 * 
 * function App() {
 *   const users = [/* user data *\/];
 *   return <UserList users={users} />;
 * }
 * ```
 */
const UserList: React.FC<UserListProps> = memo(({ users: initialUsers }) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletedMsg, setDeletedMsg] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    /**
     * Handles row click to open user details modal.
     * 
     * @param {User} user - The user object to display in the modal
     * 
     * @example
     * ```typescript
     * handleRowClick(user);
     * ```
     */
    const handleRowClick = useCallback((user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    }, []);

    /**
     * Closes the user details modal and resets selected user.
     * 
     * @example
     * ```typescript
     * handleCloseModal();
     * ```
     */
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedUser(null);
    }, []);

    /**
     * Initiates the delete user process by opening confirmation modal.
     * 
     * @param {User} user - The user to be deleted
     * @param {React.MouseEvent} e - Optional mouse event (used to prevent row click)
     * 
     * @example
     * ```typescript
     * handleDeleteUser(user, event);
     * ```
     */
    const handleDeleteUser = useCallback((user: User, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setUserToDelete(user);
        setConfirmOpen(true);
    }, []);

    /**
     * Confirms user deletion and removes from the list.
     * 
     * This function:
     * - Removes the user from the local state
     * - Shows a temporary success message
     * - Closes the confirmation modal
     * 
     * @example
     * ```typescript
     * handleConfirmDelete();
     * ```
     */
    const handleConfirmDelete = useCallback(() => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            setDeletedMsg('User deleted');
            setTimeout(() => setDeletedMsg(null), 1800);
        }
        setConfirmOpen(false);
        setUserToDelete(null);
    }, [userToDelete]);

    /**
     * Cancels the delete operation and closes confirmation modal.
     * 
     * @example
     * ```typescript
     * handleCancelDelete();
     * ```
     */
    const handleCancelDelete = useCallback(() => {
        setConfirmOpen(false);
        setUserToDelete(null);
    }, []);

    /**
     * Memoized table rows to prevent unnecessary re-renders.
     * 
     * Each row includes:
     * - User name and email
     * - Formatted address
     * - Clickable phone number
     * - Clickable website link
     * - Company name
     * - Delete button with accessibility features
     * 
     * @type {JSX.Element[]}
     */
    const tableRows = useMemo(() => {
        return users.map((user) => (
            <tr
                key={user.id}
                className="table-row"
                onClick={() => handleRowClick(user)}
            >
                <td className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                </td>
                <td className="user-address" title={formatAddress(user.address)}>
                    {formatAddress(user.address)}
                </td>
                <td className="user-phone">
                    <a
                        href={`tel:${user.phone}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {user.phone}
                    </a>
                </td>
                <td className="user-website">
                    <a
                        href={formatWebsite(user.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {user.website}
                    </a>
                </td>
                <td className="user-company">
                    {user.company.name}
                </td>
                <td className="user-action">
                    <button
                        className="action-btn"
                        aria-label={`Remove user ${user.name}`}
                        tabIndex={0}
                        onClick={(e) => handleDeleteUser(user, e)}
                    >
                        <span className="action-x">×</span>
                    </button>
                </td>
            </tr>
        ));
    }, [users, handleRowClick, handleDeleteUser]);

    return (
        <>
            <div className="user-list-container">
                <h2 className="user-list-title">User Directory</h2>
                <div className="user-table-wrapper">
                    <table className="user-table modern">
                        <thead>
                            <tr className="table-header">
                                <th>NAME / EMAIL</th>
                                <th>ADDRESS</th>
                                <th>PHONE</th>
                                <th>WEBSITE</th>
                                <th>COMPANY</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows}
                        </tbody>
                    </table>
                </div>
                {deletedMsg && (
                    <div className="user-toast" role="status">{deletedMsg}</div>
                )}
                <ConfirmDeleteModal
                    open={confirmOpen}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    userName={userToDelete?.name || ''}
                />
            </div>

            {isModalOpen && (
                <Suspense fallback={
                    <div className="modal-backdrop">
                        <div className="modal-container">
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading modal...</p>
                            </div>
                        </div>
                    </div>
                }>
                    <UserDetailsModal
                        user={selectedUser}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                </Suspense>
            )}
        </>
    );
});

UserList.displayName = 'UserList';

export default UserList; 