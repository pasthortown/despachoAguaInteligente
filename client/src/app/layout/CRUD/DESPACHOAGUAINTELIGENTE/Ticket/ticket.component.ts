import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { TicketService } from './../../../../services/CRUD/DESPACHOAGUAINTELIGENTE/ticket.service';
import { Ticket } from './../../../../models/DESPACHOAGUAINTELIGENTE/Ticket';
import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';


@Component({
   selector: 'app-ticket',
   templateUrl: './ticket.component.html',
   styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
   tickets: Ticket[] = [];
   ticketSelected: Ticket = new Ticket();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   users: User[] = [];
   today = new Date();
   today_plus = new Date();

   constructor(
               private modalService: NgbModal,
               private toastr: ToastrManager,
               private userDataService: UserService,
               private ticketDataService: TicketService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getUser();
      this.refresh_clock();
   }

   refresh_clock() {
      this.today = new Date();
      this.today_plus = new Date();
      this.today_plus.setMinutes(this.today.getMinutes() + 10);
      setTimeout(() => {
          this.refresh_clock();
      }, 1000);
   }

   selectTicket(ticket: Ticket) {
      this.ticketSelected = ticket;
   }

   getUser() {
      this.users = [];
      this.userDataService.get().then( r => {
         this.users = r as User[];
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getTickets();
   }

   getTickets() {
      this.tickets = [];
      this.ticketSelected = new Ticket();
      this.ticketSelected.user_id = 0;
      this.ticketDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.tickets = r.data as Ticket[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newTicket(content) {
      this.ticketSelected = new Ticket();
      this.ticketSelected.user_id = 0;
      this.openDialog(content);
   }

   editTicket(content) {
      if (typeof this.ticketSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.openDialog(content);
   }

   deleteTicket() {
      if (typeof this.ticketSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.ticketDataService.delete(this.ticketSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getTickets();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.ticketDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain;charset=utf-8' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Tickets.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.ticketDataService.get().then( r => {
         const backupData = r as Ticket[];
         let output = 'id;code;dispatcher_code;start_time;end_time;attended;quantity;user_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.code + ';' + element.dispatcher_code + ';' + element.start_time + ';' + element.end_time + ';' + element.attended + ';' + element.quantity + ';' + element.user_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Tickets.csv');
      }).catch( e => console.log(e) );
   }

   decodeUploadFile(event) {
      const reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
         const file = event.target.files[0];
         reader.readAsDataURL(file);
         reader.onload = () => {
            const fileBytes = reader.result.toString().split(',')[1];
            const newData = JSON.parse(decodeURIComponent(escape(atob(fileBytes)))) as any[];
            this.ticketDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   openDialog(content) {
      this.modalService.open(content, { centered: true }).result.then(( response => {
         if ( response === 'Guardar click' ) {
            if (typeof this.ticketSelected.id === 'undefined' || this.ticketSelected.id === 0) {
               this.ticketSelected.start_time = new Date(
                  this.today.getFullYear().toString() + '-' + 
                  (this.today.getMonth() + 1).toString() + '-' + 
                  this.today.getDate().toString() + ' ' + 
                  (this.today.getHours() - 5).toString() + ':' + 
                  this.today.getMinutes().toString() + ':' + 
                  this.today.getSeconds().toString());
               this.ticketSelected.end_time = new Date(
                  this.today.getFullYear().toString() + '-' + 
                  (this.today.getMonth() + 1).toString() + '-' + 
                  this.today.getDate().toString() + ' ' + 
                  (this.today.getHours() - 5).toString() + ':' + 
                  (this.today.getMinutes() + 10).toString() + ':' + 
                  this.today.getSeconds().toString());
               this.ticketDataService.post(this.ticketSelected).then( r => {
                  this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
                  this.getTickets();
               }).catch( e => console.log(e) );
            } else {
               this.ticketDataService.put(this.ticketSelected).then( r => {
                  this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
                  this.getTickets();
               }).catch( e => console.log(e) );
            }
         }
      }), ( r => {}));
   }
}