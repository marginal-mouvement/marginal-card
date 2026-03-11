import type { Store } from "@marginal-card/backend-framework";

import type { Show } from "../domain/show";

export interface ShowStore extends Store<Show> {
  loadAll(): Promise<Show[]>;
}
