import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private as:AuthService, private router: Router){}

  username: string = "";
  password: string = "";

  async login(){
    try{
      let resp = await this.as.loginWithUserAndPassword(this.username, this.password);
      let jsonResp = resp as {token: string};
      localStorage.setItem('token', jsonResp.token);
      console.log(jsonResp.token)
    }catch(e){
      console.error(e);
    }
  }
}
