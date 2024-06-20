import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { enviroment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  /**
   * this service makes the user login in the backend
   * @param username 
   * @param password 
   * @returns 
   */
  public loginWithUserAndPassword(username: string, password: string){
    const body = {
      username: username,
      password: password
    }

    return lastValueFrom(this.http.post(enviroment.apiUrl + '/login/', body))
  }

}
