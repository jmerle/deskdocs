import { rendererConfig } from './config';

function updateTheme(): void {
  const bodyClasses = document.body.classList;
  const dark = rendererConfig.get('dark');

  bodyClasses.toggle('theme-default', !dark);
  bodyClasses.toggle('theme-dark', dark);
}

export function initTheme(): void {
  updateTheme();

  rendererConfig.onChange('dark', () => {
    updateTheme();
  });
}
