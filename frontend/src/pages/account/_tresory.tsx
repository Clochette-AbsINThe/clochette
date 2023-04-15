import TresoryButtons from '@components/Admin/Charts/TresoryButtons';
import TresoryChart from '@components/Admin/Charts/TresoryChart';
import TransactionHistory from '@components/History/TransactionHistory';
import type { NextPage } from 'next';

const TresoryPage: NextPage = () => {
    return (
        <div className='flex flex-col justify-between grow'>
            <TresoryButtons />
            <TresoryChart />
            <TransactionHistory showTreasuryTransaction={true} />
        </div>
    );
};

export default TresoryPage;
