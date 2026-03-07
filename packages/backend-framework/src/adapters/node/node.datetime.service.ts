import type { DatetimeService } from "../../core";

export class NodeDatetimeService implements DatetimeService {
  now() {
    return new Date();
  }
}
