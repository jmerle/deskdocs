import { WebviewTag } from 'electron';
import { BaseConfig } from '../common/config/BaseConfig';
import { ConfigEvent } from '../common/config/config-types';
import { answerMain, callMain } from '../common/ipc';

class RendererConfig extends BaseConfig {
  protected initListeners(): void {
    answerMain(this.eventChannel, data => {
      document.querySelectorAll<WebviewTag>('webview').forEach(webview => {
        webview.send(this.eventChannel, data);
      });

      this.handleEvent(data);
    });
  }

  protected sendEvent(event: ConfigEvent): void {
    callMain(this.eventChannel, event);
  }

  public initWebviewTag(webview: WebviewTag): void {
    webview.addEventListener('ipc-message', data => {
      const target = data.target as Element;
      if (!target.classList.contains('hidden')) {
        callMain(data.channel, ...data.args);
      }
    });
  }
}

export const rendererConfig = new RendererConfig();
