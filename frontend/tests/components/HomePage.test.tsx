import HomePage from '@components/HomePage';
import { render, screen } from '@testing-library/react';

test('Render HomePage', () => {
    render(<HomePage />);
    const homePage = screen.queryByText('Bienvenue sur Clochette!');
    expect(homePage).toBeInTheDocument();
});
