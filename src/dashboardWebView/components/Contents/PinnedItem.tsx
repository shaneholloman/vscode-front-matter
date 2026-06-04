import * as React from 'react';
import { Page } from '../../models';
import { MarkdownIcon } from '../../../panelWebView/components/Icons/MarkdownIcon';
import { ContentActions } from './ContentActions';
import useCard from '../../hooks/useCard';
import { SettingsSelector } from '../../state';
import { useRecoilValue } from 'recoil';
import { ItemSelection } from '../Common/ItemSelection';
import { openFile } from '../../utils';
import useSelectedItems from '../../hooks/useSelectedItems';
import { cn } from '../../../utils/cn';

export interface IPinnedItemProps extends Page { }

export const PinnedItem: React.FunctionComponent<IPinnedItemProps> = ({
  ...pageData
}: React.PropsWithChildren<IPinnedItemProps>) => {
  const { selectedFiles } = useSelectedItems();
  const settings = useRecoilValue(SettingsSelector);
  const { escapedTitle } = useCard(pageData, settings?.dashboardState?.contents?.cardFields);

  const isSelected = React.useMemo(() => selectedFiles.includes(pageData.fmFilePath), [selectedFiles, pageData.fmFilePath]);

  const onOpenFile = React.useCallback(() => {
    openFile(pageData.fmFilePath);
  }, [pageData.fmFilePath]);

  return (
    <li
      className={cn(
        `group relative flex items-center h-14 w-52 flex-shrink-0`,
        `rounded-[6px] border overflow-hidden`,
        `transition duration-150 ease-out`,
        isSelected
          ? `border-[var(--fm-accent-line)]`
          : `border-[var(--fm-border)] hover:border-[var(--fm-border-hi)]`
      )}
      style={{ backgroundColor: 'var(--fm-surface-2)' }}
    >
      {/* Thumbnail */}
      <button
        onClick={onOpenFile}
        className={`relative h-full w-12 flex-shrink-0 overflow-hidden`}
        style={{ borderRight: '1px solid var(--fm-border)' }}
      >
        {pageData['fmPreviewImage'] ? (
          <img
            src={`${pageData['fmPreviewImage']}`}
            alt={pageData.title || ''}
            className="absolute inset-0 h-full w-full object-cover object-left-top group-hover:brightness-75 transition-[filter] duration-150"
            loading="lazy"
          />
        ) : (
          <div
            className={`h-full flex items-center justify-center`}
            style={{ backgroundColor: 'var(--fm-surface-3)' }}
          >
            <MarkdownIcon className={`h-5 opacity-25 text-[var(--fm-text-mid)]`} />
          </div>
        )}
      </button>

      {/* Text content */}
      <button
        onClick={onOpenFile}
        className={`flex-1 px-2 text-left min-w-0 overflow-hidden`}
      >
        <p
          className={`text-xs font-semibold truncate`}
          style={{ color: 'var(--fm-text-hi)' }}
        >
          {escapedTitle}
        </p>
        {pageData.fmContentType && (
          <p
            className={`text-[0.65rem] truncate mt-0.5`}
            style={{ color: 'var(--fm-text-xlo)' }}
          >
            {pageData.fmContentType}
          </p>
        )}
      </button>

      {/* Selection checkbox */}
      <ItemSelection filePath={pageData.fmFilePath} />

      {/* Context menu */}
      <ContentActions
        path={pageData.fmFilePath}
        relPath={pageData.fmRelFileWsPath}
        contentType={pageData.fmContentType}
        scripts={settings?.scripts}
        onOpen={onOpenFile}
      />
    </li>
  );
};
