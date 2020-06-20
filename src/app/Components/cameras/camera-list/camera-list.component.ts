import {Component, OnInit} from '@angular/core';
import {Camera} from '../../../Data/APIDataClasses.module';
import {ApiService} from '../../../Services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-camera-list',
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.css']
})
export class CameraListComponent implements OnInit {
  cameras: Camera[];
  pageSize = 10;
  pageIndex = 1;
  totalElements = 10;
  isLoading = false;

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit(): void {
    this.getCameras();
  }

  getCameras(pageSizeChanged = false) {
    if (this.apiService.isNumber(this.pageSize)) {
      this.isLoading = true;
      this.apiService.getCameras(this.pageSize, pageSizeChanged ? 1 : this.pageIndex).subscribe(data => {
        this.cameras = data._embedded.cameras;
        if (this.cameras) {
          this.apiService.injectCameras(this.cameras);
        }
        this.totalElements = data.page.totalElements;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        console.log(error);
      });
    }

  }

  goToAddCamera() {
    this.router.navigateByUrl('cameras/add');
  }

  goToDetails(camera: Camera) {
    this.router.navigateByUrl('cameras/details').then(() => this.apiService.selectedCamera = camera);
  }

}
