export const pages = {
  signin: '/login',
  signout: '/logout',
  signup: '/register',
  index: '/',
  configuration: {
    index: '/configuration',
    boissons: {
      index: '/configuration/boissons',
      create: '/configuration/boissons/create',
      id: (id: number) => `/configuration/boissons/${id}`
    },
    horsInventaires: {
      index: '/configuration/hors-inventaires',
      create: '/configuration/hors-inventaires/create',
      id: (id: number) => `/configuration/hors-inventaires/${id}`
    },
    consommables: {
      index: '/configuration/consommables',
      create: '/configuration/consommables/create',
      id: (id: number) => `/configuration/consommables/${id}`
    }
  },
  transactionHistory: '/transaction-history',
  transaction: {
    achat: '/transaction/achat',
    vente: '/transaction/vente'
  },
  stock: '/stock',
  account: {
    index: '/account',
    dashboard: '/account/dashboard',
    users: '/account/users',
    tresory: '/account/tresory'
  }
} as const;
