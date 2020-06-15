import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {ApiService} from '../../../Services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css']
})
export class UsersDetailsComponent implements OnInit, OnDestroy {

  loading = false;
  isLoading: boolean;

  constructor(private modal: NzModalService, public apiService: ApiService, private router: Router) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.loadUser().subscribe(user => {
      this.isLoading = false;
      this.apiService.userDetails = user;
      console.log(this.apiService.userDetails);
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  public ngOnDestroy() {
    this.apiService.userDetails = null;
    this.apiService.userLink = null;
  }

  modifyUser() {

  }

  deleteUser() {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this user?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => console.log('OK'),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  navigateToUsers() {
    this.router.navigateByUrl('/users');
  }
}
