import * as unhandled from 'electron-unhandled';
import { debugInfo, openNewGitHubIssue } from 'electron-util';
import { REPO_NAME, REPO_OWNER } from './constants';

export function initUnhandled(): void {
  // Set-up a dialog with a report button which shows if there are unhandled errors
  // The dialog will only show in production
  unhandled({
    reportButton: error => {
      openNewGitHubIssue({
        user: REPO_OWNER,
        repo: REPO_NAME,
        body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`,
      });
    },
  });
}
