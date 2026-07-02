import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ViewAtom, SettingsSelector } from '../../state';
import { Bars4Icon, Squares2X2Icon, FolderIcon } from '@heroicons/react/24/solid';
import { Messenger } from '@estruyf/vscode/dist/client';
import { DashboardMessage } from '../../DashboardMessage';
import { DashboardViewType } from '../../models';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';

export interface IViewSwitchProps { }

export const ViewSwitch: React.FunctionComponent<IViewSwitchProps> = (
  props: React.PropsWithChildren<IViewSwitchProps>
) => {
  const [view, setView] = useRecoilState(ViewAtom);
  const settings = useRecoilValue(SettingsSelector);

  const handleViewChange = (newView: DashboardViewType) => {
    setView(newView);
    Messenger.send(DashboardMessage.setPageViewType, newView);
  };

  React.useEffect(() => {
    if (settings?.pageViewType) {
      setView(settings?.pageViewType);
    }
  }, [settings?.pageViewType]);

  const btnBase = `flex items-center px-2 py-1.5 transition-colors duration-100`;

  const btnStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? 'var(--fm-accent)' : 'transparent',
    color: isActive ? 'var(--fm-accent-ink)' : 'var(--fm-text-lo)'
  });

  return (
    <div
      className={`flex rounded-[6px] overflow-hidden`}
      style={{ border: '1px solid var(--fm-border)' }}
    >
      <button
        className={`${btnBase} rounded-l-[5px]`}
        style={btnStyle(view === DashboardViewType.Grid)}
        title={l10n.t(LocalizationKey.dashboardHeaderViewSwitchToGrid)}
        type={`button`}
        onMouseEnter={(e) => { if (view !== DashboardViewType.Grid) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-mid)'; } }}
        onMouseLeave={(e) => { if (view !== DashboardViewType.Grid) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-lo)'; } }}
        onClick={() => handleViewChange(DashboardViewType.Grid)}
      >
        <Squares2X2Icon className={`w-4 h-4`} />
        <span className={`sr-only`}>{l10n.t(LocalizationKey.dashboardHeaderViewSwitchToGrid)}</span>
      </button>

      <button
        className={`${btnBase}`}
        style={{ ...btnStyle(view === DashboardViewType.List), borderLeft: '1px solid var(--fm-border)', borderRight: '1px solid var(--fm-border)' }}
        title={l10n.t(LocalizationKey.dashboardHeaderViewSwitchToList)}
        type={`button`}
        onMouseEnter={(e) => { if (view !== DashboardViewType.List) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-mid)'; } }}
        onMouseLeave={(e) => { if (view !== DashboardViewType.List) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-lo)'; } }}
        onClick={() => handleViewChange(DashboardViewType.List)}
      >
        <Bars4Icon className={`w-4 h-4`} />
        <span className={`sr-only`}>{l10n.t(LocalizationKey.dashboardHeaderViewSwitchToList)}</span>
      </button>

      <button
        className={`${btnBase} rounded-r-[5px]`}
        style={btnStyle(view === DashboardViewType.Structure)}
        title={l10n.t(LocalizationKey.dashboardHeaderViewSwitchToStructure)}
        type={`button`}
        onMouseEnter={(e) => { if (view !== DashboardViewType.Structure) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-mid)'; } }}
        onMouseLeave={(e) => { if (view !== DashboardViewType.Structure) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-lo)'; } }}
        onClick={() => handleViewChange(DashboardViewType.Structure)}
      >
        <FolderIcon className={`w-4 h-4`} />
        <span className={`sr-only`}>{l10n.t(LocalizationKey.dashboardHeaderViewSwitchToStructure)}</span>
      </button>
    </div>
  );
};
