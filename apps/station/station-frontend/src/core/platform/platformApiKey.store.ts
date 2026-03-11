export class PlatformApiKeyStore {
  static readonly KEY = "platform-api-key";

  static load() {
    return localStorage.getItem(this.KEY) ?? undefined;
  }

  static save(apiKey: string) {
    localStorage.setItem(this.KEY, apiKey);
  }
}
