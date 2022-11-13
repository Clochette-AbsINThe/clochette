import Form from '@components/Form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ItemBuy } from '@types';

const newItemBarrel: ItemBuy = {
    table: 'barrel',
    quantity: 1,
    item: {
        fkID: -1,
        name: '',
        unitPrice: 0,
        sellPrice: 0,
        icon: 'Barrel'
    }
};

const newItemConsumable: ItemBuy = {
    table: 'consumable',
    quantity: 1,
    item: {
        fkID: -1,
        name: '',
        unitPrice: 0,
        sellPrice: 0,
        icon: 'Misc'
    }
};

describe('Form tests', () => {
    test('Barrel Item tests', async () => {
        const onSubmit = vi.fn();
        render(
            <Form
                item={newItemBarrel}
                onSubmited={onSubmit}
            />
        );
        expect(screen.queryAllByText('Vente', { exact: false })).not.toBeNull();
        expect(screen.queryAllByText('écocup', { exact: false })).not.toBeNull();

        await userEvent.type(screen.getByLabelText('name'), 'New Barrel');
        expect(screen.getByLabelText('name')).toHaveValue('New Barrel');

        await userEvent.type(screen.getByLabelText('quantity'), '2');
        expect(screen.getByLabelText('quantity')).toHaveValue(12);

        await userEvent.click(screen.getByLabelText('unitPrice')); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.type(screen.getByLabelText('unitPrice'), '-1');
        expect(screen.getByLabelText('unitPrice')).toHaveValue(0);
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.type(screen.getByLabelText('unitPrice'), '3');
        expect(screen.getByLabelText('unitPrice')).toHaveValue(3);
        await userEvent.click(screen.getByLabelText('totalPriceSelected'));
        expect(screen.getByLabelText('unitPrice')).toHaveValue(3);

        await userEvent.click(screen.getByLabelText('unitPriceSelected'));
        await userEvent.click(screen.getByLabelText('unitPrice')); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        expect(screen.getByLabelText('unitPrice')).toHaveValue(null);
        await userEvent.click(screen.getByLabelText('totalPriceSelected')); // Blur
        await userEvent.keyboard('{Backspace}'); // Clear the field
        expect(screen.getByLabelText('unitPrice')).toHaveValue(0);

        await userEvent.click(screen.getByLabelText('totalPrice')); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        expect(screen.getByLabelText('totalPrice')).toHaveValue(null);
        await userEvent.click(screen.getByLabelText('quantity')); // Blur
        expect(screen.getByLabelText('totalPrice')).toHaveValue(0);

        await userEvent.click(screen.getByLabelText('totalPrice')); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.type(screen.getByLabelText('totalPrice'), '-1');
        expect(screen.getByLabelText('totalPrice')).toHaveValue(0);
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.type(screen.getByLabelText('totalPrice'), '4');
        expect(screen.getByLabelText('totalPrice')).toHaveValue(4);

        await userEvent.click(screen.getByLabelText('quantity')); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        expect(screen.getByLabelText('quantity')).toHaveValue(null);
        await userEvent.type(screen.getByLabelText('quantity'), '0');
        expect(screen.getByLabelText('quantity')).toHaveValue(1);
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.click(screen.getByLabelText('totalPriceSelected')); // Blur
        expect(screen.getByLabelText('quantity')).toHaveValue(1);

        await userEvent.click(screen.getByLabelText('sellPrice')); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        expect(screen.getByLabelText('sellPrice')).toHaveValue(null);

        await userEvent.click(screen.getByLabelText('totalPriceSelected')); // Blur
        expect(screen.getByLabelText('sellPrice')).toHaveValue(0);
        await userEvent.click(screen.getByLabelText('sellPrice')); // Clear the field
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.type(screen.getByLabelText('sellPrice'), '-1');
        expect(screen.getByLabelText('sellPrice')).toHaveValue(0);
        await userEvent.keyboard('{Backspace}'); // Clear the field
        await userEvent.type(screen.getByLabelText('sellPrice'), '10');
        expect(screen.getByLabelText('sellPrice')).toHaveValue(10);

        await userEvent.click(screen.getByRole('submit'));
        expect(onSubmit).toBeCalledWith({
            table: 'barrel',
            quantity: 1,
            item: {
                fkID: -1,
                name: 'New Barrel',
                unitPrice: 4,
                sellPrice: 10,
                icon: 'Barrel'
            }
        });
    });

    test('Consumable Item tests', async () => {
        const onSubmit = vi.fn();
        render(
            <Form
                item={newItemConsumable}
                onSubmited={onSubmit}
            />
        );
        expect(screen.getByText('Type de produit :')).toBeInTheDocument();
        await userEvent.click(screen.getByLabelText('icon-food'));
        expect(screen.getByLabelText('icon-food')).toBeChecked();
        await userEvent.click(screen.getByLabelText('icon-soft'));
        expect(screen.getByLabelText('icon-soft')).toBeChecked();
        await userEvent.click(screen.getByLabelText('icon-misc'));
        expect(screen.getByLabelText('icon-misc')).toBeChecked();
    });
});
