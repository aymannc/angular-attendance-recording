import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  Camera,
  CamerasResponse,
  Complaint,
  Departement,
  Filiere,
  Image,
  Semester,
  User,
  UserPostData,
  UtilisateursResponse
} from '../Data/APIDataClasses.module';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public pythonApiUrl = 'http://localhost:5001/';
  public springApiUrl = 'http://localhost:8080/';
  public springImageUrl = this.springApiUrl + 'image/';
  public addMode = false;
  userDetails: User = null;
  userLink: string;
  selectedCamera: Camera;

  constructor(private http: HttpClient) {
  }

  getImageUrl(slug: string): string {
    if (!slug) {
      return '';
    }
    return this.springImageUrl + slug;
  }

  getUsers(pageIndex: number, pageSize: number, sortField: string, sortOrder: string, filter: Array<{ key: string; value: string[] }>) {
    // const requestUrl = this.springApiUrl + `utilisateurs?page=${pageIndex - 1}&size=${pageSize}`;
    const requestUrl =
      this.springApiUrl + `utilisateurs?page=${pageIndex - 1}&size=${pageSize}${sortField ? '&sort=' + sortField : ''}${sortOrder ? ',' + sortOrder.substr(0, 4) : ''}`;
    return this.http.get<UtilisateursResponse>(requestUrl);
  }

  loadUser() {
    return this.http.get<User>(this.userLink || 'http://localhost:8080/utilisateurs/1');
  }

  setUserLink(link: string) {
    this.userLink = link;
  }

  getComplaints(link: string) {
    // @ts-ignore
    return this.http.get<Complaint[]>(link).pipe(map(data => data._embedded.reclamations));
  }

  deleteComplaints(complaintUrl: string) {
    return this.http.delete<any>(complaintUrl);
  }

  getImageData(href: string) {
    return this.http.get<Image>(href);
  }

  changeImageState(imageUrl: string, data: { 'verified': boolean }) {
    return this.http.patch<Image>(imageUrl, data);
  }

  loadComplaints() {
    this.getComplaints(this.userDetails._links.reclamations.href).subscribe(complaints => {
      this.userDetails.complaints = complaints || [];
    });
  }

  loadUserImages() {
    if (this.userDetails.perssone) {
      this.userDetails.perssone.images = [];
      if (this.userDetails?.perssone?._links?.images != null) {
        const array = (this.userDetails?.perssone?._links?.images instanceof Array) ? this.userDetails?.perssone?._links?.images :
          [this.userDetails?.perssone?._links?.images];
        array.forEach(imageLink => {
          this.getImageData(imageLink.href).subscribe(image => {
            this.userDetails.perssone.images.push(image);
          }, error => {
          });
        });
      }
    }
  }

  changeComplaintState(complaintLink: string, data: { statut: boolean }) {
    return this.http.patch<Complaint>(complaintLink, data);
  }

  addUserDepartment() {
    this.http.get<Departement>(this.userDetails.perssone?._links?.departement?.href).subscribe(departement => {
      this.userDetails.perssone.departement = departement;
    });
  }

  addUserFiliere() {
    this.userDetails.perssone.filiere = null;
    if (this.userDetails.perssone?._links?.filiere != null) {
      this.http.get<Filiere>(this.userDetails.perssone._links.filiere.href).subscribe(filiere => {
        this.userDetails.perssone.filiere = filiere;
      });
    }
  }

  addUserSemester() {
    this.userDetails.perssone.semester = null;
    if (this.userDetails.perssone?._links?.semesstre != null) {
      this.http.get<Semester>(this.userDetails.perssone._links.semesstre.href).subscribe(semester => {
        this.userDetails.perssone.semester = semester;
      });
    }
  }

  addUserProfileImage() {
    if (this.userDetails._links?.profileImage?.href != null) {
      this.http.get<Image>(this.userDetails._links?.profileImage?.href).subscribe(image => {
        this.userDetails.profileImage = image;
      }, error => {
      });
    }
  }

  deleteUser() {
    console.log(this.userDetails._links.self.href);
    return this.http.delete<any>(this.userDetails._links.self.href);
  }

  addUser(userData: UserPostData) {
    return this.http.post<User>(this.springApiUrl + 'createUser', userData);
  }

  getDepartments() {
    // @ts-ignore
    return this.http.get<Departement[]>(this.springApiUrl + 'departements').pipe(map(data => data._embedded.departements));
  }

  getFilieres() {
    // @ts-ignore
    return this.http.get<Filiere[]>(this.springApiUrl + 'filieres').pipe(map(data => data._embedded.filieres));
  }

  getSemesters() {
    // @ts-ignore
    return this.http.get<Departement[]>(this.springApiUrl + 'semesstres').pipe(map(data => data._embedded.semesstres));
  }

  uploadImage(formData: FormData) {
    return this.http.post(this.springApiUrl + 'upload', formData);
  }

  setImageAsPrimary(slug: string) {
    return this.http.post(this.springApiUrl + 'setImageAsPrimary?slug=' + slug, {});
  }

  getCameras(pageSize: number, pageIndex: number) {
    const requestUrl = this.springApiUrl + `cameras?page=${pageIndex - 1}&size=${pageSize}`;
    console.log(requestUrl);
    return this.http.get<CamerasResponse>(requestUrl);
  }
}
