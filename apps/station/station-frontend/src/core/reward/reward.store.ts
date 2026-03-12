interface Reward {
  label: string;
  amount: number;
  thumbnailUrl?: string;
}

interface RewardDict {
  [key: string]: Reward;
}

export class RewardStore {
  static readonly KEY = "rewards";

  static load(): RewardDict {
    return JSON.parse(localStorage.getItem(this.KEY) ?? "{}");
  }

  static save(rewards: RewardDict) {
    localStorage.setItem(this.KEY, JSON.stringify(rewards));
  }
}
