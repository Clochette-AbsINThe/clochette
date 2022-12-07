export type TableData = 'out_of_stock' | 'glass' | 'barrel' | 'consumable';
export type PaymentMethod = 'CB' | 'Espèces' | 'Lydia' | 'Virement';
export type IconName = 'Glass' | 'Beer' | 'Food' | 'Soft' | 'Barrel' | 'Misc' | 'Lydia' | 'Cash' | 'CB' | 'Setting' | 'Virement';

// drink/ --> get // Rempli le dropdown des fûts
// drink/ --> post // Ajoute une nouvelle boisson manquante dans la base de données
export interface Drink {
    readonly id?: number;
    name: string;
    icon?: IconName; //! Pas dans la réponse de l'API
}

// consumable_item/ --> get // Rempli le dropdown des consommables
// consumable_item/ --> post // Ajoute un nouveau consommable manquant dans la base de données
export interface ConsumableItem {
    readonly id?: number;
    name: string;
    icon: IconName;
}

// out_of_stock_item/buy/ --> get // Rempli le dropdown des hors stocks
// out_of_stock_item/buy/ --> post // Ajoute un nouveau hors stock de buy manquant dans la base de données
export interface OutOfStockItemBuy {
    readonly id?: number;
    name: string;
    icon: IconName;
    sellPrice?: number;
}

// out_of_stock_item/sell/ --> get // Repmli la colonne des hors stocks
// out_of_stock_item/sell/ --> post // Ajoute un nouveau hors stock de sell manquant dans la base de données
export interface OutOfStockItemSell {
    readonly id?: number;
    name: string;
    icon: IconName;
    sellPrice: number;
}

// barrel/ --> get // Utile pour l'appli des stocks ( Rempli la colonne des verres avec barrel/mounted/ et j'adapte le front)
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface Barrel {
    readonly id?: number;
    readonly fkId: number; //* Drink['id']
    name: string;
    icon: IconName; //! Pas dans la réponse de l'API
    unitPrice: number;
    sellPrice: number; // Prix de vente du verre après
    isMounted: boolean; // Default = false
    empty: boolean; // Default = false
}

// glass/ --> get // Utile pour l'appli de l'historique des transactions
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface Glass {
    readonly id?: number;
    readonly fkId: number; //* Barrel['id']
    name: string;
    icon?: IconName; //! Pas dans la réponse de l'API
    sellPrice: number;
}

// consumable --> get // Rempli la colonne des consommables
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface Consumable {
    readonly id?: number;
    readonly fkId: number; //* ConsumableItem['id']
    name: string;
    icon: IconName;
    unitPrice: number;
    sellPrice: number;
    empty: boolean; // Default = false
}

// out_of_stock/buy/ --> get (Utile pour l'appli de la partie historique des transactions ? Pas important a implémenter))
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface OutOfStockBuy {
    id?: number;
    readonly fkId: number; //* OutOfStockItemBuy['id']
    name: string;
    icon: IconName;
    unitPrice: number;
    sellPrice?: number; //! Pas dans la réponse de l'API
}

// out_of_stock/sell/ --> get (Utile pour l'appli de la partie historique des transactions et encore ? Pas important a implémenter) )
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface OutOfStockSell {
    id?: number;
    readonly fkId: number; //* OutOfStockItemSell['id']
    name: string;
    icon: IconName;
    sellPrice: number;
}

export interface APIItem<ItemType> {
    table: TableData;
    quantity: number;
    item: ItemType;
    maxQuantity?: number; //! Pas dans la réponse de l'API
}

export type ItemSell = APIItem<Glass | OutOfStockSell | Consumable>;
export type ItemBuy = APIItem<Barrel | OutOfStockBuy | Consumable>;

export type ItemTransactionResponse = APIItem<Barrel | Glass | OutOfStockSell | OutOfStockBuy | Consumable>;

export interface ITransactionType {
    readonly id?: number;
    datetime: string;
    amount: number;
    sale: boolean; // true = vente, false = achat
    paymentMethod: PaymentMethod;
}

// transaction/ --> get // Utile pour l'appli de l'historique des transactions
// transaction/ --> post // Ajoute une nouvelle transaction dans la base de données
export interface TransactionType<T> extends ITransactionType {
    items: T[];
}

export interface TransactionResponse extends ITransactionType {
    barrels: Barrel[];
    glasses: Glass[];
    outOfStocks: Array<OutOfStockBuy | OutOfStockSell>;
    consumablesPurchase: Consumable[];
    consumablesSale: Consumable[];
}

interface IAccount {
    readonly id?: number;
    username: string;
    firstName: string;
    lastName: string;
    promotionYear: number;
}

export interface AccountCreate extends IAccount {
    password: string;
}