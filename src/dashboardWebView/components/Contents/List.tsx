import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { DashboardViewType } from '../../models';
import { ViewSelector } from '../../state';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';

export interface IListProps { }

export const List: React.FunctionComponent<IListProps> = ({
  children
}: React.PropsWithChildren<IListProps>) => {
  const view = useRecoilValue(ViewSelector);

  let className = '';
  if (view === DashboardViewType.Grid) {
    className = `grid gap-4`;
    // inline style is set on the element below via style prop
  } else if (view === DashboardViewType.List) {
    className = `-mx-4`;
  } else if (view === DashboardViewType.Structure) {
    className = `structure-view`;
  }

  const gridStyle = view === DashboardViewType.Grid
    ? { gridTemplateColumns: 'repeat(auto-fill, minmax(264px, 1fr))' }
    : undefined;

  return (
    <ul role="list" className={className} style={gridStyle}>
      {view === DashboardViewType.List && (
        <li className={`px-5 relative uppercase py-2 border-b text-[var(--vscode-editor-foreground)] border-[var(--frontmatter-border)]`}>
          <div className={`grid grid-cols-12 gap-x-4 sm:gap-x-6 xl:gap-x-8`}>
            <div className="col-span-8">{l10n.t(LocalizationKey.dashboardContentsListTitle)}</div>
            <div className="col-span-2">{l10n.t(LocalizationKey.dashboardContentsListDate)}</div>
            <div className="col-span-2">{l10n.t(LocalizationKey.dashboardContentsListStatus)}</div>
          </div>
        </li>
      )}
      {children}
    </ul>
  );
};
