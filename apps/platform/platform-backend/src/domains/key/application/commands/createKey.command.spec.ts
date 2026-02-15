import { InMemoryDatabase } from "@ddd-ts/store-inmemory";
import { InMemoryKeyStore } from "../../infrastructure/inMemory.key.store";
import { CreateKeyCommand, CreateKeyCommandHandler } from "./createKey.command";
import { Actor } from "../../../actor/domain/actor";
import { Permission } from "../../../actor/domain/grade";
import { ApplicationError } from "@marginal-card/backend-framework";

describe("CreateKeyCommand", () => {
  function createHandler() {
    const db = new InMemoryDatabase();
    const keyStore = new InMemoryKeyStore(db);
    const handler = new CreateKeyCommandHandler(keyStore);

    return { keyStore, handler };
  }

  it("should create a key", async () => {
    const { keyStore, handler } = createHandler();
    const actor = Actor.generate(Permission.station());
    const command = new CreateKeyCommand({ actor });

    const result = await handler.execute(command);

    const savedKey = await keyStore.load(result.id);
    expect(savedKey).toBeDefined();
    expect(savedKey?.id).toEqual(result.id);
  });

  it("should throw if actor has insufficient permissions", async () => {
    const { handler } = createHandler();
    const actor = Actor.generate(Permission.basic());
    const command = new CreateKeyCommand({ actor });

    await expect(handler.execute(command)).rejects.toThrow(
      ApplicationError.forbidden("Station", "Basic").message,
    );
  });
});
