import { getIcon } from '@styles/utils';

export default function ConfigurationHomePage(): JSX.Element {
    return (
        <>
            <h1 className="text-3xl">Configuration</h1>
            <p>Page de configuration</p>
            <div className="grid grid-col-1 md:grid-cols-3 gap-5 flex-wrap">
                <div className="flex flex-col items-center border space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700">
                    <h2 className="text-xl">Boissons</h2>
                    <a href="/configuration/boissons" className="btn-primary" aria-label="edit">Editer</a>
                    <div className="flex justify-center space-x-5">
                        <div>{getIcon('Beer', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                        <div>{getIcon('Barrel', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center border space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700">
                    <h2 className="text-xl">Consommables</h2>
                    <a href="/configuration/consommables" className="btn-primary" aria-label="edit">Editer</a>
                    <div className="flex justify-center space-x-5">
                        <div>{getIcon('Food', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                        <div>{getIcon('Soft', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center border space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700">
                    <h2 className="text-xl">Produits hors-stock</h2>
                    <a href="/configuration/hors-stocks" className="btn-primary" aria-label="edit">Editer</a>
                    <div className="flex justify-center space-x-5">
                        <div>{getIcon('Glass', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                        <div>{getIcon('Misc', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
