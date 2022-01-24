<template>
  {{#if @show}}
    <div
      class="
        absolute inset-0 grid gap-8 items-center
        justify-center p-4
        bg-[rgba(255,255,255,0.5)]
      "
    >
      <h3 class="text-4xl">Yay 🎉</h3>

      <p>You dit it!</p>
    </div>
  {{/if}}
</template>
