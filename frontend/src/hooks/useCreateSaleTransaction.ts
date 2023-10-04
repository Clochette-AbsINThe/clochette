import toast from 'react-hot-toast';

import { useCreateTransactionFlow } from './useCreateTransactionFlow';

import { SaleItem, SaleItems, useTransactionSaleStore } from '@/components/transaction-page/sale/transaction-sale-store';
import { useCreateNonInventoried, useSaleConsumable, useCreateGlass, useReadConsumables } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { Consumable, TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';

type Item = SaleItem['item'];
type ExpandedItem = {
  type: SaleItem['type'];
  item: Item;
};

export function expandItems(items: SaleItems, consumables: Consumable[]) {
  const transformedItems: ExpandedItem[] = [];

  items.forEach((item) => {
    const isConsumable = item.type === 'consumable';
    const matchingConsumables = isConsumable ? consumables.filter((consumable) => consumable.consumableItemId === item.item.consumableItemId) : [];

    for (let i = 0; i < item.quantity; i++) {
      transformedItems.push({
        type: item.type,
        item: isConsumable ? matchingConsumables[i] : item.item
      });
    }
  });

  return transformedItems;
}

export function useCreateSaleTransaction() {
  const createNonInventoried = useCreateNonInventoried({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création du produit hors inventaire. ${detail}`);
    }
  });
  const saleConsumable = useSaleConsumable({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la vente du consommable. ${detail}`);
    }
  });
  const createGlass = useCreateGlass({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création du verre. ${detail}`);
    }
  });
  const { transactionFlow, isLoading } = useCreateTransactionFlow();

  const { data: consumables } = useReadConsumables({});

  const loading = createNonInventoried.isLoading || saleConsumable.isLoading || createGlass.isLoading || isLoading;

  const items = useTransactionSaleStore.use.items();
  const expandedItems = expandItems(items, consumables ?? []);

  const itemHandlers = {
    consumable: async (transactionId: number, item: Item) => {
      await saleConsumable.mutateAsync({
        body: {
          transactionId: transactionId
        },
        pathParams: {
          consumableId: item.id
        }
      });
    },
    glass: async (transactionId: number, item: Item) => {
      await createGlass.mutateAsync({
        body: {
          barrelId: item.id,
          transactionId: transactionId
        }
      });
    },
    'non-inventoried': async (transactionId: number, item: Item) => {
      await createNonInventoried.mutateAsync({
        body: {
          nonInventoriedItemId: item.id,
          transactionId: transactionId
        }
      });
    }
  };

  const itemsCallback = async (transactionId: number) => {
    await Promise.all(
      expandedItems.map(async (item) => {
        await itemHandlers[item.type](transactionId, item.item);
      })
    );
  };

  const createTransaction = async (transaction: TransactionCommerceCreate) => {
    await transactionFlow(transaction, itemsCallback);
  };

  return {
    createTransaction,
    loading
  };
}
