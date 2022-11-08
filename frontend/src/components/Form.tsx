import { getIcon } from '@styles/utils';
import type { ItemBuy } from '@types';
import { useEffect, useState } from 'react';

interface FormProps {
    item: ItemBuy
    onSubmited: (item: ItemBuy) => void
}

export default function Form(props: FormProps): JSX.Element {
    const [priceSelected, setPriceSelected] = useState<'price_unit' | 'price_total'>('price_unit');
    const [quantity, setQuantity] = useState(props.item.quantity);
    const [unitPrice, setUnitPrice] = useState(props.item.item.unitPrice);
    const [totalPrice, setTotalPrice] = useState(0);
    const [sellPrice, setSellPrice] = useState(props.item.item.sellPrice ?? 0);
    const [name, setName] = useState(props.item.item.name);
    const [icon, setIcon] = useState(props.item.item.icon);

    /**
     * This is in charge of updating the total or the unit price when the unit, the total price or the quantity change.
     */
    useEffect(() => {
        if (priceSelected === 'price_unit') {
            setTotalPrice(Number((unitPrice * quantity).toFixed(2)));
        } else {
            setUnitPrice(Number((totalPrice / quantity).toFixed(2)));
        }
    }, [quantity, unitPrice, totalPrice]);

    /**
     * This function create the ItemBuy to send to the parent component.
     * @param event the submit event
     */
    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const data: ItemBuy = {
            item: {
                ...props.item.item,
                name,
                icon,
                unitPrice
            },
            quantity,
            table: props.item.table
        };
        if (props.item.item.sellPrice !== undefined) {
            data.item.sellPrice = sellPrice;
        }
        props.onSubmited(data);
    };

    /**
     * This function render, or not, the selection for the icon
     */
    const renderIconChoice = (): JSX.Element => {
        const item = props.item.item;
        if (item.fkID === -1 && props.item.table !== 'barrel') {
            return (
                <>
                    <div className='text-2xl'>Type de produit :</div>
                    <div className="flex items-center justify-between flex-wrap space-y-2">
                        <div className='flex space-x-4 items-center'>
                            <input type="radio" name="icon" id='Food' className='checkbox' onChange={() => setIcon('Food')} defaultChecked={icon === 'Food'} aria-label='icon-food' />
                            <label htmlFor="Food">{getIcon('Food', 'w-10 h-10 dark:text-white text-black')}</label>
                        </div>
                        <div className='flex space-x-4 items-center'>
                            <input type="radio" name="icon" id='Soft' className='checkbox' onChange={() => setIcon('Soft')} defaultChecked={icon === 'Soft'} aria-label='icon-soft' />
                            <label htmlFor="Soft">{getIcon('Soft', 'w-10 h-10 dark:text-white text-black')}</label>
                        </div>
                        <div className='flex space-x-4 items-center'>
                            <input type="radio" name="icon" id='Misc' className='checkbox' onChange={() => setIcon('Misc')} defaultChecked={icon === 'Misc'} aria-label='icon-misc' />
                            <label htmlFor='Misc'>{getIcon('Misc', 'w-10 h-10 dark:text-white text-black')}</label>
                        </div>
                    </div>
                </>

            );
        } else {
            return <></>;
        }
    };

    return (
        <form className='flex flex-col self-start space-y-4 p-4 grow w-full' onSubmit={handleOnSubmit}>
            {getIcon(icon, 'w-10 h-10 dark:text-white text-black')}
            <input type="text" value={props.item.table} className='sr-only' readOnly id="table" name="table" disabled />
            <input type="number" value={props.item.item.fkID} className='sr-only' readOnly id="fkID" name="fkID" disabled />
            <input type="text" value={icon} className='sr-only' readOnly id="icon" name="icon" disabled />
            <div className='flex items-center space-x-4'>
                <label htmlFor='name'>Nom :</label>
                <input
                    type='text'
                    id='name'
                    name='name'
                    aria-label='name'
                    className='input w-64'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={props.item.item.fkID !== -1}
                    required
                />
            </div>
            <div className='flex items-center space-x-4'>
                <label htmlFor='quantity'>Nombre :</label>
                <input
                    type='number'
                    id='quantity'
                    name='quantity'
                    aria-label='quantity'
                    className='input w-32'
                    value={isNaN(quantity) ? '' : quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? NaN : (parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 1))}
                    onBlur={() => setQuantity(isNaN(quantity) ? 1 : quantity)}
                    min={1}
                />
            </div>
            {props.item.item.unitPrice !== undefined && (
                <div className='flex flex-col'>
                    <div className='text-2xl mb-2'>Prix d&apos;achat :</div>
                    <div className='flex items-center justify-between flex-wrap space-y-2'>
                        <div className="flex items-center space-x-4">
                            <input
                                type="radio"
                                name="price"
                                id="unitPriceSelected"
                                aria-label='unitPriceSelected'
                                defaultChecked
                                onChange={() => setPriceSelected('price_unit')}
                                className='checkbox'
                            />
                            <label htmlFor='unitPrice'>Prix à l&apos;unité :</label>
                            <input
                                type='number'
                                id='unitPrice'
                                name='unitPrice'
                                aria-label='unitPrice'
                                className='input w-24'
                                step={0.01}
                                min={0.01}
                                disabled={priceSelected === 'price_total'}
                                onChange={(e) => setUnitPrice(e.target.value === '' ? NaN : (Number(e.target.value) > 0 ? Number(e.target.value) : 0))}
                                value={isNaN(unitPrice) ? '' : unitPrice}
                                onBlur={() => setUnitPrice(isNaN(unitPrice) ? 0 : unitPrice)}
                            />
                            <span>€</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <input
                                type="radio"
                                name="price"
                                id="totalPriceSelected"
                                aria-label='totalPriceSelected'
                                onChange={() => setPriceSelected('price_total')}
                                className='checkbox'
                            />
                            <label htmlFor='totalPrice'>Prix total :</label>
                            <input
                                type='number'
                                id='totalPrice'
                                name='totalPrice'
                                aria-label='totalPrice'
                                className='input w-24'
                                min={0.01}
                                step={0.01}
                                disabled={priceSelected === 'price_unit'}
                                onChange={(e) => setTotalPrice(e.target.value === '' ? NaN : (Number(e.target.value) > 0 ? Number(e.target.value) : 0))}
                                value={isNaN(totalPrice) ? '' : totalPrice}
                                onBlur={() => setTotalPrice(isNaN(totalPrice) ? 0 : totalPrice)}
                            />
                            <span>€</span>
                        </div>
                    </div>
                </div>
            )}
            {props.item.item.sellPrice !== undefined && (
                <div className='flex flex-col'>
                    <div className='text-2xl mb-2'>Prix de vente :</div>
                    <div className='flex items-center space-x-4'>
                        <label htmlFor='sellPrice'>Prix de vente : {props.item.table === 'barrel' && '(Sans le prix de l\'écocup)'}</label>
                        <input
                            type='number'
                            id='sellPrice'
                            name='sellPrice'
                            aria-label='sellPrice'
                            className='input w-24'
                            min={0.01}
                            step={0.01}
                            onChange={(e) => setSellPrice(e.target.value === '' ? NaN : (Number(e.target.value) > 0 ? Number(e.target.value) : 0))}
                            value={isNaN(sellPrice) ? '' : sellPrice}
                            onBlur={() => setSellPrice(isNaN(sellPrice) ? 0 : sellPrice)}
                        />
                        <span>€</span>
                    </div>
                </div>
            )}
            {renderIconChoice()}
            <div className="grow"></div>
            <div className='flex flex-col'>
                <div className='text-2xl mb-2'>Récapitulatif :</div>
                <ul className='list-disc pl-6'>
                    <li>Achat {isNaN(quantity) ? '' : quantity} {name} pour {isNaN(totalPrice) ? '' : totalPrice} €.</li>
                    {(props.item.item.sellPrice !== undefined) && <li>Vente à {sellPrice} € l&apos;unité</li>}
                </ul>
            </div>
            <button type='submit' className='btn-primary' role='submit' id='submit-btn'>Envoyer</button>
        </form>
    );
}
