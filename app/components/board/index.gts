import Component from '@glimmer/component';
import { tracked, cached } from '@glimmer/tracking';

import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import Success from './success';

import { toBase64, findTodaysWord } from './utils';
import { words } from './words';
import { isAttemptActive, colorForLetter } from './state/queries';
import { handleKeyDown, initialStateFor, guess } from './state/actions';

interface Args {
  // year-month-day
  day: string;
}


const not = (item) => !item;

const Letter = <template>

  <input
    disabled={{not @active}}
    class="
      border border-2 border-gray-300 h-16 w-16 text-center text-3xl uppercase
      rounded
      outline-none
      focus:ring-offset-2 focus:ring-4 ring-blue-400 ring-offset-slate-50
      focus:border-1 focus:border-gray-100
      {{colorForLetter @letter @attempt}}
      {{if @attempt.isFrozen 'font-bold text-white' 'text-black'}}
    "
    pattern="[a-z]{1}"
    value={{@letter.value}}
    {{on 'keydown' (fn handleKeyDown @letter)}}
  >

</template>;

const Row = <template>

  {{#let (isAttemptActive @board @attempt) as |isActive|}}
    <form {{on 'submit' @tryGuess}} class="flex gap-4">

      {{yield isActive}}

      <button type="submit" class="sr-only">Submit Attempt</button>
    </form>
  {{/let}}

</template>;


export default class Board extends Component<Args> {
  @tracked message;
  @tracked success = false;

  wordList = words(this);

  @cached
  get todaysWord() {
    return findTodaysWord(this.args.day, this.wordList.answers);
  }

  tryGuess = (attempt, submitEvent) => {
    submitEvent.preventDefault();

    guess(attempt, {
      onError: this.say,
      onWin: () => (this.success = true),
      answer: this.todaysWord,
      all: this.wordList.all
    });
  };

  say = async (msg: string) => {
    this.message = msg;

    await new Promise(resolve => setTimeout(resolve, 3000));

    this.message = '';
  }

  <template>
    <div class="h-12 flex justify-center items-center">
      {{#if this.message}}
        {{this.message}}
      {{/if}}
    </div>

    <div class="grid gap-4 relative">
      <Success @show={{this.success}} />

      {{#let (initialStateFor @day) as |board|}}

        {{#each board as |attempt|}}

          <Row
            @board={{board}}
            @attempt={{attempt}}
            @tryGuess={{fn this.tryGuess attempt}}
            as |isActive|
          >
            {{#each attempt.letters as |letter|}}

              <Letter
                @attempt={{attempt}}
                @letter={{letter}}
                @active={{isActive}}
              />

            {{/each}}
          </Row>

        {{/each}}

      {{/let}}

      {{log "Don't be a cheater" (toBase64 this.todaysWord)}}
    </div>

  </template>
}

