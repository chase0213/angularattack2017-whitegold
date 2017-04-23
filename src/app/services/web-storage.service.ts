import { Injectable } from '@angular/core';
import { WebStorageInterface } from '../interfaces/web-storage-interface';
import { CookieService } from './cookie.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class WebStorageService implements WebStorageInterface {

  storage: CookieService|LocalStorageService;

  constructor(private _cookie: CookieService, private _localStorage: LocalStorageService) {
    if (this._localStorage.isAvailable()) {
      this.storage = this._localStorage;
    } else {
      this.storage = this._cookie;
    }
  }

  get(key: string): string {
    return this.storage.get(key);
  }

  set(key: string, value: string, options?: any): void {
    return this.storage.set(key, value, options);
  }

  remove(key: string): void {
    return this.storage.remove(key);
  }

  hasItem(key: string): boolean {
    return this.storage.hasItem(key);
  }

}