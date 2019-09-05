import { config } from '../common/config';
import { modules } from './modules';

declare global {
  const app: any;
}

config.initWebview();

function onNavigate(currentPathname: string): void {
  for (const module of modules) {
    module.update(currentPathname);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const interval = setInterval(() => {
    if (app !== undefined && app.router !== undefined) {
      clearInterval(interval);

      if (app.router.context !== undefined) {
        onNavigate(window.location.pathname);
      }

      app.router.on('after', (type: string, details: any) => {
        onNavigate(details.path);
      });
    }
  }, 50);
});
