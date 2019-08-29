import { pageHandlers } from './pages';
import { PageHandler } from './pages/PageHandler';

declare global {
  const app: any;
}

const currentHandlers: Map<string, PageHandler> = new Map();

function onNavigate(currentPathname: string): void {
  for (const [pathname, ctor] of pageHandlers) {
    if (pathname === '*' || currentPathname === pathname) {
      if (!currentHandlers.has(pathname)) {
        currentHandlers.set(pathname, new ctor());
      }

      currentHandlers.get(pathname).onNavigate(currentPathname);
    } else {
      currentHandlers.delete(pathname);
    }
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
