/**
 * @fileoverview Modal component for displaying detailed user information.
 * This component provides a comprehensive view of user details including contact information,
 * address, and company details in a modal overlay with accessibility features.
 * 
 * @module UserDetailsModal
 * @requires React
 * @requires ../types/types
 * @requires ../utils/formatters
 * @requires ./UserDetailsModal.css
 */

import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { User } from '../types/types';
import { formatAddress, formatWebsite, getMapUrl } from '../utils/formatters';
import './UserDetailsModal.css';

/**
 * Props for the UserDetailsModal component.
 * 
 * @interface UserDetailsModalProps
 * @property {User | null} user - The user object to display, null if no user selected
 * @property {boolean} isOpen - Whether the modal is currently open
 * @property {() => void} onClose - Function to call when the modal should be closed
 */
interface UserDetailsModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Modal component for displaying detailed user information.
 * 
 * This component provides:
 * - Comprehensive user details display
 * - Modal overlay with backdrop
 * - Keyboard navigation (Escape to close)
 * - Click outside to close functionality
 * - Body scroll prevention when open
 * - Auto-focus management
 * - Accessibility features (ARIA labels, keyboard support)
 * - Responsive design with modern styling
 * 
 * @component
 * @param {UserDetailsModalProps} props - Component props
 * @returns {JSX.Element | null} Modal component or null if not open
 * 
 * @example
 * ```tsx
 * import UserDetailsModal from './components/UserDetailsModal';
 * 
 * function App() {
 *   const [selectedUser, setSelectedUser] = useState<User | null>(null);
 *   const [isModalOpen, setIsModalOpen] = useState(false);
 * 
 *   return (
 *     <UserDetailsModal
 *       user={selectedUser}
 *       isOpen={isModalOpen}
 *       onClose={() => setIsModalOpen(false)}
 *     />
 *   );
 * }
 * ```
 */
const UserDetailsModal: React.FC<UserDetailsModalProps> = memo(({ user, isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    /**
     * Prevents body scrolling when modal is open and restores it when closed.
     * 
     * This effect ensures that the background content doesn't scroll while
     * the modal is open, providing a better user experience.
     * 
     * @example
     * ```typescript
     * // Body scroll is automatically managed when modal opens/closes
     * ```
     */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    /**
     * Auto-focuses the modal when it opens for better accessibility.
     * 
     * This ensures that keyboard users can immediately interact with the modal
     * when it opens, following accessibility best practices.
     * 
     * @example
     * ```typescript
     * // Modal automatically receives focus when opened
     * ```
     */
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    /**
     * Handles backdrop click to close the modal.
     * 
     * Only closes the modal if the click target is the backdrop itself,
     * not if the click is on the modal content.
     * 
     * @param {React.MouseEvent} e - The mouse event
     * 
     * @example
     * ```typescript
     * // Clicking outside the modal content closes it
     * ```
     */
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    /**
     * Handles keyboard events for accessibility.
     * 
     * Supports Escape key to close the modal, following standard
     * modal interaction patterns.
     * 
     * @param {React.KeyboardEvent} e - The keyboard event
     * 
     * @example
     * ```typescript
     * // Pressing Escape closes the modal
     * ```
     */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    /**
     * Memoized formatted address string.
     * 
     * Only recalculates when the user object changes to optimize performance.
     * 
     * @type {string}
     */
    const formattedAddress = useMemo(() =>
        user ? formatAddress(user.address) : '',
        [user]
    );

    /**
     * Memoized formatted website URL.
     * 
     * Ensures the website URL has proper protocol for external links.
     * 
     * @type {string}
     */
    const formattedWebsite = useMemo(() =>
        user ? formatWebsite(user.website) : '',
        [user]
    );

    /**
     * Memoized Google Maps URL for the user's location.
     * 
     * Creates a clickable link to view the user's address on Google Maps.
     * 
     * @type {string}
     */
    const mapUrl = useMemo(() =>
        user ? getMapUrl(user.address.geo.lat, user.address.geo.lng) : '',
        [user]
    );

    // Don't render if modal is not open or no user is selected
    if (!isOpen || !user) return null;

    return (
        <div
            ref={modalRef}
            className="modal-backdrop"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="modal-container redesigned-modal">
                <div className="modal-header redesigned-header">
                    <div>
                        <div className="modal-user-name">{user.name}</div>
                        <a href={`mailto:${user.email}`} className="modal-user-email">{user.email}</a>
                    </div>
                    <button className="close-button redesigned-close" onClick={onClose} aria-label="Close modal">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-divider" />
                <div className="modal-content redesigned-content">
                    <div className="modal-section">
                        <div className="modal-section-title">Address</div>
                        <div className="modal-section-body">
                            <div>{user.address.street}, {user.address.suite}</div>
                            <div>{user.address.city}, {user.address.zipcode}</div>
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-map-link"
                            >
                                <span className="modal-map-pin" role="img" aria-label="pin">📍</span> View on map
                            </a>
                        </div>
                    </div>
                    <div className="modal-section">
                        <div className="modal-section-title">Contact</div>
                        <div className="modal-section-body">
                            <div><span className="modal-label">Phone:</span> {user.phone}</div>
                            <div>
                                <span className="modal-label">Website:</span>{' '}
                                <a
                                    href={formattedWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="modal-link"
                                >
                                    {user.website}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="modal-section">
                        <div className="modal-section-title">Company</div>
                        <div className="modal-section-body">
                            <div><span className="modal-label">Name:</span> {user.company.name}</div>
                            <div><span className="modal-label">Catchphrase:</span> {user.company.catchPhrase}</div>
                            <div><span className="modal-label">Business:</span> {user.company.bs}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

UserDetailsModal.displayName = 'UserDetailsModal';

export default UserDetailsModal; 