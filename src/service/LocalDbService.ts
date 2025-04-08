abstract class LocalDbService {
  abstract getData<T, F, Key = string>(key: Key, fallback: F): T | F

  abstract clearData<Key = string>(key: Key): void

  abstract clearAllData(): void

  abstract setData<T, K = string>(data: T, key: K): void
}

export default LocalDbService
