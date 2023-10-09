import React from 'react';

export default function useOnEchap(handler: any): void {
  React.useEffect(() => {
    const listener = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [handler]);
}
