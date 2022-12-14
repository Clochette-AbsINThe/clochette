import Page404 from '@components/404';
import { render, screen } from '@testing-library/react';

test('Render Page404', () => {
    render(<Page404 />);
    const page404 = screen.queryByText('La page est introuvable');
    expect(page404).toBeInTheDocument();
});
