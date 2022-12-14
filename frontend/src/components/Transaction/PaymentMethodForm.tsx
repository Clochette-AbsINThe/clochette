import { getIcon } from '@styles/utils';
import { PaymentMethod } from '@types';

export function PaymentMethodForm({ paymentMethod, changePaymentMethod }: { paymentMethod: PaymentMethod; changePaymentMethod: (data: PaymentMethod) => void }): JSX.Element {
    return (
        <div className='flex flex-col space-y-3 mr-8'>
            <label htmlFor='payment-method'>
                <span className='text-2xl font-bold mb-2'>Moyen de paiement</span>
            </label>
            <div className='flex flex-row flex-wrap'>
                <label
                    htmlFor='cb'
                    className='flex flex-row items-center space-x-2 p-2 border rounded-sm m-2'>
                    <input
                        type='radio'
                        id='cb'
                        name='payment-method'
                        value='CB'
                        checked={paymentMethod === 'CB'}
                        onChange={() => changePaymentMethod('CB')}
                        className='checkbox'
                        aria-label='cb'
                    />
                    {getIcon('CB')}
                    <span>CB</span>
                </label>
                <label
                    htmlFor='lydia'
                    className='flex flex-row items-center space-x-2 p-2 border rounded-sm m-2'>
                    <input
                        type='radio'
                        id='lydia'
                        name='payment-method'
                        value='Lydia'
                        checked={paymentMethod === 'Lydia'}
                        onChange={() => changePaymentMethod('Lydia')}
                        className='checkbox'
                        aria-label='lydia'
                    />
                    {getIcon('Lydia')}
                    <span>Lydia</span>
                </label>
                <label
                    htmlFor='cash'
                    className='flex flex-row items-center space-x-2 p-2 border rounded-sm m-2'>
                    <input
                        type='radio'
                        id='cash'
                        name='payment-method'
                        value='Cash'
                        checked={paymentMethod === 'Esp??ces'}
                        onChange={() => changePaymentMethod('Esp??ces')}
                        className='checkbox'
                        aria-label='cash'
                    />
                    {getIcon('Cash')}
                    <span>Esp??ces</span>
                </label>
                <label
                    htmlFor='virement'
                    className='flex flex-row items-center space-x-2 p-2 border rounded-sm m-2'>
                    <input
                        type='radio'
                        id='virement'
                        name='payment-method'
                        value='Virement'
                        checked={paymentMethod === 'Virement'}
                        onChange={() => changePaymentMethod('Virement')}
                        className='checkbox'
                        aria-label='virement'
                    />
                    {getIcon('Virement')}
                    <span>Virement</span>
                </label>
            </div>
        </div>
    );
}
