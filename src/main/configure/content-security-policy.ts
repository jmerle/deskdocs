import { session } from 'electron';

export function configureContentSecurityPolicy(): void {
  session.defaultSession.webRequest.onHeadersReceived((details: any, callback) => {
    if (details.url.startsWith('https://devdocs.io/')) {
      delete details.responseHeaders['content-security-policy'];
    }

    callback({
      cancel: false,
      responseHeaders: details.responseHeaders,
    });
  });
}
