import { fireEvent, render, screen } from '@testing-library/react';

import SearchBar from '@/components/search-bar';

describe('SearchBar', () => {
  it('should update the query string', () => {
    const setQuery = vi.fn();
    render(
      <SearchBar
        setQuery={setQuery}
        query=''
      />
    );

    fireEvent.change(screen.getByLabelText('search'), {
      target: { value: 'hello' }
    });

    expect(setQuery).toHaveBeenCalledWith('hello');
  });
});
