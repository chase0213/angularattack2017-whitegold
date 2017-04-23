import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.model';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  keyword: string = "";
  rooms$: Observable<Room[]>;
  isLoggedIn$: Observable<boolean>;
  subs: Subscription = new Subscription();

  constructor(
    public as: AuthService,
    public fs: FirebaseService,
    private _room: RoomService,
    private _router: Router,
  ) { }

  ngOnInit() {

    this.isLoggedIn$ = this.as.isLoggedIn();

    this.subs.add(this.as.isLoggedIn().subscribe(result => {
      if (!result) {
        this.fs.initializeFirebaseUI('#firebase-ui-container');
      }
    }));

    this.rooms$ = this._room.get(null, 6);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onClickSearch(event) {
    this._router.navigateByUrl('/room;q=' + this.keyword);
  }

}
