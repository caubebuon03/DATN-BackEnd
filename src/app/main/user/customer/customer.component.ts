import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent extends BaseComponent implements OnInit {
  public customers: any;
  public customer: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public parent: 10;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'customer_name': [''],
      'customer_email': [''],
    });
    
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/customer/search-customer',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.customers = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/customer/search-customer',{page: this.page, pageSize: this.pageSize, customer_name: this.formsearch.get('customer_name').value,customer_email: this.formsearch.get('customer_email').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.customers = res.data;
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
            customer_email:value.customer_email,
            customer_name:value.customer_name,
            customer_phone:value.customer_phone,
            customer_address:value.customer_address,
            customer_password:value.customer_password,
                   
          };
        this._api.post('/api/customer/create-customer',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          customer_email:value.customer_email,
            customer_name:value.customer_name,
            customer_phone:value.customer_phone,
            customer_address:value.customer_address,
            customer_password:value.customer_password,
           customer_id:this.customer.customer_id,          
          };
        this._api.post('/api/customer/update-customer',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/customer/delete-customer',{customer_id:row.customer_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.customer = null;
    this.formdata = this.fb.group({
      'customer_email': ['', Validators.required],
      'customer_name': ['', Validators.required],
      'customer_phone': ['', Validators.required],
      'customer_address': ['', Validators.required],
      'customer_password': ['', Validators.required],
    }, {
    
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.customer = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'customer_email': ['', Validators.required],
        'customer_name': ['', Validators.required],
        'customer_phone': ['', Validators.required],
        'customer_address': ['', Validators.required],
        'customer_password': ['', Validators.required],

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
      this._api.get('/api/customer/get-by-id/'+ row.customer_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.customer = res; 
        
          this.formdata = this.fb.group({
            'customer_email': [this.customer.customer_email, Validators.required],
            'customer_name': [this.customer.customer_name, Validators.required],
            'customer_phone': [this.customer.customer_phone, Validators.required],
            'customer_address': [this.customer.customer_address, Validators.required],
            'customer_password': [this.customer.customer_password, Validators.required],
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
