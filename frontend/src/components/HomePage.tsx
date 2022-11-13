import Card from '@components/Card';


export default function HomePage(): JSX.Element {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold text-green-700">Bienvenue sur Clochette!</h1>
                <h2 className="text-2xl font-medium text-gray-500 dark:text-gray-100">Le site pour la gestion du bar.</h2>
            </div>
            <div className='flex flex-grow flex-col'>
                <div className='grid grid-col-1 lg:grid-cols-2 gap-5'>
                    <Card icon={['CB', 'Cash']} title="Gestion des transactions" description="Gestion des différents transactions du bar; les commandes et les ventes" link='/transaction' />
                    <Card icon={['Barrel', 'Soft']} title="Gestion des stocks" description="Gestion des différents stocks du bar; les boissons et les consommables" link='/stocks' />
                    <Card icon={['Misc']} title="Historique des transactions" description="Historique des transactions du bar; les commandes et les ventes" link='/transaction_history' />
                    <Card icon={['Setting']} title="Configuration" description="Configuration des élements du bar; les boissons, les consommables et les produits hors-stock" link='/configuration' />
                </div>
            </div>
        </>
    );
}

