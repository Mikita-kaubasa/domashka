import { API_ENDPOINTS } from '../constants/api';
import { User } from '../types/types';
import { apiService } from './api';

global.fetch = jest.fn();

describe('apiService', () => {
  const mockUsers: User[] = [
    {
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
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    apiService.clearCache();
  });

  it('fetches users successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });
    const result = await apiService.getUsers();
    expect(fetch).toHaveBeenCalledWith(API_ENDPOINTS.USERS, expect.any(Object));
    expect(result.data).toEqual(mockUsers);
    expect(result.error).toBeNull();
  });

  it('fetches user by id successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers[0],
    });
    const result = await apiService.getUserById(1);
    expect(fetch).toHaveBeenCalledWith(`${API_ENDPOINTS.USERS}/1`, expect.any(Object));
    expect(result.data).toEqual(mockUsers[0]);
    expect(result.error).toBeNull();
  });

  it('returns error on network failure', async () => {
    (fetch as jest.Mock).mockImplementation(() => Promise.reject(new Error('Network down')));
    const result = await apiService.getUsers();
    expect(result.data).toBeNull();
    expect(result.error).toMatch(/Network down/);
  });

  it('returns error on non-ok response', async () => {
    (fetch as jest.Mock).mockImplementation(() => Promise.resolve({
      ok: false,
      status: 500,
      json: async () => ({}),
    }));
    const result = await apiService.getUsers();
    expect(result.data).toBeNull();
    expect(result.error).toMatch(/HTTP error/);
  });

  it('caches successful responses', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });
    const first = await apiService.getUsers();
    expect(fetch).toHaveBeenCalledTimes(1);
    const second = await apiService.getUsers();
    expect(fetch).toHaveBeenCalledTimes(1); // No new fetch
    expect(second.data).toEqual(first.data);
  });

  it('clears cache and fetches again', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
    await apiService.getUsers();
    apiService.clearCache();
    await apiService.getUsers();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles pending requests and returns same promise', async () => {
    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((resolve) => { resolveFetch = resolve; });
    (fetch as jest.Mock).mockReturnValue(fetchPromise);
    const promise1 = apiService.getUsers();
    const promise2 = apiService.getUsers();
    resolveFetch!({ ok: true, json: async () => mockUsers });
    const result1 = await promise1;
    const result2 = await promise2;
    expect(result1).toEqual(result2);
  });

  it('returns cached data until expired', async () => {
    jest.setTimeout(20000);
    jest.useFakeTimers();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
    await apiService.getUsers();
    jest.advanceTimersByTime(5 * 60 * 1000 + 1); // Expire cache
    // Flush all pending promises
    await Promise.resolve();
    await Promise.resolve();
    await apiService.getUsers();
    expect(fetch).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
}); 