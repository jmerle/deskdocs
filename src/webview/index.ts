import { webviewConfig } from './config';
import { createModules } from './modules';
import { Module } from './modules/Module';

declare global {
  const app: any;
}

webviewConfig.init();

function onNavigate(modules: Module[], currentPathname: string): void {
  for (const module of modules) {
    module.update(currentPathname);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const interval = setInterval(() => {
    if (app !== undefined && app.router !== undefined) {
      clearInterval(interval);

      const modules = createModules();

      if (app.router.context !== undefined) {
        onNavigate(modules, window.location.pathname);
      }

      app.router.on('after', (type: string, details: any) => {
        onNavigate(modules, details.path);
      });
    }
  }, 50);
});
