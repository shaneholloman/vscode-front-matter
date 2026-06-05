import { Messenger } from '@estruyf/vscode/dist/client';
import * as React from 'react';
import { CommandToCode } from '../../CommandToCode';
import { LocalizationKey, localize } from '../../../localization';
import type { LinkValidationResult } from '../../../helpers/LinkValidator';

interface Props {
  internalLinks: LinkValidationResult[];
}

const truncate = (url: string, max = 40): string =>
  url.length > max ? `${url.slice(0, max)}…` : url;

const InternalLinks: React.FunctionComponent<Props> = ({ internalLinks }) => {
  if (!internalLinks || internalLinks.length === 0) {
    return null;
  }

  const handleSelect = (url: string) => {
    Messenger.send(CommandToCode.selectInDocument, url);
  };

  const invalidLinks = React.useMemo(() => internalLinks.filter(link => !link.exists), [internalLinks]);

  if (!invalidLinks || invalidLinks.length === 0) {
    return null;
  }

  return (
    <div className='mt-2'>
      <p className='text-sm font-semibold text-[var(--vscode-descriptionForeground)] uppercase mb-1'>
        {localize(LocalizationKey.panelArticleDetailsInternalLinks)}
      </p>
      <ul className='space-y-1'>
        {invalidLinks.map((link) => (
          <li
            key={link.url}
            className={`flex items-center gap-1 text-sm ${link.exists
              ? 'text-[var(--vscode-foreground)]'
              : 'text-[var(--vscode-problemsErrorIcon-foreground)]'
              }`}
          >
            <span
              className={`shrink-0 w-2 h-2 rounded-full ${link.exists
                ? 'bg-[var(--vscode-testing-iconPassed)]'
                : 'bg-[var(--vscode-problemsErrorIcon-foreground)]'
                }`}
              title={
                link.exists
                  ? localize(LocalizationKey.panelContentHealthLinkStatusValid)
                  : localize(LocalizationKey.panelContentHealthLinkStatusBroken)
              }
            />
            <button
              className='text-[var(--vscode-problemsErrorIcon-foreground)] hover:underline cursor-pointer bg-transparent border-0 p-0 text-sm text-left truncate max-w-full hover:bg-transparent active:outline-0 focus:outline-0'
              title={localize(LocalizationKey.panelContentHealthSelectInDocument, link.url)}
              onClick={() => handleSelect(link.url)}
            >
              {truncate(link.url)}
              {!link.exists && (
                <span className='ml-1 opacity-70'>
                  {localize(LocalizationKey.panelContentHealthLinkNotFound)}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

InternalLinks.displayName = 'InternalLinks';
export { InternalLinks };
