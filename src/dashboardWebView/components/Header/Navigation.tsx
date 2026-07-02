import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Tab } from '../../constants/Tab';
import { SettingsAtom, TabAtom, TabInfoAtom } from '../../state';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';

export interface INavigationItemProps {
  tabId: string;
  isCrntTab: boolean;
  count?: number;
  onClick: () => void;
}

const NavigationItem: React.FunctionComponent<INavigationItemProps> = ({
  tabId,
  isCrntTab,
  count,
  onClick,
  children
}: React.PropsWithChildren<INavigationItemProps>) => {
  return (
    <button
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-sm font-medium whitespace-nowrap transition-colors duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1`}
      style={{
        backgroundColor: isCrntTab ? 'var(--fm-surface-4)' : 'transparent',
        color: isCrntTab ? 'var(--fm-text-hi)' : 'var(--fm-text-lo)',
        outlineColor: isCrntTab ? 'var(--fm-accent)' : undefined
      }}
      onMouseEnter={(e) => {
        if (!isCrntTab) {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-mid)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--fm-surface-3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isCrntTab) {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-lo)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }
      }}
      aria-current={isCrntTab ? 'page' : undefined}
      onClick={onClick}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span
          className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-full leading-none`}
          style={{
            backgroundColor: isCrntTab ? 'var(--fm-accent)' : 'var(--fm-surface-3)',
            color: isCrntTab ? 'var(--fm-accent-ink)' : 'var(--fm-text-xlo)'
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export const Navigation: React.FunctionComponent = () => {
  const [crntTab, setCrntTab] = useRecoilState(TabAtom);
  const tabInfo = useRecoilValue(TabInfoAtom);
  const settings = useRecoilValue(SettingsAtom);

  const tabs = React.useMemo(() => {
    const crntTabs = [
      { name: l10n.t(LocalizationKey.dashboardHeaderNavigationAllArticles), id: Tab.All }
    ];

    if (settings?.draftField?.type === 'boolean' && tabInfo && Object.keys(tabInfo).length > 1) {
      crntTabs.push({ name: l10n.t(LocalizationKey.dashboardHeaderNavigationPublished), id: Tab.Published });

      if (tabInfo.scheduled) {
        crntTabs.push({ name: l10n.t(LocalizationKey.dashboardHeaderNavigationScheduled), id: Tab.Scheduled });
      }

      crntTabs.push({ name: l10n.t(LocalizationKey.dashboardHeaderNavigationDraft), id: Tab.Draft });
    }

    return crntTabs;
  }, [settings?.draftField?.type, tabInfo]);

  return (
    <nav className="flex items-center gap-1 flex-1" aria-label="Tabs">
      {settings?.draftField?.type === 'boolean' ? (
        tabs.map((tab) => (
          <NavigationItem
            tabId={tab.id}
            isCrntTab={tab.id === crntTab}
            count={tabInfo?.[tab.id]}
            key={tab.name}
            onClick={() => setCrntTab(tab.id)}
          >
            {tab.name}
          </NavigationItem>
        ))
      ) : (
        <>
          <NavigationItem
            tabId={tabs[0].id}
            isCrntTab={tabs[0].id === crntTab}
            count={tabInfo?.[tabs[0].id]}
            onClick={() => setCrntTab(tabs[0].id)}
          >
            {tabs[0].name}
          </NavigationItem>

          {settings?.draftField?.choices?.map((value, idx) => (
            <NavigationItem
              key={`${value}-${idx}`}
              tabId={value}
              isCrntTab={value === crntTab}
              count={tabInfo?.[value]}
              onClick={() => setCrntTab(value)}
            >
              {value}
            </NavigationItem>
          ))}
        </>
      )}
    </nav>
  );
};
