class TriggerOverride {
  private disabledTriggers: string[] = [];

  public init(): void {
    this.patchTrigger();
  }

  public disableDefaultBehavior(triggers: string[]): void {
    this.disabledTriggers.push(...triggers);
    this.disabledTriggers = [...new Set(this.disabledTriggers)];
  }

  public enableDefaultBehavior(triggers: string[]): void {
    for (const trigger of triggers) {
      const index = this.disabledTriggers.indexOf(trigger);
      if (index > -1) {
        this.disabledTriggers.splice(1, index);
      }
    }
  }

  private patchTrigger(): void {
    // tslint:disable-next-line:no-this-assignment
    const self = this;

    const originalTrigger = app.shortcuts.trigger;
    app.shortcuts.trigger = function(): any {
      if (self.disabledTriggers.includes(arguments[0])) {
        return;
      }

      return originalTrigger.apply(this, arguments);
    };
  }
}

export const triggerOverride = new TriggerOverride();
