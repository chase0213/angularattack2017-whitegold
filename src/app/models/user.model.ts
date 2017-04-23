import { UserInterface } from '../interfaces/user-interface';

export class User implements UserInterface {
  uid: string;
  email: string;
  name: string;
  displayName: string;
  photoUrl: string;

  fromJson(obj: any) {
    this.uid = obj['uid'];
    this.email = obj['email'];
    this.name = obj['name'];
    this.displayName = obj['displayName'];
    this.photoUrl = obj['photoURL'];
  }
}