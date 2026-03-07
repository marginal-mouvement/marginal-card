import type { SubscriptionEvent } from "@marginal-card/types";

import { SubscriptionRegistry } from "./subscriptionRegistry";

import { SubscriptionId , UserId } from "../value";

type TestTopics = "orders" | "alerts" | "news";

type TestEvent = SubscriptionEvent<
  "Test",
  {
    hi: string;
  }
>;

describe("SubscriptionRegistry", () => {
  it("delivers message to registered handler for subscribed topic", () => {
    const registry = new SubscriptionRegistry<TestEvent, TestTopics>();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);
    const handler = jest.fn();

    registry.registerHandler(subId, handler);
    registry.subscribe("orders", subId);

    const evt = {
      at: new Date(),
      name: "Test" as const,
      payload: { hi: "hello" },
    };

    registry.publish(["orders"], evt);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(evt);
  });

  it("deduplicates deliveries when publishing multiple topics with same subscriber", () => {
    const registry = new SubscriptionRegistry<TestEvent, TestTopics>();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);
    const handler = jest.fn();

    registry.registerHandler(subId, handler);
    registry.subscribe("alerts", subId);
    registry.subscribe("news", subId);

    const evt = {
      at: new Date(),
      name: "Test" as const,
      payload: { hi: "ping" },
    };

    registry.publish(["news", "alerts"], evt);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(evt);
  });

  it("unsubscribe stops delivery for that topic but keeps other topics active", () => {
    const registry = new SubscriptionRegistry<TestEvent, TestTopics>();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);
    const handler = jest.fn();

    registry.registerHandler(subId, handler);
    registry.subscribe("news", subId);
    registry.subscribe("alerts", subId);

    const evt = {
      at: new Date(),
      name: "Test" as const,
      payload: { hi: "ping" },
    };

    registry.publish(["news"], evt);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(evt);

    handler.mockClear();

    registry.unsubscribe("news", subId);

    registry.publish(["news"], evt);
    expect(handler).not.toHaveBeenCalled();

    registry.publish(["alerts"], evt);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(evt);
  });

  it("unregistering a handler prevents further deliveries for that subscriber, others unaffected", () => {
    const registry = new SubscriptionRegistry<TestEvent, TestTopics>();

    const user1 = UserId.generate();
    const sub1 = SubscriptionId.for(user1);
    const h1 = jest.fn();

    const user2 = UserId.generate();
    const sub2 = SubscriptionId.for(user2);
    const h2 = jest.fn();

    registry.registerHandler(sub1, h1);
    registry.registerHandler(sub2, h2);

    registry.subscribe("orders", sub1);
    registry.subscribe("orders", sub2);

    registry.unregisterHandler(sub1);

    const evt = {
      at: new Date(),
      name: "Test" as const,
      payload: { hi: "ping" },
    };

    registry.publish(["orders"], evt);

    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledWith(evt);
  });

  it("does nothing (no throw) if a subscribed id has no registered handler", () => {
    const registry = new SubscriptionRegistry<TestEvent, TestTopics>();
    const user = UserId.generate();
    const subId = SubscriptionId.for(user);

    registry.subscribe("alerts", subId);

    const evt = {
      at: new Date(),
      name: "Test" as const,
      payload: { hi: "ping" },
    };

    expect(() => registry.publish(["alerts"], evt)).not.toThrow();
  });
});
