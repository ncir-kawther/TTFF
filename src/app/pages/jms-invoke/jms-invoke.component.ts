import { OnInit, ViewEncapsulation } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, ControlContainer, FormGroup, FormControl } from '@angular/forms';
import { FocusModule } from 'angular2-focus';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, Inject, ViewChild, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import '../../../assets/charts/echart/echarts-all.js';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { API_ENDPOINT } from '../../app.constants';



@Component({
  selector: 'app-jms-invoke',
  templateUrl: './jms-invoke.component.html',
  styleUrls: ['./jms-invoke.component.css',
  '../../../../node_modules/ng2-toasty/style-bootstrap.css',
  '../../../../node_modules/ng2-toasty/style-default.css',
  '../../../../node_modules/ng2-toasty/style-material.css',
], encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class JmsInvokeComponent implements OnInit {
  dataFinal: any;
  position = 'bottom-right';
  title: string;
  msg: string;
  showClose = true;
  timeout = 5000;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;
  dataprojects: any;
  dataclients : any;
  dataOperation : any;
  dataCreateProcess : any;
  ShowOperation : boolean;
  Operationclicked : boolean;
  ChoiceLogInfoExcepType : boolean;
  objUrl = {};
  objInv = {};
  objOp = {};
  objLogType = {};
  objCreate = {};
  private ProjectsArray: Array<any> = [];
  private ClientsArray: Array<any> = [];
  private OperationsArray: Array<any> = [];
 public SelectedProcess: String;
  public CallsAddedSucc: boolean;
  public CallsAddedFail: boolean;
  public JmsInvokeJson: string;
  public InvSynch:String="SynchronousInvokeCall";
  public InvAsynch:String="AsynchronousInvokeCall"
  public sub: any;
  public pname: any;
  public ptype :any;
  public pclient : any;

  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  constructor(  private route: ActivatedRoute,
    private router: Router, private http: HttpClient, private toastyService: ToastyService){

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
  this.sub = this.route
  .queryParams
  .subscribe(params => {
    //console.log(params);
    // Defaults to 0 if no query param provided.
    this.pname = params['project'];
    this.ptype = params['type'];
    this.pclient = params['client'];
    // console.log(this.pname);
    // console.log(this.ptype);
    // console.log(this.pclient);
  });

  this.Operationclicked = false;
  this.ChoiceLogInfoExcepType =false;
  this.GetProjects('userX');
  Object.assign(this.objUrl, {ClientName: "Oreedo",ProjectName:this.pname,ProjectType:this.ptype});
  // console.log(this.objUrl);

//  this.UtilsArray.push(this.pname,this.ptype,this.pclient);
}


GetProjects(username: string) {
  this.http.get('http:/' +  API_ENDPOINT + ':8084/GetProject?Username=' + username).subscribe(data => {
    this.dataprojects = data;
    for (const elt of this.dataprojects.resultSet.record) {
      this.ProjectsArray.push(elt);
    }
   // console.log(this.ProjectsArray);
  });
   //console.log(this.ProjectsArray);

}

invoquer(pname: String, cname: String, type: String) {

  // tslint:disable-next-line:max-line-length
  this.http.get('http://' + API_ENDPOINT + ':7070/ShowOperation?projectName=' + pname + '&clientName=Oreedo&typeTemplate=' + type).subscribe(data => {

    this.dataOperation = data;
    //console.log(data);
    this.Operationclicked=true;

});
Object.assign(this.objInv, {ClientNameInv: "Oreedo", ProjectNameInv: pname, ProjectTypeInv: type});

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

GO(OperationName:String){
  // this.UtilsArray.push(OperationName);
  // console.log(this.UtilsArray);
  Object.assign(this.objOp, {OpName:OperationName});
  this.ChoiceLogInfoExcepType =true;
}

OnSubmit(Loginfo: boolean, LogExcep: boolean, Syn: boolean, Asyn: boolean){

  if (Loginfo)
  {
    Object.assign(this.objLogType, {LogInfo:"true"});

  }
  else{
    Object.assign(this.objLogType, {LogInfo:"false"});

  }
  if(LogExcep){
    Object.assign(this.objLogType, {LogExcep:"true"});

  }  else{
    Object.assign(this.objLogType, {LogExcep:"false"});

    }
  if(Syn){
    Object.assign(this.objLogType, {Syn:"true"});

  }  else{
    Object.assign(this.objLogType, {Syn:"false"});

    }
  if(Asyn){
    Object.assign(this.objLogType, {Asyn:"true"});

  }  else{
    Object.assign(this.objLogType, {Asyn:"false"});

    }
  Object.assign(this.objCreate, this.objUrl,this.objInv,this.objOp,this.objLogType);
  console.log(this.objCreate);
   console.log(JSON.stringify(this.objCreate));

   this.http.post('http://' +  API_ENDPOINT + ':7071/CreateInvocationProcess', JSON.stringify(this.objCreate)).subscribe(data => {
     console.log(data);
     this.dataFinal=data;
     if (this.dataFinal.root.Status == 'SUCCESS') {
      // tslint:disable-next-line:max-line-length
      this.addToast ({title: 'SUCCESS', msg: 'INVOCATION JMS CREATED', timeout: 7000, theme: 'bootstrap', position: 'top-right', type: 'success'});
    } else {
      this.addToast ({title: 'FAIL', msg: 'An error occured while creating Jms Invocation', timeout: 7000, theme: 'bootstrap', position: 'top-right', type: 'error'});
    }


   });
}
}
