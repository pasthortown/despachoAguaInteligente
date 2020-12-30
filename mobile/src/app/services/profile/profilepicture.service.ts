import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from './../../../environments/environment';
import { ProfilePicture } from './../../models/profile/ProfilePicture';

@Injectable({
providedIn: 'root'
})
export class ProfilePictureService {

   url = environment.api_despachoaguainteligente + 'profilepicture/';
   options = null;

   constructor(private http: HTTP) {
      this.http.setDataSerializer('json');
      this.http.setServerTrustMode('nocheck');
      this.options = {'api_token': sessionStorage.getItem('api_token'), 'Content-Type': 'application/json'};
   }
   
   get(user_id: number): Promise<any> {
      return this.http.get(this.url + '?user_id=' + user_id.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }
   
   get_paginate(size: number, page: number): Promise<any> {
      return this.http.get(this.url + 'paginate?size=' + size.toString() + '&page=' + page.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }
   
   delete(id: number): Promise<any> {
      return this.http.delete(this.url + '?id=' + id.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }
   
   post(profilepicture: ProfilePicture): Promise<any> {
      return this.http.post(this.url, profilepicture, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }
   
   put(profilepicture: ProfilePicture): Promise<any> {
      return this.http.put(this.url, profilepicture, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }
   
   handledError(error: any) {
      console.log(error);
   }
}