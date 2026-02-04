import { Intent, IntentHandler, IntentResult } from "./intent";
import { Logger } from "../logger";
import { IntentBus } from "./intentBus";
import { InfrastructureError } from "../error";

export class InMemoryIntentBus implements IntentBus {
  private readonly handlers: Map<string, IntentHandler<any>> = new Map();
  private logger = Logger.for(InMemoryIntentBus);

  register(handler: IntentHandler<any>) {
    const intentName = handler.of.name;

    const existing = this.handlers.get(intentName);

    if (existing !== undefined) {
      throw InfrastructureError.because(
        `Handler handling same intent name already registered (${intentName})`,
      );
    }

    this.handlers.set(intentName, handler);
    this.logger.log(
      `Intent ${intentName} registered with handler ${handler.constructor.name}`,
    );
  }

  async handle<I extends Intent<any>>(intent: I) {
    const handler = this.handlers.get(intent.constructor.name);

    if (!handler) {
      throw InfrastructureError.because(
        `No handler found for intent ${intent.constructor.name}`,
      );
    }

    this.logger.log(
      `Handling intent ${intent.constructor.name}`,
      intent.payload,
    );

    return (await handler.execute(intent)) as IntentResult<I>;
  }
}
