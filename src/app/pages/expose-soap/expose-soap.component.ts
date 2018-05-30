import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { API_ENDPOINT } from '../../app.constants';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-expose-soap',
  templateUrl: './expose-soap.component.html',
  styleUrls: ['./expose-soap.component.css',
  '../../../../node_modules/ng2-toasty/style-bootstrap.css',
  '../../../../node_modules/ng2-toasty/style-default.css',
  '../../../../node_modules/ng2-toasty/style-material.css',
], encapsulation: ViewEncapsulation.None
})
export class ExposeSoapComponent implements OnInit {
  position = 'bottom-right';
  title: string;
  msg: string;
  showClose = true;
  timeout = 5000;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;

public dataFinal: any;
public sub: any;
public OperationsArray :Array<any>=[];
public pname: any;
public ptype :any;
public pclient : any;
public dataOperations : any;
public dataWsdl : any;
elmt = {};
  constructor(private route: ActivatedRoute,
    private router: Router, private http: HttpClient, private toastyService: ToastyService) { }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {

      this.pname = params['project'];
      this.ptype = params['type'];
      this.pclient = params['client'];

    });
    this.http.get('http://' + API_ENDPOINT + ':7072/GetAllOperations?clientname=Oreedo&projectname=' + this.pname + '&projecttype=' + this.ptype).subscribe(data => {
      this.dataOperations = data;
      for (const elt of this.dataOperations.Operations.OpName) {
        this.OperationsArray.push(elt);
      }

    });
  }
  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout,
      theme: options.theme,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };
  
    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

GO(OperationName: any){
  // tslint:disable-next-line:max-line-length
  this.http.post('http://' + API_ENDPOINT +':7073/CreateWsdl?nomclient=Oreedo&nomprojet='+ this.pname + '&typeprojet=' + this.ptype, JSON.stringify({"Operations": {"input":OperationName}})).subscribe(data => {
    console.log(data);
    this.dataWsdl=data;
    console.log(this.dataWsdl);
     if (this.dataWsdl.root.Status == 'SUCCESS') {
      // tslint:disable-next-line:max-line-length
      this.addToast ({title: 'SUCCESS', msg: 'EXPOSITION SOAP CREATED', timeout: 7000, theme: 'bootstrap', position: 'top-right', type: 'success'});
    } else {
      this.addToast ({title: 'FAIL', msg: 'An error occured while creating SOAP Exposition', timeout: 7000, theme: 'bootstrap', position: 'top-right', type: 'error'});
    }

  });
  console.log(JSON.stringify({"Operations": {"input":OperationName}}))
}


}
