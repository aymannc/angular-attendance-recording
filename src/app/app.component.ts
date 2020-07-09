import {Component, OnInit} from '@angular/core';
import {AuthService} from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Lriyab';

  constructor(protected authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.checkForUser();
  }

  checkForUser() {
    return this.authService.authUser.getValue() !== null;
  }

  isUserProf() {
    return this.authService.authUser.getValue().type === 'Prof';
  }

  isUserStudent() {
    return this.authService.authUser.getValue().type === 'Etudient';
  }

  isUserAdmin() {
    return this.authService.authUser.getValue().type === 'Etudient';
  }
}
