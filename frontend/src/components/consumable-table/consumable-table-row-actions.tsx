import { useState } from 'react';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { ConsumableModifyPopup } from './consumable-modify-popup';

import { Button as UIButton } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConsumableDistinct } from '@/openapi-codegen/clochetteSchemas';

export interface DataTableRowActionsProps {
  row: Row<ConsumableDistinct>;
}

export function DataTableRowActions({ row }: Readonly<DataTableRowActionsProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UIButton
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </UIButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-32'
        >
          <DialogTrigger asChild>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <ConsumableModifyPopup
          row={row}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
