import ConfigurationHomePage from '@components/ConfigurationPage/ConfigurationHomePage';
import { render, screen } from '@testing-library/react';

test('Render ConfigurationHomePage', () => {
    render(<ConfigurationHomePage />);
    const configurationHomePage = screen.queryByText('Configuration');
    expect(configurationHomePage).toBeInTheDocument();
});
