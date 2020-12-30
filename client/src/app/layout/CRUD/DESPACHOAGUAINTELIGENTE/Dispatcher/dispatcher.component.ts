import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { DispatcherService } from './../../../../services/CRUD/DESPACHOAGUAINTELIGENTE/dispatcher.service';
import { Dispatcher } from './../../../../models/DESPACHOAGUAINTELIGENTE/Dispatcher';

@Component({
   selector: 'app-dispatcher',
   templateUrl: './dispatcher.component.html',
   styleUrls: ['./dispatcher.component.scss']
})
export class DispatcherComponent implements OnInit {
   dispatchers: Dispatcher[] = [];
   dispatcherSelected: Dispatcher = new Dispatcher();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   constructor(
               private modalService: NgbModal,
               private toastr: ToastrManager,
               private dispatcherDataService: DispatcherService) {}

   ngOnInit() {
      this.goToPage(1);
   }

   selectDispatcher(dispatcher: Dispatcher) {
      this.dispatcherSelected = dispatcher;
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getDispatchers();
   }

   getDispatchers() {
      this.dispatchers = [];
      this.dispatcherSelected = new Dispatcher();
      this.dispatcherDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.dispatchers = r.data as Dispatcher[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newDispatcher(content) {
      this.dispatcherSelected = new Dispatcher();
      this.openDialog(content);
   }

   editDispatcher(content) {
      if (typeof this.dispatcherSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.openDialog(content);
   }

   deleteDispatcher() {
      if (typeof this.dispatcherSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.dispatcherDataService.delete(this.dispatcherSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getDispatchers();
      }).catch( e => console.log(e) );
   }

   backup() {
      this.dispatcherDataService.getBackUp().then( r => {
         const backupData = r;
         const blob = new Blob([JSON.stringify(backupData)], { type: 'text/plain;charset=utf-8' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Dispatchers.json');
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.dispatcherDataService.get().then( r => {
         const backupData = r as Dispatcher[];
         let output = 'id;code\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.code + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_Dispatchers.csv');
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
            this.dispatcherDataService.masiveLoad(newData).then( r => {
               this.goToPage(this.currentPage);
            }).catch( e => console.log(e) );
         };
      }
   }

   openDialog(content) {
      this.modalService.open(content, { centered: true }).result.then(( response => {
         if ( response === 'Guardar click' ) {
            if (typeof this.dispatcherSelected.id === 'undefined') {
               this.dispatcherDataService.post(this.dispatcherSelected).then( r => {
                  this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
                  this.getDispatchers();
               }).catch( e => console.log(e) );
            } else {
               this.dispatcherDataService.put(this.dispatcherSelected).then( r => {
                  this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
                  this.getDispatchers();
               }).catch( e => console.log(e) );
            }
         }
      }), ( r => {}));
   }
}