import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from './dispatcher.component';

const routes: Routes = [
   {
      path: '',
      component: DispatcherComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class DispatcherRoutingModule {}
