import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { UserForm } from '@/components/account-page/account-page-user-form';
import { Account } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

const mockUser: Account = {
  id: 1,
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe'
} as any;

describe('UserForm', () => {
  it('should render the form with user data', async () => {
    render(<UserForm user={mockUser} />, {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(screen.getByLabelText<HTMLInputElement>('Prénom').value).toBe('John');
      expect(screen.getByLabelText<HTMLInputElement>('Nom de famille').value).toBe('Doe');
      expect(screen.getByLabelText<HTMLInputElement>("Nom d'utilisateur").value).toBe('johndoe');
    });
  });

  it('should update the user data when the form is submitted', async () => {
    const mockUpdateAccountMe = vi.fn();
    spyOnApi('useUpdateAccountMe', mockUpdateAccountMe);

    render(<UserForm user={mockUser} />, {
      wrapper: createWrapper()
    });

    fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Nom de famille'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText("Nom d'utilisateur"), { target: { value: 'janedoe' } });

    fireEvent.click(screen.getByRole('button', { name: 'Modifier mon compte' }));

    await waitFor(() => {
      expect(mockUpdateAccountMe).toHaveBeenCalledWith({
        body: {
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'janedoe'
        }
      });
    });
  });
});
