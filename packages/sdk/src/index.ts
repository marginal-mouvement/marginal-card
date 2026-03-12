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
  private apiKey?: string;
  private keyId?: string;

  private errorCallback?: (error: Error) => void;

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
        const error = new ApiClientError(err);
        this.errorCallback?.(err);
        throw error;
      });

    if (!response.ok) {
      const error = new ApiServerError(response);
      this.errorCallback?.(error);
      throw error;
    }

    return response.data;
  }

  async subscribeToEvents(
    callback: (event: T[keyof T]) => void,
    oldSubscriptionId?: string,
  ) {
    const subscriptionId: string = (
      await this.fetch("/subscription", "POST", {
        oldSubscriptionId,
      })
    ).subscriptionId;

    const eventSource = new EventSource(
      `${this.baseUrl}/events/${subscriptionId}`,
      {
        withCredentials: true,
      },
    );

    eventSource.onmessage = (e) => {
      const event = JSON.parse(e.data) as
        | T[keyof T]
        | HandshakeSubscriptionEvent;

      if (event.name === "Handshake") {
        console.log(event);
        return;
      }

      callback(event as T[keyof T]);
    };

    const unsubscribe = () => {
      eventSource.close();
    };

    return { unsubscribe, subscriptionId };
  }

  onError(callback: (error: Error) => void) {
    this.errorCallback = callback;
    return this;
  }

  setApiKey(apiKey?: string) {
    this.apiKey = apiKey;
    return this;
  }

  setKeyId(keyId?: string) {
    this.keyId = keyId;
    return this;
  }
}
