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
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NgZorroAntdModule, NzAutocompleteModule, NzBreadCrumbModule, NzButtonModule, NzGridModule, NzInputModule} from 'ng-zorro-antd';
import {HeaderComponent} from './Components/header/header.component';
import {SideMenuComponent} from './Components/side-menu/side-menu.component';
import { DemoContentComponent } from './Components/demo-content/demo-content.component';
import { BreadcrumbComponent } from './Components/breadcrumb/breadcrumb.component';
import { UsersComponent } from './Components/users/users.component';
import { UsersDetailsComponent } from './Components/users/users-details/users-details.component';
import { UserFormComponent } from './Components/users/user-form/user-form.component';

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
    UserFormComponent
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
    NgZorroAntdModule
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
