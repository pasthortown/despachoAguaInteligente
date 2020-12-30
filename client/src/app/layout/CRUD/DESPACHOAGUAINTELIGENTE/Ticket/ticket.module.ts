import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { TicketService } from './../../../../services/CRUD/DESPACHOAGUAINTELIGENTE/ticket.service';
import { UserService } from './../../../../services/profile/user.service';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
   imports: [CommonModule,
             TicketRoutingModule,
             QrCodeModule,
             FormsModule],
   declarations: [TicketComponent],
   providers: [
               NgbModal,
               UserService,
               TicketService
               ]
})
export class TicketModule {}