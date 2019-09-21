import { ipcRenderer } from 'electron';
import { BaseConfig } from '../common/config/BaseConfig';
import { ConfigEvent } from '../common/config/config-types';

class WebviewConfig extends BaseConfig {
  protected initListeners(): void {
    ipcRenderer.on(this.eventChannel, (event, data) => {
      this.handleEvent(data);
    });
  }

  protected sendEvent(event: ConfigEvent): void {
    ipcRenderer.sendToHost(this.eventChannel, event);
  }
}

export const webviewConfig = new WebviewConfig();
