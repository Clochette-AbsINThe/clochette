import ConfigurationDrink from '@components/ConfigurationPage/ConfigurationDrink';
import { addIdToUrl } from '@utils/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { server } from '../../setupTests';
import { Toaster } from 'react-hot-toast';

test('Render ConfigurationDrink', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/drink/', (req, res, ctx) => {
            return res(
                ctx.json([
                    {
                        id: 1,
                        name: 'Rouge'
                    },
                    {
                        id: 2,
                        name: 'Blanc'
                    }
                ]),
                ctx.status(200),
                ctx.delay(50)
            );
        })
    );
    render(<ConfigurationDrink />);
    expect(screen.getByText('Modification des boissons')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge')).toBeInTheDocument();
});

test('Edit a drink succes', async () => {
    render(<Toaster />);
    render(<ConfigurationDrink />);
    expect(screen.getByText('Modification des boissons')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'une boisson", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'test');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rougetest modifié avec succès !')).toBeInTheDocument();
});

test('Edit a drink error', async () => {
    render(<Toaster />);
    server.use(
        rest.put('https://clochette.dev/api/v1/drink/1', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationDrink />);
    expect(screen.getByText('Modification des boissons')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'une boisson", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'test');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Erreur lors de la modification de Rougetest. Error message')).toBeInTheDocument();
});

test('Add a drink succes', async () => {
    render(<Toaster />);
    render(<ConfigurationDrink />);
    expect(screen.getByText('Modification des boissons')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Ajout d'une boisson", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'NewDrink');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('NewDrink ajouté avec succès !')).toBeInTheDocument();
});

test('Add a drink error', async () => {
    render(<Toaster />);
    server.use(
        rest.post('https://clochette.dev/api/v1/drink/', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationDrink />);
    expect(screen.getByText('Modification des boissons')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Ajout d'une boisson", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'NewDrink');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Erreur lors de l'ajout de NewDrink. Error message")).toBeInTheDocument();
});

test('Delete a drink succes', async () => {
    render(<Toaster />);
    render(<ConfigurationDrink />);
    expect(screen.getByText('Modification des boissons')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'une boisson", { exact: false })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Supprimer' }));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge supprimé avec succès !')).toBeInTheDocument();
});

test('Delete a drink error', async () => {
    render(<Toaster />);
    server.use(
        rest.delete('https://clochette.dev/api/v1/drink/1', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationDrink />);
    expect(screen.getByText('Modification des boissons')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Rouge')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'une boisson", { exact: false })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Supprimer' }));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Erreur lors de la suppression de Rouge. Error message')).toBeInTheDocument();
});

test('Go to 404', async () => {
    addIdToUrl(404);
    render(<ConfigurationDrink />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.getByText('PAGE NOT FOUND')).toBeInTheDocument();
});
