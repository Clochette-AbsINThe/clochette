import { render, screen } from '@testing-library/react';
import Footer from '@components/Layout/Footer';

test('Render footer', () => {
    render(<Footer />);
    const footer = screen.queryByText('Guillemet Samuel - Marzelleau Benoit');
    expect(footer).toBeInTheDocument();
});
