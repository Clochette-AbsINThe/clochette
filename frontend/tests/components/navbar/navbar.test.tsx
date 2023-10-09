import { fireEvent, render, screen } from '@testing-library/react';

import Navbar from '@/components/navbar/navbar';

describe('Navbar', () => {
  it('should match snapshot', () => {
    const { container } = render(<Navbar />);
    expect(container).toMatchSnapshot();
  });

  it('should open the mobile menu when clicking on the hamburger button', () => {
    window.innerWidth = 500;
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText('hamburger-menu'));
    const login = screen.queryByText('Se déconnecter');
    expect(login).not.toBeNull();
  });
});
