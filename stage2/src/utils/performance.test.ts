import { chunkArray, createIntersectionObserver, debounce, measurePerformance, throttle } from './performance';

describe('debounce', () => {
  jest.useFakeTimers();
  it('delays function call', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced('a');
    debounced('b');
    expect(fn).not.toBeCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toBeCalledTimes(1);
    expect(fn).toBeCalledWith('b');
  });
});

describe('throttle', () => {
  jest.useFakeTimers();
  it('throttles function calls', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);
    throttled('a');
    throttled('b');
    expect(fn).toBeCalledTimes(1);
    jest.advanceTimersByTime(100);
    throttled('c');
    expect(fn).toBeCalledTimes(2);
  });
});

describe('chunkArray', () => {
  it('splits array into chunks', () => {
    expect(chunkArray([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]]);
  });
  it('returns empty array for empty input', () => {
    expect(chunkArray([], 3)).toEqual([]);
  });
});

describe('measurePerformance', () => {
  it('measures and returns result', () => {
    const fn = jest.fn(() => 42);
    const spy = jest.spyOn(global.performance, 'now');
    spy.mockReturnValueOnce(1).mockReturnValueOnce(2);
    expect(measurePerformance(fn, 'label')).toBe(42);
    spy.mockRestore();
  });
});

describe('createIntersectionObserver', () => {
  it('returns an IntersectionObserver-like object', () => {
    const obs = createIntersectionObserver(() => {});
    expect(typeof obs.observe).toBe('function');
    expect(typeof obs.disconnect).toBe('function');
  });
}); 