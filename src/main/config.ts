import { BrowserWindow } from 'electron';
import { BaseConfig } from '../common/config/BaseConfig';
import { ConfigEvent } from '../common/config/config-types';
import { answerRenderer, callRenderer } from '../common/ipc';

class MainConfig extends BaseConfig {
  protected initListeners(): void {
    answerRenderer(this.eventChannel, data => {
      this.sendEvent(data);
    });
  }

  protected sendEvent(event: ConfigEvent): void {
    this.handleEvent(event);

    for (const win of BrowserWindow.getAllWindows()) {
      callRenderer(win, this.eventChannel, event);
    }
  }
}

export const mainConfig = new MainConfig();
