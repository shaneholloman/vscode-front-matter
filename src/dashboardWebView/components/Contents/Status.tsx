import * as React from 'react';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { SettingsAtom, TabInfoAtom } from '../../state';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';

export interface IStatusProps {
  draft: boolean | string;
  published: number | null | undefined;
}

export const Status: React.FunctionComponent<IStatusProps> = ({
  draft,
  published
}: React.PropsWithChildren<IStatusProps>) => {
  const settings = useRecoilValue(SettingsAtom);
  const tabInfo = useRecoilValue(TabInfoAtom);

  const draftField = useMemo(() => settings?.draftField, [settings]);
  const isFuture = useMemo(() => published ? published > Date.now() : false, [published]);

  const draftValue = useMemo(() => {
    if (draftField && draftField.type === 'choice') {
      return draft;
    } else if (draftField && typeof draftField.invert !== 'undefined' && draftField.invert) {
      return !draft;
    } else {
      return draft;
    }
  }, [draftField, draft]);

  if (settings?.draftField && settings.draftField.type === 'choice') {
    if (draftValue) {
      return (
        <span className={`inline-flex items-center gap-1.5`}>
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0`}
            style={{ backgroundColor: 'var(--fm-accent)' }}
          />
          <span
            className={`text-[0.7rem] font-medium uppercase tracking-wide`}
            style={{ color: 'var(--fm-text-mid)' }}
          >
            {draftValue as string}
          </span>
        </span>
      );
    } else {
      return null;
    }
  }

  if (tabInfo && Object.keys(tabInfo).length <= 1) {
    return null;
  }

  const dotColor = draftValue
    ? 'var(--fm-status-draft)'
    : isFuture
      ? 'var(--fm-status-scheduled)'
      : 'var(--fm-status-published)';

  const label = draftValue
    ? l10n.t(LocalizationKey.dashboardContentsStatusDraft)
    : isFuture
      ? l10n.t(LocalizationKey.dashboardContentsStatusScheduled)
      : l10n.t(LocalizationKey.dashboardContentsStatusPublished);

  return (
    <span className={`draft__status inline-flex items-center gap-1.5`}>
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0`}
        style={{ backgroundColor: dotColor }}
        aria-hidden="true"
      />
      <span
        className={`text-[0.7rem] font-medium uppercase tracking-wide`}
        style={{ color: dotColor }}
      >
        {label}
      </span>
    </span>
  );
};
