import { TicketService } from './../../services/CRUD/DESPACHOAGUAINTELIGENTE/ticket.service';
import { UserService } from './../../services/profile/user.service';
import { User } from './../../models/profile/User';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    public barChartData: any[] = [
        { data: [0], label: 'Atendido' },
        { data: [0], label: 'No Atendido' }
     ];
  
     public barChartData2: any[] = [
        { data: [0], label: 'Atendido' },
        { data: [0], label: 'No Atendido' }
     ];
  
     public barChartType: string  = 'bar';
     public barChartLabels: string[] = [
        ''
     ];
  
     
     users: User[] = [];

     public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
     };
  
     public barChartLegend: boolean = true;

    constructor(private userDataService: UserService, private ticketDataService: TicketService) {}

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.users = [];
        this.userDataService.get().then( r => {
           this.users = r as User[];
           this.getStatistics();
        }).catch( e => console.log(e) );
    }

    getStatistics() {
        this.ticketDataService.get_statistics().then( r => {
           this.barChartLabels = [''];
           const data_activo = {data: [0], label:'Atendido'};
           const data_usado = {data: [0], label:'No Atendido'};
           const data_activo_pedidos = {data: [0], label:'Atendido'};
           const data_usado_pedidos = {data: [0], label:'No Atendido'};
           const sorted_array_data = [];
           const sorted_data = {label: '', quantity_active: 0, quantity_used: 0, requests_active: 0, requests_used: 0};
           const incomming_data = r;
           incomming_data.forEach(element => {
              let user_of_element = null;
              this.users.forEach(user => {
                 if (element.user_id == user.id) {
                    user_of_element = user;
                 }
              });
              let existe = false;
              sorted_array_data.forEach(row => {
                 if (row.label == user_of_element.name) {
                    existe = true;
                    if (element.activo) {
                       row.quantity_active = element.quantity_of_wather;
                       row.requests_active = element.num_requests;
                    } else {
                       row.quantity_used = element.quantity_of_wather;
                       row.requests_used = element.num_requests;
                    }
                 }
              });
              if (!existe) {
                 if (element.activo) {
                    sorted_array_data.push({label: user_of_element.name, quantity_active: element.quantity_of_wather, quantity_used: 0, requests_active: element.num_requests, requests_used: 0});
                 } else {
                    sorted_array_data.push({label: user_of_element.name, quantity_active: 0, quantity_used: element.quantity_of_wather, requests_active: 0, requests_used: element.num_requests});
                 }               
              }
           });
           sorted_array_data.forEach(row => {
              this.barChartLabels.push(row.label);
              data_activo.data.push(row.quantity_active);
              data_usado.data.push(row.quantity_used);
              data_activo_pedidos.data.push(row.requests_active);
              data_usado_pedidos.data.push(row.requests_used);
           });
           this.barChartData = [data_activo, data_usado];
           this.barChartData2 = [data_activo_pedidos, data_usado_pedidos];
        }).catch( e => { console.log(e); });
    }
}
