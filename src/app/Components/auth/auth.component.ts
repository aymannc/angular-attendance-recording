import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../Services/auth.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  error: any;
  isLoading: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private messageService: NzMessageService) {
  }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
      remember: new FormControl(true)
    });
  }

  passwordValidator(control: FormControl): { [stat: string]: boolean } {
    const password: string = control.value;
    if (password) {
      // if (!password.match('\\S*(\\S*([a-zA-Z]\\S*[0-9])|([0-9]\\S*[a-zA-Z]))\\S*')) {
      if (password.length < 8) {
        return {passwordWeak: true};
      }
    }
    return null;
  }

  onSubmit() {
    this.error = null;
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authService.logIn(email, password).subscribe(
      results => {
        console.log(results);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      errorMessage => {
        this.isLoading = false;
        this.messageService.error(errorMessage);
      });

    this.loginForm.reset();
  }
}
