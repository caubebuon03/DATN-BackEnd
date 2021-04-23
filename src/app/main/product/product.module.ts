import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { BrandComponent } from './brand/brand.component';

const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'category',
    component: TypeComponent
  },
  { path: 'order', component: OrderComponent},
  { path: 'brand', component: BrandComponent }
];

@NgModule({
  declarations: [ 
    OrderComponent,ProductComponent,TypeComponent, BrandComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FileUploadModule,
    SharedModule,
  ]
})
export class ProductModule { }
