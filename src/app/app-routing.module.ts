import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RoomIndexComponent } from './views/room-index/room-index.component';
import { RoomShowComponent } from './views/room-show/room-show.component';
import { RoomCreateComponent } from './views/room-create/room-create.component';
import { RoomEditComponent } from './views/room-edit/room-edit.component';

// guards
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'room', children: [
    { path: '', component: RoomIndexComponent },
    { path: 'new', component: RoomCreateComponent, canActivate: [AuthGuardService] },
    { path: ':id', component: RoomShowComponent },
    { path: ':id/edit', component: RoomEditComponent, canActivate: [AuthGuardService] }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
