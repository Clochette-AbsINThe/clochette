import Navbar from '@include/Navbar';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('Render Navbar', () => {
    render(<Navbar />);
    const navbar = screen.queryByText('Clochette');
    expect(navbar).toBeInTheDocument();
});

test('Resize Navbar Show', () => {
    window.innerWidth = 1025;
    render(<Navbar />);
    const login = screen.queryByText('Se connecter');
    expect(login).toBeInTheDocument();
});

test('Open hamburger-menu', async () => {
    window.innerWidth = 500;
    render(<Navbar />);
    await act(async () => {
        await userEvent.click(screen.getByLabelText('hamburger-menu'));
    });
    const login = screen.queryByText('Se connecter');
    expect(login).toBeInTheDocument();
});
