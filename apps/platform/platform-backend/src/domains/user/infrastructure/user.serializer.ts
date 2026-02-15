import { User } from "../domain/user";
import { AutoSerializer } from "@ddd-ts/core";

export class UserSerializer extends AutoSerializer(User, 1) {}
