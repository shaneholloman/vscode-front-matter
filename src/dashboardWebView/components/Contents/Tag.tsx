import * as React from 'react';
import * as l10n from '@vscode/l10n';
import { routePaths } from '../..';
import { LocalizationKey } from '../../../localization';
import { useNavigate } from 'react-router-dom';

export interface ITagProps {
  value?: string;
  tagField?: string | null | undefined;
}

export const Tag: React.FunctionComponent<ITagProps> = ({
  value,
  tagField
}: React.PropsWithChildren<ITagProps>) => {
  const navigate = useNavigate();

  if (!value) {
    return null;
  }

  return (
    <button
      className={`flex-shrink-0 inline-block text-[0.65rem] font-medium px-1.5 py-0.5 rounded transition-colors duration-100`}
      style={{
        color: 'var(--fm-text-lo)',
        backgroundColor: 'var(--fm-surface-3)',
        border: '1px solid var(--fm-border)'
      }}
      title={l10n.t(LocalizationKey.commonFilterValue, value)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-mid)';
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--fm-surface-4)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--fm-text-lo)';
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--fm-surface-3)';
      }}
      onClick={() => {
        if (tagField) {
          navigate(`${routePaths.contents}?taxonomy=${tagField}&value=${value}`);
        }
      }}
    >
      {value}
    </button>
  );
};
