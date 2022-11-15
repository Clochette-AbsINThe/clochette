import Page404 from '@components/404';
import Loader from '@components/Loader';
import { Drink, ConsumableItem, OutOfStockItemBuy, OutOfStockItemSell } from '@types';
import { AxiosError } from 'axios';

interface ItemPageWrapperProps {
    id: number | null;
    errorGetById: AxiosError<unknown, any> | null | undefined;
    loadingGetById: boolean;
    item: Drink | ConsumableItem | OutOfStockItemBuy | OutOfStockItemSell;
    children: JSX.Element;
}

export default function ItemPageWrapper(props: ItemPageWrapperProps): JSX.Element {
    const { id, errorGetById, loadingGetById, item, children } = props;
    if (id !== -1) {
        if (errorGetById?.response?.status === 404) {
            return <Page404 />;
        } else if (loadingGetById || item.id === undefined) {
            return <Loader />;
        }
    }
    return children;
}
