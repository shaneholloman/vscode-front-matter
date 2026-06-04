import * as React from 'react';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';
import { ClipboardIcon, CodeBracketIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CustomScript, MediaInfo, Snippet, ViewData } from '../../../models';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/shadcn/Dropdown';
import { messageHandler } from '@estruyf/vscode/dist/client';
import { DashboardMessage } from '../../DashboardMessage';
import { parseWinPath } from '../../../helpers/parseWinPath';
import { copyToClipboard } from '../../utils';
import { CustomActions } from './CustomActions';

export interface IItemMenuProps {
  media: MediaInfo;
  relPath?: string;
  selectedFolder: string | null;
  viewData?: ViewData;
  snippets: Snippet[];
  scripts?: CustomScript[];
  insertIntoArticle: () => void;
  showUpdateMedia: () => void;
  showMediaDetails: () => void;
  processSnippet: (snippet: Snippet) => void;
  onDelete: () => void;
  onMenuOpenChange?: (open: boolean) => void;
}

export const ItemMenu: React.FunctionComponent<IItemMenuProps> = ({
  media,
  relPath,
  selectedFolder,
  viewData,
  snippets,
  scripts,
  insertIntoArticle,
  showUpdateMedia,
  showMediaDetails,
  processSnippet,
  onDelete,
  onMenuOpenChange,
}: React.PropsWithChildren<IItemMenuProps>) => {

  const onCopyToClipboard = React.useCallback(() => {
    copyToClipboard(parseWinPath(relPath) || '');
  }, [relPath]);

  const revealMedia = React.useCallback(() => {
    messageHandler.send(DashboardMessage.revealMedia, {
      file: media.fsPath,
      folder: selectedFolder
    });
  }, [selectedFolder]);

  return (
    <div className="absolute top-2 right-2 z-10 flex">
      <DropdownMenu onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger className="relative flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--fm-border)] bg-[var(--fm-surface-2)]/95 text-[var(--fm-text-lo)] backdrop-blur-sm transition-colors hover:bg-[var(--fm-surface-3)] hover:text-[var(--fm-text-hi)] data-[state=open]:bg-[var(--fm-surface-3)] data-[state=open]:text-[var(--fm-text-hi)] focus:outline-none">
          <span className="sr-only">{l10n.t(LocalizationKey.commonMenu)}</span>
          <EllipsisHorizontalIcon className="w-4 h-4" aria-hidden="true" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={showMediaDetails}>
                <EyeIcon className="h-4 w-4" aria-hidden={true} />
                <span>{l10n.t(LocalizationKey.commonView)}</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={showUpdateMedia}>
                <PencilIcon className="h-4 w-4" aria-hidden={true} />
                <span>{l10n.t(LocalizationKey.dashboardMediaItemMenuItemEditMetadata)}</span>
              </DropdownMenuItem>

              {
                viewData?.filePath ? (
                  <>
                    <DropdownMenuItem onClick={insertIntoArticle}>
                      <PlusIcon className="h-4 w-4" aria-hidden={true} />
                      <span>{l10n.t(LocalizationKey.dashboardMediaItemMenuItemInsertImage)}</span>
                    </DropdownMenuItem>

                    {
                      viewData?.position &&
                      snippets.length > 0 &&
                      snippets.map((snippet, idx) => (
                        <DropdownMenuItem key={idx} onClick={() => processSnippet(snippet)}>
                          <CodeBracketIcon
                            className="h-4 w-4"
                            aria-hidden={true}
                          />
                          <span>{snippet.title}</span>
                        </DropdownMenuItem>
                      ))
                    }
                  </>
                ) : (
                  <DropdownMenuItem onClick={onCopyToClipboard}>
                    <ClipboardIcon className="h-4 w-4" aria-hidden={true} />
                    <span>{l10n.t(LocalizationKey.dashboardMediaItemQuickActionCopyPath)}</span>
                  </DropdownMenuItem>
                )
              }

              <CustomActions
                filePath={media.fsPath}
                scripts={scripts} />

              <DropdownMenuItem onClick={revealMedia}>
                <EyeIcon className="h-4 w-4" aria-hidden={true} />
                <span>{l10n.t(LocalizationKey.dashboardMediaItemMenuItemRevealMedia)}</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onDelete} className={`focus:bg-[var(--vscode-statusBarItem-errorBackground)] focus:text-[var(--vscode-statusBarItem-errorForeground)]`}>
                <TrashIcon className="h-4 w-4" aria-hidden={true} />
                <span>{l10n.t(LocalizationKey.commonDelete)}</span>
              </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};