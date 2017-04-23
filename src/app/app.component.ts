import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  user$: Observable<any>;

  constructor(public as: AuthService) {
  }

  ngOnInit() {
    this.user$ = this.as.firebaseLoginStatusObservable();
  }

  onClickSignOut(event) {
    this.as.signOut();
  }
}