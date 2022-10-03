import BaseURL from '@proxies/Config';

test('URL base is the goodd one', () => {
    expect(BaseURL).toBe('https://clochette.dev/api/v1');
});
