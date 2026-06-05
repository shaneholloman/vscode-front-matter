import * as React from 'react';
import { Collapsible } from '../Collapsible';
import { VSCodeTable, VSCodeTableBody } from '../VSCode/VSCodeTable';
import { ReadabilityScore } from './ReadabilityScore';
import { FreshnessWarning } from './FreshnessWarning';
import { InternalLinks } from './InternalLinks';
import { BrokenExternalLinks } from './BrokenExternalLinks';
import { LocalizationKey, localize } from '../../../localization';
import type { LinkValidationResult } from '../../../helpers/LinkValidator';
import type { ReadabilityResult } from '../../../helpers/ReadabilityHelper';

interface ContentHealthData {
  internalLinks?: LinkValidationResult[];
  brokenExternalLinks?: LinkValidationResult[];
  readability?: ReadabilityResult;
  freshnessWarning?: { daysSince: number; threshold: number } | null;
  minReadability?: number;
}

interface Props {
  contentHealth: ContentHealthData;
}

const ContentHealth: React.FunctionComponent<Props> = ({ contentHealth }) => {
  if (!contentHealth) {
    return null;
  }

  const { internalLinks, brokenExternalLinks, readability, freshnessWarning, minReadability = 0 } = contentHealth;

  const hasBrokenInternalLinks = (internalLinks || []).some((l) => !l.exists);
  const hasBrokenExternal = (brokenExternalLinks || []).length > 0;
  const hasIssues = hasBrokenInternalLinks || hasBrokenExternal ||
    (freshnessWarning !== null && freshnessWarning !== undefined) ||
    (readability && minReadability > 0 && readability.score < minReadability);

  return (
    <Collapsible id='contentHealth' title={localize(LocalizationKey.panelContentHealthTitle)}>
      <div className='space-y-2'>
        <VSCodeTable>
          <VSCodeTableBody>
            {readability && (
              <ReadabilityScore readability={readability} minScore={minReadability} />
            )}
            {freshnessWarning && (
              <FreshnessWarning freshnessWarning={freshnessWarning} />
            )}
          </VSCodeTableBody>
        </VSCodeTable>

        {internalLinks && internalLinks.length > 0 && (
          <InternalLinks internalLinks={internalLinks} />
        )}

        {brokenExternalLinks && brokenExternalLinks.length > 0 && (
          <BrokenExternalLinks brokenExternalLinks={brokenExternalLinks} />
        )}

        {!hasIssues && (
          <p className='text-xs text-[var(--vscode-testing-iconPassed)]'>
            {localize(LocalizationKey.panelContentHealthNoIssues)}
          </p>
        )}
      </div>
    </Collapsible>
  );
};

ContentHealth.displayName = 'ContentHealth';
export { ContentHealth };
