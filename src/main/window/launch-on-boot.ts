import AutoLaunch from 'auto-launch';
import { is } from 'electron-util';
import { mainConfig } from '../config';

const autoLauncher = new AutoLaunch({
  name: 'DeskDocs',
});

function updateLaunchOnBoot(): void {
  const shouldLaunchOnBoot = mainConfig.get('launchOnBoot') && !is.development;

  autoLauncher
    .isEnabled()
    .then(enabled => {
      if (shouldLaunchOnBoot && !enabled) {
        return autoLauncher.enable();
      } else if (!shouldLaunchOnBoot && enabled) {
        return autoLauncher.disable();
      }

      return Promise.resolve();
    })
    .catch(() => {
      // Do nothing
    });
}

export function configureLaunchOnBoot(): void {
  updateLaunchOnBoot();
  mainConfig.onChange('launchOnBoot', () => updateLaunchOnBoot());
}
