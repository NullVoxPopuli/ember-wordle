import { tracked } from 'ember-deep-tracked';

import { focusNext } from './focus';

import type { Attempt, Board, Letter } from './types';

export function colorForLetter(letter: Letter, attempt: Attempt) {
  if (attempt.isFrozen) {
    if (letter.isInCorrectPosition) {
      return 'bg-green-400';
    }

    if (letter.isInAnswer) {
      return 'bg-yellow-500';
    }

    return 'bg-gray-400';
  }

  return 'disabled:bg-gray-100';
}

export function handleKeyDown(keyEvent: KeyboardEvent) {
  let { key } = keyEvent;

  if (/^[a-z]$/.test(key)) {
    // we don't want to let a letter be typed until keyup
    keyEvent.preventDefault();

    return;
  }

  if (key.length === 1) {
    // prevent numbers, symbols, etc
    keyEvent.preventDefault();
  }
}

export function handleKey(letter: Letter, keyEvent: KeyboardEvent) {
  let { key } = keyEvent;

  if (key === 'Backspace') {
    letter.value = '';

    return;
  }

  if (/^[a-z]$/.test(key)) {
    letter.value = key;
    focusNext();
  }
}

/**
 * 5 columns (5 letter words)
 * 6 rows (6 potential guesses)
 */
export function initialStateFor(day: string) {
  console.debug(`Generating blank game board for ${day}`);

  let grid = Array.from({ length: 6 }, () => {
    return {
      isFrozen: false,
      letters: Array.from({ length: 5 }, () => ({
        value: '',
        isInAnswer: false,
        isInCorrectPosition: false,
      })),
    };
  });

  return tracked(grid);
}

export function isAttemptComplete(attempt: Attempt) {
  return attempt.letters.every((letter) => letter.value);
}

export function isAttemptActive(board: Board, attempt: Attempt) {
  let index = board.indexOf(attempt);

  // How in the world can this be -1?
  if (index < 0) {
    index = 0;
  }

  let lastFrozenIndex = -1;

  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i].isFrozen) {
      lastFrozenIndex = i;
    }
  }

  return index === lastFrozenIndex + 1;
}

export function wordFor(attempt: Attempt) {
  return attempt.letters.map((letter) => letter.value).join('');
}

interface GuessOptions {
  onError: (msg: string) => void;
  answer: string;
  all: string[];
}

export function guess(attempt: Attempt, { answer, all, onError }: GuessOptions) {
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

  // Gotta give time for the next row to un-disable
  requestAnimationFrame(() => {
    focusNext();
  });
}
