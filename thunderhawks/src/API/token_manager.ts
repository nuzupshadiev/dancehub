/**
 * TokenManagerI : an interface for all token managers
 *
 */
export interface TokenManagerI<T> {
  /**
   * @brief loads the token managed by this token manager.
   */
  store: () => void;
  /**
   * @brief clears the token managed by this token manager. This will clear the locally stored token
   * but keep the already loaded token in memory.
   */
  clear: () => void;
  /**
   * @brief reloads the token managed by this token manager. This will clear the already loaded
   * token in memory. If a reload fails, it will not update the internal state.
   * @returns a boolean to indicate if the load has succeeded.
   */
  reload: () => boolean;
  getToken: () => T;
  setToken: (token: T) => TokenManagerI<T>;
}

export class InMemoryTokenManager<T> implements TokenManagerI<T> {
  token: T;
  constructor(token: T) {
    this.token = token;
  }
  store() {}
  clear() {}
  reload() {
    return true;
  }
  getToken(): T {
    return this.token;
  }
  setToken(token: T) {
    return new InMemoryTokenManager(token);
  }
}

/**
 * @brief Manages a token kept in local storage.
 */
export class LocalStorageTokenManager implements TokenManagerI<string> {
  token: string;
  storageKey: string;
  constructor(token: string, storageKey: string = "thunderhawk-token") {
    this.token = token;
    this.storageKey = storageKey;
  }
  store() {
    localStorage.setItem(
      this.storageKey,
      Buffer.from(this.token).toString("base64"),
    );
  }
  clear() {
    localStorage.removeItem(this.storageKey);
  }
  reload(): boolean {
    const loadedItem = LocalStorageTokenManager._load(this.storageKey);
    if (loadedItem === null) return false;
    this.token = loadedItem;
    return true;
  }
  getToken(): string {
    return this.token;
  }
  setToken(token: string) {
    const manager = new LocalStorageTokenManager(token, this.storageKey);
    manager.store();
    return manager;
  }

  /**
   * Creates a LocalStorageTokenManager by loading from LocalStorage
   * @param storageKey the key to use
   * @returns null if a the load fails. Otherwise success.
   */
  static load(
    storageKey: string = "thunderhawk-token",
  ): LocalStorageTokenManager | null {
    const loadedItem = LocalStorageTokenManager._load(storageKey);
    return loadedItem === null
      ? null
      : new LocalStorageTokenManager(loadedItem, storageKey);
  }

  static _load(storageKey: string): string | null {
    const loadedEntry = localStorage.getItem(storageKey);
    if (loadedEntry === null) return null;
    const loadedItem = Buffer.from(loadedEntry, "base64").toString("utf-8");
    return loadedItem;
  }
}
