export interface ItemCountProps {
    name: string
    price: number
}

function ItemCount(props: ItemCountProps): JSX.Element {
    return (
        <div className="flex m-4">
            <h1>{props.name}</h1>
            <h2>{props.price} €</h2>
        </div>
    );
};

export default ItemCount;
