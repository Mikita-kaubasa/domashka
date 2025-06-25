import { fireEvent, render, screen } from '@testing-library/react';
import { User } from '../types/types';
import UserDetailsModal from './UserDetailsModal';

const mockUser: User = {
    id: 1,
    name: 'Alice',
    username: 'alice123',
    email: 'alice@example.com',
    address: {
        street: 'Main St',
        suite: 'Apt 1',
        city: 'Wonderland',
        zipcode: '12345',
        geo: { lat: '0', lng: '0' },
    },
    phone: '123-456-7890',
    website: 'alice.com',
    company: {
        name: 'Alice Co',
        catchPhrase: 'Curious and Curiouser',
        bs: 'adventures',
    },
};

describe('UserDetailsModal', () => {
    it('renders without crashing when open and user is provided', () => {
        render(<UserDetailsModal user={mockUser} isOpen={true} onClose={jest.fn()} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('alice@example.com')).toBeInTheDocument();
        expect(screen.getByText(/Address/i)).toBeInTheDocument();
        expect(screen.getByText(/Contact/i)).toBeInTheDocument();
        expect(screen.getByText(/Company/i)).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(<UserDetailsModal user={mockUser} isOpen={false} onClose={jest.fn()} />);
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });

    it('does not render when user is null', () => {
        render(<UserDetailsModal user={null} isOpen={true} onClose={jest.fn()} />);
        expect(screen.queryByText(/Address/i)).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const handleClose = jest.fn();
        render(<UserDetailsModal user={mockUser} isOpen={true} onClose={handleClose} />);
        const closeButton = screen.getByRole('button', { name: /close modal/i });
        fireEvent.click(closeButton);
        expect(handleClose).toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
        const handleClose = jest.fn();
        render(<UserDetailsModal user={mockUser} isOpen={true} onClose={handleClose} />);
        const modal = screen.getByText('Alice').closest('.modal-backdrop');
        if (modal) {
            fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
            expect(handleClose).toHaveBeenCalled();
        }
    });

    it('has correct accessibility attributes', () => {
        render(<UserDetailsModal user={mockUser} isOpen={true} onClose={jest.fn()} />);
        const modal = screen.getByText('Alice').closest('.modal-backdrop');
        expect(modal).toHaveAttribute('tabindex', '-1');
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<UserDetailsModal user={mockUser} isOpen={true} onClose={jest.fn()} />);
        expect(asFragment()).toMatchSnapshot();
    });
}); 