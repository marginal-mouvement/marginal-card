import type { Show } from "../domain/show";

export class HttpShowSerializer {
  serializeShow(show: Show) {
    return {
      id: show.id.serialize(),
      name: show.name,
      reward: show.reward,
      date: show.date,
      thumbnailUrl: show.thumbnailUrl,
    };
  }

  serializeShows(shows: Show[]) {
    return { shows: shows.map(this.serializeShow) };
  }
}
