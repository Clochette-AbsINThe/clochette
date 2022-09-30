import Loader from '@components/Loader';
import { render, screen } from '@testing-library/react';

test('Render Loader', () => {
    render(<Loader />);
    const loader = screen.queryByTestId('loader');
    expect(loader).toBeInTheDocument();
});
