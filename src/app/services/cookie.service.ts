import { Injectable } from '@angular/core';
import { WebStorageInterface } from '../interfaces/web-storage-interface';

@Injectable()
export class CookieService implements WebStorageInterface {

  constructor() { }

  get(key: string): string {
    if (!key || !this.hasItem(key)) {
      return null;
    }

    const regexp = new RegExp(key + '=' + '([^;]+)[;$]?');
    return document.cookie.match(regexp)[1];
  }

  set(key: string, value: string, options?: any): void {
    if (!key) {
      return;
    }

    let cookieOptions = '';
    for (let o of options) {
      cookieOptions += ';' + o + '=' + options[o];
    }
    document.cookie = key + '=' + value + cookieOptions;
  }

  remove(key: string): void {
    if (!key || !this.hasItem(key)) {
      return;
    }
    document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  hasItem(key: string): boolean {
    const regexp = new RegExp(key + '=' + '([^;]+)[;$]?');
    return regexp.test(document.cookie);
  }

}