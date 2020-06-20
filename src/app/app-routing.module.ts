import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DemoContentComponent} from './Components/demo-content/demo-content.component';
import {UsersComponent} from './Components/users/users.component';
import {UserFormComponent} from './Components/users/user-form/user-form.component';
import {UsersDetailsComponent} from './Components/users/users-details/users-details.component';
import {CamerasComponent} from './Components/cameras/cameras.component';
import {CamerasDetailsComponent} from './Components/cameras/cameras-details/cameras-details.component';
import {CameraFormComponent} from './Components/cameras/camera-form/camera-form.component';
import {ComplaintsComponent} from './Components/complaints/complaints.component';
import {EncodeFacesComponent} from './Components/module-configuration/encode-faces/encode-faces.component';
import {DetectFacesComponent} from './Components/module-configuration/detect-faces/detect-faces.component';
import {MyUploadComponent} from './Components/module-configuration/my-upload/my-upload.component';
import {AuthComponent} from './Components/auth/auth.component';
import {AuthGuard, LoginPageGuard} from './Services/auth.guard';
import {ProfileComponent} from './Components/profile/profile.component';
import {FullScreenStreamComponent} from './Components/cameras/full-screen-stream/full-screen-stream.component';

const routes: Routes = [
  {path: '', component: DemoContentComponent, canActivate: [AuthGuard]},
  {path: 'login', component: AuthComponent, canActivate: [LoginPageGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {
    path: 'users', children: [
      {path: '', component: UsersComponent},
      {path: 'add', component: UserFormComponent},
      {path: 'details', component: UsersDetailsComponent}
      // , canActivate: [NoSelectedUserGard]}
    ]
  },
  {
    path: 'cameras', children: [
      {path: '', component: CamerasComponent},
      {path: 'add', component: CameraFormComponent},
      {path: 'details', component: CamerasDetailsComponent},
      {path: 'full-screen', component: FullScreenStreamComponent},
    ]
  },
  {
    path: 'complaints', children: [
      {path: '', component: ComplaintsComponent},
    ]
  },
  {
    path: 'module-configuration', children: [
      {path: 'detect-faces', component: DetectFacesComponent},
      {path: 'add', component: MyUploadComponent},
      {path: 'encode-faces', component: EncodeFacesComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
