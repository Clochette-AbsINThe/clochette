import toast from 'react-hot-toast';

import { useCreateTransactionFlow } from './useCreateTransactionFlow';

import { PurchaseItem, useTransactionPurchaseStore } from '@/components/transaction-page/purchase/transaction-purchase-store';
import { useCreateNonInventoried, useCreateConsumable, useCreateDrink, useCreateConsumableItem, useCreateNonInventoriedItem, useCreateBarrel } from '@/openapi-codegen/clochetteComponents';
import { generateApiErrorMessage } from '@/openapi-codegen/clochetteFetcher';
import { ConsumableItemCreate, DrinkItemCreate, NonInventoriedItemCreate, TransactionCommerceCreate } from '@/openapi-codegen/clochetteSchemas';

type Item = PurchaseItem['item'];
type ExpandedItem = {
  type: PurchaseItem['type'];
  item: Item;
};

export function expandItems(items: ExpandedItem[]) {
  const transformedItems: ExpandedItem[] = [];
  items.forEach((item) => {
    for (let i = 0; i < item.item.quantity!; i++) {
      transformedItems.push(item);
    }
  });

  return transformedItems;
}

export function useCreatePurchaseTransaction() {
  const createDrink = useCreateDrink({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création de la boisson. ${detail}`);
    }
  });
  const createConsumableItem = useCreateConsumableItem({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création du consommable. ${detail}`);
    }
  });
  const createNonInventoriedItem = useCreateNonInventoriedItem({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création du produit hors inventaire. ${detail}`);
    }
  });

  const createNonInventoried = useCreateNonInventoried({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création du produit hors inventaire. ${detail}`);
    }
  });
  const createConsumable = useCreateConsumable({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la vente du consommable. ${detail}`);
    }
  });
  const createBarrel = useCreateBarrel({
    onError(error, variables, context) {
      const detail = generateApiErrorMessage(error);
      toast.error(`Erreur lors de la création du fût. ${detail}`);
    }
  });
  const { transactionFlow, isLoading } = useCreateTransactionFlow();

  const loading = createDrink.isLoading || createConsumableItem.isLoading || createNonInventoriedItem.isLoading || createNonInventoried.isLoading || createConsumable.isLoading || createBarrel.isLoading || isLoading;

  const items = useTransactionPurchaseStore.use.items();

  const itemHandlers = {
    consumable: async (item: Item) => {
      const itemToCreate = item as ConsumableItemCreate;
      return await createConsumableItem.mutateAsync({
        body: itemToCreate
      });
    },
    barrel: async (item: Item) => {
      const itemToCreate = item as DrinkItemCreate;
      return await createDrink.mutateAsync({
        body: itemToCreate
      });
    },
    'non-inventoried': async (item: Item) => {
      const itemToCreate = item as NonInventoriedItemCreate;
      return await createNonInventoriedItem.mutateAsync({
        body: itemToCreate
      });
    }
  };

  const transactionItemHandlers = {
    consumable: async (transactionId: number, item: Item) => {
      await createConsumable.mutateAsync({
        body: {
          buyPrice: item.buyPrice!,
          sellPrice: item.sellPrice!,
          consumableItemId: item.id!,
          transactionId: transactionId
        }
      });
    },
    barrel: async (transactionId: number, item: Item) => {
      await createBarrel.mutateAsync({
        body: {
          buyPrice: item.buyPrice!,
          sellPrice: item.sellPrice!,
          drinkItemId: item.id!,
          transactionId: transactionId
        }
      });
    },
    'non-inventoried': async (transactionId: number, item: Item) => {
      await createNonInventoried.mutateAsync({
        body: {
          buyPrice: item.buyPrice!,
          nonInventoriedItemId: item.id!,
          transactionId: transactionId
        }
      });
    }
  };

  const preProcessItems = async () => {
    const result = await Promise.all(
      items.map(async (item) => {
        if ('id' in item.item) {
          return item;
        } else {
          const newItem = await itemHandlers[item.type](item.item);
          item.item.id = newItem.id;
          return {
            type: item.type,
            item: item.item
          };
        }
      })
    );

    return result;
  };

  const createTransaction = async (transaction: TransactionCommerceCreate) => {
    const processedItems = await preProcessItems();
    const itemsCallback = async (transactionId: number) => {
      const expandedItems = expandItems(processedItems);
      await Promise.all(
        expandedItems.map(async (item) => {
          await transactionItemHandlers[item.type](transactionId, item.item);
        })
      );
    };
    await transactionFlow(transaction, itemsCallback);
  };

  return {
    createTransaction,
    loading
  };
}
