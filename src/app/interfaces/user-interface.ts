import { ApiInterface } from './api-interface';

export interface UserInterface extends ApiInterface {
  uid: string;
  email: string;
  name: string;
  displayName: string;
  photoUrl: string;
}