export type ReadabilityLabel = 'veryEasy' | 'easy' | 'standard' | 'difficult' | 'veryDifficult';

export interface ReadabilityResult {
  score: number;
  label: ReadabilityLabel;
  /** Average number of words per sentence (target ≤ 20) */
  avgWordsPerSentence: number;
  /** Average number of syllables per word (target ≤ 1.5) */
  avgSyllablesPerWord: number;
}

export class ReadabilityHelper {
  /**
   * Strip markdown syntax to get plain text for analysis.
   */
  private static stripMarkdown(text: string): string {
    return text
      .replace(/!\[.*?\]\(.*?\)/g, '') // images
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text only
      .replace(/#{1,6}\s/g, '') // headings
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline + fenced code
      .replace(/```[\s\S]*?```/g, '') // fenced blocks
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
      .replace(/>\s/g, '') // blockquotes
      .replace(/[-*+]\s/g, '') // list bullets
      .replace(/\d+\.\s/g, '') // numbered lists
      .replace(/\r?\n/g, ' ') // line breaks → space
      .replace(/\s{2,}/g, ' ') // collapse whitespace
      .trim();
  }

  private static countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 2) {
      return 1;
    }
    // Remove silent trailing 'e'
    word = word.replace(/e$/, '');
    const vowelGroups = word.match(/[aeiouy]+/g);
    return Math.max(1, vowelGroups ? vowelGroups.length : 1);
  }

  private static countSentences(text: string): number {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    return Math.max(1, sentences ? sentences.length : 1);
  }

  private static labelFromScore(score: number): ReadabilityLabel {
    if (score >= 80) {
      return 'veryEasy';
    }
    if (score >= 60) {
      return 'easy';
    }
    if (score >= 30) {
      return 'standard';
    }
    if (score >= 10) {
      return 'difficult';
    }
    return 'veryDifficult';
  }

  /**
   * Calculates the Flesch Reading Ease score for the given markdown text.
   * Score ranges: ≥80 Very Easy, 60–79 Easy, 30–59 Standard, 10–29 Difficult, <10 Very Difficult
   */
  public static analyze(markdownText: string): ReadabilityResult {
    const plain = ReadabilityHelper.stripMarkdown(markdownText);

    const words = plain.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;

    if (wordCount < 5) {
      return {
        score: 0,
        label: 'veryDifficult',
        avgWordsPerSentence: 0,
        avgSyllablesPerWord: 0
      };
    }

    const sentenceCount = ReadabilityHelper.countSentences(plain);
    const syllableCount = words.reduce((sum, w) => sum + ReadabilityHelper.countSyllables(w), 0);

    const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;
    const avgSyllablesPerWord = Math.round((syllableCount / wordCount) * 100) / 100;

    const score =
      206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);

    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    return {
      score: clamped,
      label: ReadabilityHelper.labelFromScore(clamped),
      avgWordsPerSentence,
      avgSyllablesPerWord
    };
  }
}
