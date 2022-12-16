import { useAuthContext } from '@components/Context';
import { Account } from '@types';
import { parseJwt } from '@utils/utils';
import { useState } from 'react';

interface AccountFormProps {
    account: Account;
    editAccount: (account: Account) => void;
    deleteAccount?: (id: number) => void;
}

const TranslateAccountKeys: Record<keyof Account, string> = {
    id: 'ID',
    firstName: 'Prénom',
    lastName: 'Nom',
    staffName: 'Surnom',
    roles: 'Roles',
    isActive: 'Membre actif',
    isInducted: 'Intronisé',
    promotionYear: 'Année de promotion',
    username: 'Username'
};

export default function AccountForm(props: AccountFormProps) {
    const [account, setAccount] = useState<Account>(props.account);

    const { jwt } = useAuthContext();

    const decodedJwt = parseJwt(jwt!);

    const keysWithTypes = Object.keys(account).map((key) => key as keyof Account);

    const isEditable = (key: keyof Account) => {
        if (key === 'id') return false;
        if (decodedJwt?.roles?.includes('ROLE_ADMIN')) {
            //TODO
            return true;
        }
        return key !== 'roles' && key !== 'isActive' && key !== 'isInducted';
    };
    const keys = keysWithTypes.filter((key) => isEditable(key));

    const isCheckbox = (key: keyof Account) => {
        return typeof account[key] === 'boolean';
    };

    const isString = (key: keyof Account) => {
        return typeof account[key] === 'string';
    };

    const isNumber = (key: keyof Account) => {
        return typeof account[key] === 'number';
    };

    const createInput = (key: keyof Account) => {
        if (isCheckbox(key)) {
            return (
                <div
                    className='flex items-center md:gap-4 gap-2 flex-wrap'
                    key={key}>
                    <label
                        htmlFor={key}
                        className='text-xl'>
                        {TranslateAccountKeys[key]}
                    </label>
                    <input
                        type='checkbox'
                        id={key}
                        name={key}
                        aria-label={key}
                        className='checkbox h-6 w-6'
                        checked={account[key] as boolean}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                [key]: e.target.checked
                            })
                        }
                    />
                </div>
            );
        } else if (isString(key)) {
            return (
                <div
                    className='flex items-center md:gap-4 gap-2 flex-wrap'
                    key={key}>
                    <label
                        htmlFor={key}
                        className='text-xl'>
                        {TranslateAccountKeys[key]}
                    </label>
                    <input
                        type='text'
                        id={key}
                        name={key}
                        aria-label={key}
                        className='input w-60'
                        value={account[key] as string}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                [key]: e.target.value
                            })
                        }
                        onBlur={(e) => e.target.classList.add('input-error')}
                        required
                    />
                </div>
            );
        } else if (isNumber(key)) {
            return (
                <div
                    className='flex items-center md:gap-4 gap-2 flex-wrap'
                    key={key}>
                    <label
                        htmlFor={key}
                        className='text-xl'>
                        {TranslateAccountKeys[key]}
                    </label>
                    <input
                        type='number'
                        id={key}
                        name={key}
                        aria-label={key}
                        className='input w-60'
                        value={account[key] as number}
                        onChange={(e) =>
                            setAccount({
                                ...account,
                                [key]: +e.target.value
                            })
                        }
                        onBlur={(e) => e.target.classList.add('input-error')}
                        required
                    />
                </div>
            );
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.editAccount(account);
    };

    return (
        <div className='flex flex-grow flex-col'>
            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-2xl font-bold mb-6'>Modification du compte</h1>
            </div>
            {/*// TODO */}
            {decodedJwt?.roles?.includes('ROLE_ADMIN') && (
                <div className='flex flex-col items-end justify-center'>
                    <button
                        className='btn-danger'
                        onClick={() => props.deleteAccount?.(account.id!)}>
                        Supprimer le compte
                    </button>
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className='flex flex-col self-start md:space-y-4 space-y-2 p-4 grow w-full'>
                {keys.map((key) => createInput(key))}
                <div className='grow'></div>
                <button
                    type='submit'
                    className='btn-primary'>
                    Valider les modifications
                </button>
            </form>
        </div>
    );
}
