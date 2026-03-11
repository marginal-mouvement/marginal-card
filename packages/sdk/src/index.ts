import type {
  Contract,
  HandshakeSubscriptionEvent,
  MethodOf,
  PayloadOf,
  ResultOf,
  RouteOf,
  SubscriptionEvent,
} from "@marginal-card/types";

interface ServerError {
  ok: false;
  message: string;
  data: unknown;
}

interface OkResponse<T> {
  ok: true;
  data: T;
}

export class ApiClientError extends Error {
  constructor(readonly payload: unknown) {
    super(payload instanceof Error ? payload.message : "Unknown error");
  }
}

export class ApiServerError extends Error {
  constructor(readonly payload: ServerError) {
    super(payload.message);
  }
}

export class SDK<
  T extends { [key: string]: SubscriptionEvent<any, any> } = any,
> {
  private subscriptionId: string | undefined;
  private apiKey?: string;
  private keyId?: string;

  constructor(private readonly baseUrl: string) {}

  async fetch<T extends Contract<any, any, any, any>>(
    route: RouteOf<T>,
    method: MethodOf<T>,
    payload: PayloadOf<T>,
  ): Promise<ResultOf<T>> {
    let headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.apiKey) {
      headers = {
        ...headers,
        "X-API-KEY": this.apiKey,
      };
    }

    if (this.keyId) {
      headers = {
        ...headers,
        "X-KEY-ID": this.keyId,
      };
    }

    const response: OkResponse<ResultOf<T>> | ServerError = await fetch(
      `${this.baseUrl}${route}`,
      {
        method,
        body: payload ? JSON.stringify(payload) : undefined,
        headers,
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        throw new ApiClientError(err);
      });

    if (!response.ok) {
      throw new ApiServerError(response);
    }

    return response.data;
  }

  subscribeToEvents(
    callback: (event: T[keyof T] | HandshakeSubscriptionEvent) => void,
  ) {
    const eventSource = new EventSource(`${this.baseUrl}/events`, {
      withCredentials: true,
    });

    eventSource.onmessage = (e) => {
      const event = JSON.parse(e.data) as
        | T[keyof T]
        | HandshakeSubscriptionEvent;

      if (event.name === "Handshake") {
        this.subscriptionId = event.payload.subscriptionId;
        return;
      }

      callback(event);
    };

    return () => {
      eventSource.close();
    };
  }

  setApiKey(apiKey?: string) {
    this.apiKey = apiKey;
  }

  setKeyId(keyId?: string) {
    this.keyId = keyId;
  }
}
