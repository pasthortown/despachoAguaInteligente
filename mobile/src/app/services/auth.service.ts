import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   options = null;

   constructor(private http: HTTP) {
      this.http.setDataSerializer('json');
      this.http.setServerTrustMode('nocheck');
      this.options = {'Content-Type': 'application/json'};
   }
  
  login(email: String, password: String): Promise<any> {
    const data = {email: email, password: password};
    return this.http.post(environment.api_despachoaguainteligente + 'login', data, this.options)
    .then( r =>
      JSON.parse(r.data)
    ).catch( error => { JSON.stringify(error); });
  }
  
  register(name: String, email: String): Promise<any> {
    const data = {name: name, email: email};
    return this.http.post(environment.api_despachoaguainteligente + 'register', data, this.options)
    .then( r =>
      JSON.parse(r.data)
    ).catch( error => { console.log(error); });
  }

  password_recovery_request(email: String): Promise<any> {
    const data = {email: email};
    return this.http.post(environment.api_despachoaguainteligente + 'password_recovery_request', data, this.options)
    .then( r =>
      JSON.parse(r.data)
    ).catch( error => { console.log(error); });
  }
  
  password_change(new_password: String,  user_id: number): Promise<any> {
    const data = {new_password: new_password, user_id: user_id};
    this.options = {'api_token': sessionStorage.getItem('api_token'), 'Content-Type': 'application/json'};
    return this.http.post(environment.api_despachoaguainteligente + 'user/password_change', data, this.options)
    .then( r =>
      JSON.parse(r.data)
    ).catch( error => { console.log(error); });
  }
}
