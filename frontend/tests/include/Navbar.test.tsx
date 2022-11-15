import Navbar from '@include/Navbar';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('Render Navbar', () => {
    render(<Navbar />);
    const navbar = screen.queryByText('Clochette');
    expect(navbar).toBeInTheDocument();
});

test('Resize Navbar Hide', () => {
    window.innerWidth = 500;
    render(<Navbar />);
    const login = screen.queryByText('Login');
    expect(login).toBeNull();
});

test('Resize Navbar Show', () => {
    window.innerWidth = 1025;
    render(<Navbar />);
    const login = screen.queryByText('Login');
    expect(login).toBeInTheDocument();
});

test('debounce Resize Navbar Show', async () => {
    window.innerWidth = 1024;
    render(<Navbar />);
    await act(async () => {
        window.innerWidth = 760;
        window.dispatchEvent(new Event('resize'));
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    const login = screen.queryByText('Login');
    expect(login).toBeNull();
});

test('Open hamburger-menu', async () => {
    window.innerWidth = 500;
    render(<Navbar />);
    await act(async () => {
        await userEvent.click(screen.getByLabelText('hamburger-menu'));
    });
    const login = screen.queryByText('Login');
    expect(login).toBeInTheDocument();
});
