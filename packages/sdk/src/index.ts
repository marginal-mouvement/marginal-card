import type {
  Contract,
  MethodOf,
  PayloadOf,
  ResultOf,
  RouteOf,
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

export class SDK {
  constructor(
    private readonly baseUrl: string,
    private apiKey?: string,
  ) {}

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

    const response: OkResponse<ResultOf<T>> | ServerError = await fetch(
      `${this.baseUrl}/${route}`,
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

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}
