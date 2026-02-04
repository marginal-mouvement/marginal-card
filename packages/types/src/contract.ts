export type ContractMethod = "GET" | "POST";

export interface Contract<
  Route extends `/${string}`,
  Method extends ContractMethod,
  Payload extends Record<string, any> | undefined,
  Result extends Record<string, any> | undefined,
> {
  __is: "@marginal-card/contract";
  route: Route;
  payload: Payload;
  result: Result;
  method: Method;
}

export type RouteOf<C extends Contract<any, any, any, any>> = C["route"];

export type MethodOf<C extends Contract<any, any, any, any>> = C["method"];

export type PayloadOf<C extends Contract<any, any, any, any>> = C["payload"];

export type ResultOf<C extends Contract<any, any, any, any>> = C["result"];
