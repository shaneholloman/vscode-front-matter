import { Messenger } from '@estruyf/vscode/dist/client';
import * as React from 'react';
import { CommandToCode } from '../../CommandToCode';
import { LocalizationKey, localize } from '../../../localization';
import type { LinkValidationResult } from '../../../helpers/LinkValidator';

interface Props {
  brokenExternalLinks: LinkValidationResult[];
}

const truncate = (url: string, max = 50): string =>
  url.length > max ? `${url.slice(0, max)}…` : url;

const BrokenExternalLinks: React.FunctionComponent<Props> = ({ brokenExternalLinks }) => {
  if (!brokenExternalLinks || brokenExternalLinks.length === 0) {
    return null;
  }

  const handleSelect = (url: string) => {
    Messenger.send(CommandToCode.selectInDocument, url);
  };

  return (
    <div className='mt-2'>
      <p className='text-sm font-semibold text-[var(--vscode-descriptionForeground)] uppercase mb-1'>
        {localize(LocalizationKey.panelContentHealthBrokenExternalLinks)}
      </p>
      <ul className='space-y-1'>
        {brokenExternalLinks.map((link) => (
          <li
            key={link.url}
            className='flex items-center gap-1 text-sm text-[var(--vscode-problemsErrorIcon-foreground)]'
          >
            <span
              className='shrink-0 w-2 h-2 rounded-full bg-[var(--vscode-problemsErrorIcon-foreground)]'
              title={localize(LocalizationKey.panelContentHealthLinkStatusBroken)}
            />
            <button
              className='text-[var(--vscode-problemsErrorIcon-foreground)] hover:underline cursor-pointer bg-transparent border-0 p-0 text-sm text-left truncate max-w-full hover:bg-transparent active:outline-0 focus:outline-0'
              title={localize(LocalizationKey.panelContentHealthSelectInDocument, link.url)}
              onClick={() => handleSelect(link.url)}
            >
              {truncate(link.url)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

BrokenExternalLinks.displayName = 'BrokenExternalLinks';
export { BrokenExternalLinks };
