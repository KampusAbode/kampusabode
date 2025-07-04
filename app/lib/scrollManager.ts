
// lib/scrollManager.ts
const scrollPositions = new Map<string, number>();

export function saveScroll(key: string) {
  scrollPositions.set(key, window.scrollY);
}

export function getScroll(key: string): number | undefined {
  return scrollPositions.get(key);
}
