import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DispatcherRoutingModule } from './dispatcher-routing.module';
import { DispatcherComponent } from './dispatcher.component';
import { DispatcherService } from './../../../../services/CRUD/DESPACHOAGUAINTELIGENTE/dispatcher.service';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
   imports: [CommonModule,
             DispatcherRoutingModule,
             FormsModule, QrCodeModule],
   declarations: [DispatcherComponent],
   providers: [
               NgbModal,
               DispatcherService
               ]
})
export class DispatcherModule {}