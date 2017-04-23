import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit, OnDestroy {

  subs: Subscription = new Subscription();
  room: Room = new Room();

  constructor(
    private _snackBar: MdSnackBar,
    private _route: ActivatedRoute,
    private _router: Router,
    private _room: RoomService,
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      if (params && params["id"]) {
        this.subs.add(this._room.get(params['id']).subscribe(room => {
          this.room = room;
        }));
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onClickSave($event) {
    this._room.update(this.room).subscribe(room => {
      if (room && room.id) {
        this._snackBar.open('Success!', 'ok');
        setTimeout(() => {
          this._router.navigate(['/room', room.id]);
        }, 1000);
      } else {
        this._snackBar.open('Oops, something wrong...', 'ok');
      }
    }, error => {
      this._snackBar.open('Oops, something wrong...', 'ok');
    });
  }

  onClickCancel(event) {
    history.back();
  }

  onClickDelete(event) {
    if (window.confirm('Do you really delete this room?')) {
      this._room.delete(this.room).subscribe(result => {
        if (result) {
          this._snackBar.open('Success!', 'OK');
          this._router.navigate(['/']);
        } else {
          this._snackBar.open("Oops, something wrong...", 'OK');
        }
      });
    }
  }

}
