import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { Ticket } from './../../../models/DESPACHOAGUAINTELIGENTE/Ticket';

@Injectable({
   providedIn: 'root'
})
export class TicketService {

   url = environment.api_despachoaguainteligente + 'ticket/';
   options = null;

   constructor(private http: HTTP, private router: Router) {
      this.http.setDataSerializer('json');
      this.http.setServerTrustMode('nocheck');
      this.options = {'api_token': sessionStorage.getItem('api_token'), 'Content-Type': 'application/json'};
   }

   get(id?: number): Promise<any> {
      if (typeof id === 'undefined') {
         return this.http.get(this.url, {}, this.options)
         .then( r => {
            return JSON.parse(r.data);
         }).catch( error => { this.handledError(error);  });
      }
      return this.http.get(this.url + '?id=' + id.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }

   check_ticket(code: String, user_id: number): Promise<any> {
      return this.http.get(this.url + 'check_ticket?code=' + code + '&user_id=' + user_id.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => { this.handledError(error);  });
   }

   get_my_tickets(user_id: number): Promise<any> {
      return this.http.get(this.url + 'get_my_requests?user_id=' + user_id.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => { this.handledError(error);  });
   }

   get_paginate(size: number, page: number): Promise<any> {
      return this.http.get(this.url + 'paginate?size=' + size.toString() + '&page=' + page.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => { this.handledError(error);  });
   }

   delete(id: number): Promise<any> {
      return this.http.delete(this.url + '?id=' + id.toString(), {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }

   getBackUp(): Promise<any> {
      return this.http.get(this.url + 'backup', {}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }

   post(ticket: Ticket): Promise<any> {
      return this.http.post(this.url, ticket, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }

   put(ticket: Ticket): Promise<any> {
      return this.http.put(this.url, ticket, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }

   masiveLoad(data: any[]): Promise<any> {
      return this.http.post(this.url + 'masive_load', {data: data}, this.options)
      .then( r => {
         return JSON.parse(r.data);
      }).catch( error => {
         return JSON.stringify(error); 
      });
   }

   handledError(error: any) {
      console.log(error);
      sessionStorage.clear();
      this.router.navigate(['/login']);
   }
}