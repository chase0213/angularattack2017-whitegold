import { ApiInterface } from './api-interface';

export interface RoomInterface extends ApiInterface {
  id: string;
  name: string;
  description: string;
  movieUrl: string;
  createdAt: number;
  updatedAt: number;
  adminName: string;
  adminPhotoUrl: string;
}