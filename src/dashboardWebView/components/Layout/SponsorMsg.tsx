import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import * as React from 'react';
import { REVIEW_LINK, SPONSOR_LINK } from '../../../constants';
import { VersionInfo } from '../../../models';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';

export interface ISponsorMsgProps {
  beta: boolean | undefined;
  version: VersionInfo | undefined;
  isBacker: boolean | undefined;
  topContent?: React.ReactNode;
}

interface ISponsorLinkProps {
  title: string;
  href: string;
}

const SponsorLink: React.FunctionComponent<ISponsorLinkProps> = ({ title, href, children }: React.PropsWithChildren<ISponsorLinkProps>) => {
  return (
    <a
      className={`group inline-flex items-center gap-2 opacity-60 hover:opacity-100 text-[var(--fm-text-lo)] hover:text-[var(--vscode-textLink-foreground)] transition-opacity duration-150`}
      href={href}
      title={title}
    >
      {children}
    </a>
  );
}

export const SponsorMsg: React.FunctionComponent<ISponsorMsgProps> = ({
  beta,
  isBacker,
  topContent,
  version
}: React.PropsWithChildren<ISponsorMsgProps>) => {
  return (
    <div className='w-full border-t bg-[var(--vscode-editor-background)] border-[var(--frontmatter-border)]'>
      {topContent && (
        <div className='px-4 py-2 border-b border-[var(--frontmatter-border)]'>
          {topContent}
        </div>
      )}

      <footer
        className={`w-full px-4 py-2 text-xs sm:text-sm flex items-center gap-4 ${isBacker ? 'justify-center' : 'justify-between'} text-[var(--fm-text-xlo)]`}
      >
        {isBacker ? (
          <span>
            Front Matter
            {version ? ` (v${version.installedVersion}${!!beta ? ` BETA` : ''})` : ''}
          </span>
        ) : (
          <>
            <SponsorLink
              title={l10n.t(LocalizationKey.dashboardLayoutSponsorSupportMsg)}
              href={SPONSOR_LINK}>
              <span>{l10n.t(LocalizationKey.commonSupport)}</span>
              <HeartIcon className={`h-4 w-4 group-hover:fill-current`} />
            </SponsorLink>
            <span className='truncate'>
              Front Matter
              {version ? ` (v${version.installedVersion}${!!beta ? ` BETA` : ''})` : ''}
            </span>
            <SponsorLink
              title={l10n.t(LocalizationKey.dashboardLayoutSponsorReviewMsg)}
              href={REVIEW_LINK}>
              <StarIcon className={`h-4 w-4 group-hover:fill-current`} />
              <span>{l10n.t(LocalizationKey.dashboardLayoutSponsorReviewLabel)}</span>
            </SponsorLink>
          </>
        )}
      </footer>
    </div>
  );
};
