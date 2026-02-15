import { AutoSerializer } from "@ddd-ts/core";
import { Key } from "../domain/key";

export class KeySerializer extends AutoSerializer(Key, 1) {}
