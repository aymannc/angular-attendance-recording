import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DemoContentComponent} from './Components/demo-content/demo-content.component';
import {UsersComponent} from './Components/users/users.component';
import {UserFormComponent} from './Components/users/user-form/user-form.component';
import {UsersDetailsComponent} from './Components/users/users-details/users-details.component';

const routes: Routes = [
  {path: '', component: DemoContentComponent},
  {
    path: 'users', children: [
      {path: '', component: UsersComponent},
      {path: 'add', component: UserFormComponent},
      {path: 'details/:id', component: UsersDetailsComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
