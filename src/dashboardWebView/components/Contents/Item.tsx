import { useRecoilValue } from 'recoil';
import { MarkdownIcon } from '../../../panelWebView/components/Icons/MarkdownIcon';
import { Page } from '../../models/Page';
import { SettingsSelector, ViewSelector } from '../../state';
import { DateField } from '../Common/DateField';
import { DashboardViewType } from '../../models';
import { ContentActions } from './ContentActions';
import { useMemo } from 'react';
import { Status } from './Status';
import * as React from 'react';
import useExtensibility from '../../hooks/useExtensibility';
import * as l10n from '@vscode/l10n';
import { LocalizationKey } from '../../../localization';
import useCard from '../../hooks/useCard';
import { I18nLabel } from './I18nLabel';
import { ItemSelection } from '../Common/ItemSelection';
import { openFile } from '../../utils';
import { FooterActions } from './FooterActions';
import useSelectedItems from '../../hooks/useSelectedItems';
import { cn } from '../../../utils/cn';
import { Tags } from './Tags';

export interface IItemProps extends Page { }

const PREVIEW_IMAGE_FIELD = 'fmPreviewImage';

export const Item: React.FunctionComponent<IItemProps> = ({
  ...pageData
}: React.PropsWithChildren<IItemProps>) => {
  const { selectedFiles } = useSelectedItems();
  const view = useRecoilValue(ViewSelector);
  const settings = useRecoilValue(SettingsSelector);
  const draftField = useMemo(() => settings?.draftField, [settings]);
  const cardFields = useMemo(() => settings?.dashboardState?.contents?.cardFields, [settings?.dashboardState?.contents?.cardFields]);
  const { escapedTitle, escapedDescription } = useCard(pageData, settings?.dashboardState?.contents?.cardFields);
  const { titleHtml, descriptionHtml, dateHtml, statusHtml, tagsHtml, imageHtml, footerHtml } = useExtensibility({
    fmFilePath: pageData.fmFilePath,
    date: pageData.date,
    title: pageData.title,
    description: pageData.description,
    type: pageData.fmContentType,
    pageData
  });

  const isSelected = useMemo(() => selectedFiles.includes(pageData.fmFilePath), [selectedFiles, pageData.fmFilePath]);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [tagsExpanded, setTagsExpanded] = React.useState(false);

  const onOpenFile = React.useCallback(() => {
    openFile(pageData.fmFilePath);
  }, [pageData.fmFilePath]);

  const tags: string[] | undefined = useMemo(() => {
    if (!settings?.dashboardState?.contents?.tags) {
      return undefined;
    }

    const tagField = settings.dashboardState.contents.tags;
    let tagsValue = [];

    if (tagField === 'tags') {
      tagsValue = pageData.fmTags;
    } else if (tagField === 'categories') {
      tagsValue = pageData.fmCategories;
    } else {
      tagsValue = pageData[tagField] || [];
    }

    if (typeof tagsValue === 'string') {
      return [tagsValue];
    } else if (Array.isArray(tagsValue)) {
      const items = tagsValue.map(t => typeof t === 'string' ? t : undefined);
      return items.filter(t => t !== undefined) as string[];
    }

    return [];
  }, [settings, pageData]);

  const statusPlaceholder = useMemo(() => {
    if (!statusHtml && !cardFields?.state) {
      return null;
    }

    return (
      statusHtml ? (
        <div dangerouslySetInnerHTML={{ __html: statusHtml }} />
      ) : (
        cardFields?.state && draftField && draftField.name && typeof pageData[draftField.name] !== 'undefined'
          ? <Status draft={pageData[draftField.name]} published={pageData.fmPublished} />
          : null
      )
    );
  }, [statusHtml, cardFields?.state, draftField, pageData]);

  const datePlaceholder = useMemo(() => {
    if (!dateHtml && !cardFields?.date) {
      return null;
    }

    return (
      dateHtml ? (
        <div dangerouslySetInnerHTML={{ __html: dateHtml }} />
      ) : (
        cardFields?.date && pageData.date
          ? <DateField value={pageData.date} format={pageData.fmDateFormat} />
          : null
      )
    );
  }, [dateHtml, cardFields?.date, pageData]);

  if (view === DashboardViewType.Grid) {
    return (
      <li className="relative">
        <div
          className={cn(
            `group flex flex-col w-full text-left`,
            `min-h-[342px] h-full`,
            `rounded-[9px]`,
            `overflow-hidden`,
            `border`,
            `shadow-[0_1px_2px_rgba(0,0,0,.3)]`,
            `hover:shadow-[0_8px_24px_rgba(0,0,0,.35)]`,
            `transform-gpu`,
            `hover:-translate-y-0.5`,
            `transition duration-150 ease-out`,
            menuOpen && `shadow-[0_8px_24px_rgba(0,0,0,.35)] -translate-y-0.5`,
            isSelected
              ? `border-[var(--fm-accent-line)]`
              : cn(`border-[var(--fm-border)] hover:border-[var(--fm-border-hi)]`, menuOpen && `border-[var(--fm-border-hi)]`)
          )}
          style={{ backgroundColor: 'var(--fm-surface-2)' }}
        >
          {/* ── Cover ─────────────────────────────────────────── */}
          <div className={`relative h-[120px] flex-shrink-0 overflow-hidden rounded-t-[9px]`}>
            <button
              title={escapedTitle ? l10n.t(LocalizationKey.commonOpenWithValue, escapedTitle) : l10n.t(LocalizationKey.commonOpen)}
              onClick={onOpenFile}
              className={`absolute inset-0 cursor-pointer`}
            >
              {imageHtml ? (
                <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: imageHtml }} />
              ) : pageData[PREVIEW_IMAGE_FIELD] ? (
                <img
                  src={`${pageData[PREVIEW_IMAGE_FIELD]}`}
                  alt={escapedTitle || ''}
                  className="absolute inset-0 h-full w-full object-cover object-left-top group-hover:brightness-75 transition-[filter] duration-150"
                  loading="lazy"
                />
              ) : (
                <div
                  className={`h-full flex items-center justify-center`}
                  style={{ backgroundColor: 'var(--fm-surface-3)' }}
                >
                  <MarkdownIcon className={`h-24 opacity-20 text-[var(--fm-text-mid)]`} />
                </div>
              )}
            </button>

            {/* ⋮ context menu — comes after the button in DOM so it receives pointer events */}
            <ContentActions
              path={pageData.fmFilePath}
              relPath={pageData.fmRelFileWsPath}
              contentType={pageData.fmContentType}
              locale={pageData.fmLocale}
              isDefaultLocale={pageData.fmDefaultLocale}
              translations={pageData.fmTranslations}
              scripts={settings?.scripts}
              onOpen={onOpenFile}
              onMenuOpenChange={setMenuOpen}
            />
          </div>

          {/* Checkbox — absolutely positioned to li.relative, appears in cover area */}
          <ItemSelection filePath={pageData.fmFilePath} />

          {/* ── Body ──────────────────────────────────────────── */}
          <div className={`flex flex-col flex-1 px-3 pt-3 pb-1 min-h-0 gap-1 ${tagsExpanded ? '' : 'overflow-hidden'}`}>
            <I18nLabel page={pageData} />

            {/* Status dot + date row */}
            {(statusPlaceholder || datePlaceholder) && (
              <div className="flex items-center justify-between gap-2 mb-2 flex-shrink-0">
                <div>{statusPlaceholder}</div>
                <div>{datePlaceholder}</div>
              </div>
            )}

            {/* Title — hero text */}
            <button
              title={escapedTitle ? l10n.t(LocalizationKey.commonOpenWithValue, escapedTitle) : l10n.t(LocalizationKey.commonOpen)}
              onClick={onOpenFile}
              className={`text-left flex-shrink-0 mb-1`}
            >
              {titleHtml ? (
                <div dangerouslySetInnerHTML={{ __html: titleHtml }} />
              ) : (
                <h2
                  className="text-[15px] font-semibold leading-snug line-clamp-2"
                  style={{ color: 'var(--fm-text-hi)', fontWeight: 650 }}
                >
                  {escapedTitle}
                </h2>
              )}
            </button>

            {/* Description */}
            {(escapedDescription || descriptionHtml) && (
              <button
                title={escapedTitle ? l10n.t(LocalizationKey.commonOpenWithValue, escapedTitle) : l10n.t(LocalizationKey.commonOpen)}
                onClick={onOpenFile}
                className={`text-left flex-shrink-0`}
              >
                {descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                ) : (
                  <p className={`text-xs line-clamp-2`} style={{ color: 'var(--fm-text-mid)' }}>
                    {escapedDescription}
                  </p>
                )}
              </button>
            )}

            {/* Spacer pushes tags to bottom of body */}
            <div className="flex-1" />

            {/* Tags — single row, no wrap */}
            {tagsHtml ? (
              <div dangerouslySetInnerHTML={{ __html: tagsHtml }} />
            ) : (
              <Tags values={tags} tagField={settings?.dashboardState?.contents?.tags} onExpandChange={setTagsExpanded} />
            )}

            {/* Optional custom metadata from extensibility */}
            {footerHtml && (
              <div
                className="mt-2 min-w-0 text-[0.7rem] leading-none overflow-hidden whitespace-nowrap"
                style={{ color: 'var(--fm-text-lo)', fontFamily: 'var(--fm-mono)' }}
              >
                <div
                  className="placeholder__card__footer"
                  style={{ display: 'block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  dangerouslySetInnerHTML={{ __html: footerHtml }}
                />
              </div>
            )}
          </div>

          {/* ── Footer ────────────────────────────────────────── */}
          <div
            className="flex items-center justify-end gap-2 px-3 py-2 flex-shrink-0 rounded-b-[9px] overflow-hidden"
            style={{ borderTop: '1px solid var(--fm-border)' }}
          >
            {/* Right: quick actions — fade in on hover */}
            <div className={cn("shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-150", menuOpen && "opacity-100")}>
              <FooterActions
                filePath={pageData.fmFilePath}
                contentType={pageData.fmContentType}
                websiteUrl={settings?.websiteUrl}
                scripts={settings?.scripts}
                compact
                onMenuOpenChange={setMenuOpen}
              />
            </div>
          </div>
        </div>
      </li>
    );
  } else if (view === DashboardViewType.List) {
    return (
      <li className="relative">
        <div
          className={`px-5 cursor-pointer w-full text-left grid grid-cols-12 gap-x-4 sm:gap-x-6 xl:gap-x-8 py-2 border-b hover:bg-opacity-70`}
          style={{
            borderColor: 'var(--fm-border)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--fm-surface-3)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent')}
        >
          <div className="col-span-8 truncate flex items-center space-x-4" style={{ color: 'var(--fm-text-hi)', fontWeight: 600 }}>
            <ItemSelection filePath={pageData.fmFilePath} show />

            <button
              title={escapedTitle ? l10n.t(LocalizationKey.commonOpenWithValue, escapedTitle) : l10n.t(LocalizationKey.commonOpen)}
              onClick={onOpenFile}>
              {escapedTitle}
            </button>

            <ContentActions
              path={pageData.fmFilePath}
              relPath={pageData.fmRelFileWsPath}
              contentType={pageData.fmContentType}
              scripts={settings?.scripts}
              onOpen={onOpenFile}
              listView
            />
          </div>
          <div className="col-span-2" style={{ fontFamily: 'var(--fm-mono)', fontSize: '0.75rem', color: 'var(--fm-text-lo)' }}>
            <DateField value={pageData.date} />
          </div>
          <div className="col-span-2">
            {draftField && draftField.name && <Status draft={pageData[draftField.name]} published={pageData.fmPublished} />}
          </div>
        </div>
      </li>
    );
  }

  return null;
};
