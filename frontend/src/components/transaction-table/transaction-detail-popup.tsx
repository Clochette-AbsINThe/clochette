import { BarrelPurchaseDetail, ConsumablePurchaseDetail, BarrelSaleDetail, NonInventoriedSaleDetail, NonInventoriedPurchaseDetail, ConsumableSaleDetail, GlassDetail } from './transaction-items-detail';
import { DataTableRowActionsProps } from './transaction-table-row-actions';

import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useReadTransaction } from '@/openapi-codegen/clochetteComponents';
import { TransactionDetail } from '@/openapi-codegen/clochetteSchemas';

export function TransactionDetails(transaction: Readonly<TransactionDetail>) {
  if (transaction.trade === 'purchase') {
    return (
      <>
        {transaction.barrelsPurchase.length > 0 && BarrelPurchaseDetail(transaction.barrelsPurchase)}
        {transaction.consumablesPurchase.length > 0 && ConsumablePurchaseDetail(transaction.consumablesPurchase)}
        {transaction.nonInventorieds.length > 0 && NonInventoriedPurchaseDetail(transaction.nonInventorieds)}
      </>
    );
  } else if (transaction.trade === 'sale') {
    return (
      <>
        {transaction.barrelsSale.length > 0 && BarrelSaleDetail(transaction.barrelsSale)}
        {transaction.consumablesSale.length > 0 && ConsumableSaleDetail(transaction.consumablesSale)}
        {transaction.glasses.length > 0 && GlassDetail(transaction.glasses)}
        {transaction.nonInventorieds.length > 0 && NonInventoriedSaleDetail(transaction.nonInventorieds)}
      </>
    );
  }
}
interface TransactionDetailPopupProps extends DataTableRowActionsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function TransactionDetailPopup({ row, isOpen }: Readonly<TransactionDetailPopupProps>) {
  const { data, isLoading, isError } = useReadTransaction(
    {
      pathParams: {
        transactionId: row.original.id
      }
    },
    {
      enabled: isOpen
    }
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Récapitulatif de la transaction :</DialogTitle>
      </DialogHeader>
      <div className='flex flex-col gap-4 min-h-[50vh] min-w-[50vw]'>
        {isLoading && <p className='text-md text-muted-foreground'>Chargement...</p>}
        {isError && <p className='text-md text-muted-foreground'>Erreur lors du chargement de la transaction.</p>}
        {data && <TransactionDetails {...data} />}
        {data?.description && <p className='text-md text-muted-foreground ml-4 mt-4'>{data.description}</p>}
      </div>
    </>
  );
}
