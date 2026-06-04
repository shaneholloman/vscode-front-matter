import * as React from 'react';
import * as l10n from '@vscode/l10n';
import { useCallback } from 'react';
import { LocalizationKey } from '../../../localization';
import { openFile } from '../../utils/MessageHandlers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/shadcn/Dropdown';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface IItemMenuProps {
  insertEnabled: boolean;
  sourcePath?: string;
  onEdit?: () => void;
  onInsert: () => void;
  onDelete?: () => void;
  onMenuOpenChange?: (open: boolean) => void;
}

export const ItemMenu: React.FunctionComponent<IItemMenuProps> = ({
  insertEnabled,
  sourcePath,
  onEdit,
  onInsert,
  onDelete,
  onMenuOpenChange,
}: React.PropsWithChildren<IItemMenuProps>) => {

  const showFile = useCallback(() => {
    openFile(sourcePath);
  }, [sourcePath]);

  if (!onEdit && !onDelete && !sourcePath && !insertEnabled) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2 z-10 flex">
      <DropdownMenu onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--fm-border)] bg-[var(--fm-surface-2)]/95 text-[var(--fm-text-lo)] backdrop-blur-sm transition-colors hover:bg-[var(--fm-surface-3)] hover:text-[var(--fm-text-hi)] data-[state=open]:bg-[var(--fm-surface-3)] data-[state=open]:text-[var(--fm-text-hi)] focus:outline-none">
          <span className="sr-only">{l10n.t(LocalizationKey.commonMenu)}</span>
          <EllipsisHorizontalIcon className="w-4 h-4" aria-hidden="true" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
              {
                insertEnabled && (
                  <DropdownMenuItem
                    title={l10n.t(LocalizationKey.commonInsertSnippet)}
                    onClick={onInsert}>
                    <PlusIcon className="h-4 w-4" aria-hidden={true} />
                    <span>{l10n.t(LocalizationKey.commonInsertSnippet)}</span>
                  </DropdownMenuItem>
                )
              }

              {
                !sourcePath ? (
                  <>
                    {
                      onEdit && (
                        <DropdownMenuItem
                          title={l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionEditSnippet)}
                          onClick={onEdit}>
                          <PencilIcon className="h-4 w-4" aria-hidden={true} />
                          <span>{l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionEditSnippet)}</span>
                        </DropdownMenuItem>
                      )
                    }

                    {
                      onDelete && (
                        <DropdownMenuItem
                          title={l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionDeleteSnippet)}
                          onClick={onDelete}
                          className={`focus:bg-[var(--vscode-statusBarItem-errorBackground)] focus:text-[var(--vscode-statusBarItem-errorForeground)]`}>
                          <TrashIcon className="h-4 w-4" aria-hidden={true} />
                          <span>{l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionDeleteSnippet)}</span>
                        </DropdownMenuItem>
                      )
                    }
                  </>
                ) : (
                  <DropdownMenuItem
                    title={l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionViewSnippet)}
                    onClick={showFile}>
                    <EyeIcon className="h-4 w-4" aria-hidden={true} />
                    <span>{l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionViewSnippet)}</span>
                  </DropdownMenuItem>
                )
              }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};