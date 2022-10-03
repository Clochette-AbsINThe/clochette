import { render, screen } from '@testing-library/react';
import Sale, { SaleProps } from '@components/Sale';
import { AxiosError } from 'axios';
import userEvent from '@testing-library/user-event';

const saleData: SaleProps = {
    items: [
        {
            id: 1,
            name: 'Test',
            price: 1,
            value: 0
        }
    ],
    changeSubTotal: jest.fn(),
    loading: false,
    error: null
};

const testChangeValueData: SaleProps = {
    items: [
        {
            id: 1,
            name: 'Beer',
            price: 1,
            value: 0
        },
        {
            id: 2,
            name: 'Glass',
            price: 1,
            value: 0,
            isGlass: true
        }
    ],
    changeSubTotal: jest.fn(),
    loading: false,
    error: null
};

test('Render Sale loading', () => {
    const newSaleData = { ...saleData };
    newSaleData.loading = true;
    newSaleData.items = [];
    render(<Sale {...newSaleData} />);
    const sale = screen.queryByText('Test');
    expect(sale).toBeNull();
});

test('Render Sale error', () => {
    const newSaleData = { ...saleData };
    newSaleData.error = new AxiosError('Error');
    newSaleData.items = [];
    render(<Sale {...newSaleData} />);
    const sale = screen.queryByText('Error');
    expect(sale).toBeInTheDocument();
});

test('Render Sale Glass', () => {
    const newSaleData = { ...saleData };
    newSaleData.items[0].isGlass = true;
    render(<Sale {...newSaleData} />);
    const sale = screen.queryByLabelText('glass-div');
    expect(sale).toBeInTheDocument();
});

test('Change value with glass', async () => {
    render(<Sale {...testChangeValueData} />);
    const inputPlus = screen.queryAllByLabelText('plus');
    const inputMinus = screen.queryAllByLabelText('minus');
    const inputReset = screen.queryAllByLabelText('reset');
    await userEvent.click(inputPlus[0]);
    expect(testChangeValueData.changeSubTotal).toHaveBeenCalledWith(testChangeValueData.items.map(item => {
        return {
            ...item,
            value: 1
        };
    }));
    await userEvent.click(inputMinus[1]);
    expect(testChangeValueData.changeSubTotal).toHaveBeenCalledWith(testChangeValueData.items.map(item => {
        return {
            ...item,
            value: item.isGlass ? 0 : 1
        };
    }));
    await userEvent.click(inputPlus[0]);
    await userEvent.click(inputReset[1]);
    expect(testChangeValueData.changeSubTotal).toHaveBeenCalledWith(testChangeValueData.items.map(item => {
        return {
            ...item,
            value: item.isGlass ? 0 : 1
        };
    }));
});

test('Change value without glass', async () => {
    const newSaleData = { ...testChangeValueData };
    newSaleData.items[1].isGlass = false;
    render(<Sale {...newSaleData} />);
    const inputPlus = screen.queryAllByLabelText('plus');
    const inputMinus = screen.queryAllByLabelText('minus');
    await userEvent.click(inputPlus[0]);
    expect(newSaleData.changeSubTotal).toHaveBeenCalledWith(newSaleData.items.map(item => {
        return {
            ...item,
            value: item.id === 1 ? 1 : 0
        };
    }));
    await userEvent.click(inputMinus[1]);
    expect(newSaleData.changeSubTotal).toHaveBeenCalledWith(newSaleData.items.map(item => {
        return {
            ...item,
            value: item.id === 1 ? 1 : 0
        };
    }));
});
