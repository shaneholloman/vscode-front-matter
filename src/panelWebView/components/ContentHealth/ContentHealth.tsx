import * as React from 'react';
import { Messenger } from '@estruyf/vscode/dist/client';
import type { PaneAction } from 'vscrui';
import { Collapsible } from '../Collapsible';
import { VSCodeTable, VSCodeTableBody } from '../VSCode/VSCodeTable';
import { ReadabilityScore } from './ReadabilityScore';
import { FreshnessWarning } from './FreshnessWarning';
import { InternalLinks } from './InternalLinks';
import { BrokenExternalLinks } from './BrokenExternalLinks';
import { COMMAND_NAME, GeneralCommands } from '../../../constants';
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
  contentHealth: ContentHealthData | undefined;
}

const ContentHealth: React.FunctionComponent<Props> = ({ contentHealth }) => {
  const [lastKnownData, setLastKnownData] = React.useState<ContentHealthData | undefined>(undefined);

  React.useEffect(() => {
    if (contentHealth !== undefined) {
      setLastKnownData(contentHealth);
    }
  }, [contentHealth]);

  const openContentHealthDocs = React.useCallback(() => {
    Messenger.send(GeneralCommands.toVSCode.runCommand, {
      command: COMMAND_NAME.docs,
      args: '/panel#content-health'
    });
  }, []);

  const actions = React.useMemo<PaneAction[]>(() => ([
    {
      iconName: 'book',
      onClick: openContentHealthDocs
    }
  ]), [openContentHealthDocs]);

  // Use the last known data if current data is undefined (during analysis)
  const displayData = contentHealth !== undefined ? contentHealth : lastKnownData;

  if (displayData === undefined) {
    return (
      <Collapsible id='contentHealth' title={localize(LocalizationKey.panelContentHealthTitle)} actions={actions}>
        <p className='opacity-60'>{localize(LocalizationKey.panelContentHealthChecking)}</p>
      </Collapsible>
    );
  }

  const { internalLinks, brokenExternalLinks, readability, freshnessWarning, minReadability = 0 } = displayData;

  const hasBrokenInternalLinks = (internalLinks || []).some((l) => !l.exists);
  const hasBrokenExternal = (brokenExternalLinks || []).length > 0;
  const hasIssues = hasBrokenInternalLinks || hasBrokenExternal ||
    (freshnessWarning !== null && freshnessWarning !== undefined) ||
    (readability && minReadability > 0 && readability.score < minReadability);

  return (
    <Collapsible id='contentHealth' title={localize(LocalizationKey.panelContentHealthTitle)} actions={actions}>
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
