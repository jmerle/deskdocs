let quitting = false;

export function isQuitting(): boolean {
  return quitting;
}

export function startQuitting(): void {
  quitting = true;
}
