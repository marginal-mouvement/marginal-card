import { InMemoryEventBus } from "./inMemory.eventBus";
import { EsEvent } from "@ddd-ts/core";

describe("In memory EventBus", () => {
  class TestEvent extends EsEvent("TestEvent", {
    name: String,
  }) {}

  it("should register handlers", async () => {
    const eventBus = new InMemoryEventBus();

    const handlerA = jest.fn();
    const handlerB = jest.fn();

    eventBus.on(TestEvent, handlerA);
    eventBus.on(TestEvent, handlerB);

    const event = new TestEvent({ name: "test" });

    await eventBus.publish(event);

    await eventBus.waitForIdle();

    expect(handlerA).toHaveBeenCalledTimes(1);
    expect(handlerB).toHaveBeenCalledTimes(1);
  });

  it("should unregister handlers", async () => {
    const eventBus = new InMemoryEventBus();

    const handler = jest.fn();

    eventBus.on(TestEvent, handler);

    eventBus.off(TestEvent, handler);

    const event = new TestEvent({ name: "test" });

    await eventBus.publish(event);

    await eventBus.waitForIdle();

    expect(handler).toHaveBeenCalledTimes(0);
  });

  it("should execute synchronously", async () => {
    const eventBus = new InMemoryEventBus();

    const handler = jest.fn();

    eventBus.on(TestEvent, handler);

    const event = new TestEvent({ name: "test" });

    await eventBus.publish(event, { executeSync: true });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
