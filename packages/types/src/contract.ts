export interface Contract<
  Route extends string,
  Payload extends Record<string, any>,
  Result extends Record<string, any>,
> {
  type: "@marginal-card/contract";
  route: Route;
  payload: Payload;
  result: Result;
}
