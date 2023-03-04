export const endpoints = {
    v1: {
        drink: '/drink/',
        consumable: '/consumable/',
        consumableDistinct: '/consumable/distincts/',
        consumableItem: '/consumable_item/',
        outOfStock: '/out_of_stock/',
        outOfStockItemBuy: '/out_of_stock_item/buy/',
        outOfStockItemSell: '/out_of_stock_item/sell/',
        outOfStockItem: '/out_of_stock_item/',
        barrel: '/barrel/',
        barrelMounted: '/barrel/?mounted=true',
        barrelDistinct: '/barrel/distincts/',
        barrelAll: '/barrel/?all=true',
        glass: '/glass/',
        transaction: '/transaction/',
        transactionSell: '/transaction/sell/',
        transactionBuy: '/transaction/buy/',
        login: '/auth/login/',
        account: '/account/',
        accountMe: '/auth/me/',
        tresory: '/treasury/'
    },
    internal: {
        saveJwtInCookie: '/api/saveJwtInCookie',
        getJwtInCookie: '/api/getJwtInCookie',
        deleteJwtInCookie: '/api/deleteJwtInCookie'
    }
} as const;
