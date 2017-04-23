import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthService {

  constructor(
    private fs: FirebaseService,
    private _snackBar: MdSnackBar,
    private _router: Router,
  ) {}

  getCurrentUserUid(): string {
    let user = this.fs.firebase.auth().currentUser;
    if (user) {
      return user.uid;
    } else {
      return null;
    }
  }

  firebaseLoginStatusObservable(): Observable<any> {
    return Observable.create(obs => {
      this.fs.firebase.auth().onAuthStateChanged(
        user => obs.next(user),
        err  => obs.error(err),
        ()   => obs.complete()
      );
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this.firebaseLoginStatusObservable().map(user => {
      // firebase上でログインしているかどうか
      if (!!user) {
        return true;
      } else {
        // firebase上でログインしていない場合はログイン画面へ
        return false;
      }
    });
  }

  signOut() {
    this.fs.firebase.auth().signOut().then(() => {
      this._snackBar.open('Signed out.', 'ok');
      location.href = '/';
    });
  }

}