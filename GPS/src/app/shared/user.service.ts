import { Injectable } from '@angular/core';
import {User} from './user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    nom: '',
    prenom: '',
    mail: '',
    password: ''
  };

  constructor(private http: HttpClient) { }

  postUser(user: User)
  {
    return this.http.post(environment.api +'/inscription', user);
  }

  login(authCredentials) {
    //return this.http.post(environment.api + '/authenticate', authCredentials,this.noAuthHeader);
  }
 
 setToken(token: string) {
    localStorage.setItem('token', token);
  }
 
  getToken() {
    return localStorage.getItem('token');
  }
 
  deleteToken() {
    localStorage.removeItem('token');
  }
}
