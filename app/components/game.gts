import Component from '@glimmer/component';
import { service } from '@ember/service';
import { cached } from '@glimmer/tracking';
import { tracked } from 'ember-deep-tracked';

import { words } from './words';

interface Args {
  // year-month-day
  day: string;
}

export default class Game extends Component<Args> {
  wordList = words(this);

  @cached
  get todaysWord() {
    let { answers }  = this.wordList;

    let index = toDate(this.args.day).getTime() % answers.length;

    return answers[index];
  }

  @cached
  get state() {
    return initialStateFor(this.args.day);
  }


  <template>
    {{this.todaysWord}}

  </template>
}

function initialStateFor(day) {
  return {};
}

function toDate(dayString: string) {
  let [year, month, day] = dayString.split('-');
  let date = new Date(year, month, day);

  return date;
}
