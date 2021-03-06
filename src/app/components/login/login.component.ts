import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _auth: AuthService,
    private _flash: FlashMessagesService,
    private _router: Router) { }
  @ViewChild('form') form;

  user = {
    email: '',
    password: ''
  }

  ngOnInit(): void {
  }

  onLoginSubmit() {
    const user = this.user
    this._flash.show('loading..', { cssClass: 'alert-success', timeout: 1000});
    this._auth.loginUser(user).subscribe((data: {success: boolean, token: string}) => {
      this.form.reset();
      const token = data.token
      this._auth.saveToken(token);
      this._router.navigate(['/profile']);
      this._flash.show('logged in', { cssClass: 'alert-success', timeout: 2000});
    }, error => {
      this._flash.show(error, {cssClass: 'alert-danger', timeout: 5000})
    });
    return ;
  }
}
