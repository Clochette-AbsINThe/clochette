import { render, screen } from '@testing-library/react';
import ItemCount, { ItemCountProps } from '@components/ItemCount';
import userEvent from '@testing-library/user-event';

const itemData: ItemCountProps = {
    id: 1,
    name: 'Test',
    price: 1,
    value: 0,
    onValueChange: jest.fn()

};

test('Render ItemCount', () => {
    render(<ItemCount {...itemData} />);
    const item = screen.queryByText('Test');
    expect(item).toBeInTheDocument();
});

test('ItemCount plus click', async () => {
    render(<ItemCount {...itemData} />);
    const plus = screen.getByLabelText('plus');
    await userEvent.click(plus);
    expect(itemData.onValueChange).toHaveBeenCalledWith(1, 1);
});

test('ItemCount minus click', async () => {
    render(<ItemCount {...itemData} />);
    const minus = screen.getByLabelText('minus');
    await userEvent.click(minus);
    expect(itemData.onValueChange).toHaveBeenCalledWith(-1, 1);
});

test('ItemCount reset click', async () => {
    render(<ItemCount {...itemData} />);
    const reset = screen.getByLabelText('reset');
    await userEvent.click(reset);
    expect(itemData.onValueChange).toHaveBeenCalledWith(0, 1);
});

test('Icon is not rendered', () => {
    render(<ItemCount {...itemData} />);
    const icon = screen.queryByLabelText('icon');
    expect(icon).toBeNull();
});

test('Icon is rendered', () => {
    render(<ItemCount {...itemData} icon='Beer' />);
    const icon = screen.queryByLabelText('icon');
    expect(icon).toBeInTheDocument();
});
