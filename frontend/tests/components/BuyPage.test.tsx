import BuyPage, { createNewItem, RecapItem } from '@components/BuyPage';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ItemBuy } from '@types';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { server } from '../setupTests';

const item: ItemBuy = {
    table: 'consumable',
    quantity: 1,
    item: {
        fkID: 0,
        name: 'Consumable 1',
        unitPrice: 0,
        sellPrice: 0,
        icon: 'Food'
    }
};


describe('createNewItem tests', () => {
    test('create a new item of type Barrel', async () => {
        const newItem = createNewItem({ id: 0, name: 'Boisson 1', icon: 'Barrel' }, 'barrel');
        expect(newItem).toEqual({
            table: 'barrel',
            quantity: 1,
            item: {
                fkID: 0,
                name: 'Boisson 1',
                unitPrice: 0,
                sellPrice: 0,
                icon: 'Barrel'
            }
        });
    });

    test('create a new item of type OutOfStockBuy', async () => {
        const newItem = createNewItem({ id: 1, name: 'OutOfStock 1', icon: 'Food' }, 'outofstock');
        expect(newItem).toEqual({
            table: 'outofstock',
            quantity: 1,
            item: {
                fkID: 1,
                name: 'OutOfStock 1',
                unitPrice: 0,
                icon: 'Food'
            }
        });
    });

    test('create a new item of type OutOfStock EcoCup', async () => {
        const newItem = createNewItem({ id: 0, name: 'EcoCup', icon: 'Glass' }, 'outofstock');
        expect(newItem).toEqual({
            table: 'outofstock',
            quantity: 1,
            item: {
                fkID: 0,
                name: 'EcoCup',
                unitPrice: 1,
                icon: 'Glass'
            }
        });
    });

    test('create a new item of type Consumable', async () => {
        const newItem = createNewItem({ id: 0, name: 'Consumable 1', icon: 'Food' }, 'consumable');
        expect(newItem).toEqual({
            table: 'consumable',
            quantity: 1,
            item: {
                fkID: 0,
                name: 'Consumable 1',
                unitPrice: 0,
                sellPrice: 0,
                icon: 'Food'
            }
        });
    });
});

test('RecapItem renders', async () => {
    const handleModal = jest.fn();
    render(<RecapItem item={item} handleModalEdit={handleModal} />);
    expect(screen.getByText('Consumable 1')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('edit'));
    expect(handleModal).toHaveBeenCalled();
});

test('BuyPage renders', async () => {
    const changeSelectedItems = jest.fn();
    render(<BuyPage changeSelectedItems={changeSelectedItems} selectedItems={[item]} />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.getByText('1€')).toBeInTheDocument();
    expect(screen.getByText('Consumable 1')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('add-ecocup'));
    expect(screen.getByText('Nombre :')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('submit'));
    expect(changeSelectedItems).toHaveBeenCalled();
    await userEvent.click(screen.getAllByLabelText('edit')[0]);
    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getAllByLabelText('edit')[0]);
    await userEvent.click(screen.getByRole('submit'));
    expect(changeSelectedItems).toHaveBeenCalled();
});

test('EcoCup error', async () => {
    server.use(
        rest.get('https://clochette.dev/api/v1/OutOfStockItem/Buy', (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );
    const changeSelectedItems = jest.fn();
    render(<BuyPage changeSelectedItems={changeSelectedItems} selectedItems={[item]} />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.getByText('Erreur lors du chargement de l\'écocup')).toBeInTheDocument();
});
