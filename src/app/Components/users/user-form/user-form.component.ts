import {Component, OnDestroy, OnInit} from '@angular/core';
import {Departement, Filiere, Image, Semester, UserPostData} from '../../../Data/APIDataClasses.module';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../Services/api.service';
import {NzModalService, UploadFile} from 'ng-zorro-antd';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {
  validateForm!: FormGroup;
  current = 0;
  userTypes: string[] = ['Scolarité', 'Etudient', 'Prof'];
  userType: string;

  genders: string[] = ['male', 'female'];

  departments: Departement[];
  filieres: Filiere[];
  semesters: Semester[];
  fileList: UploadFile[] = [];
  isLoading: boolean;

  constructor(private modal: NzModalService, private fb: FormBuilder, private apiService: ApiService,
              private datePipe: DatePipe) {
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.validateForm.controls.password.value) {
      return {confirm: true, error: true};
    }
    return {};
  }

  onlyNumbers = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (isNaN(control.value)) {
      return {chars: true, error: true};
    }
    return {};
  }
  beforeUpload = (file: UploadFile): boolean => {
    // this.fileList = this.fileList.concat(file);
    this.fileList = [file];
    return false;
  }

  ngOnDestroy() {
    this.apiService.userDetails = null;
    this.apiService.addMode = false;
  }

  ngOnInit(): void {

    this.apiService.addMode = true;
    this.validateForm = this.fb.group({
      noImage: [false, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      prenom: [null, [Validators.required]],
      nom: [null, [Validators.required]],
      gender: [this.genders[0], [Validators.required]],
      dateNaissance: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required, this.onlyNumbers]],
      adresse: [null, [Validators.required]],
      cin: [null, [Validators.required]],
      cne: [null, [Validators.required]],
      departement: [null, [Validators.required]],
      filiere: [null, [Validators.required]],
      semester: [null, [Validators.required]],
    });

    this.addNewUser();
  }

  changeUserType(userType: string) {
    this.userType = userType;
  }

  onIndexChange(event: number): void {
    this.current = event;
    if (!this.departments || !this.filieres || !this.semesters) {
      this.loadDropDowns();
    }
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    if (this.current === 1) {
      this.submitForm();
    } else {
      this.current += 1;
    }
  }

  handleUpload(): void {
    const cne = this.apiService.userDetails.perssone.cne;
    if (cne == null) {
      this.isLoading = false;
      this.modal.error({
        nzTitle: 'Image upload failed',
        nzContent: 'CNE is not valide'
      });
    } else {
      const formData = new FormData();
      this.fileList.forEach((file: any) => {
        formData.append('file', file);
      });
      formData.append('cne', cne);
      this.apiService.uploadImage(formData).subscribe(
        (result: Image) => {
          this.apiService.userDetails.profileImage = result;
          if (this.apiService.userDetails.perssone.images) {
            this.apiService.userDetails.perssone.images.push(result);
          } else {
            this.apiService.userDetails.perssone.images = [result];
          }
          this.apiService.loadUser();
          this.isLoading = false;
          this.current += 1;
          console.log(result);
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
          this.modal.error({
            nzTitle: 'Image upload failed',
            nzContent: error.error.message
          });
        }
      );
    }

  }

  done(): void {
    if (this.fileList.length === 0) {
      if (this.validateForm.get('noImage').value === false) {
        this.modal.error({
          nzTitle: '<i>You didn\'t specify an image!</i>',
          nzOnOk: () => {
          }
        });
      } else {
        this.callApi(false);
      }
    } else {
      this.callApi(true);
    }

  }

  callApi(withPicture: boolean) {
    this.isLoading = true;
    this.apiService.addUser(this.formToUser()).subscribe(response => {
      console.log('data', response);
      this.apiService.userDetails = response;
      console.log(withPicture);
      if (withPicture) {
        this.handleUpload();
      } else {
        this.isLoading = false;
        this.current += 1;
      }
    }, error => {
      this.isLoading = false;
      this.modal.error({
        nzTitle: 'Error',
        nzContent: error.error.status + ', ' + error.error.error
      });
      console.log(error.error.status, error.error.error, error.error.message);
    });
  }

  submitForm() {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.done();
    }
  }

  addNewUser() {

    this.validateForm.reset();
    this.current = 0;
    this.userType = this.userTypes[1];
    this.validateForm.get('gender').setValue(this.genders[0]);
    this.loadDropDowns();
    this.apiService.userDetails = null;
    this.fileList = [];
    this.isLoading = false;
  }

  isStudent() {
    return this.userType === this.userTypes[1];
  }

  isStudentOrProf() {
    return this.userType !== this.userTypes[0];
  }


  private formToUser(): UserPostData {
    const userPostData: UserPostData = this.validateForm.value;
    userPostData.motDePass = this.validateForm.value.password;
    userPostData.tele = this.validateForm.value.phoneNumber;
    userPostData.type = this.userType;
    userPostData.dateNaissance = this.datePipe.transform(this.validateForm.value.dateNaissance,
      'yyyy-MM-dd');
    return userPostData;
  }

  private loadDropDowns() {
    if (this.isStudent()) {
      this.apiService.getFilieres().subscribe(data => {
        this.filieres = data;
        this.validateForm.get('filiere').setValue(this.filieres[0].nomFiliere);
      }, _ => {
      });
      this.apiService.getSemesters().subscribe(data => {
        this.semesters = data;
        this.validateForm.get('semester').setValue(this.semesters[0].nom);
      }, _ => {
      });
    }
    if (this.isStudentOrProf()) {
      this.apiService.getDepartments().subscribe(data => {
        this.departments = data;
        this.validateForm.get('departement').setValue(this.departments[0].nomDepartement);
      }, _ => {
      });
    }

  }


}

