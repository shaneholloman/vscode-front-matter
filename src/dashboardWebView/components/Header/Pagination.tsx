import * as React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import usePagination from '../../hooks/usePagination';
import { MediaTotalSelector, PageAtom, SettingsAtom, ViewSelector } from '../../state';
import { PaginationButton } from './PaginationButton';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';
import { DashboardViewType } from '../../models';

export interface IPaginationProps {
  totalPages?: number;
}

export const Pagination: React.FunctionComponent<IPaginationProps> = ({
  totalPages
}: React.PropsWithChildren<IPaginationProps>) => {
  const [page, setPage] = useRecoilState(PageAtom);
  const totalMedia = useRecoilValue(MediaTotalSelector);
  const settings = useRecoilValue(SettingsAtom);
  const view = useRecoilValue(ViewSelector);
  const { pageSetNr, totalPagesNr } = usePagination(
    settings?.dashboardState.contents.pagination,
    totalPages,
    totalMedia
  );

  const buttons = useMemo((): JSX.Element[] => {
    const maxButtons = 5;
    const buttons: JSX.Element[] = [];
    const start = Math.max(0, page - Math.floor(maxButtons / 2));
    const end = Math.min(totalPagesNr, start + maxButtons - 1);

    for (let i = start; i <= end; i++) {
      const isActive = i === page;
      buttons.push(
        <button
          key={i}
          disabled={isActive}
          onClick={() => setPage(i)}
          className={`min-w-[28px] h-7 px-1.5 rounded-[6px] text-sm font-medium transition-colors duration-100`}
          style={{
            fontFamily: 'var(--fm-mono)',
            backgroundColor: isActive ? 'var(--fm-accent)' : 'transparent',
            color: isActive ? 'var(--fm-accent-ink)' : 'var(--fm-text-lo)',
            cursor: isActive ? 'default' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--fm-surface-3)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-mid)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-lo)';
            }
          }}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  }, [page, totalPagesNr]);

  useEffect(() => {
    setPage(0);
  }, [pageSetNr]);

  useEffect(() => {
    setPage(0);
  }, []);

  if (view === DashboardViewType.Structure) {
    return null;
  }

  return (
    <div className="flex justify-between items-center sm:justify-end gap-1 text-sm">
      <PaginationButton
        title={l10n.t(LocalizationKey.dashboardHeaderPaginationPrevious)}
        disabled={page === 0}
        onClick={() => {
          if (page > 0) {
            setPage(page - 1);
          }
        }}
      />

      {buttons}

      <PaginationButton
        title={l10n.t(LocalizationKey.dashboardHeaderPaginationNext)}
        disabled={page >= totalPagesNr}
        onClick={() => setPage(page + 1)}
      />
    </div>
  );
};
