import { pageHandlers } from './pages';
import { PageHandler } from './pages/PageHandler';

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
  const originalPushState = history.pushState;

  history.pushState = function(): any {
    const result = originalPushState.apply(this, arguments as any);
    onNavigate(arguments[0].path);
    return result;
  };

  onNavigate(window.location.pathname);
});
