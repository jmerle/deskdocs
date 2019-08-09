// tslint:disable:member-access

declare module 'chrome-tabs' {
  interface TabProperties {
    title: string;
    id?: string;
    favicon?: string;
  }

  interface AddTabOptions {
    animate: boolean;
    background: boolean;
  }

  class ChromeTabs {
    readonly tabEls: HTMLElement[];
    readonly tabContentEl: HTMLElement;
    readonly tabContentWidths: number[];
    readonly tabContentPositions: number[];
    readonly tabPositions: number[];
    readonly activeTabEl: HTMLElement;

    init(container: HTMLElement): void;

    emit(eventName: string, data: any): void;

    setupCustomProperties(): void;

    setupStyleEl(): void;

    setupEvents(): void;

    layoutTabs(): void;

    createNewTabEl(): HTMLElement;

    addTab(properties: TabProperties, options?: AddTabOptions): void;

    setTabCloseEventListener(tabEl: HTMLElement): void;

    hasActiveTab(): boolean;

    setCurrentTab(tabEl: HTMLElement): void;

    removeTab(tabEl: HTMLElement): void;

    updateTab(tabEl: HTMLElement, properties: TabProperties): void;

    cleanUpPreviouslyDraggedTabs(): void;

    setupDraggabilly(): void;

    animateTabMove(tabEl: HTMLElement, originIndex: number, destinationIndex: number): void;
  }

  export = ChromeTabs;
}
