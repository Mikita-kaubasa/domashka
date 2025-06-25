import { fireEvent, render, screen } from '@testing-library/react';
import { User } from '../types/types';
import UserList from './UserList';

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

const mockUsers: User[] = [
    mockUser,
    {
        ...mockUser,
        id: 2,
        name: 'Bob',
        username: 'bob321',
        email: 'bob@example.com',
        company: { ...mockUser.company, name: 'Bob Inc' },
    },
];

describe('UserList', () => {
    it('renders without crashing', () => {
        render(<UserList users={mockUsers} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('renders correct number of users', () => {
        render(<UserList users={mockUsers} />);
        // Select all rows except the header
        const rows = screen.getAllByRole('row');
        // First row is header, rest are users
        expect(rows.length - 1).toBe(mockUsers.length);
    });

    it('renders empty table if no users', () => {
        render(<UserList users={[]} />);
        // There should be no table rows except the header
        const rows = screen.getAllByRole('row');
        // Only header row should exist
        expect(rows.length).toBe(1);
    });

    it('opens modal when a user row is clicked', () => {
        render(<UserList users={mockUsers} />);
        const aliceRow = screen.getByText('Alice').closest('tr');
        if (aliceRow) fireEvent.click(aliceRow);
        // Modal fallback or modal content should appear
        expect(screen.getByText(/loading modal/i)).toBeInTheDocument();
    });

    it('has correct accessibility attributes on delete buttons', () => {
        render(<UserList users={mockUsers} />);
        const deleteButtons = screen.getAllByRole('button', { name: /remove user/i });
        deleteButtons.forEach((btn) => {
            expect(btn).toHaveAttribute('tabindex', '0');
            expect(btn).toHaveAttribute('aria-label');
        });
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<UserList users={mockUsers} />);
        expect(asFragment()).toMatchSnapshot();
    });
}); 