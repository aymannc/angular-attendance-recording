import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../Services/api.service';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Complaint, Href, Image} from '../../../../Data/APIDataClasses';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';

const count = 5;
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

@Component({
  selector: 'app-user-description',
  templateUrl: './user-description.component.html',
  styleUrls: ['./user-description.component.css']
})
export class UserDescriptionComponent implements OnInit {
  initLoading = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];
  isVisible = false;
  isOkLoading = false;
  isComplaintOkLoading = false;
  loading = false;
  selectedImage: Image = new Image();
  imagesPageIndex = 1;
  imagesPageSize = 10;
  complaintsPageIndex = 1;
  complaintsPageSize = 10;
  complaints: Complaint[] = [];
  isComplaintVisible: boolean;
  selectedComplaint = new Complaint();
  complaintSwitchLoading = false;
  isSetImagePrimaryButtonLoading: boolean;

  constructor(public apiService: ApiService, private modal: NzModalService,
              private http: HttpClient, private msg: NzMessageService, private router: Router) {
  }


  ngOnInit(): void {
  }

  handleOk(): void {
    this.isVisible = false;
  }

  someThingChanged(type: number) {
    console.log('someThingChanged', type);

  }

  showImageModal(image: Image) {
    this.selectedImage = image;
    this.isVisible = true;
  }

  deleteComplaint(href: Href) {
    this.modal.confirm({
      nzTitle: '<b style="color: red;">Are you sure delete this complaint !</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => this.apiService.deleteComplaints(href.href).subscribe(data => {
        this.apiService.loadComplaints();
      }),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  showComplaint(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.isComplaintVisible = true;
  }


  handleComplaintOk() {
    this.isComplaintVisible = false;
  }

  clickComplaintSwitch() {
    if (!this.complaintSwitchLoading) {
      this.complaintSwitchLoading = true;
      this.apiService.changeComplaintState(this.selectedComplaint._links.self.href, {statut: !this.selectedComplaint.statut})
        .subscribe((data) => {
            this.selectedComplaint = data;
            this.apiService.loadComplaints();
            this.complaintSwitchLoading = false;
          }
        );
    }
  }

  navigateToAddImages() {
    this.router.navigateByUrl('/module-configuration/add');
  }

  clickSwitch(): void {
    if (!this.loading) {
      this.loading = true;
      console.log('you chosed', !this.selectedImage.verified);
      this.apiService.changeImageState(this.selectedImage._links.self.href, {verified: !this.selectedImage.verified})
        .subscribe((data) => {
            this.selectedImage = data;
            this.apiService.loadUserImages();
            this.loading = false;
          }
        );
    }
  }

  setImageAsPrimary() {
    if (!this.isSetImagePrimaryButtonLoading) {
      this.isSetImagePrimaryButtonLoading = true;
      this.apiService.setImageAsPrimary(this.selectedImage.slug)
        .subscribe((image: Image) => {
            this.msg.success('Successful !');
            this.apiService.userDetails.profileImage = image;
            this.isSetImagePrimaryButtonLoading = false;
          }, error => {
            this.isSetImagePrimaryButtonLoading = false;
            this.msg.error(error.error.message);
          }
        );
    }
  }

  imageIsPrimary() {
    return (this.apiService?.userDetails?.profileImage?.slug != null) && (this.selectedImage?.slug != null)
      && (this.apiService?.userDetails?.profileImage?.slug === this.selectedImage.slug);
  }
}
