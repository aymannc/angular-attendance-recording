import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import {ApiService} from '../../Services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];
  isVisibleMiddle: boolean;
  pythonApiUrl: string;
  springApiUrl: string;

  constructor(private modal: NzModalService,
              public auth: AuthService,
              private api: ApiService,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log(this.auth.authUser?.value);
  }

  logOut(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to logout?</i>',
      nzOnOk: () => this.auth.logOut()
    });
  }

  showProfile() {
    this.router.navigate(
      ['/profile']);
  }


  settings(): void {
    this.isVisibleMiddle = true;
    this.pythonApiUrl = this.api.pythonApiUrl;
    this.springApiUrl = this.api.springApiUrl;
  }

  setPublicApiUrl() {
    this.api.pythonApiUrl = this.pythonApiUrl;
    this.api.springApiUrl = this.springApiUrl;
    this.isVisibleMiddle = false;
  }
}
