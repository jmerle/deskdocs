import { rendererConfig } from './config';

function updateTheme(): void {
  const bodyClasses = document.body.classList;
  const darkMode = rendererConfig.get('darkMode');

  bodyClasses.toggle('theme-default', !darkMode);
  bodyClasses.toggle('theme-dark', darkMode);
}

export function initTheme(): void {
  updateTheme();

  rendererConfig.onChange('darkMode', () => {
    updateTheme();
  });
}
