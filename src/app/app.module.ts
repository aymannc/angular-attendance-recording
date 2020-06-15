import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IconsProviderModule} from './icons-provider.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NgZorroAntdModule, NzAutocompleteModule, NzBreadCrumbModule, NzButtonModule, NzGridModule, NzInputModule} from 'ng-zorro-antd';
import {HeaderComponent} from './Components/header/header.component';
import {SideMenuComponent} from './Components/side-menu/side-menu.component';
import {DemoContentComponent} from './Components/demo-content/demo-content.component';
import {BreadcrumbComponent} from './Components/breadcrumb/breadcrumb.component';
import {UsersComponent} from './Components/users/users.component';
import {UsersDetailsComponent} from './Components/users/users-details/users-details.component';
import {UserFormComponent} from './Components/users/user-form/user-form.component';
import {UserDescriptionComponent} from './Components/users/users-details/user-description/user-description.component';
import {CamerasComponent} from './Components/cameras/cameras.component';
import {CamerasTableComponent} from './Components/cameras/cameras-table/cameras-table.component';
import {CamerasStreamComponent} from './Components/cameras/cameras-stream/cameras-stream.component';
import {CameraDescriptionComponent} from './Components/cameras/cameras-details/camera-description/camera-description.component';
import {CamerasDetailsComponent} from './Components/cameras/cameras-details/cameras-details.component';
import {CameraFormComponent} from './Components/cameras/camera-form/camera-form.component';
import {CameraMaintenanceScheduleComponent} from './Components/cameras/camera-maintenance-schedule/camera-maintenance-schedule.component';
import {ComplaintsComponent} from './Components/complaints/complaints.component';
import {AddPicturesComponent} from './Components/module-configuration/add-pictures/add-pictures.component';
import {EncodeFacesComponent} from './Components/module-configuration/encode-faces/encode-faces.component';
import {AddPicturesBetaComponent} from './Components/module-configuration/add-pictures-beta/add-pictures-beta.component';
import {DetectFacesComponent} from './Components/module-configuration/detect-faces/detect-faces.component';
import {MyUploadComponent} from './Components/module-configuration/my-upload/my-upload.component';
import {AuthComponent} from './Components/auth/auth.component';
import { ProfileComponent } from './Components/profile/profile.component';
import {StudentStatsComponent} from './Components/users/student-stats/student-stats.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    DemoContentComponent,
    BreadcrumbComponent,
    UsersComponent,
    UsersDetailsComponent,
    UserFormComponent,
    UserDescriptionComponent,
    CamerasComponent,
    CamerasTableComponent,
    CamerasStreamComponent,
    CameraDescriptionComponent,
    CamerasDetailsComponent,
    CameraFormComponent,
    CameraMaintenanceScheduleComponent,
    ComplaintsComponent,
    AddPicturesComponent,
    EncodeFacesComponent,
    AddPicturesBetaComponent,
    DetectFacesComponent,
    MyUploadComponent,
    AuthComponent,
    ProfileComponent,
    StudentStatsComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzAutocompleteModule,
    NzBreadCrumbModule,
    NgZorroAntdModule,
    NgxChartsModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
