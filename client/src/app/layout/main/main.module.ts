import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ChartsModule } from 'ng2-charts';
import { QrCodeModule } from 'ng-qrcode';
import { TicketService } from './../../services/CRUD/DESPACHOAGUAINTELIGENTE/ticket.service';
import { UserService } from './../../services/profile/user.service';

@NgModule({
    imports: [CommonModule, MainRoutingModule, ChartsModule, QrCodeModule],
    declarations: [MainComponent],
    providers: [UserService, TicketService]
})
export class MainModule {}
