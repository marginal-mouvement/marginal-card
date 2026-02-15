import { Command, CommandHandler, Query, QueryHandler } from "./intent";
import { InMemoryIntentBus } from "./inMemory.intentBus";

describe("In memory IntentBus", () => {
  interface Dependency {
    extraNumber(): number;
  }

  class DependencyImpl implements Dependency {
    extraNumber() {
      return 5;
    }
  }

  it("should throw an error when trying to add multiple handlers with the same intent name", () => {
    const intentBus = new InMemoryIntentBus();

    class SomeCommand extends Command {
      constructor(readonly payload: {}) {
        super();
      }
    }

    class SomeCommandHandler extends CommandHandler(SomeCommand) {
      async execute() {}
    }

    class SomeOtherCommandHandler extends CommandHandler(SomeCommand) {
      async execute() {}
    }

    class SomeQuery extends Query<number> {
      constructor(readonly payload: {}) {
        super();
      }
    }

    class SomeQueryHandler extends QueryHandler(SomeQuery) {
      async execute() {
        return 5;
      }
    }

    class SomeOtherQueryHandler extends QueryHandler(SomeQuery) {
      async execute() {
        return 5;
      }
    }

    intentBus.register(new SomeCommandHandler());

    expect(() => intentBus.register(new SomeCommandHandler())).toThrow(Error);
    expect(() => intentBus.register(new SomeOtherCommandHandler())).toThrow(
      Error,
    );

    intentBus.register(new SomeQueryHandler());

    expect(() => intentBus.register(new SomeQueryHandler())).toThrow(Error);
    expect(() => intentBus.register(new SomeOtherQueryHandler())).toThrow(
      Error,
    );
  });

  it("should throw an error if no handler is registered for an intent", async () => {
    const intentBus = new InMemoryIntentBus();

    class SomeCommand extends Command {
      constructor(readonly payload: {}) {
        super();
      }
    }

    class SomeQuery extends Query<number> {
      constructor(readonly payload: {}) {
        super();
      }
    }

    await expect(intentBus.handle(new SomeQuery({}))).rejects.toThrow(Error);
    await expect(intentBus.handle(new SomeCommand({}))).rejects.toThrow(Error);
  });

  it("should handle a command", async () => {
    const intentBus = new InMemoryIntentBus();

    let foo = 5;

    class IncrementFooCommand extends Command {
      constructor(
        readonly payload: {
          value: number;
        },
      ) {
        super();
      }
    }

    class IncrementFooCommandHandler extends CommandHandler(
      IncrementFooCommand,
    ) {
      constructor(private readonly dependency: Dependency) {
        super();
      }

      async execute(command: IncrementFooCommand) {
        foo += command.payload.value + this.dependency.extraNumber();
      }
    }

    intentBus.register(new IncrementFooCommandHandler(new DependencyImpl()));

    await intentBus.handle(
      new IncrementFooCommand({
        value: 5,
      }),
    );

    expect(foo).toBe(15);
  });

  it("should handle a query", async () => {
    const intentBus = new InMemoryIntentBus();

    class SomeQuery extends Query<number> {
      constructor(
        readonly payload: {
          input: number;
        },
      ) {
        super();
      }
    }

    class SomeQueryHandler extends QueryHandler(SomeQuery) {
      constructor(private readonly dependency: Dependency) {
        super();
      }
      async execute(query: SomeQuery) {
        return query.payload.input + this.dependency.extraNumber();
      }
    }

    intentBus.register(new SomeQueryHandler(new DependencyImpl()));

    const result = await intentBus.handle(new SomeQuery({ input: 5 }));

    expect(result.toFixed(2)).toBe("10.00");
  });
});
