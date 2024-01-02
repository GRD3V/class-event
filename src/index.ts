type EventListener<T> = (e: T) => void | Promise<void>;

export class ClassEvent<EventMap> {
  private _maxEventBeforeWarn: number = 10;
  private _maxEventListeners: number = 0;

  private listenerList: {
    [key in keyof EventMap]?: EventListener<any>[];
  } = {};
  private warnIssuedFor: { [key in keyof EventMap]?: true } = {};

  public on<Key extends keyof EventMap>(
    eventName: Key,
    listener: EventListener<EventMap[Key]>
  ): ClassEvent<EventMap> {
    if (!this.listenerList[eventName]) this.listenerList[eventName] = [];

    const isMaxListenner =
      this.maxEventListeners > 0 &&
      (this.listenerList[eventName]?.length ?? 0) >= this.maxEventListeners;

    if (isMaxListenner) {
      console.warn(
        `The maximum number (${
          this.maxEventListeners
        }) of event listeners for "${String(
          eventName
        )}" has been reached. The event listener therefore did not add.`
      );
    }

    if (this.listenerList[eventName] && !isMaxListenner) {
      this.listenerList[eventName]?.push(listener);
      this.checkEventList(eventName);
    }
    return this;
  }

  public off<Key extends keyof EventMap>(
    eventName: Key,
    listener: EventListener<EventMap[Key]>
  ): ClassEvent<EventMap> {
    const eventListenerList = this.listenerList[eventName];
    if (eventListenerList) {
      const even = (l: EventListener<EventMap[Key]>) => l === listener;
      const index = eventListenerList.findIndex(even);
      eventListenerList.splice(index, 1);
    }
    return this;
  }

  protected emit<Key extends keyof EventMap>(
    eventName: Key,
    e: EventMap[Key]
  ): ClassEvent<EventMap> {
    const eventListenerList = this.listenerList[eventName];
    if (eventListenerList) {
      eventListenerList.forEach((listener) => {
        listener(e);
      });
    }
    return this;
  }

  private checkEventList(eventName: keyof EventMap): void {
    const eventListenerList = this.listenerList[eventName];
    if (
      eventListenerList &&
      eventListenerList.length >= this.maxEventBeforeWarn &&
      !this.warnIssuedFor[eventName]
    ) {
      this.warnIssuedFor[eventName] = true;
      console.warn(
        `Warning: Possible memory leak, event "${String(eventName)}" contains ${
          eventListenerList.length
        } listeners.`
      );
    }
  }

  public get maxEventBeforeWarn(): number {
    return this._maxEventBeforeWarn;
  }
  public set maxEventBeforeWarn(v: number) {
    if (!isPositiveInteger(v)) {
      throw new Error("Value is not a valid number");
    }
    this._maxEventBeforeWarn = v;
  }

  public get maxEventListeners(): number {
    return this._maxEventListeners;
  }
  public set maxEventListeners(v: number) {
    if (!isPositiveInteger(v)) {
      throw new Error("Value is not a valid number");
    }
    this._maxEventListeners = v;
  }
}

function isPositiveInteger(n: number): boolean {
  return typeof n === "number" && isFinite(n) && !isNaN(n) && n >= 0;
}
