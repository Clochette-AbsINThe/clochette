import ItemCount from '@components/ItemCount';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Consumable, Glass, ItemSell } from '@types';

const item: Consumable = {
    name: 'Test',
    unitPrice: 0,
    sellPrice: 0,
    fkID: 0,
    id: 0,
    icon: 'Food',
    empty: false
};

const itemData: ItemSell = {
    quantity: 0,
    table: 'consumable',
    item
};

const onValueChange = jest.fn();

describe('ItemCount', () => {
    render(<ItemCount item={itemData} onValueChange={onValueChange} />);
    const itemOnScreen = screen.queryByText('Test');

    test('Render ItemCount', () => {
        expect(itemOnScreen).toBeInTheDocument();
    });
});

test('ItemCount plus click', async () => {
    render(<ItemCount item={itemData} onValueChange={onValueChange} />);
    const plus = screen.getByLabelText('plus');
    await userEvent.click(plus);
    expect(onValueChange).toHaveBeenLastCalledWith(1, item);
});
test('ItemCount minus click', async () => {
    render(<ItemCount item={itemData} onValueChange={onValueChange} />);
    const minus = screen.getByLabelText('minus');
    await userEvent.click(minus);
    expect(onValueChange).toHaveBeenCalledWith(-1, item);
});
test('ItemCount reset click', async () => {
    render(<ItemCount item={itemData} onValueChange={onValueChange} />);
    const reset = screen.getByLabelText('reset');
    await userEvent.click(reset);
    expect(onValueChange).toHaveBeenCalledWith(0, item);
});


test('Icon is rendered', () => {
    render(<ItemCount item={itemData} onValueChange={onValueChange} />);
    const icon = screen.queryByLabelText('icon');
    expect(icon).toBeInTheDocument();
});

test('Icon is not rendered', () => {
    const newitem: Glass = {
        name: 'test',
        sellPrice: 1,
        fkID: 0
    };
    const newitemData: ItemSell = {
        quantity: 0,
        table: 'glass',
        item: newitem
    };
    render(<ItemCount item={newitemData} onValueChange={onValueChange} />);
    const icon = screen.queryByLabelText('icon');
    expect(icon).toBeNull();
});


