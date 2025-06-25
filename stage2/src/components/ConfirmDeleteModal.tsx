/**
 * @fileoverview Confirmation modal component for user deletion.
 * This component provides a simple confirmation dialog for deleting users
 * with keyboard navigation support and accessibility features.
 * 
 * @module ConfirmDeleteModal
 * @requires React
 */

import React from 'react';

/**
 * Props for the ConfirmDeleteModal component.
 * 
 * @interface ConfirmDeleteModalProps
 * @property {boolean} open - Whether the confirmation modal is currently open
 * @property {() => void} onCancel - Function to call when deletion is cancelled
 * @property {() => void} onConfirm - Function to call when deletion is confirmed
 * @property {string} userName - Name of the user to be deleted (displayed in confirmation message)
 */
interface ConfirmDeleteModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    userName: string;
}

/**
 * Confirmation modal for user deletion.
 * 
 * This component provides:
 * - Simple confirmation dialog with user name
 * - Keyboard navigation (Escape to cancel, Enter/Space to confirm)
 * - Auto-focus on cancel button for safety
 * - Accessibility features
 * - Clean, focused UI for important decisions
 * 
 * @component
 * @param {ConfirmDeleteModalProps} props - Component props
 * @returns {JSX.Element | null} Confirmation modal or null if not open
 * 
 * @example
 * ```tsx
 * import ConfirmDeleteModal from './components/ConfirmDeleteModal';
 * 
 * function UserList() {
 *   const [confirmOpen, setConfirmOpen] = useState(false);
 *   const [userToDelete, setUserToDelete] = useState<User | null>(null);
 * 
 *   const handleConfirmDelete = () => {
 *     // Delete user logic
 *     setConfirmOpen(false);
 *   };
 * 
 *   return (
 *     <ConfirmDeleteModal
 *       open={confirmOpen}
 *       onCancel={() => setConfirmOpen(false)}
 *       onConfirm={handleConfirmDelete}
 *       userName={userToDelete?.name || ''}
 *     />
 *   );
 * }
 * ```
 */
const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, onCancel, onConfirm, userName }) => {
    /**
     * Sets up keyboard event listeners for accessibility.
     * 
     * This effect adds global keyboard listeners when the modal is open:
     * - Escape key: Cancels the deletion
     * - Enter or Space key: Confirms the deletion
     * 
     * The listeners are properly cleaned up when the modal closes or component unmounts.
     * 
     * @example
     * ```typescript
     * // Press Escape to cancel, Enter/Space to confirm
     * ```
     */
    React.useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter' || e.key === ' ') onConfirm();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onCancel, onConfirm]);

    // Don't render if modal is not open
    if (!open) return null;

    return (
        <div className="modal-backdrop confirm-backdrop" tabIndex={-1}>
            <div className="confirm-modal">
                <div className="confirm-title">Delete user?</div>
                <div className="confirm-message">Are you sure you want to delete <b>{userName}</b>?</div>
                <div className="confirm-actions">
                    <button className="confirm-btn cancel" onClick={onCancel} autoFocus>Cancel</button>
                    <button className="confirm-btn delete" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal; 