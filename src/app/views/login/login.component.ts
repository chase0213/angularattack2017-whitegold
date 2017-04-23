import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public as: AuthService, public fs: FirebaseService) { }

  ngOnInit() {
    this.as.isLoggedIn().subscribe(result => {
      if (!result) {
        this.fs.initializeFirebaseUI('#firebase-ui-container');
      }
    });
  }

}
