import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent extends BaseComponent implements OnInit {
  public brands: any;
  public brand: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public parent: 1;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'brand_name': [''],
    });
    
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/brand/search-brand',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/brand/search-brand',{page: this.page, pageSize: this.pageSize, brand_name: this.formsearch.get('brand_name').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res.data;
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
          parent_brand_id:this.parent,
           brand_name:value.brand_name,
           brand_desc:value.brand_desc,
           url:value.url,       
          };
        this._api.post('/api/brand/create-brand',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          
          brand_name:value.brand_name,
           brand_desc:value.brand_desc,
           url:value.url,
          brand_id:this.brand.brand_id,          
          };
        this._api.post('/api/brand/update-brand',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/brand/delete-brand',{brand_id:row.brand_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.brand = null;
    this.formdata = this.fb.group({
      'brand_name': ['', Validators.required],
      'brand_desc': ['', Validators.required],
      'url': ['', Validators.required],
    }, {
    
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.brand = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
      'brand_name': ['',Validators.required],
      'brand_desc': ['',Validators.required],
      'url': ['',Validators.required],

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
      this._api.get('/api/brand/get-by-id/'+ row.brand_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.brand = res; 
        
          this.formdata = this.fb.group({
            'brand_name': [this.brand.brand_name,Validators.required],
            'brand_desc': [this.brand.brand_desc,Validators.required],
            'url': [this.brand.url,Validators.required],
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
