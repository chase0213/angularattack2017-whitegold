import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Room } from '../../models/room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.scss']
})
export class RoomCreateComponent implements OnInit {

  room: Room = new Room();

  constructor(
    private _router: Router,
    private _snackBar: MdSnackBar,
    private _room: RoomService
  ) { }

  ngOnInit() {
  }

  onClickSave(event) {
    this._room.create(this.room).subscribe(room => {
      if (room && room.id) {
        this._snackBar.open('Success!', 'ok');
        setTimeout(() => {
          this._router.navigate(['/room', room.id]);
        }, 1000);
      } else {
        this._snackBar.open('Failed...', 'ok');
      }
    }, error => {
      this._snackBar.open('Failed...', 'ok');
    });
  }

  onClickCancel(event) {
    history.back();
  }

}
