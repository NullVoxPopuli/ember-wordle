import Header from './header';
import Board from './board';

interface Args {
  // year-month-day
  day: string;
}

<template>
  <Header />

  <section class="grid gap-4 mx-auto">
    <Board @day={{@day}} />

    <ul class="list-disc pl-4">
      <li>Use your keyboard to guess letters</li>
      <li>Press <kbd>Enter</kbd> to submit your guess</li>
    </ul>
  </section>
</template>

