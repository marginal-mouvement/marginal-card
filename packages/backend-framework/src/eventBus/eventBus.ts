import { IEvent } from "@ddd-ts/core";
import { Constructor } from "@ddd-ts/types";

export type EventCallback<T extends IEvent> = (
  event: T,
) => void | Promise<void>;

export interface EventBus {
  on<T extends IEvent>(event: Constructor<T>, callback: EventCallback<T>): void;

  off<T extends IEvent>(
    event: Constructor<T>,
    callback: EventCallback<T>,
  ): void;

  publish<T extends IEvent>(
    event: T,
    options?: { executeSync?: boolean },
  ): Promise<void>;

  waitForIdle(): Promise<void>;
}
