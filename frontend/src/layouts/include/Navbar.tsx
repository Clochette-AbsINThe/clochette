import { DarkMode } from '@components/DarkMode';
import useWindowSize from '@hooks/useWindowSize';

const navitems = {
    Home: '/',
    Stocks: '/stocks',
    Transaction: '/transaction'
};

export default function Navbar(): JSX.Element {
    const dimension = useWindowSize();

    return (
        <header className="flex">
            <h1 className="text-4xl text-green-700 font-bold p-4">Clochette</h1>
            {dimension.width > 768
                ? (
                    <>
                        <div className="flex p-2 justify-start flex-grow self-center h-full">
                            {Object.entries(navitems).map(([name, link]) => <NavbarItem key={name} name={name} link={link} />)}
                        </div>
                        <DarkMode />
                        <div className="justify-center self-center mr-4">
                            <a className="bg-green-700 text-white font-bold py-2 px-4 rounded" href='/login'>Login</a>
                        </div>
                    </>
                )
                : (<div className="flex flex-grow justify-end">
                    <DarkMode />
                </div>)}
        </header>
    );
}

function NavbarItem(props: { name: string, link: string }): JSX.Element {
    return (
        <div className="text-xl hover:text-2xl hover:underline mx-6">
            <a href={props.link}>{props.name}</a>
        </div>
    );
}
