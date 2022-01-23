export interface Letter {
  value: string;
  isInAnswer: boolean;
  isInCorrectPosition: boolean;
}

export interface Attempt {
  isFrozen: boolean;
  letters: [Letter, Letter, Letter, Letter, Letter];
}

export type Board = [Attempt, Attempt, Attempt, Attempt, Attempt, Attempt];
