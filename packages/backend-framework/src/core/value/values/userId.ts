import { Id } from "../id";

export class UserId extends Id("usr") {
  static root() {
    return new UserId("usr_ROOT");
  }

  static platform() {
    return new UserId("usr_PLATFORM");
  }
}
