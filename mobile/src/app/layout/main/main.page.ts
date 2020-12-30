import { Ticket } from './../../models/DESPACHOAGUAINTELIGENTE/Ticket';
import { TicketService } from './../../services/CRUD/DESPACHOAGUAINTELIGENTE/ticket.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BarcodeScannerOptions, BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  appName = 'Tickets';
  barcodeScannerOptions: BarcodeScannerOptions;
  userData = null;
  my_tickets: Ticket[] = [];
  new_ticket: Ticket = new Ticket();
  ocupado = false;

  constructor(private ticketDataService: TicketService, private barcodeScanner: BarcodeScanner,
    public toastController: ToastController) { 
      this.barcodeScannerOptions = {
        showFlipCameraButton : true,
        showTorchButton : true,
        torchOn: false,
        prompt : "Coloque el código QR dentro del área de escaneo", // Android
        resultDisplayDuration: 500,
        formats : "QR_CODE,PDF_417",
      };
    }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userData = JSON.parse(sessionStorage.getItem('user'));
    this.get_my_tickets();
  }

  request_ticket() {
   this.new_ticket.user_id = this.userData.id;
   this.ocupado = true;
   this.ticketDataService.post(this.new_ticket).then( r => {
    this.ocupado = false;
    this.showToast('Ticket Generado','Se ha generado un ticket.', 'success');
   }).catch( e => {
    this.ocupado = false;
    console.log(e);
   });
  }

  get_my_tickets() {
    if (!this.ocupado) {
      this.new_ticket = new Ticket();
      this.ocupado = true;
      this.ticketDataService.get_my_tickets(this.userData.id).then( r => {
        this.my_tickets = r as Ticket[];
        this.ocupado = false;
      }).catch( e => { console.log(e); });
    }
    setTimeout(() => {
      this.get_my_tickets();
  }, 3000);
  }

  scanQR(ticket: Ticket) {
    this.ocupado = true;
    this.ticketDataService.check_ticket(ticket.code, this.userData.id).then( r => {
      if (typeof r.response == 'undefined') {
        this.ocupado = false;
        this.showToast('Ticket no Encontrado', 'El ticket buscado no se encontró.', 'danger');
        return;
      }
      if (r.response == 'no existe') {
        this.ocupado = false;
        this.showToast('Ticket no Encontrado', 'El ticket buscado no se encontró.', 'danger');
        return;
      }
      if (r.response == 'utilizado') {
        this.ocupado = false;
        this.showToast('Ticket Utilizado', 'El ticket buscado ya fue utilizado.', 'danger');
        return;
      }
      if (r.response == 'expirado') {
        this.ocupado = false;
        this.showToast('Ticket Expirado', 'El ticket buscado de encuentra caducado.', 'danger');
        return;
      }
      this.barcodeScanner.scan(this.barcodeScannerOptions).then(barcodeData => {
        this.lookForData(barcodeData.text, ticket);
      }).catch(err => {
        this.ocupado = false;
        this.showToast('Permiso denegado','Se requiere autorización para utilizar la cámara.', 'danger');
      });
    }).catch( e => console.log(e) );
  }

  lookForData(code: string, ticket: Ticket) {
    ticket.dispatcher_code = code;
    this.ticketDataService.put(ticket).then( r => {
      this.ocupado = false;
      this.showToast('Despacho de Agua', 'Comunicando con unidad de Despacho', 'success');
    }).catch( e => {
      this.ocupado = false;
      console.log(e);
    });
  }

  async showToast(header, message, color) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      color: color,
      duration: 5000,
      position: 'middle',
    });
    toast.present();
  }
}
