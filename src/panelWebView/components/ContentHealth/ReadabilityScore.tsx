import * as React from 'react';
import { messageHandler } from '@estruyf/vscode/dist/client';
import { VSCodeTableCell, VSCodeTableRow } from '../VSCode/VSCodeTable';
import { CommandToCode } from '../../CommandToCode';
import { useRecoilValue } from 'recoil';
import { PanelSettingsAtom } from '../../state';
import { CopilotIcon } from '../Icons';
import { LocalizationKey, localize } from '../../../localization';
import type { ReadabilityLabel, ReadabilityResult } from '../../../helpers/ReadabilityHelper';

// Targets from Flesch formula: shorter sentences and simpler words both raise the score
const TARGET_WORDS_PER_SENTENCE = 20;
const TARGET_SYLLABLES_PER_WORD = 1.5;

interface Props {
  readability: ReadabilityResult;
  minScore: number;
}

const scoreColor = (score: number, isLow: boolean): string => {
  if (isLow) { return 'text-[var(--vscode-problemsWarningIcon-foreground)]'; }
  if (score >= 60) { return 'text-[var(--vscode-testing-iconPassed)]'; }
  if (score >= 30) { return 'text-[var(--vscode-problemsWarningIcon-foreground)]'; }
  return 'text-[var(--vscode-problemsErrorIcon-foreground)]';
};

const localizedReadabilityLabel = (label: ReadabilityLabel): string => {
  switch (label) {
    case 'veryEasy':
      return localize(LocalizationKey.panelContentHealthReadabilityLevelVeryEasy);
    case 'easy':
      return localize(LocalizationKey.panelContentHealthReadabilityLevelEasy);
    case 'standard':
      return localize(LocalizationKey.panelContentHealthReadabilityLevelStandard);
    case 'difficult':
      return localize(LocalizationKey.panelContentHealthReadabilityLevelDifficult);
    default:
      return localize(LocalizationKey.panelContentHealthReadabilityLevelVeryDifficult);
  }
};

const ReadabilityScore: React.FunctionComponent<Props> = ({ readability, minScore }) => {
  const settings = useRecoilValue(PanelSettingsAtom);
  const isLow = minScore > 0 && readability.score < minScore;

  const sentencesTooLong = readability.avgWordsPerSentence > TARGET_WORDS_PER_SENTENCE;
  const wordsTooComplex = readability.avgSyllablesPerWord > TARGET_SYLLABLES_PER_WORD;

  const optimizeReadability = (type: 'sentence' | 'word') => {
    const command =
      type === 'sentence'
        ? CommandToCode.copilotOptimizeAvgSentence
        : CommandToCode.copilotOptimizeAvgWord;

    messageHandler
      .request<boolean>(command)
      .catch(() => {
        // Errors are surfaced via the extension message pipeline.
      })
  };

  return (
    <>
      <VSCodeTableRow>
        <VSCodeTableCell>{localize(LocalizationKey.panelContentHealthReadabilityLabel)}</VSCodeTableCell>
        <VSCodeTableCell>
          <span className={`font-semibold ${scoreColor(readability.score, isLow)}`}>
            {readability.score}
          </span>
          <span className='text-[var(--vscode-descriptionForeground)] ml-1'>
            / 100 &mdash; {localizedReadabilityLabel(readability.label)}
            {isLow && (
              <span className='ml-1 text-[var(--vscode-problemsWarningIcon-foreground)]'>
                {localize(LocalizationKey.panelContentHealthReadabilityBelowThreshold, minScore)}
              </span>
            )}
          </span>
        </VSCodeTableCell>
      </VSCodeTableRow>

      <VSCodeTableRow>
        <VSCodeTableCell>{localize(LocalizationKey.panelContentHealthReadabilityAvgSentence)}</VSCodeTableCell>
        <VSCodeTableCell>
          <div className='flex items-center justify-between gap-1'>
            <div>
              <span className={sentencesTooLong ? 'text-[var(--vscode-problemsWarningIcon-foreground)]' : 'text-[var(--vscode-testing-iconPassed)]'}>
                {localize(
                  LocalizationKey.panelContentHealthReadabilityWords,
                  readability.avgWordsPerSentence
                )}
              </span>
              <span className='text-[var(--vscode-descriptionForeground)] ml-1'>
                {localize(
                  LocalizationKey.panelContentHealthReadabilityTarget,
                  TARGET_WORDS_PER_SENTENCE
                )}
              </span>
            </div>

            {settings?.copilotEnabled && sentencesTooLong && (
              <button
                className="metadata_field__title__action inline-block text-[var(--vscode-editor-foreground)] disabled:opacity-50"
                title={localize(LocalizationKey.panelContentHealthReadabilityCopilotOptimizeSentence)}
                type='button'
                onClick={() => optimizeReadability('sentence')}
              >
                <CopilotIcon />
              </button>
            )}
          </div>



          {sentencesTooLong && (
            <p className='text-xs text-[var(--vscode-descriptionForeground)] mt-0.5'>
              {localize(LocalizationKey.panelContentHealthReadabilityHintSentence)}
            </p>
          )}
        </VSCodeTableCell>
      </VSCodeTableRow>

      <VSCodeTableRow>
        <VSCodeTableCell>{localize(LocalizationKey.panelContentHealthReadabilityAvgWord)}</VSCodeTableCell>
        <VSCodeTableCell>
          <div className='flex items-center justify-between gap-1'>
            <div>
              <span className={wordsTooComplex ? 'text-[var(--vscode-problemsWarningIcon-foreground)]' : 'text-[var(--vscode-testing-iconPassed)]'}>
                {localize(
                  LocalizationKey.panelContentHealthReadabilitySyllables,
                  readability.avgSyllablesPerWord
                )}
              </span>

              <span className='text-[var(--vscode-descriptionForeground)] ml-1'>
                {localize(
                  LocalizationKey.panelContentHealthReadabilityTarget,
                  TARGET_SYLLABLES_PER_WORD
                )}
              </span>
            </div>

            {settings?.copilotEnabled && wordsTooComplex && (
              <button
                className="metadata_field__title__action inline-block text-[var(--vscode-editor-foreground)] disabled:opacity-50"
                title={localize(LocalizationKey.panelContentHealthReadabilityCopilotOptimizeWord)}
                type='button'
                onClick={() => optimizeReadability('word')}
              >
                <CopilotIcon />
              </button>
            )}
          </div>

          {wordsTooComplex && (
            <p className='text-xs text-[var(--vscode-descriptionForeground)] mt-0.5'>
              {localize(LocalizationKey.panelContentHealthReadabilityHintWord)}
            </p>
          )}
        </VSCodeTableCell>
      </VSCodeTableRow>
    </>
  );
};

ReadabilityScore.displayName = 'ReadabilityScore';
export { ReadabilityScore };
