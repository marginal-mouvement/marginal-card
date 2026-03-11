export class KeyStore {
  private static LocalStorageKey = "keyId";

  static load() {
    const keyId = localStorage.getItem(this.LocalStorageKey);

    if (keyId) {
      return keyId;
    }
  }

  static save(keyId: string) {
    localStorage.setItem(this.LocalStorageKey, keyId);
  }
}
