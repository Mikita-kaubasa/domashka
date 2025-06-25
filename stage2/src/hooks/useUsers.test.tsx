import { act, render, waitFor } from '@testing-library/react';
import { apiService } from '../services/api';
import { useUsers } from './useUsers';

jest.mock('../services/api');

const mockUsers = [
  { id: 1, name: 'A', username: 'a', email: 'a@a.com', address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, phone: '', website: '', company: { name: '', catchPhrase: '', bs: '' } },
  { id: 2, name: 'B', username: 'b', email: 'b@b.com', address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, phone: '', website: '', company: { name: '', catchPhrase: '', bs: '' } },
];

type UseUsersState = ReturnType<typeof useUsers>;

const TestComponent = () => {
  const state = useUsers();
  return <div data-testid="users-state">{JSON.stringify(state)}</div>;
};

describe('useUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads users on mount', async () => {
    (apiService.getUsers as jest.Mock).mockResolvedValue({ data: mockUsers, error: null });
    const { getByTestId } = render(<TestComponent />);
    let state: UseUsersState = JSON.parse(getByTestId('users-state').textContent!);
    expect(state.loading).toBe(true);
    await waitFor(() => {
      state = JSON.parse(getByTestId('users-state').textContent!);
      expect(state.loading).toBe(false);
    });
    expect(state.users).toEqual(mockUsers);
    expect(state.error).toBeNull();
  });

  it('handles error', async () => {
    (apiService.getUsers as jest.Mock).mockResolvedValue({ data: null, error: 'fail' });
    const { getByTestId } = render(<TestComponent />);
    let state: UseUsersState;
    await waitFor(() => {
      state = JSON.parse(getByTestId('users-state').textContent!);
      expect(state.loading).toBe(false);
    });
    state = JSON.parse(getByTestId('users-state').textContent!);
    expect(state.error).toBe('fail');
    expect(state.users).toEqual([]);
  });

  it('refetches users', async () => {
    (apiService.getUsers as jest.Mock).mockResolvedValueOnce({ data: mockUsers, error: null });
    const { getByTestId } = render(<TestComponent />);
    let state: UseUsersState;
    await waitFor(() => {
      state = JSON.parse(getByTestId('users-state').textContent!);
      expect(state.loading).toBe(false);
    });
    (apiService.getUsers as jest.Mock).mockResolvedValueOnce({ data: [mockUsers[0]], error: null });
    state = JSON.parse(getByTestId('users-state').textContent!);
    await act(async () => {
      await state.refetch();
    });
    state = JSON.parse(getByTestId('users-state').textContent!);
    expect(state.users).toEqual([mockUsers[0]]);
  });
}); 