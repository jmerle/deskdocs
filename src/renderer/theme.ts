import { config } from '../common/config';

function updateTheme(): void {
  const bodyClasses = document.body.classList;
  const darkMode = config.get('darkMode');

  bodyClasses.toggle('theme-default', !darkMode);
  bodyClasses.toggle('theme-dark', darkMode);
}

export function initTheme(): void {
  updateTheme();

  config.onChange('darkMode', () => {
    updateTheme();
  });
}
