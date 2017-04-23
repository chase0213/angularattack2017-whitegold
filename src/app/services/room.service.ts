import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';
import { PlayerStatus } from '../models/player-status.model';

@Injectable()
export class RoomService {

  constructor(public fs: FirebaseService, public as: AuthService) { }

  _refToObservable(ref: any): Observable<any> {
    return Observable.create(obs => {
      ref.on('value', snapshot => {
        if (snapshot) {
          obs.next(snapshot.val());
        } else {
          obs.next(null);
        }
      });
    });
  }

  get(id?: string, limit: number = 20): Observable<any> {
    if (id) {
      return this._refToObservable(this.fs.database.ref('room/' + id));
    } else {
      if (limit > 0) {
        let objectObservable = this._refToObservable(this.fs.database.ref('room').orderByChild('createdAt').limitToLast(limit));
        return this.fs.objectToListObservable(objectObservable);
      } else {
        let objectObservable = this._refToObservable(this.fs.database.ref('room').orderByChild('createdAt'));
        return this.fs.objectToListObservable(objectObservable);
      }
    }
  }

  getRoomStatus(id: string): Observable<PlayerStatus> {
    let ref = this.fs.database.ref('room/' + id + '/status');
    let obs = this._refToObservable(ref).map(res => {
      let status = null;
      if (res) {
        status = new PlayerStatus();
        status.fromJson(res);
      }
      return status;
    });
    return obs;
  }

  isRoomAdmin(id: string): Observable<boolean> {
    return Observable.create(obs => {
      this.fs.firebase.auth().onAuthStateChanged((user) => {

        this.fs.database.ref('room/' + id).on('value', snapshot => {
          let room = snapshot.val();
          if (user && user.uid === room.admin) {
            obs.next(true);
          } else {
            obs.next(false);
          }
          obs.complete();
        });

      });
    });
  }

  updateRoomStatus(id: string, status: PlayerStatus) {
    let ref = this.fs.database.ref('room/' + id + '/status');
    return this.fs.database.ref('room/' + id + '/status').update(status);
  }

  create(room: Room): Observable<any> {
    let date = new Date();
    let unixTimestamp = date.getTime();
    room.createdAt = unixTimestamp;
    room.updatedAt = unixTimestamp;
    room.videoId = this._trimYoutubeVideoId(room.movieUrl);

    return Observable.create(obs => {
      this.as.firebaseLoginStatusObservable().subscribe(auth => {
        if (auth) {
          // set login user as admin
          room.admin = auth.uid;
          room.adminName = auth.displayName;
          room.adminPhotoUrl = auth.photoURL;

          // get an id for new room
          let roomId = this.fs.database.ref('room').push().key;
          room.id = roomId;

          // update object on firebase
          this.fs.database.ref('room/' + room.id).update(room).then(result => {
            obs.next(room);
          }, error => {
            obs.error(error);
          });

        } else {
          obs.error('Authentication required.');
        }

        obs.complete();
      });
    });
  }

  update(room: Room, admin?: User, userIds: string[] = []): Observable<Room> {
    let date = new Date();
    let unixTimestamp = date.getTime();
    room.updatedAt = unixTimestamp;
    room.videoId = this._trimYoutubeVideoId(room.movieUrl);

    return Observable.create(obs => {
      this.as.firebaseLoginStatusObservable().subscribe(auth => {
        if (auth) {
          // update admin
          if (admin) {
            room.admin = admin.uid;
            room.adminName = admin.displayName;
            room.adminPhotoUrl = admin.photoUrl;
          }

          // update users
          for (let id in userIds) {
            room.users[id] = true;
          }

          // update room model
          this.fs.database.ref('room/' + room.id).update(room).then(result => {
            obs.next(room);
          }, error => {
            obs.error(error);
          });

        } else {
          obs.error('Authentication required.');
        }
     });
    });
  }

  delete(room: Room): Observable<boolean> {
    return Observable.create(obs => {
      console.log(room);
      let updates = {};
      updates[room.id] = null;
      this.fs.database.ref('room').update(updates).then(result => {
        obs.next(true);
      }, error => {
        obs.next(false);
      });
    });
  }

  _trimYoutubeVideoId(url: string): string {
    if (url) {
      const regexp = /https?:\/\/((www\.youtube\.com\/watch\?v=)|(youtu\.be\/))([a-zA-Z0-9_-]+)/;

      const match = url.match(regexp);
      if (match && match.length >= 5) {
        const videoId = match[4];
        return videoId;
      }
    }
    return null;
  }

}
