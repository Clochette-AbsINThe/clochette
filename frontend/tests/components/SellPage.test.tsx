import { endpoints } from '@endpoints';
import { rest } from 'msw';
import { render, screen, act } from '@testing-library/react';
import { server } from '../setupTests';
import SellPage from '@components/Transaction/Sell/SellPage';

test('EcoCup error', async () => {
    server.use(
        rest.get(`https://clochette.dev/api/v1${endpoints.v1.outOfStockItemBuy}`, (req, res, ctx) => {
            return res(ctx.status(500));
        })
    );
    const changeSelectedItems = vi.fn();
    render(<SellPage setItems={changeSelectedItems} />);
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    });
    expect(screen.getByText("Erreur lors du chargement de l'écocup")).toBeInTheDocument();
});
