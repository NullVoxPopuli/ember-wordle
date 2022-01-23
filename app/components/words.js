// TODO: upgrade to 4.0.0+
// See: https://github.com/NullVoxPopuli/ember-wordle/issues/2
import { Resource, useFunction as untrackedFunction, useResource } from 'ember-resources';

export function words(destroyable) {
  return useResource(destroyable, Words);
}

class Words extends Resource {
  wordList = untrackedFunction(this, async () => {
    return await import(/* webpackIgnore */ '/words.js');
  });

  get answers() {
    return this.wordList.value?.answers ?? [];
  }

  get all() {
    return this.wordList.value?.allWords ?? [];
  }
}
