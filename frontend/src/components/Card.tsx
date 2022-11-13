import { getIcon } from '@styles/utils';
import type { IconName } from '@types';

interface CardProps {
    title: string
    description: string
    link: string
    icon: IconName[]
    buttonLabel?: string
}

export default function Card(props: CardProps): JSX.Element {
    const { title, description, link, icon, buttonLabel } = props;

    return (
        <div className="w-full p-4 flex-grow">
            <div className="border space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 h-full flex flex-col justify-between">
                <div className="flex flex-row items-center">
                    <div className="flex-shrink pr-4">
                        {icon.map((name) => getIcon(name))}
                    </div>
                    <div className="flex-1 text-right md:text-center space-y-3">
                        <h3 className="text-3xl font-bold uppercase">{title}</h3>
                        <h5 className="text-2xl font-semibold text-gray-500 dark:text-gray-100">{description}</h5>
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <div className="flex-grow"></div>
                    <div className="flex-shrink p-4">
                        <a href={link} className="btn-primary">{buttonLabel ?? 'Voir'}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
