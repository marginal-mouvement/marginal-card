import type { z } from "zod";

export class Contract<
  const Path extends string,
  const Method extends "GET" | "POST",
  const BodyType extends "application/json" | undefined,
  const BodySchema extends z.ZodObject | undefined,
  const OutputSchema extends z.ZodObject | undefined,
  const WithAuth extends boolean,
> {
  constructor(
    readonly path: Path,
    readonly method: Method,
    readonly bodyType: BodyType,
    readonly bodySchema: BodySchema,
    readonly outputSchema: OutputSchema,
    readonly withAuth: WithAuth,
  ) {}

  static forSimpleQuery<
    const Path extends string,
    const OutputSchema extends z.ZodObject,
    const WithAuth extends boolean,
  >({
    path,
    outputSchema,
    withAuth,
  }: {
    path: Path;
    outputSchema: OutputSchema;
    withAuth: WithAuth;
  }) {
    return new Contract(
      path,
      "GET",
      undefined,
      undefined,
      outputSchema,
      withAuth,
    );
  }

  static forQuery<
    const Path extends string,
    const BodySchema extends z.ZodObject,
    const OutputSchema extends z.ZodObject,
    const WithAuth extends boolean,
  >({
    withAuth,
    bodySchema,
    outputSchema,
    path,
  }: {
    path: Path;
    bodySchema: BodySchema;
    withAuth: WithAuth;
    outputSchema: OutputSchema;
  }) {
    return new Contract(
      path,
      "POST",
      "application/json",
      bodySchema,
      outputSchema,
      withAuth,
    );
  }

  static forSilentCommand<
    const Path extends string,
    const BodySchema extends z.ZodObject,
    const WithAuth extends boolean,
  >({
    path,
    bodySchema,
    withAuth,
  }: {
    path: Path;
    bodySchema: BodySchema;
    withAuth: WithAuth;
  }) {
    return new Contract(
      path,
      "POST",
      "application/json",
      bodySchema,
      undefined,
      withAuth,
    );
  }

  static forReturningCommand<
    const Path extends string,
    const BodySchema extends z.ZodObject,
    const OutputSchema extends z.ZodObject,
    const WithAuth extends boolean,
  >({
    path,
    outputSchema,
    bodySchema,
    withAuth,
  }: {
    path: Path;
    bodySchema: BodySchema;
    outputSchema: OutputSchema;
    withAuth: WithAuth;
  }) {
    return new Contract(
      path,
      "POST",
      "application/json",
      bodySchema,
      outputSchema,
      withAuth,
    );
  }

  needsAuth(): this is AnyContractWithAuth {
    return this.withAuth;
  }
}

export type AnyContract = Contract<any, any, any, any, any, any>;

export type AnyContractWithoutPayload = Contract<
  any,
  any,
  any,
  undefined,
  any,
  any
>;

export type AnyContractWithAuth = Contract<any, any, any, any, any, true>;

export type AnyContractWithoutAuth = Contract<any, any, any, any, any, false>;

export type AnyContractWithOutput<T extends object> = AnyContract & {
  outputSchema: z.ZodType<T>;
};

export type PayloadOf<C extends AnyContract> = C["bodySchema"] extends undefined
  ? undefined
  : z.Infer<C["bodySchema"]>;

export type RouteOf<C extends AnyContract> = C["path"];

export type MethodOf<C extends AnyContract> = C["method"];

export type ResultOf<C extends AnyContract> =
  C["outputSchema"] extends undefined ? void : z.Infer<C["outputSchema"]>;
