import { render, screen } from '@testing-library/react';
import Footer from '@include/Footer';

test('Render footer', () => {
    render(<Footer />);
    const footer = screen.queryByText('Guillemet Samuel - Marzelleau Benoit');
    expect(footer).toBeInTheDocument();
});
