import cleanCodeCover from '../../../assets/covers/clean-code.jpg';
import designPatternsCover from '../../../assets/covers/design-patterns.jpg';
import algorithmsCover from '../../../assets/covers/algorithms-clrs.jpg';
import microeconomicsCover from '../../../assets/covers/microeconomics.jpg';
import blueOceanCover from '../../../assets/covers/blue-ocean.jpg';
import grammarInUseCover from '../../../assets/covers/grammar-in-use.jpg';
import oxfordDictCover from '../../../assets/covers/oxford-dictionary.jpg';
import dataIntensiveCover from '../../../assets/covers/data-intensive.jpg';
import corporateFinanceCover from '../../../assets/covers/corporate-finance.jpg';
import vocabInUseCover from '../../../assets/covers/vocab-in-use.jpg';
import refactoringCover from '../../../assets/covers/refactoring.jpg';
import thinkingFastSlowCover from '../../../assets/covers/thinking-fast-slow.jpg';

export const famousBookCovers: Record<string, string> = {
  b1: cleanCodeCover,
  b2: designPatternsCover,
  b3: algorithmsCover,
  b4: microeconomicsCover,
  b5: blueOceanCover,
  b6: grammarInUseCover,
  b7: oxfordDictCover,
  b8: dataIntensiveCover,
  b9: corporateFinanceCover,
  b10: vocabInUseCover,
  b11: refactoringCover,
  b12: thinkingFastSlowCover,
};

export function getBookCover(id: string, fallbackUrl?: string): string {
  return famousBookCovers[id] || fallbackUrl || cleanCodeCover;
}

