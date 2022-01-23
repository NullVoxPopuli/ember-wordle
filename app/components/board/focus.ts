export function focusNext() {
  let active = document.activeElement;

  let lettersQuery = document.querySelectorAll('input:not(:disabled)');
  let letters = [...lettersQuery];

  // is a letter active?
  if (!active) {
    let firstLetter = letters[0];

    if (firstLetter instanceof HTMLElement) {
      firstLetter.focus();
    }

    return;
  }

  let index = letters.indexOf(active);
  let nextLetter = letters[index + 1];

  if (nextLetter instanceof HTMLElement) {
    nextLetter.focus();
  }
}
