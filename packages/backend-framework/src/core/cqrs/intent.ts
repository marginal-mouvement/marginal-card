import { Constructor } from "@ddd-ts/types";

export abstract class Intent<R> {
  private readonly _result!: R;
  abstract payload: Record<string, any>;
}

export type IntentResult<I extends Intent<any>> =
  I extends Intent<infer R> ? R : never;

export abstract class IntentHandler<I extends Intent<any>> {
  abstract execute(intent: I): Promise<IntentResult<I>>;
  abstract of: Constructor<I>;
}

// COMMAND
export abstract class Command<R = void> extends Intent<R> {
  private kind = "Command" as const;
}

export function CommandHandler<C extends Command<any>>(of: Constructor<C>) {
  abstract class CommandHandler extends IntentHandler<C> {
    of = of;
  }

  return CommandHandler;
}

// QUERY
export abstract class Query<R> extends Intent<R> {
  private kind = "Query" as const;
}

export function QueryHandler<Q extends Query<any>>(of: Constructor<Q>) {
  abstract class QueryHandler extends IntentHandler<Q> {
    of = of;
  }

  return QueryHandler;
}
