const navitems = {
    Home: '/',
    Stocks: '/stocks',
    Payments: '/payments',
    About: '/about',
    Contact: '/contact'
};

interface NavbarProps {
    children: JSX.Element
};

export default function Navbar({ children }: NavbarProps): JSX.Element {
    return (
        <header className="flex">
            <h1 className="text-4xl text-green-700 font-bold p-4">Clochette</h1>
            <div className="flex p-2 justify-evenly flex-grow self-center">
                {Object.entries(navitems).map(([name, link]) => <NavbarItem key={name} name={name} link={link} />)}
            </div>
            {children}
            <div className="justify-center self-center mr-4">
                <button className="bg-green-700 text-white font-bold py-2 px-4 rounded">Login</button>
            </div>
        </header>
    );
}

function NavbarItem(props: { name: string, link: string }): JSX.Element {
    return (
        <div className="text-xl hover:text-2xl hover:underline">
            <a href={props.link}>{props.name}</a>
        </div>
    );
}
