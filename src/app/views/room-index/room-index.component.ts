import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-room-index',
  templateUrl: './room-index.component.html',
  styleUrls: ['./room-index.component.scss']
})
export class RoomIndexComponent implements OnInit, OnDestroy {

  // Event
  keyUp = new Subject<string>();

  keyword: string = '';
  rooms: Room[] = [];
  filtered: Room[] = [];
  rooms$: Observable<any>;
  subs: Subscription = new Subscription();


  constructor(
    private _route: ActivatedRoute,
    private _room: RoomService
  ) { }

  ngOnInit() {
    this.rooms$ = this._room.get();

    this._route.params.subscribe(params => {
      if (params['q']) {
        this.keyword = params['q'];
      }
      this.queryRoom(this.keyword);
    });

    this.subs.add(this.keyUp
      .debounceTime(1000)
      .distinctUntilChanged()
      .flatMap((search) => {
        return Observable.of(search).delay(300);
      })
      .subscribe((data) => {
        this.queryRoom(this.keyword);
      }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onClickSearch(event) {
    this.queryRoom(this.keyword);
  }

  queryRoom(keyword?: string) {
    // rewrite url
    history.replaceState(null, null, 'q=' + keyword);

    this.rooms$.subscribe(rooms => {
      this.filtered = rooms.filter((room) => {
        if (keyword) {
          return (
            (room['name'] && room['name'].indexOf(keyword) >= 0) ||
            (room['adminName'] && room['adminName'].indexOf(keyword)) >= 0
          );
        } else {
          return true;
        }
      });
    });
  }

}
