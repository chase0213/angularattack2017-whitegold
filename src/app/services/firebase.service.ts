import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

declare const require;

@Injectable()
export class FirebaseService {

  firebase = require('firebase');
  firebaseui = require('firebaseui');
  ui;
  database;
  storage;

  constructor(private _router: Router) {
    this.initializeFirebase();
  }

  initializeFirebase() {
    const config = {
      apiKey: "AIzaSyD0kz4VhVoLsqPmHiEYTFXPWCtDW4K-Q-g",
      authDomain: "qnote-8dc51.firebaseapp.com",
      databaseURL: "https://qnote-8dc51.firebaseio.com",
      projectId: "qnote-8dc51",
      storageBucket: "qnote-8dc51.appspot.com",
      messagingSenderId: "113081075054"
    };

    this.firebase.initializeApp(config);
    this.database = this.firebase.database();
    this.storage = this.firebase.storage();
  }

  initializeFirebaseUI(selector: string, callback?: any) {
    const config = {
      signInSuccessUrl: '/',
      callbacks: {
        signInSuccess: (currentUser, credential, redirectUrl) => {
          if (callback) {
            callback(currentUser, credential, redirectUrl);
          } else {
            this._router.navigate(['/']);
          }
        }
      },
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        this.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // this.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // this.firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // this.firebase.auth.GithubAuthProvider.PROVIDER_ID,
        // this.firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      tosUrl: '/terms'
    };

    if (this.ui) {
      // ui が書記されていたら何もしない
    } else {
      // ui が初期化されていない場合のみ初期化する
      this.ui = new this.firebaseui.auth.AuthUI(this.firebase.auth());
    }

    this.ui.start(selector, config)
  }

  disposeFirebaseUI() {
    this.ui.reset();
  }

  objectToListObservable(objectObservable: Observable<any>): Observable<any[]> {
    return objectObservable.map(data => {
      let keys = Object.keys(data);
      let array = [];
      for (let key of keys) {
        array.push(data[key]);
      }
      return array;
    });
  }

}