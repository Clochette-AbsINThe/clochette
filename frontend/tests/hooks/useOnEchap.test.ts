import { renderHook } from '@testing-library/react';

import useOnEchap from '../../src/hooks/useOnEchap';

describe('useOnEchap', () => {
  it('should call the handler when Escape key is pressed', () => {
    const handler = vi.fn();
    renderHook(() => useOnEchap(handler));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should not call the handler when another key is pressed', () => {
    const handler = vi.fn();
    renderHook(() => useOnEchap(handler));

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });
});
