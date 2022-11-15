import ConfigurationOutOfStockItem from '@components/ConfigurationPage/ConfigurationOutOfStockItem';
import { addIdToUrl } from '@utils/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { server } from '../../setupTests';
import { Toaster } from 'react-hot-toast';

test('Render ConfigurationOutOfStockItem', async () => {
    render(<ConfigurationOutOfStockItem />);
    expect(screen.getByText('Modification des produits hors stock')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Planchette Charcuterie')).toBeInTheDocument();
});

test('Edit a outOfStock item succes', async () => {
    render(<Toaster />);
    render(<ConfigurationOutOfStockItem />);
    expect(screen.getByText('Modification des produits hors stock')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Planchette Charcuterie')).toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('edit')[0]);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'un produit hors stock", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'test');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('EcoCuptest modifié avec succès !')).toBeInTheDocument();
});

test('Edit a outOfStock item error', async () => {
    render(<Toaster />);
    server.use(
        rest.put('https://clochette.dev/api/v1/out_of_stock_item/1', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationOutOfStockItem />);
    expect(screen.getByText('Modification des produits hors stock')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Planchette Charcuterie')).toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('edit')[0]);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Modification d'un produit hors stock", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'test');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Erreur lors de la modification de EcoCuptest. Error message')).toBeInTheDocument();
});

test('Add a outOfStock item succes', async () => {
    render(<Toaster />);
    render(<ConfigurationOutOfStockItem />);
    expect(screen.getByText('Modification des produits hors stock')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Planchette Charcuterie')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Ajout d'un produit hors stock", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'NewOutOfStock');
    await userEvent.click(screen.getByLabelText('icon-food'));
    expect(screen.getByLabelText('icon-food')).toBeChecked();
    await userEvent.click(screen.getByLabelText('icon-soft'));
    expect(screen.getByLabelText('icon-soft')).toBeChecked();
    await userEvent.click(screen.getByLabelText('icon-misc'));
    expect(screen.getByLabelText('icon-misc')).toBeChecked();
    await userEvent.click(screen.getByLabelText('icon-glass'));
    expect(screen.getByLabelText('icon-glass')).toBeChecked();

    await userEvent.click(screen.getByLabelText('sellPriceCheckbox'));
    expect(screen.getByLabelText('sellPriceCheckbox')).toBeChecked();
    await userEvent.click(screen.getByLabelText('sellPrice'));
    await userEvent.keyboard('{Backspace}');
    expect(screen.getByLabelText('sellPrice')).toHaveValue(null);
    await userEvent.type(screen.getByLabelText('sellPrice'), '1');
    expect(screen.getByLabelText('sellPrice')).toHaveValue(1);
    await userEvent.click(screen.getByLabelText('sellPriceCheckbox'));
    expect(screen.getByLabelText('sellPriceCheckbox')).not.toBeChecked();

    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('NewOutOfStock ajouté avec succès !')).toBeInTheDocument();
});

test('Add a outOfStock item error', async () => {
    render(<Toaster />);
    server.use(
        rest.post('https://clochette.dev/api/v1/out_of_stock_item/', (req, res, ctx) => {
            return res(ctx.json({ detail: 'Error message' }), ctx.status(400), ctx.delay(50));
        })
    );
    render(<ConfigurationOutOfStockItem />);
    expect(screen.getByText('Modification des produits hors stock')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Planchette Charcuterie')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Ajout d'un produit hors stock", { exact: false })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('name'), 'NewOutOfStock');
    await userEvent.click(screen.getByRole('submit'));

    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Erreur lors de l'ajout de NewOutOfStock. Error message")).toBeInTheDocument();
});

test('Click on go back button', async () => {
    render(<ConfigurationOutOfStockItem />);
    expect(screen.getByText('Modification des produits hors stock')).toBeInTheDocument();
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText('Planchette Charcuterie')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Ajouter un produit' }));
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    });
    expect(screen.getByText("Ajout d'un produit hors stock", { exact: false })).toBeInTheDocument();

    await userEvent.click(screen.getByText('Retourner à la page de sélection'));
    expect(screen.getByText('Modification des produits hors stock')).toBeInTheDocument();
});

test('Go to 404', async () => {
    addIdToUrl(404);
    render(<ConfigurationOutOfStockItem />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.getByText('PAGE NOT FOUND')).toBeInTheDocument();
});
