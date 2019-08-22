import { PageHandler } from './PageHandler';

export class GenericPageHandler extends PageHandler {
  public onNavigate(pathname: string): void {
    console.log(`Navigated to ${pathname}`);
  }
}
