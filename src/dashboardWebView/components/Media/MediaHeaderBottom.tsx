import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { NavigationType } from '../../models/NavigationType';
import { SettingsAtom } from '../../state';
import { Sorting } from '../Header';
import { Breadcrumb } from '../Header/Breadcrumb';

export interface IMediaHeaderBottomProps { }

export const MediaHeaderBottom: React.FunctionComponent<IMediaHeaderBottomProps> = (
  _: React.PropsWithChildren<IMediaHeaderBottomProps>
) => {
  const settings = useRecoilValue(SettingsAtom);

  if (!settings?.wsFolder) {
    return null;
  }

  return (
    <nav
      className="overflow-x-auto px-4 py-1.5 flex items-center justify-between gap-3 border-b border-[var(--frontmatter-border)]"
      aria-label="Breadcrumb"
    >
      <Breadcrumb />

      <div className="flex items-center gap-4 flex-shrink-0">
        <Sorting view={NavigationType.Media} disableCustomSorting />
      </div>
    </nav>
  );
};
