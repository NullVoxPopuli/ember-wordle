import type { Attempt, Board, Letter } from './types';

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

      break;
    }
  }

  return index === lastFrozenIndex + 1;
}

export function wordFor(attempt: Attempt) {
  return attempt.letters.map((letter) => letter.value).join('');
}

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
