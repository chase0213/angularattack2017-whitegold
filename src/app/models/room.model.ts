import { User } from './user.model';
import { RoomInterface } from '../interfaces/room-interface';

export class Room implements RoomInterface {
  id: string;
  videoId: string;
  name: string;
  description: string;
  movieUrl: string;
  admin: any;
  users: any; // {'uid': any, ...}
  createdAt: number;
  updatedAt: number;
  adminName: string;
  adminPhotoUrl: string;

  fromJson(obj: any) {
    this.id = obj['id'];
    this.videoId = obj['videoId'];
    this.name = obj['name'];
    this.description = obj['description'];
    this.movieUrl = obj['movieUrl'];
    this.createdAt = obj['createdAt'];
    this.updatedAt = obj['updatedAt'];
    this.admin = obj['admin'];
    this.adminName = obj['adminName'];
    this.adminPhotoUrl = obj['adminPhotoUrl'];
    this.users = obj['users'] || {};
  }
}
