import { Command, CommandHandler, Query, QueryHandler } from "./intent";

class SomeCommand extends Command<number> {
  constructor(readonly payload: {}) {
    super();
  }
}

class SomeCommandHandler extends CommandHandler(SomeCommand) {
  // @ts-expect-error handler must respect the contract
  async execute() {
    return "some string";
  }
}

class SomeQuery extends Query<number> {
  constructor(readonly payload: {}) {
    super();
  }
}

class SomeQueryHandler extends QueryHandler(SomeQuery) {
  // @ts-expect-error handler must respect the contract
  async execute() {
    return "some string";
  }
}

// @ts-expect-error a command handler cannot handle a query
class SomeCommandHandlerTryingToHandleQuery extends CommandHandler(SomeQuery) {}

// @ts-expect-error a query handler cannot handle a command
class SomeQueryHandlerTryingToHandleCommand extends CommandHandler(
  SomeCommand,
) {}

void SomeCommandHandler;
void SomeQueryHandler;
void SomeCommandHandlerTryingToHandleQuery;
void SomeQueryHandlerTryingToHandleCommand;
