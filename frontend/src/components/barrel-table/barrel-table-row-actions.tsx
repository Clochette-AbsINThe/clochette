import { useState } from 'react';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { BarrelModifyPopup } from './barrel-modify-popup';
import { BarrelSalePopup } from './barrel-sale-popup';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarrelDistinct } from '@/openapi-codegen/clochetteSchemas';

export interface DataTableRowActionsProps {
  row: Row<BarrelDistinct>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'details' | 'sale'>('sale');

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-32'
        >
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setType('details');
              }}
            >
              Modifier
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setType('sale');
              }}
            >
              Vendre le fût
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        {type === 'details' && (
          <BarrelModifyPopup
            rowBarrel={row.original}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
        {type === 'sale' && (
          <BarrelSalePopup
            rowBarrel={row.original}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
