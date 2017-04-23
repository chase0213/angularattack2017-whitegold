import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private _router: Router,
    private _auth: AuthService,
  ) { }

  canActivate(): Observable<boolean> {
    return this._auth.isLoggedIn();
  }

}