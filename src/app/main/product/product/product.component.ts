
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs-compat';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent extends BaseComponent implements OnInit {
  public products: any;
  public product: any;
  menus: any;
  brands: any;
  category : any;
  category_id: any;
  public totalRecords:any;
  public pageSize :any;
  public page :any;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'product_name': [''],
      'category_id': [''],
      'product_price': [''],     
    });
    this._api.get('/api/category/get-category').takeUntil(this.unsubscribe).subscribe(res => {
      this.menus = res;
    }); 
    
    
    this._api.get('/api/brand/get-brand').takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res;
      
    }); 
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/product/timkiem',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 12;
    this._api.post('/api/product/timkiem',{page: this.page, pageSize: this.pageSize, product_name: this.formsearch.get('product_name').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
      
  }
  

  

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           product_image:data_image,
           product_name:value.product_name,
           category_id:value.category_id,
           brand_id:value.brand_id,
           product_CPU:value.product_CPU,
           product_Ram:value.product_Ram,
           product_VGA:value.product_VGA,
           product_desc:value.product_desc,
           product_price: +value.product_price,           
          };
        this._api.post('/api/product/create-product',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          product_image:data_image,
          product_name:value.product_name,
          category_id:value.category_id,
          brand_id:value.brand_id,
          product_CPU:value.product_CPU,
          product_Ram:value.product_Ram,
          product_VGA:value.product_VGA,
          product_price: +value.product_price,
          product_desc:value.product_desc,
          product_id:this.product.product_id,          
          };
        this._api.post('/api/product/update-product',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/product/delete-product',{product_id:row.product_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.product = null;
    this.formdata = this.fb.group({
      'product_name': ['', Validators.required],
      'product_Ram': ['', Validators.required],
      'product_CPU': ['',Validators.required],
      'product_VGA': ['', Validators.required],
      'category_id': ['',Validators.required,],
      'brand_id': ['', Validators.required],
      'product_price': ['', [Validators.required]],
      'product_desc': ['', Validators.required],
    }, {
    
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.product = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
      'product_name': ['',Validators.required],
      'product_Ram': ['',Validators.required],
      'product_CPU': ['',Validators.required],
      'product_VGA': ['',Validators.required],
      'category_id': ['',Validators.required],
      'brand_id': ['', Validators.required],
      'product_price': ['', Validators.required],
      'product_desc': ['', Validators.required],

      }, {
        
      });
      
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/product/get-by-id/'+ row.product_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.product = res; 
        
          this.formdata = this.fb.group({
            'product_name': [this.product.product_name, Validators.required],
            'product_Ram': [this.product.product_Ram, Validators.required],
            'product_CPU': [this.product.product_CPU,Validators.required],
            'product_VGA': [this.product.product_VGA, Validators.required],
            'category_id': [this.product.category_id,Validators.required,],
            'brand_id': [this.product.brand_id, Validators.required],
            'product_price': [this.product.product_price, [Validators.required]],
            'product_desc': [this.product.product_desc, Validators.required],
            'product_image': [this.product.product_image, Validators.required],
            
          }, {
            
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
