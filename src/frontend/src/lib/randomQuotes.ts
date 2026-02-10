import { quotes } from '@/data/quotes';

/**
 * Selects 2-3 random quotes without repetition within a single selection
 * @param count Number of quotes to select (2 or 3)
 * @returns Array of selected quote strings
 */
export function selectRandomQuotes(count: 2 | 3 = 3): string[] {
  // Create a copy of the quotes array to avoid mutating the original
  const availableQuotes = [...quotes];
  const selected: string[] = [];

  // Ensure we don't try to select more quotes than available
  const numToSelect = Math.min(count, availableQuotes.length);

  for (let i = 0; i < numToSelect; i++) {
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    selected.push(availableQuotes[randomIndex]);
    // Remove selected quote to prevent repetition
    availableQuotes.splice(randomIndex, 1);
  }

  return selected;
}
