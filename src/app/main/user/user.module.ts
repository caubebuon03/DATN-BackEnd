import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerComponent } from './customer/customer.component';
@NgModule({
  declarations: [UserComponent, UserComponent, CustomerComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'customer',
        component: CustomerComponent,
      },
  ]),  
  ]
})
export class UserModule { }
