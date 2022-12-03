import StockBarrel from '@components/Stock/Barrel/StockBarrel';
import StockConsumable from '@components/Stock/Consumable/StockConsumable';

export default function Stock(): JSX.Element {
    return (
        <div className='space-y-4'>
            <StockBarrel />
            <StockConsumable />
        </div>
    );
}
