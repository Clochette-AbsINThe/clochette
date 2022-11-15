import Card from '@components/Card';

export default function ConfigurationHomePage(): JSX.Element {
    return (
        <>
            <div className='flex flex-col items-center justify-center h-full'>
                <h1 className='text-4xl font-bold text-green-700'>Configuration</h1>
                <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Page de configuration</h2>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 flex-grow'>
                <Card
                    icon={['Barrel', 'Beer']}
                    title='Boissons'
                    description='Les boissons sont les produits achetés sous forme de fûts et revendu en verre.'
                    link='/configuration/boissons'
                />
                <Card
                    icon={['Soft', 'Food']}
                    title='Consommables'
                    description="Les produits consommables sont les produits qui sont vendus sous la même forme qu'ils sont acheté, comme par exemple les softs où les pizzas."
                    link='/configuration/consommables'
                />
                <Card
                    icon={['Misc', 'Glass']}
                    title='Produits hors-stock'
                    description="Les produits hors stock sont les produits qui n'apparaitrons pas dans la gestion des stocks comme les planchette de charcuterie."
                    link='/configuration/hors-stocks'
                />
            </div>
        </>
    );
}
