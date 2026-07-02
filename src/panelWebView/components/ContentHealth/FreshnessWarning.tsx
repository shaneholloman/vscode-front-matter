import * as React from 'react';
import { VSCodeTableCell, VSCodeTableRow } from '../VSCode/VSCodeTable';
import { LocalizationKey, localize } from '../../../localization';

interface Props {
  freshnessWarning: { daysSince: number; threshold: number };
}

const FreshnessWarning: React.FunctionComponent<Props> = ({ freshnessWarning }) => {
  return (
    <VSCodeTableRow>
      <VSCodeTableCell>{localize(LocalizationKey.panelContentHealthFreshnessLabel)}</VSCodeTableCell>
      <VSCodeTableCell>
        <span className='text-[var(--vscode-problemsWarningIcon-foreground)]'>
          {localize(
            LocalizationKey.panelContentHealthFreshnessDaysOld,
            freshnessWarning.daysSince
          )}
        </span>
      </VSCodeTableCell>
    </VSCodeTableRow>
  );
};

FreshnessWarning.displayName = 'FreshnessWarning';
export { FreshnessWarning };
