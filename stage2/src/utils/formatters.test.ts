import { formatAddress, formatPhoneNumber, formatWebsite, getMapUrl, truncateText } from './formatters';

describe('formatAddress', () => {
  it('formats a full address', () => {
    expect(formatAddress({
      street: 'Main St',
      suite: 'Apt 1',
      city: 'Springfield',
      zipcode: '12345',
      geo: { lat: '0', lng: '0' },
    })).toBe('Main St, Apt 1, Springfield, 12345');
  });
});

describe('formatPhoneNumber', () => {
  it('formats a 10-digit US phone', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });
  it('formats an 11-digit US phone with country code', () => {
    expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890');
  });
  it('returns original if not 10/11 digits', () => {
    expect(formatPhoneNumber('555-123')).toBe('555-123');
  });
});

describe('formatWebsite', () => {
  it('adds https:// if missing', () => {
    expect(formatWebsite('example.com')).toBe('https://example.com');
  });
  it('keeps http://', () => {
    expect(formatWebsite('http://foo.com')).toBe('http://foo.com');
  });
  it('keeps https://', () => {
    expect(formatWebsite('https://bar.com')).toBe('https://bar.com');
  });
});

describe('getMapUrl', () => {
  it('returns a Google Maps URL', () => {
    expect(getMapUrl('10', '20')).toBe('https://www.google.com/maps?q=10,20');
  });
});

describe('truncateText', () => {
  it('returns text if under maxLength', () => {
    expect(truncateText('short', 10)).toBe('short');
  });
  it('truncates and adds ... if over maxLength', () => {
    expect(truncateText('longertext', 5)).toBe('longe...');
  });
}); 