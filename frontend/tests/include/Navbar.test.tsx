import { act, render, screen } from '@testing-library/react';
import Navbar from '@include/Navbar';

test('Render Navbar', () => {
    render(<Navbar />);
    const navbar = screen.queryByText('Clochette');
    expect(navbar).toBeInTheDocument();
});

test('Resize Navbar Hide', () => {
    global.innerWidth = 500;
    render(<Navbar />);
    const login = screen.queryByText('Login');
    expect(login).toBeNull();
});

test('Resize Navbar Show', () => {
    global.innerWidth = 1024;
    render(<Navbar />);
    const login = screen.queryByText('Login');
    expect(login).toBeInTheDocument();
});

test('debounce Resize Navbar Show', async () => {
    global.innerWidth = 1024;
    render(<Navbar />);
    await act(async () => {
        global.innerWidth = 760;
        global.dispatchEvent(new Event('resize'));
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    const login = screen.queryByText('Login');
    expect(login).toBeNull();
});
