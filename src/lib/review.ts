/**
 * Shared model for "review your answers" at the end of a practice session.
 * Every quiz/game records a list of these as the learner answers, then shows
 * them via the ReviewList component. Pure data + helpers so the logic is testable.
 */
export interface ReviewItem {
  /** The thing asked: a word, a sentence, or a question. */
  prompt: string;
  emoji?: string;
  /** What the learner chose (article or option text); "" if unanswered / timed out. */
  picked: string;
  /** The correct answer (article or option text). */
  correct: string;
  isCorrect: boolean;
}

/** Tally of a review log. */
export function reviewStats(items: ReviewItem[]): { total: number; correct: number; wrong: number } {
  const correct = items.reduce((n, it) => n + (it.isCorrect ? 1 : 0), 0);
  return { total: items.length, correct, wrong: items.length - correct };
}

/** The items to show, optionally narrowed to just the ones the learner got wrong. */
export function filterReview(items: ReviewItem[], mistakesOnly: boolean): ReviewItem[] {
  return mistakesOnly ? items.filter(it => !it.isCorrect) : items;
}
