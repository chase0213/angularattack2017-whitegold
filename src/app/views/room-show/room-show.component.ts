import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { RoomService } from '../../services/room.service';
import { PlayerStatus } from '../../models/player-status.model';

@Component({
  selector: 'app-room-show',
  templateUrl: './room-show.component.html',
  styleUrls: ['./room-show.component.scss']
})
export class RoomShowComponent implements OnInit, OnDestroy, AfterViewInit {

  subs: Subscription = new Subscription();
  room$: Observable<any>;
  roomId: string;
  movieUrl: string;
  allowSync: boolean = true;
  shouldUpdate: boolean = false;
  isAdmin: boolean = false;
  isAdmin$: Observable<boolean>;
  statusObservable$: Observable<PlayerStatus>;
  updateObservable$: Observable<PlayerStatus>;

  constructor(
    private _room: RoomService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      if (params && params['id']) {
        this.roomId = params['id'];
        this.room$ = this._room.get(params['id']);
        this.isAdmin$ = this._room.isRoomAdmin(params['id']);

        this.subs.add(this._room.get(params['id']).subscribe(room => {
          this.movieUrl = room.movieUrl;
        }));

        this.subs.add(this.isAdmin$.subscribe(isAdmin => {
          if (isAdmin) {
            this.shouldUpdate = true;
          } else {
            this.statusObservable$ = this._room.getRoomStatus(params['id']);
          }
        }));

      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onClickAsync(event) {
    this.allowSync = false;
  }

  onClickSync(event) {
    this.allowSync = true;
  }

  onChangeStatus(event) {
    this._room.updateRoomStatus(this.roomId, event);
  }

  ngAfterViewInit() {
    // !function(d,s,id){
    //   var js, fjs = d.getElementsByTagName(s)[0];
    //   if (!d.getElementById(id)) {
    //     js = d.createElement(s);
    //     js.id = id;
    //     js.src = "https://platform.twitter.com/widgets.js";
    //     fjs.parentNode.insertBefore(js,fjs);
    //   }
    // }(document, "script", "twitter-wjs");
  }

}
