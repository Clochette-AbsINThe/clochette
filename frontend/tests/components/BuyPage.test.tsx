import BuyPage, { createNewItem, updateFkID } from '@components/Transaction/Buy/BuyPage';
import { endpoints } from '@utils/endpoints';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ConsumableItem, Drink, ItemBuy, OutOfStockItemBuy } from '@types';
import { rest } from 'msw';
import { act } from 'react-dom/test-utils';
import { server } from '../setupTests';
import { RecapItem } from '@components/Transaction/Buy/RecapItem';

const item: ItemBuy = {
    table: 'consumable',
    quantity: 1,
    item: {
        fkId: 0,
        name: 'Consumable 1',
        unitPrice: 1,
        sellPrice: 1,
        icon: 'Food'
    }
};

const item2: ItemBuy = {
    table: 'consumable',
    quantity: 1,
    item: {
        fkId: -1,
        name: 'Consumable 2',
        unitPrice: 1,
        sellPrice: 1,
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
                fkId: 0,
                name: 'Boisson 1',
                unitPrice: 0,
                sellPrice: 0,
                icon: 'Barrel',
                empty: false
            }
        });
    });

    test('create a new item of type OutOfStockBuy', async () => {
        const newItem = createNewItem({ id: 1, name: 'OutOfStock 1', icon: 'Food' }, 'out_of_stock');
        expect(newItem).toEqual({
            table: 'out_of_stock',
            quantity: 1,
            item: {
                fkId: 1,
                name: 'OutOfStock 1',
                unitPrice: 0,
                icon: 'Food'
            }
        });
    });

    test('create a new item of type OutOfStock EcoCup', async () => {
        const newItem = createNewItem({ id: 0, name: 'EcoCup', icon: 'Glass' }, 'out_of_stock');
        expect(newItem).toEqual({
            table: 'out_of_stock',
            quantity: 1,
            item: {
                fkId: 0,
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
                fkId: 0,
                name: 'Consumable 1',
                unitPrice: 0,
                sellPrice: 0,
                icon: 'Food',
                empty: false
            }
        });
    });
});

test('RecapItem renders', async () => {
    const handleModalEdit = vi.fn();
    const handleModalDelete = vi.fn();
    render(
        <RecapItem
            item={item}
            handleModalEdit={handleModalEdit}
            handleRemoveItem={handleModalDelete}
        />
    );
    expect(screen.getByText('Consumable 1')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('edit'));
    expect(handleModalEdit).toHaveBeenCalled();
});

test('BuyPage renders', async () => {
    const changeSelectedItems = vi.fn();
    render(
        <BuyPage
            changeSelectedItems={changeSelectedItems}
            selectedItems={[item, item2]}
        />
    );
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    // expect(screen.getByText('1€')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Pizza'));
    expect(screen.getByText('Nombre :')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('submit'));
    expect(changeSelectedItems).toHaveBeenCalled();

    await userEvent.click(screen.getAllByLabelText('edit')[0]!);
    expect(screen.getByText('Nombre :')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');

    await userEvent.click(screen.getAllByLabelText('edit')[0]!);
    expect(screen.getByText('Nombre :')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('submit'));
    expect(changeSelectedItems).toHaveBeenCalled();

    await userEvent.click(screen.getAllByLabelText('delete')[0]!);
    expect(changeSelectedItems).toHaveBeenCalled();
});

test('Error on fetch', async () => {
    server.use(
        rest.get(`https://clochette.dev/api/v1${endpoints.v1.drink}`, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );
    const changeSelectedItems = vi.fn();
    render(
        <BuyPage
            changeSelectedItems={changeSelectedItems}
            selectedItems={[item]}
        />
    );
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.getByText('Request failed with status code 500', { exact: false })).toBeInTheDocument();
});

test('updateFkID', async () => {
    const barrels: Drink[] = [
        { id: 0, name: 'Boisson 1', icon: 'Barrel' },
        { id: 1, name: 'Boisson 2', icon: 'Barrel' }
    ];
    const consommables: ConsumableItem[] = [
        { id: 0, name: 'Consommable 1', icon: 'Food' },
        { id: 1, name: 'Consumable 2', icon: 'Food' }
    ];
    const outOfStock: OutOfStockItemBuy[] = [
        { id: 0, name: 'OutOfStock 1', icon: 'Food' },
        { id: 1, name: 'OutOfStock 2', icon: 'Food' }
    ];
    const ecoCup: OutOfStockItemBuy = { id: 0, name: 'EcoCup', icon: 'Glass' };

    const selectedItems = [item, item2];

    const newSelectedItems = updateFkID(barrels, consommables, outOfStock, selectedItems);
    expect(newSelectedItems).toEqual([
        item,
        {
            ...item2,
            item: {
                ...item2.item,
                fkId: 1
            }
        }
    ]);
});
