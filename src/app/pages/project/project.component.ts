import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormBuilder, Validators, ControlContainer, FormGroup, FormControl } from '@angular/forms';
import { FocusModule } from 'angular2-focus';
import { Router } from '@angular/router';
import { ProjectfilterpipePipe } from './../../projectfilterpipe.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import '../../../assets/charts/echart/echarts-all.js';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { HttpModule, Http, Response, Headers } from '@angular/http';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { API_ENDPOINT, USERS_WORKSPACE } from '../../app.constants';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css',
    '../../../../node_modules/ng2-toasty/style-bootstrap.css',
    '../../../../node_modules/ng2-toasty/style-default.css',
    '../../../../node_modules/ng2-toasty/style-material.css'],

  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProjectComponent implements OnInit {
  position = 'top-right';
  msg: string;
  showClose = true;
  timeout = 5000;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;


  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;
  // Data Variables

  serviceUrl: string;
  data: any;
  dataclients: any;
  dataprojects: any;
  datatemplates: any;
  // NG IF VARIABLES

  public showdivsucc: boolean;
  public showdivfail: boolean;
  public addnew: boolean;
  public basic: boolean;

  public operation: boolean;
  public autofoc: boolean;
  public addnewops: boolean;

  public modify: boolean;
  public upload: boolean;
  public checkout: boolean;
  public operationfoc: boolean;
  public OperationsNotAdded: boolean;
  public OperationsAdded: boolean;
  public uploadSuccess: boolean;
  public uploadFail: boolean;

  // Data Arrays after getting them
  private OperationsArray: Array<string> = [];
  private ProjectsArray: Array<any> = [];
  private ClientsArray: Array<any> = [];
  private TemplatesArray: Array<any> = [];
  public fileToUpload: File = null;
  // Needed Variables
  public filename: any;
  public jsonOperations: any;
  public dataa: any;
  public ProjectName: any;
  public selectedvalue: string;
  public projname: string;
  private newAttribute: string;
  public output: string;
  public pname: string;

  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  public res: any;
  profitChartOption: any;
  constructor(private http: HttpClient, private router: Router, private toastyService: ToastyService) { }

  // Listing Projects and hiding divisions ON INIT
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    // this.serviceUrl = '192.168.110.224';
    this.http.get('http://' + API_ENDPOINT + ':8090/GetTemplates?ClientName=' + 'Oreedo').subscribe(data => {
      this.datatemplates = data;
      console.log(this.datatemplates);
      for (const elt of this.datatemplates.Templates) {
        this.TemplatesArray.push(elt);
      }
      console.log(this.TemplatesArray);
    });
    this.showdivsucc = false;
    this.showdivfail = false;
    this.basic = true;
    this.addnew = false;
    this.OperationsNotAdded = false;
    this.upload = false;
    this.checkout = false;
    this.modify = false;
    this.GetProjects('userX');


  }



  // Show Generate New project Div
  onNew(f: NgForm) {
    this.addnew = !this.addnew;
    this.showdivfail = false;
    this.operation = false;
  }

  // Get projects BY USER_CLIENTS
  GetProjects(username: string) {
    this.http.get('http://' + API_ENDPOINT + ':8084/GetProject?Username=' + username).subscribe(data => {
      this.dataprojects = data;
      for (const elt of this.dataprojects.resultSet.record) {
        this.ProjectsArray.push(elt);
      }
      console.log(this.ProjectsArray);
    });

    this.http.get('http://' + API_ENDPOINT + ':8087/GetClient?Username=' + username).subscribe(data => {
      this.dataclients = data;
      console.log(this.dataclients.root.record.clientName[0]);
      for (const elt of this.dataclients.root.record.clientName) {
        this.ClientsArray.push(elt);
      }
      console.log(this.ClientsArray);
    });

  }

  // Show Create Operations Div
  onOld(pname: string) {
    this.projname = pname;
    console.log(this.projname);
    this.operation = !this.operation;
    console.log(this.operation);
    this.showdivfail = false;
    this.addnew = false;
  }


  // Call Checkout Service
  Checkout(pname, client: string) {
    console.log(pname);
    console.log(client);
    // tslint:disable-next-line:max-line-length
    this.http.get('http://' + API_ENDPOINT + ':8085/checkout?ProjectName=' + pname + '&Client=Orange&Username=hejer').subscribe(data => {
      console.log(data);

    });
    this.checkout = true;
  }


  // Get Templates After Choosing A Client
  onSelect(client: string) {
    this.TemplatesArray = [];
    console.log(client);
    this.http.get('http://' + API_ENDPOINT + ':8090/GetTemplates?ClientName=' + client).subscribe(data => {
      this.datatemplates = data;
      console.log(this.datatemplates.Templates.template);
      for (const elt of this.datatemplates.Templates.template) {
        this.TemplatesArray.push(elt);
      }
      console.log(this.TemplatesArray);
    });

  }

  // Generating New Project
  onSubmit(f: NgForm) {
    // tslint:disable-next-line:max-line-length
    this.http.get('http://' + API_ENDPOINT + ':8089/CreateProject?ProjectName=' + f.value.pname + '&ClientName=' + f.value.cname + '&ProjectType=' + f.value.ptype + '&UserName=Hejer').subscribe(data => {
      console.log(data);
      this.data = data;
      console.log(this.data.GenerateProjectResponse.Status);
      this.ProjectName = f.value.pname;

      if (this.data.GenerateProjectResponse.Status === 'FAILED') {
        //    this.showdivsucc = false;
        //    this.showdivfail = false;
        this.addnew = false;
        this.addToast({
          title: 'Fail', msg: 'This Project already exists',
          timeout: 7000, theme: 'default', position: 'top-right', type: 'error'
        });
        setTimeout(() => {

          this.addToast({
            title: 'Try another Name', msg: 'Projects must have a unique name',
            timeout: 7000, theme: 'default', position: 'top-right', type: 'warning'
          });
        }, 1000);
      }

      // tslint:disable-next-line:one-line
      else {
        this.ProjectsArray = [];
        this.GetProjects('userX');
        //  this.showdivfail = false;
        //this.showdivsucc = true;
        this.addnew = false;
        setTimeout(() => {

          this.addToast({
            title: 'Success', msg: 'Your project  is created and configured with success',
            timeout: 9000, theme: 'default', position: 'top-right', type: 'success'
          });
        }, 3000);

      }
    });
  }

  // Creating The List Of Operations Submitted
  onSubmitOp() {
    console.log(JSON.stringify(this.OperationsArray));
    // tslint:disable-next-line:max-line-length
    this.jsonOperations = '{"CreateOperations":{"ProjectName":"' + this.projname + '","OperationName":' + JSON.stringify(this.OperationsArray) + '}}';
    console.log(this.jsonOperations);

    // tslint:disable-next-line:max-line-length
    this.http.post('http://' + API_ENDPOINT + ':8088/CreateOperation', this.jsonOperations).subscribe(data => {
      console.log(data);
      this.data = data;
      if (this.data.GenerateOperationResponse.Status === 'FAILED') {
        this.OperationsNotAdded = true;
        this.OperationsAdded = false;
        this.operation = false;
      }
      // tslint:disable-next-line:one-line
      else {
        this.OperationsAdded = true;
        this.OperationsNotAdded = false;
        this.operation = false;
      }
    });
  }
  // Add Operation to Temporary List
  addFieldValue() {
    console.log(this.OperationsArray);
    console.log(this.newAttribute);
    this.OperationsArray.push(this.newAttribute);
    this.newAttribute = '';
  }
  // Delete Operation From Temporary List
  deleteFieldValue(index) {
    console.log(index);
    this.OperationsArray.splice(index, 1);
  }

  OnModify(name: string, type: string, client: string) {
    // Redirect to the project Modify Page
    this.router.navigate(['./projectactions'], { queryParams: { project: name, type: type, client: client } });

  }
  OnUpload(name2: string) {
    this.upload = !this.upload;
    this.showdivfail = false;
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
  //choose file to upload node js service
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('projet', file, file.name);

      formData.append("destination", USERS_WORKSPACE);
      let headers = new Headers();
      headers.append('enctype', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      // let options = new RequestOptions({ headers: headers });
      this.http.post('http://' + API_ENDPOINT + ':3001/upload', formData)
        .catch(error => Observable.throw(error))
        .subscribe(
          data => console.log('success'),
          error => console.log(error)
        );
    }
    var file = fileList[0];
    console.log(file.name);
    this.filename = file.name;
    var nom = file.name.substr(0, file.name.indexOf('.'));
    console.log(nom);
    this.http.get('http://' + API_ENDPOINT + ':9893/unzipFolder?project_name=' + nom).subscribe(data => {
      console.log(data);

    });
    this.http.get('http://' + API_ENDPOINT + ':9934/CreateProjectUpload?project_name=' + nom).subscribe(data => {
      console.log(data);
      this.data = data;

      if (this.data.response == 'failed') {
        //  console.log('project already exists , try another name ! ');

        this.addToast({ title: 'Warning', msg: 'please check your input', timeout: 9000, theme: 'default', position: 'top-right', type: 'warning' });
      }
      else {
        console.log('success upload');
        this.addToast({ title: 'Success', msg: 'Project Uploaded with success', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
      }


    });
  }

  //redirect to uploaded projects page
  uploadFolder(f: NgForm, event) {
    if (this.filename == undefined) {
      //  this.uploadFail = true;
      this.addToast({ title: 'Warning', msg: 'please check your input , you shoold choose a project to upload', timeout: 9000, theme: 'default', position: 'top-right', type: 'warning' });
    }
    // tslint:disable-next-line:one-line
    else {


      this.addToast({ title: 'Success', msg: 'Project Uploaded with success', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
      //  this.uploadSuccess = true;
      this.router.navigate(['./simple-page']);
    }
    console.log(this.filename);
    console.log(f.value.pname);
  }

  //call node js service to download project
  Download(pname: string) {
    console.log(this.pname);
    this.pname = pname;
    this.http.get('http://' + API_ENDPOINT + ':9923/getPath?project_name=' + this.pname).subscribe(data => {
      console.log(data);

      this.output = JSON.stringify(data);
      const path = this.output.substr(13, (this.output.length) - 15);
      console.log(path);
      console.log(this.pname);
      let headers = new Headers();
      headers.append('enctype', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.get('http://' + API_ENDPOINT + ':3000/download?projectpath=' + path + '&name=' + this.pname).subscribe(res => {
        this.res = res;
        window.location.href = this.res.url;

      });

    });
    this.addToast({ title: 'Loading', msg: 'Downloading Project', timeout: 5000, theme: 'default', position: 'top-right', type: 'wait' });
    setTimeout(() => {
      // tslint:disable-next-line:max-line-length
      this.addToast({ title: 'Success', msg: 'Project downloaded with success', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
      //  this.addToast({ title: 'Success', msg: 'Project downloaded with success', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
    }, 3000);
  }


}
