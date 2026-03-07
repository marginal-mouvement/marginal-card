import { Id } from "../id";

export class KeyId extends Id("key", { implementation: "random" }) {}
