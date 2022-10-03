import Loader from '@components/Loader';
import { render, screen } from '@testing-library/react';

test('Render Loader', () => {
    render(<Loader />);
    const loader = screen.queryByLabelText('loader');
    expect(loader).toBeInTheDocument();
});
