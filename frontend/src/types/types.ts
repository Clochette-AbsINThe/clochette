export type TableData = 'outofstock' | 'glass' | 'barrel' | 'consumable';
export type PaymentMethod = 'CB' | 'Espèces' | 'Lydia';
export type IconName = 'Glass' | 'Beer' | 'Food' | 'Soft' | 'Barrel' | 'Misc';

// Drink --> get // Rempli le dropdown des fûts
// Drink --> post // Ajoute une nouvelle boisson manquante dans la base de données
export interface Drink {
    readonly id?: number
    name: string
    icon?: IconName //! Pas dans la réponse de l'API
}

// ConsumableItem --> get // Rempli le dropdown des consommables
// ConsumableItem --> post // Ajoute un nouveau consommable manquant dans la base de données
export interface ConsumableItem {
    readonly id?: number
    name: string
    icon: IconName
}

// OutOfStockItem/Buy --> get // Rempli le dropdown des hors stocks
// OutOfStockItem/Buy --> post // Ajoute un nouveau hors stock de buy manquant dans la base de données
export interface OutOfStockItemBuy {
    readonly id?: number
    name: string
    icon: IconName
}

// OutOfStockItem/Sell --> get // Repmli la colonne des hors stocks
// OutOfStockItem/Sell --> post // Ajoute un nouveau hors stock de sell manquant dans la base de données
export interface OutOfStockItemSell {
    readonly id?: number
    name: string
    icon: IconName
    sellPrice: number
}

// Barrel --> get // Utile pour l'appli des stocks
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface Barrel {
    readonly id?: number
    readonly fkID: number //* Drink['id']
    name: string
    icon: IconName
    unitPrice: number
    sellPrice: number // Prix de vente du verre après
    isMounted: boolean // Default = false
    empty: boolean // Default = false
}

// Glass --> get // Rempli la colonne des verres
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface Glass {
    readonly id?: number
    readonly fkID: number //* Barrel['id']
    name: string
    icon?: IconName //! Pas dans la réponse de l'API
    sellPrice: number
}

// Consumable --> get // Rempli la colonne des consommables
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface Consumable {
    readonly id?: number
    readonly fkID: number //* ConsumableItem['id']
    name: string
    icon: IconName
    unitPrice: number
    sellPrice: number
    empty: boolean // Default = false
}


// OutOfStock/Buy --> get
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface OutOfStockBuy {
    id?: number
    readonly fkID: number //* OutOfStockItemBuy['id']
    name: string
    icon: IconName
    unitPrice: number
    sellPrice?: number //! Pas dans la réponse de l'API
}

// OutOfStock/Sell --> get
// Pas de post car on n'ajoute un verre qu'avec une transaction
export interface OutOfStockSell {
    id?: number
    readonly fkID: number //* OutOfStockItemSell['id']
    name: string
    icon: IconName
    sellPrice: number
}

export interface APIItem<ItemType> {
    table: TableData
    quantity: number
    item: ItemType
}

export type ItemSell = APIItem<Glass | OutOfStockSell | Consumable>;
export type ItemBuy = APIItem<Barrel | OutOfStockBuy | Consumable>;

export type ItemTransactionResponse = APIItem<Barrel | Glass | OutOfStockSell | OutOfStockBuy | Consumable>;

// Transaction --> get
// Transaction --> post // Ajoute une nouvelle transaction dans la base de données
export interface TransactionType<T> {
    readonly id?: number
    dateTime: string
    totalPrice: number
    sale: boolean // true = vente, false = achat
    paymentMethod: PaymentMethod
    items: T[]
}
