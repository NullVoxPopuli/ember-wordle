export const toBase64 = (word?: string) => word && btoa(word);

export function toDate(dayString: string) {
  let [year, month, day] = dayString.split('-').map((x) => parseInt(x, 10));
  let date = new Date(year, month - 1, day, 0, 0, 0, 0);

  return date;
}

export function findTodaysWord(dayString: string, potentials: string[]) {
  let index = toDate(dayString).getTime() % potentials.length;

  return potentials[index];
}
