export class KeyStore {
  private static LocalStorageKey = "keyId";

  private static getInUrl() {
    const url = new URL(window.location.href);
    const match = url.pathname.match(/^\/k\/([^/]+)/);

    if (match) {
      return match[1];
    }

    return undefined;
  }

  static load() {
    const inUrl = this.getInUrl();

    if (inUrl) {
      this.save(inUrl);
      return inUrl;
    }

    const keyId = localStorage.getItem(this.LocalStorageKey);

    if (keyId) {
      return keyId;
    }
  }

  static erase() {
    localStorage.removeItem(this.LocalStorageKey);
  }

  static save(keyId: string) {
    localStorage.setItem(this.LocalStorageKey, keyId);
  }
}
