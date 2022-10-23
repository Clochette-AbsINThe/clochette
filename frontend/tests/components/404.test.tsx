import Page404 from '@components/404';
import { render, screen } from '@testing-library/react';

test('Render Page404', () => {
    render(<Page404 />);
    const page404 = screen.queryByText('PAGE NOT FOUND');
    expect(page404).toBeInTheDocument();
});
