import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
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

  constructor(private modal: NzModalService, private message: NzMessageService, public apiService: ApiService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadUser();
  }


  public ngOnDestroy() {
    this.apiService.userDetails = null;
    this.apiService.userLink = null;
  }

  modifyUser() {

  }

  loadUser() {
    this.isLoading = true;
    this.apiService.loadUser().subscribe(user => {
      this.isLoading = false;
      this.apiService.userDetails = user;
      this.apiService.loadComplaints();
      this.apiService.loadUserImages();
      this.apiService.addUserProfileImage();
      this.apiService.addUserDepartment();
      this.apiService.addUserFiliere();
      this.apiService.addUserSemester();
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }


  deleteUser() {
    this.modal.confirm({
      nzTitle: 'Delete the user !',
      nzContent: '<b style="color: red;">Are you sure delete this user?</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteSelectedUser(),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  navigateToUsers() {
    this.router.navigateByUrl('/users');
  }


  deleteSelectedUser() {
    this.apiService.deleteUser().subscribe(_ => {
      this.router.navigateByUrl('/users').then(() => this.message.success('User deleted'));
    }, error => this.message.error(error));
  }
}
