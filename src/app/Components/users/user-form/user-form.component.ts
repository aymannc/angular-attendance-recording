import {Component} from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  current = 0;
  userTypes: string[] = ['Scolarité', 'Teacher', 'Student'];
  currentUserType = this.userTypes[0];

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  done(): void {
    console.log('done');
  }

  changeUserType(userType: string) {
    this.currentUserType = userType;
  }

  onIndexChange(event: number): void {
    this.current = event;
  }
}
