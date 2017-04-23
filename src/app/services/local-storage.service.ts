import { Injectable } from '@angular/core';
import { WebStorageInterface } from '../interfaces/web-storage-interface';

@Injectable()
export class LocalStorageService implements WebStorageInterface {

  constructor() { }

  isAvailable(): boolean {
    let test = 'test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }

  get(key: string): string {
    return localStorage.getItem(key);
  }

  set(key: string, value: string, options?: any): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  hasItem(key: string): boolean {
    if (localStorage.getItem(key)) {
      return true;
    } else {
      return false;
    }
  }

}