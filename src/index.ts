import { KVMap } from "kvmap";
type EventListener<T> = (e: T) => void | Promise<void>;

type ClassEventKVMap = {
  maxEventBeforeWarn: number;
  maxEventListeners: number;
  [key: string]: unknown;
};

export class ClassEvent<EventMap> extends KVMap<ClassEventKVMap> {
  private listenerList: {
    [key in keyof EventMap]?: EventListener<any>[];
  } = {};
  private warnIssuedFor: { [key in keyof EventMap]?: true } = {};

  constructor() {
    super({
      maxEventBeforeWarn: 10,
      maxEventListeners: 0,
    });
  }

  public on<Key extends keyof EventMap>(
    eventName: Key,
    listener: EventListener<EventMap[Key]>
  ) {
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
    eventName: keyof EventMap,
    listener: EventListener<EventMap[Key]>
  ) {
    const eventListenerList = this.listenerList[eventName];
    if (eventListenerList) {
      const even = (l: EventListener<EventMap[Key]>) => l === listener;
      const index = eventListenerList.findIndex(even);
      eventListenerList.splice(index, 1);
    }
    return this;
  }

  protected emit<Key extends keyof EventMap>(eventName: Key, e: EventMap[Key]) {
    const eventListenerList = this.listenerList[eventName];
    if (eventListenerList) {
      eventListenerList.forEach((listener) => {
        listener(e);
      });
    }
    return this;
  }

  private checkEventList(eventName: keyof EventMap) {
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

  private get maxEventBeforeWarn() {
    return this.get("maxEventBeforeWarn") ?? 10;
  }

  private get maxEventListeners() {
    return this.get("maxEventListeners") ?? 0;
  }
}
