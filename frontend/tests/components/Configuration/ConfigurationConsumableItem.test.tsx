import ConfigurationConsumableItem from '@components/ConfigurationPage/ConfigurationConsumableItem';
import { addIdToUrl } from '@utils/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { server } from '../../setupTests';
import { Toaster } from 'react-hot-toast';

test('Render ConfigurationConsumabelItem', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/consumable_item/', (req, res, ctx) => {
            return res(
                ctx.json([
                    {
                        id: 0,
                        name: 'Pizza',
                        icon: 'Food'
                    },
                    {
                        id: 1,
                        name: 'Coca',
                        icon: 'Soft'
                    }
                ]),
                ctx.status(200),
                ctx.delay(50)
            );
        })
    );
    render(<ConfigurationConsumableItem />);
    expect(screen.getByText('Modification des produits consommables')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();
});

test('Edit a consumable item succes', async () => {
    render(<Toaster />);
    render(<ConfigurationConsumableItem />);
    expect(screen.getByText('Modification des produits consommables')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'un produit consommable", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'test');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizzatest modifié avec succès !')).toBeInTheDocument();
});

test('Edit a consumable item error', async () => {
    render(<Toaster />);
    server.use(
        rest.put('https://clochette.dev/api/v1/consumable_item/0', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationConsumableItem />);
    expect(screen.getByText('Modification des produits consommables')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'un produit consommable", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'test');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Erreur lors de la modification de Pizzatest. Error message')).toBeInTheDocument();
});

test('Add a consumable item succes', async () => {
    render(<Toaster />);
    render(<ConfigurationConsumableItem />);
    expect(screen.getByText('Modification des produits consommables')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Ajout d'un produit consommable", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'NewConsumable');
    await userEvent.click(screen.getByLabelText('icon-food'));
    expect(screen.getByLabelText('icon-food')).toBeChecked();
    await userEvent.click(screen.getByLabelText('icon-soft'));
    expect(screen.getByLabelText('icon-soft')).toBeChecked();
    await userEvent.click(screen.getByLabelText('icon-misc'));
    expect(screen.getByLabelText('icon-misc')).toBeChecked();
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('NewConsumable ajouté avec succès !')).toBeInTheDocument();
});

test('Add a consumable item error', async () => {
    render(<Toaster />);
    server.use(
        rest.post('https://clochette.dev/api/v1/consumable_item/', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationConsumableItem />);
    expect(screen.getByText('Modification des produits consommables')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Ajout d'un produit consommable", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'NewConsumable');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Erreur lors de l'ajout de NewConsumable. Error message")).toBeInTheDocument();
});

test('Delete a consumable item succes', async () => {
    render(<Toaster />);
    render(<ConfigurationConsumableItem />);
    expect(screen.getByText('Modification des produits consommables')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'un produit consommable", { exact: false })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Supprimer' }));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza supprimé avec succès !')).toBeInTheDocument();
});

test('Delete a consumable item error', async () => {
    render(<Toaster />);
    server.use(
        rest.delete('https://clochette.dev/api/v1/consumable_item/0', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationConsumableItem />);
    expect(screen.getByText('Modification des produits consommables')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('edit'));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'un produit consommable", { exact: false })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Supprimer' }));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Erreur lors de la suppression de Pizza. Error message')).toBeInTheDocument();
});

test('Go to 404', async () => {
    addIdToUrl(404);
    render(<ConfigurationConsumableItem />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.getByText('PAGE NOT FOUND')).toBeInTheDocument();
});
