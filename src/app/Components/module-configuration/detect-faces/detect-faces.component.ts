import {Component} from '@angular/core';
import {UploadFile} from 'ng-zorro-antd';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ApiService} from '../../../Services/api.service';

interface FacialRecognitionResponse {
  data_rec_time: number;
  faces_load_time: number;
  faces_found_in_image: string[];
  results_file_url: string;
}

@Component({
  selector: 'app-detect-faces',
  templateUrl: './detect-faces.component.html',
  styleUrls: ['./detect-faces.component.css']
})
export class DetectFacesComponent {
  uploading = false;
  fileList: UploadFile[] = [];
  fileUrl: any;
  facialRecognitionResponse: FacialRecognitionResponse = null;

  constructor(private http: HttpClient, private msg: NzMessageService, private apiService: ApiService) {
  }

  canUpload() {
    return this.fileList.length !== 0;
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [file];
    return false;
  };

  handleUpload(): void {
    if (this.canUpload()) {
      const formData = new FormData();
      this.fileList.forEach((file: any) => {
        formData.append('file', file);
      });
      this.uploading = true;
      // You can use any AJAX library you like
      const req = new HttpRequest('POST', this.apiService.pythonApiUrl + 'facial_recognition', formData);
      this.http
        .request(req)
        .pipe(filter(e => e instanceof HttpResponse))
        .subscribe(
          (result) => {
            this.facialRecognitionResponse = (result as HttpResponse<any>).body;
            console.log(this.facialRecognitionResponse);
            this.uploading = false;
            this.fileList = [];
            this.msg.success('upload successfully.');
          },
          (err) => {
            console.log(err);
            this.uploading = false;
            this.msg.error('upload failed.' + err.error, {
              nzDuration: 5000,
              nzPauseOnHover: true,
            });
          }
        );
    } else {
      this.msg.error('Select an Image!', {
        nzPauseOnHover: true,
      });
    }

  }
}
