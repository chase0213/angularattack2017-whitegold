export interface WebStorageInterface {
  get(key: string): string;
  set(key: string, value: string, options?: any): void;
  remove(key: string): void;
  hasItem(key: string): boolean;
}