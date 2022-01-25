import { tracked } from 'ember-deep-tracked';

import { focusNext, focusPrevious } from '../focus';
import { isAttemptComplete, isMobile, wordFor } from './queries';

import type { Attempt, Letter } from './types';

export function handleKeyDown(letter: Letter, keyEvent: KeyboardEvent) {
  let { key } = keyEvent;

  // Older android browsers...
  if (key === 'Unidentified') {
    return;
  }

  if (key === 'Backspace') {
    keyEvent.preventDefault();
    letter.value = '';

    focusPrevious();

    return;
  }

  if (/^[a-z]$/.test(key.toLowerCase())) {
    keyEvent.preventDefault();

    letter.value = key.toLowerCase();
    focusNext();

    return;
  }

  if (key.length === 1) {
    // prevent numbers, symbols, etc
    keyEvent.preventDefault();
  }
}

export function handleInput(letter: Letter, keyEvent: KeyboardEvent) {
  if (isMobile()) {
    // Hack for old android
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    keyEvent.key = keyEvent.data;

    return handleKeyDown(letter, keyEvent);
  }
}

const NUM_LETTERS = 5;
const NUM_GUESSES = 6;

/**
 * 5 columns (5 letter words)
 * 6 rows (6 potential guesses)
 */
export function initialStateFor(day: string) {
  console.debug(`Generating blank game board for ${day}`);

  let grid = [];

  for (let attemptIndex = 0; attemptIndex < NUM_GUESSES; attemptIndex++) {
    let attempt = {
      _debugId: attemptIndex,
      isFrozen: false,
      letters: Array.from({ length: NUM_LETTERS }, () => ({
        value: '',
        isInAnswer: false,
        isInCorrectPosition: false,
      })),
    };

    grid.push(attempt);
  }

  return tracked(grid);
}

interface GuessOptions {
  onError: (msg: string) => void;
  onWin: () => void;
  answer: string;
  all: string[];
}

export function guess(attempt: Attempt, { answer, all, onError, onWin }: GuessOptions) {
  if (!answer) {
    // how likely is it that someone submits something before we figure out what the word is?
    onError('Something went wrong, there is no word today');

    return;
  }

  if (!isAttemptComplete(attempt)) {
    onError('All 5 letters must be entered');

    return;
  }

  let word = wordFor(attempt);

  if (!all.includes(word)) {
    onError('Not in word list');

    return;
  }

  let answerOccurrences = getLetterOccurrences(answer);

  // Are any letters in the correct position?
  checkOccurrences(attempt, answer, answerOccurrences, true);
  // Are there any occurrences remaining that are in the wrong position?
  checkOccurrences(attempt, answer, answerOccurrences, false);

  attempt.isFrozen = true;

  if (word === answer) {
    console.debug('Congratulations');

    let element = document.activeElement;

    if (element instanceof HTMLElement) {
      element.blur();
    }

    onWin();

    return;
  }

  // Gotta give time for the next row to un-disable
  requestAnimationFrame(() => {
    focusNext();
  });
}

function getLetterOccurrences(word: string) {
  let result: Record<string, number> = {};

  for (let letter of word.split('')) {
    result[letter] = (result[letter] || 0) + 1;
  }

  return result;
}

function checkOccurrences(
  attempt: Attempt,
  answer: string,
  answerOccurrences: Record<string, number>,
  checkPosition: boolean
) {
  attempt.letters.forEach((letter, index) => {
    let occurrences = answerOccurrences[letter.value];
    let word = wordFor(attempt);

    if (occurrences) {
      if (checkPosition && answer[index] === word[index]) {
        letter.isInCorrectPosition = true;
        answerOccurrences[letter.value]--;
        letter.isInAnswer = true;
      } else if (!checkPosition) {
        answerOccurrences[letter.value]--;
        letter.isInAnswer = true;
      }
    }
  });
}
