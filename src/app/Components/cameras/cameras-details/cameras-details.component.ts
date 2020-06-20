import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cameras-details',
  templateUrl: './cameras-details.component.html',
  styleUrls: ['./cameras-details.component.css']
})
export class CamerasDetailsComponent implements OnInit {
  loading: boolean;

  constructor(private modal: NzModalService, private router: Router) {
  }

  ngOnInit(): void {
  }

  modifyCamera() {
  }

  deleteCamera() {
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

  liveStreamCamera() {
    this.router.navigateByUrl('cameras/live');
  }
}
