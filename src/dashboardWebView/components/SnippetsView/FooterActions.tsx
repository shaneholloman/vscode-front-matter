import * as React from 'react';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';
import { QuickAction } from '../Menu';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useCallback } from 'react';
import { openFile } from '../../utils/MessageHandlers';

export interface IFooterActionsProps {
  insertEnabled: boolean;
  sourcePath?: string;
  onEdit?: () => void;
  onInsert: () => void;
  onDelete?: () => void;
}

export const FooterActions: React.FunctionComponent<IFooterActionsProps> = ({
  insertEnabled,
  sourcePath,
  onEdit,
  onInsert,
  onDelete,
}: React.PropsWithChildren<IFooterActionsProps>) => {

  const showFile = useCallback(() => {
    openFile(sourcePath);
  }, [sourcePath]);

  if (!onEdit && !onDelete && !sourcePath && !insertEnabled) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-end gap-0.5 px-2 py-2 border-t border-[var(--fm-border)] z-50">
      {insertEnabled && (
        <QuickAction
          title={l10n.t(LocalizationKey.commonInsertSnippet)}
          className={`text-[var(--fm-text-lo)] hover:text-[var(--fm-text-mid)]`}
          onClick={onInsert}>
          <PlusIcon className={`w-3.5 h-3.5`} aria-hidden="true" />
          <span className='sr-only'>{l10n.t(LocalizationKey.commonInsertSnippet)}</span>
        </QuickAction>
      )}

      {
        !sourcePath ? (
          <>
            {
              onEdit && (
                <QuickAction
                  title={l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionEditSnippet)}
                  className={`text-[var(--fm-text-lo)] hover:text-[var(--fm-text-mid)]`}
                  onClick={onEdit}>
                  <PencilIcon className={`w-3.5 h-3.5`} aria-hidden="true" />
                  <span className='sr-only'>{l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionEditSnippet)}</span>
                </QuickAction>
              )
            }

            {
              onDelete && (
                <QuickAction
                  title={l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionDeleteSnippet)}
                  className={`text-[var(--fm-text-lo)] hover:text-[var(--fm-status-danger)]`}
                  onClick={onDelete}>
                  <TrashIcon className={`w-3.5 h-3.5`} aria-hidden="true" />
                  <span className='sr-only'>{l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionDeleteSnippet)}</span>
                </QuickAction>
              )
            }
          </>
        ) : (
          <QuickAction
            title={l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionViewSnippet)}
            className={`text-[var(--fm-text-lo)] hover:text-[var(--fm-text-mid)]`}
            onClick={showFile}>
            <EyeIcon className={`w-3.5 h-3.5`} aria-hidden="true" />
            <span className='sr-only'>{l10n.t(LocalizationKey.dashboardSnippetsViewItemQuickActionViewSnippet)}</span>
          </QuickAction>
        )
      }
    </div >
  );
};