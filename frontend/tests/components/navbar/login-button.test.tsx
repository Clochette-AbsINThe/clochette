import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import { Mock } from 'vitest';

import LoginButton from '@/components/navbar/login-button';
import { mockPush } from 'tests/utils';

vi.mock('next-auth/react');

describe('LoginButton', () => {
  const mockSignOut = signOut as Mock;
  const mockUseSession = useSession as Mock;

  beforeEach(() => {
    mockUseSession.mockReturnValue({ status: 'authenticated' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render a "Se déconnecter" button when the user is authenticated', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: 'Se déconnecter' });
    expect(button).not.toBeNull();
  });

  it('should render a "Se connecter" button when the user is not authenticated', () => {
    mockUseSession.mockReturnValueOnce({ status: 'unauthenticated' });
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: 'Se connecter' });
    expect(button).not.toBeNull();
  });

  it('should sign out and redirect to the index page when the "Se déconnecter" button is clicked', () => {
    render(<LoginButton />);
    const button = screen.getByRole('button', { name: 'Se déconnecter' });
    fireEvent.click(button);
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
