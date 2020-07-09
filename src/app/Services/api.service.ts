import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  Camera,
  CamerasResponse,
  Complaint,
  Departement,
  Filiere,
  Image,
  Room,
  SeanceResponse,
  Semester,
  StatusResponse,
  User,
  UserPostData,
  UtilisateursResponse
} from '../Data/APIDataClasses';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {Abscence, AbscenceResponse} from '../Data/AbscenceResponse';
import {StudentResponse} from '../Data/StudentResponse';
import {ElementApi, ElementsResponse} from '../Data/ElementsResponse';
import {SeanceProjectionResponse} from '../Data/SeanceProjectionResponse';
import {Seance, SeancesResponse} from '../Data/SeancesResponse';
import {DatePipe} from '@angular/common';

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
  cameraLink: string;

  constructor(private http: HttpClient, private authService: AuthService, private datePipe: DatePipe) {
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

  loadCamera() {
    if (this.cameraLink) {
      return this.http.get<Camera>(this.cameraLink);
    }
    // return this.http.get<Camera>(this.cameraLink || 'http://localhost:8080/cameras/1');
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
    return this.http.get<CamerasResponse>(requestUrl);
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  getStatus(href: string = this.selectedCamera._links.statuts.href) {
    return this.http.get<StatusResponse>(href);
  }

  getSalle(href: string = this.selectedCamera._links.salle.href) {
    return this.http.get<Room>(href);
  }

  setSelectedCamera(link: string) {
    this.cameraLink = link;
  }

  injectCameras(cameras: Camera[]) {
    cameras.forEach(camera => {
      this.getStatus(camera._links.statuts.href).subscribe(status => {
        camera.statuts = status._embedded.statuts;
      });
      this.getSalle(camera._links.salle.href).subscribe(rom => {
        camera.salle = rom;
      });
    });
  }

  getProfessorsSeances() {
    const user = this.authService.authUser.getValue();
    if (user.type === 'Prof') {
      const url = `http://localhost:8080/professeurs/${user.idUtilisateur}/seances`;
      console.log(url);
      return this.http.get<SeanceResponse>(url)
        .pipe(map(data => data._embedded.seances));
    }
  }

  getProfessorsSeancesProjection() {
    const user = this.authService.authUser.getValue();
    if (user.type === 'Prof') {
      const url = this.springApiUrl + '/seances/search/findAllByProfesseurIdAndJourIsNull?pofId=' +
        user.idUtilisateur + '&projection=SeanceProjection';
      console.log(url);
      return this.http.get<SeanceProjectionResponse>(url)
        .pipe(map(data => data._embedded.seances));
    }
  }

  getProfessorsElements(projectionName: string) {
    const user = this.authService.authUser.getValue();
    if (user.type === 'Prof') {
      const url = this.springApiUrl + `professeurs/${user.idUtilisateur}/elements?projection=` + projectionName;
      console.log(url);
      return this.http.get<ElementsResponse>(url)
        .pipe(map(data => data._embedded.elements));
    }
  }

  getSeance(id: number) {
    return this.http.get<Seance>(this.springApiUrl + 'seances/' + id);

  }

  getElement(href?: string, id?: number) {
    return this.http.get<ElementApi>(href ? href : this.springApiUrl + 'elements/' + id);
  }

  getAbsanceBySeanceId(seanceId: number) {
    return this.http.get<AbscenceResponse>(this.springApiUrl + `seances/${seanceId}/abscences`)
      .pipe(
        map(data => data._embedded.abscences));
  }

  getStudent(link: string) {
    return this.http.get<StudentResponse>(link);
  }

  editAbsance(data: boolean, id: any) {
    return this.http.patch<Abscence>(this.springApiUrl + 'abscences/' + id, {abscente: data});
  }

  getSeancebyElementId(id: number) {
    const url = this.springApiUrl + '/seances/search/findAllLessThanToday?id=' + id;
    return this.http
      .get<SeancesResponse>(url)
      .pipe(
        map(data => data._embedded.seances));
  }

  getAbsencesByHref(absencesHref: string) {
    return this.http.get<AbscenceResponse>(absencesHref)
      .pipe(
        map(data => data._embedded.abscences));
  }

  getSeancesGreaterThanToday(elementId: number) {
    const url = this.springApiUrl + '/seances/search/findAllGreaterThanToday?id=' + elementId;
    return this.http
      .get<SeancesResponse>(url)
      .pipe(
        map(data => data._embedded.seances));
  }

  editSeance(self: string, data: {
    self: string;
    date: string;
    startTime: Date;
    endTime: Date;
    edit: boolean;
  }) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const jourSeance = days[new Date(data.date).getDay()];
    const jour = this.datePipe.transform(data.date, 'yyyy-MM-dd');
    const d = new Date(jour);
    const heureDebut = new Date(d.getFullYear(), d.getMonth(), d.getDate(), data.startTime.getHours(), data.startTime.getMinutes(), 0);
    const heureFin = new Date(d.getFullYear(), d.getMonth(), d.getDate(), data.endTime.getHours(), data.endTime.getMinutes(), 0);

    const requestDate = {
      jourSeance,
      heureDebut,
      heureFin,
      jour
    };
    return this.http.patch<Abscence>(self, requestDate);
  }
}
