import { useState } from 'react';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { AccountDeletePopup } from './account-delete-popup';
import { AccountModifyPopup } from './account-modify-popup';

import { Button as UIButton } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Account } from '@/openapi-codegen/clochetteSchemas';

export interface DataTableRowActionsProps {
  row: Row<Account>;
}

export function DataTableRowActions({ row }: Readonly<DataTableRowActionsProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'modify' | 'delete'>('delete');

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
            <DropdownMenuItem
              onClick={() => {
                setType('modify');
              }}
            >
              Modifier
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setType('delete');
              }}
            >
              <span className='flex items-center space-x-2 text-red-600'>Supprimer</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        {type === 'modify' && (
          <AccountModifyPopup
            rowAccount={row.original}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
        {type === 'delete' && (
          <AccountDeletePopup
            rowAccount={row.original}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
