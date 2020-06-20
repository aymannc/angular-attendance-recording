import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {ApiService} from '../../../Services/api.service';

@Component({
  selector: 'app-cameras-details',
  templateUrl: './cameras-details.component.html',
  styleUrls: ['./cameras-details.component.css']
})
export class CamerasDetailsComponent implements OnInit {
  loading: boolean;

  constructor(private modal: NzModalService, private router: Router, public apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadCamera();
  }

  modifyCamera() {
  }

  goToFullScreenStream() {
    this.router.navigateByUrl('cameras/full-screen').then();
  }

  deleteCamera() {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this camera?',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => console.log('OK'),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  navigateToCameras() {
    this.router.navigateByUrl('/cameras').then();
  }

  private loadCamera() {
    this.loading = true;
    try {
      this.apiService.loadCamera().subscribe(camera => {
        this.loading = false;
        this.apiService.cameraLink = camera._links.self.href;
        this.apiService.getStatus(camera._links.statuts.href).subscribe(status => {
          this.apiService.selectedCamera.statuts = status._embedded.statuts;
        });
        this.apiService.getSalle(camera._links.salle.href).subscribe(rom => {
          this.apiService.selectedCamera.salle = rom;
        });
        this.apiService.selectedCamera = camera;
      }, error => {
        this.loading = false;
        console.log(error);
      });
    } catch (e) {
      this.loading = false;
    }

  }
}
