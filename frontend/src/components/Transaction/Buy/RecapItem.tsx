import { getIcon } from "@styles/utils";
import { ItemBuy } from "@types";

interface RecapItemProps {
    item: ItemBuy;
    handleModalEdit: (item: ItemBuy) => void;
    handleRemoveItem: (item: ItemBuy) => void;
}

export function RecapItem(props: RecapItemProps): JSX.Element {
    const { item, handleModalEdit, handleRemoveItem } = props;
    return (
        <div
            className='flex m-4 justify-center h-max rounded-xl bg-[#70707016] p-3 md:max-w-[66vw] max-w-full flex-wrap flex-col'
            key={item.item.name}>
            <div className='flex flex-grow-[10] items-start flex-wrap space-y-2'>
                {getIcon(item.item.icon, 'w-10 h-10 dark:text-white mr-2 text-black')}
                <h1 className='grow lg:text-3xl mx-5 text-xl'>{item.item.name}</h1>
                <div className='flex self-end space-x-5'>
                    <button
                        onClick={() => handleModalEdit(item)}
                        className='btn-primary'
                        aria-label='edit'>
                        Editer
                    </button>
                    <button
                        onClick={() => handleRemoveItem(item)}
                        className='btn-danger ml-5'
                        aria-label='delete'>
                        Supprimer
                    </button>
                </div>
            </div>
            <div className='flex flex-grow flex-wrap'>
                <h1 className='mr-6 text-xl'>Nombre: {item.quantity}</h1>
                <h1 className='mr-6 text-xl'>Prix total: {Number((item.item.unitPrice * item.quantity).toFixed(2))}€</h1>
                {item.item.sellPrice !== undefined && <h1 className='mr-6 text-xl'>Prix vente: {item.item.sellPrice}€</h1>}
            </div>
        </div>
    );
}