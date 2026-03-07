export interface SubscriptionEvent<
  N extends string,
  P extends Record<string, any>,
> {
  name: N;
  payload: P;
  at: Date;
}

export type HandshakeSubscriptionEvent = SubscriptionEvent<
  "Handshake",
  {
    subscriptionId: string;
  }
>;
