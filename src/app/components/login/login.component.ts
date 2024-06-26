import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private as:AuthService, private router: Router){}
  dialog = inject(MatDialog);
  username: string = "";
  password: string = "";

  async login(){
    try{
      let resp = await this.as.loginWithUserAndPassword(this.username, this.password);
      let jsonResp = resp as {token: string};
      localStorage.setItem('token', jsonResp.token);
      console.log(jsonResp.token)

      this.router.navigateByUrl('/board')
    }catch(e){
      console.error(e);
    }
  }

  addContact(){
    const dialogRef = this.dialog.open(AddContactComponent);
  }
}
