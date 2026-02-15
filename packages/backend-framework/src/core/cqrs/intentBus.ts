import { Intent, IntentHandler, IntentResult } from "./intent";

export interface IntentBus {
  register(handler: IntentHandler<any>): void;
  handle<I extends Intent<any>>(intent: I): Promise<IntentResult<I>>;
}
