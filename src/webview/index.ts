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

function forceDesktopLayout(): void {
  const mobileChecks = ['(max-width: 480px)', '(max-width: 767px)', '(max-height: 767px) and (max-width: 1024px)'];

  const originalMatchMedia = window.matchMedia;

  // @ts-ignore
  // tslint:disable-next-line:only-arrow-functions
  window.matchMedia = function(): any {
    if (mobileChecks.includes(arguments[0])) {
      return {
        matches: false,
      };
    }

    return originalMatchMedia.apply(this, arguments as any);
  };
}

function waitUntilAppLoaded(): Promise<void> {
  return new Promise(resolve => {
    const checkForApp = () => {
      if (app !== undefined && app.router !== undefined) {
        resolve();
      } else {
        requestAnimationFrame(checkForApp);
      }
    };

    requestAnimationFrame(checkForApp);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  forceDesktopLayout();

  await waitUntilAppLoaded();
  const modules = createModules();

  if (app.router.context !== undefined) {
    onNavigate(modules, window.location.pathname);
  }

  app.router.on('after', (type: string, details: any) => {
    onNavigate(modules, details.path);
  });
});
