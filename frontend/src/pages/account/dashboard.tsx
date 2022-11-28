import Base from '@layouts/base';
import StackedCharts from '@components/Admin/Charts/StackedCharts';
import type { NextPage } from 'next';

const StackedChartsPage: NextPage = () => {
    return (
        <Base
            title='Dashboard'
            description=''>
            <StackedCharts />
        </Base>
    );
};

export default StackedChartsPage;
