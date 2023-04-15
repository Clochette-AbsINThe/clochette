import { useState } from 'react';

interface DateRangePickerProps {
    startDate: Date;
    endDate: Date;
    setDateRange: (dateRange: [Date, Date]) => void;
}

export default function DateRangePicker(props: DateRangePickerProps): JSX.Element {
    const [startDate, setStartDate] = useState<Date>(props.startDate);
    const [endDate, setEndDate] = useState<Date>(props.endDate);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== startDate.toISOString().split('T')[0] && new Date(e.target.value) < endDate && e.target.value !== '') {
            setStartDate(new Date(e.target.value));
            props.setDateRange([new Date(e.target.value), endDate]);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== endDate.toISOString().split('T')[0] && new Date(e.target.value) > startDate && e.target.value !== '') {
            setEndDate(new Date(e.target.value));
            props.setDateRange([startDate, new Date(e.target.value)]);
        }
    };

    return (
        <div className='flex items-center'>
            <div>
                <input
                    name='start'
                    type='date'
                    value={startDate.toISOString().split('T')[0]}
                    onChange={handleStartDateChange}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Date de début'
                />
            </div>
            <span className='mx-4 text-gray-500'>à</span>
            <div>
                <input
                    name='end'
                    type='date'
                    value={endDate.toISOString().split('T')[0]}
                    onChange={handleEndDateChange}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                    placeholder='Date de fin'
                />
            </div>
        </div>
    );
}
