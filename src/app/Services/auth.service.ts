import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../Data/UtilisateursResponse.module';
import {catchError, tap} from 'rxjs/operators';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUser = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {
  }

  private static handleErrors(errorRes: HttpErrorResponse) {
    let errorMessage = 'unknown error occurred !';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account !';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier !';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password !';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator !';
        break;
    }
    return throwError(errorMessage);
  }


  logIn(email: string, password: string) {
    return this.http.post<User>(this.apiService.springApiUrl + 'login', {
      email,
      password,
    })
      .pipe(
        catchError(AuthService.handleErrors),
        tap(user => {
            this.registerUser(user);
          }
        )
      );
  }


  checkForUser() {
    console.log('checking for a user');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user !== null) {
      this.authUser.next(user);
      return;
    }
    this.authUser.next(null);
  }

  logOut() {
    this.authUser.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['login']);

  }

  private registerUser(user: User) {
    console.log('registerUser', user);
    this.authUser.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  //

  //
  // // private autoLogout(expirationTime: number) {
  // //   this.expirationTimeOut = setTimeout(() => {
  // //     this.logOut();
  // //   }, expirationTime);
  // // }
  //

}
