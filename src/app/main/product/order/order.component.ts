import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent extends BaseComponent implements OnInit {
  danhsachtrangthai: any;
  public orders: any;
  public order: any;
  public totalRecords: any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;
  public showUpdateModal: any;
  public isCreate: any;
  public parent: 1;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.getAllTrangThai();
    this.formsearch = this.fb.group({
      'ho_ten': [''],
    });


    this.search();
  }

  loadPage(page) {
    this._api.post('/api/hoadon/search', { page: page, pageSize: this.pageSize }).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalRecords = res.totalItems;
      this.pageSize = res.pageSize;
      this.page=page;
    });
  }

  getAllTrangThai() {
    this.danhsachtrangthai = [];
    this._api.get('/api/hoadon/all-trang-thai').takeUntil(this.unsubscribe).subscribe(res => {
      this.danhsachtrangthai = res;

    });
  }

  thayDoiTrangThai(matrangthai, madonhang) {
    let trangThai: string;
    matrangthai=parseInt(matrangthai);
    for (let i of this.danhsachtrangthai) {
      if (i.matrangthai === matrangthai) {
        trangThai = i.trangthai;
        break;
      }
    }
  if(confirm('bạn có muốn thay đổi trạng thái thành '+trangThai+'?')){
    
    let today = new Date();
    let ischangequantity = false;
    let dateFormat = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear() + ' '
      + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '.' + today.getMilliseconds();
    let audittrail = '<p> Chuyển trạng thái thành ' + '<span class="text-success">'+trangThai +'</span> bởi <b>Ryo god </b>' + ' vào lúc ' + dateFormat + '</p>';
    this._api.post('/api/hoadon/change-status', { ma_hoa_don: madonhang, matrangthai: matrangthai, ischangequantity: ischangequantity, audittrail: audittrail })
      .takeUntil(this.unsubscribe).subscribe(res => {
        this.loadPage(this.page);
      });
  }
  }
  search() {
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/hoadon/search', { page: this.page, pageSize: this.pageSize, ho_ten: this.formsearch.get('ho_ten').value }).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalRecords = res.totalItems;
      this.pageSize = res.pageSize;
    });
  }



  get f() { return this.formdata.controls; }



  Reset() {
    this.order = null;
    this.formdata = this.fb.group({
      'ho_ten': ['', Validators.required],
      'dia_chi': ['', Validators.required],
      'so_dien_thoai': ['', Validators.required],
      'total': ['', Validators.required],
    }, {

    });
  }
  xemLichSuDonHang(item) {
    this.order=item;
   setTimeout(() => {
    $('#lichSuDonHang').modal('toggle');
   }, );
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.order = null;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.formdata = this.fb.group({
        'ma_hoa_don': ['', Validators.required],
        'ho_ten': ['', Validators.required],
        'dia_chi': ['', Validators.required],
        'so_dien_thoai': ['', [Validators.required]],
        'total': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/hoadon/get-chi-tiet-by-hoa-don/' + row.ma_hoa_don).takeUntil(this.unsubscribe).subscribe((res: any) => {
        this.order = res;
        this.formdata = this.fb.group({
          'ma_hoa_don': [this.order.ma_hoa_don, Validators.required],
          'ho_ten': [this.order.ho_ten, Validators.required],
          'dia_chi': [this.order.dia_chi, Validators.required],
          'so_dien_thoai': [this.order.so_dien_thoai, Validators.required],
          'total': [this.order.total, Validators.required],
        });
        this.doneSetupForm = true;
      });
    }, 700);
  }




  closeModal() {
    $('#createsanphamModal').closest('.modal').modal('hide');
  }
  closeModal2() {
    $('#lichSuDonHang').closest('.modal').modal('hide');
  }
}
