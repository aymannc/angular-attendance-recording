import {Component} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzCascaderOption, UploadFile} from 'ng-zorro-antd';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter} from 'rxjs/operators';
import {ApiService} from '../../../Services/api.service';

const childrens = [
  {
    value: '1',
    label: '1st year',
    isLeaf: true
  },
  {
    value: '2',
    label: '2nd year',
    isLeaf: true
  },
  {
    value: '3',
    label: '3rd year',
    isLeaf: true
  }
];
const options = [
  {
    value: 'mi',
    label: 'Math Info',
    children: [
      {
        value: 'bdcc',
        label: 'BDCC',
        children: childrens
      },
      {
        value: 'glsid',
        label: 'GLSID',
        children: childrens
      }
    ]
  },
];

@Component({
  selector: 'app-my-upload',
  templateUrl: './my-upload.component.html',
  styleUrls: ['./my-upload.component.css']
})
export class MyUploadComponent {
  nzOptions: NzCascaderOption[] = options;
  values: string[] | null = null;
  isVisible = false;

  selectedValue = null;
  options: { label: string, value: string }[] = [];

  uploading = false;
  fileList: UploadFile[] = [];
  fileUrl: any;

  constructor(private http: HttpClient, private msg: NzMessageService, private apiService: ApiService) {
  }

  canUpload() {
    return !(this.fileList.length && this.values && this.selectedValue);
  }

  getSuggestions(value: string) {
    return [{label: 'aymannc', value: '1'}, {label: 'oufto', value: '2'}];
  }

  printFullParams() {
    console.log(this.values, this.selectedValue);
  }

  onChanges(values: string[]): void {
    console.log(this.values);
    this.options = this.getSuggestions(this.values[1]);
  }

  open(): void {
    this.isVisible = true;
  }

  handleOk($event: MouseEvent): void {
    this.isVisible = false;
  }

  handleCancel($event: MouseEvent): void {
    this.isVisible = false;
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('files', file);
    });
    formData.append('username', this.selectedValue);
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', this.apiService.pythonApiUrl + 'upload_images', formData, {
      reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        result => {
          this.selectedValue = null;
          this.options = [];
          this.values = [];
          this.uploading = false;
          this.fileList = [];
          this.msg.success('upload successfully.');
          this.fileUrl = (result as HttpResponse<any>).body.file_path;
          console.log(this.fileUrl);
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
  }

}
