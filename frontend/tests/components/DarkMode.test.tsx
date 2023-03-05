import { render, screen } from '@testing-library/react';
import { DarkMode } from '@components/Layout/Navbar/DarkMode';
import userEvent from '@testing-library/user-event';

test('Render DarkMode', () => {
    render(<DarkMode />);
    const darkMode = screen.queryByLabelText('darkMode');
    expect(darkMode).toBeInTheDocument();
});

test('DarkMode click', async () => {
    render(<DarkMode />);
    const dark = screen.getByLabelText('dark');
    await userEvent.click(dark);
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    expect(theme).toBe('dark');
});

test('DrakMode checked at start', () => {
    render(<DarkMode />);
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const checkbox = screen.getByLabelText(theme);
    expect(checkbox).toBeChecked();
});
