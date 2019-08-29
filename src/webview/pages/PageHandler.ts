export abstract class PageHandler {
  public abstract onNavigate(pathname: string): void;
}
