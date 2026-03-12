export interface SubscriptionEvent<
  N extends string,
  P extends Record<string, any> | undefined,
> {
  name: N;
  payload: P;
  at: Date;
}

export type HandshakeSubscriptionEvent = SubscriptionEvent<
  "Handshake",
  undefined
>;
