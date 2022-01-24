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

  // Are any letters in the correct position?
  for (let letter of attempt.letters) {
    if (answer.includes(letter.value)) {
      letter.isInAnswer = true;

      if (answer.indexOf(letter.value) === word.indexOf(letter.value)) {
        letter.isInCorrectPosition = true;
      }
    }
  }

  attempt.isFrozen = true;

  if (word === answer) {
    console.log('Congratulations');

    document.activeElement?.blur();
    onWin();

    return;
  }

  // Gotta give time for the next row to un-disable
  requestAnimationFrame(() => {
    focusNext();
  });
}
