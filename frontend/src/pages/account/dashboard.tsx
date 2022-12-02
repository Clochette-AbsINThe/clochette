import Base from '@layouts/base';
import StackedCharts from '@components/Admin/Charts/StackedCharts';
import type { NextPage } from 'next';

const StackedChartsPage: NextPage = () => {
    return (
        <Base
            title='Dashboard'
            description=''>
            <>
                <StackedCharts
                    groupByCallback={(item) => new Date(item.datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    sortCallback={(a: string, b: string) => (a > b ? 1 : -1)}
                    queryFilter='te'
                />
                <StackedCharts
                    groupByCallback={(item) => new Date(item.datetime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    sortCallback={(a: string, b: string) => new Date(a).getTime() - new Date(b).getTime()}
                    queryFilter='te'
                />
                <StackedCharts
                    groupByCallback={(item) => item.paymentMethod}
                    sortCallback={(a: string, b: string) => a.localeCompare(b)}
                    queryFilter='te'
                />
            </>
        </Base>
    );
};

export default StackedChartsPage;
