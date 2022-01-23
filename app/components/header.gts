import ExternalLink from './external-link';

<template>
  <header class="
    w-full grid grid-cols-2 sm:grid-cols-3
    p-2 sm:p-1 border-b"
  >
    <div class="hidden sm:block"></div>

    <div class="sm:text-center">
      <h1 class="text-2xl">Wordle</h1>
      <h2 class="text-italic text-xs">in Ember.JS</h2>
    </div>

    <div class="flex justify-end items-center">
      <ExternalLink href="https://github.com/nullvoxpopuli/ember-wordle">
        GitHub
      </ExternalLink>
    </div>
  </header>
</template>
