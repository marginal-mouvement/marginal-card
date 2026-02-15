import { SubscriptionRegistry, Topic } from "./subscriptionRegistry";
import { SubscriptionId } from "../value";
import { UserId } from "../value";

describe("SubscriptionRegistry", () => {
  const topic = (s: string) => s as Topic;

  it("delivers message to registered handler for subscribed topic", () => {
    const registry = new SubscriptionRegistry();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);
    const handler = jest.fn();

    registry.registerHandler(subId, handler);
    registry.subscribe(topic("orders"), subId);

    registry.publish([topic("orders")], "hello");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("hello");
  });

  it("deduplicates deliveries when publishing multiple topics with same subscriber", () => {
    const registry = new SubscriptionRegistry();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);
    const handler = jest.fn();

    registry.registerHandler(subId, handler);
    registry.subscribe(topic("alerts"), subId);
    registry.subscribe(topic("news"), subId);

    registry.publish([topic("alerts"), topic("news")], "ping");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("ping");
  });

  it("unsubscribe stops delivery for that topic but keeps other topics active", () => {
    const registry = new SubscriptionRegistry();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);
    const handler = jest.fn();

    registry.registerHandler(subId, handler);
    registry.subscribe(topic("a"), subId);
    registry.subscribe(topic("b"), subId);

    registry.publish([topic("a")], "m1");
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith("m1");

    handler.mockClear();

    registry.unsubscribe(topic("a"), subId);

    registry.publish([topic("a")], "m2");
    expect(handler).not.toHaveBeenCalled();

    registry.publish([topic("b")], "m3");
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith("m3");
  });

  it("unregistering a handler prevents further deliveries for that subscriber, others unaffected", () => {
    const registry = new SubscriptionRegistry();

    const user1 = UserId.generate();
    const sub1 = SubscriptionId.for(user1);
    const h1 = jest.fn();

    const user2 = UserId.generate();
    const sub2 = SubscriptionId.for(user2);
    const h2 = jest.fn();

    registry.registerHandler(sub1, h1);
    registry.registerHandler(sub2, h2);

    registry.subscribe(topic("t1"), sub1);
    registry.subscribe(topic("t1"), sub2);

    registry.unregisterHandler(sub1);

    registry.publish([topic("t1")], "x");

    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledWith("x");
  });

  it("does nothing (no throw) if a subscribed id has no registered handler", () => {
    const registry = new SubscriptionRegistry();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);

    registry.subscribe(topic("ghost"), subId);

    expect(() => registry.publish([topic("ghost")], "boo")).not.toThrow();
  });
});
