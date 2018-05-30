import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { OperationCall } from '../../operation-call';
import { HttpModule } from '@angular/http';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { cardToggle, cardClose } from '../../shared/card/card-animation';
import { OperationXml } from '../../operation-xml';
import { CardToggleDirective } from './../../shared/card/card-toggle.directive';
import { API_ENDPOINT } from '../../app.constants';


@Component({
  selector: 'app-project-actions',
  templateUrl: './project-actions.component.html',
  styleUrls: ['./project-actions.component.css',
    '../../../../node_modules/ng2-toasty/style-bootstrap.css',
    '../../../../node_modules/ng2-toasty/style-default.css',
    '../../../../node_modules/ng2-toasty/style-material.css',
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [cardToggle, cardClose],
})
export class ProjectActionsComponent implements OnInit {
  @Input() headerContent: string;
  @Input() title: string;
  @Input() blockClass: string;
  @Input() cardClass: string;
  @Input() classHeader = false;

  cardToggle = 'expanded';
  cardClose = 'open';
  fullCard: string;
  fullCardIcon: string;
  loadCard = false;
  isCardToggled = false;
  cardLoad: string;
  position = 'bottom-right';
  msg: string;
  showClose = true;
  timeout = 5000;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;

  public sub: any;
  public pname: any;
  public addLogdata: any;
  public urldata: any;
  data: any;
  public addXSD: any;
  public OperationsNotAdded: boolean;
  public OperationsAdded: boolean;
  private OperationsArray: Array<string> = [];
  private newAttribute: string;
  public jsonOperations: any;
  public jsonSelectedOperations: any;
  public operation: boolean;
  public showUpload: boolean;
  public displayOperations;
  public projname: string;
  public modify: boolean;
  public showActions: boolean;
  public serviceUrl: string;
  public wsdlfile: any;
  public jsonWsdl: any;
  public dataOps: any;
  public addLog: boolean;
  public addXSDSucc: boolean;
  public addXSDfail: boolean;
  public documentataionAdded: boolean;
  public displayOperationsList: boolean;
  public SelectedOperations: Array<string> = [];
  public FinalOperations: Array<OperationCall> = [];
  WsdLOpsArray: Array<string> = [];
  elm: OperationCall = {};
  pclient: string;
  ptype: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router, private http: HttpClient, private toastyService: ToastyService) {

  }

  ngOnInit(): void {
    // On Initi Show Only Division of Actions
    //this.serviceUrl = '192.168.110.224';

    this.displayOperations = false;
    this.modify = true;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log(params);
        // Defaults to 0 if no query param provided.
        this.pname = params['project'];
        this.pclient = params['client'];
        this.ptype = params['type'];
        console.log(this.pname);
      });
    this.showUpload = false;
  }

  // Show Create Operations Div
  onOld(pname: string) {
    this.projname = pname;
    console.log(this.projname);
    this.operation = !this.operation;
    console.log(this.operation);
  }

  // Submitted Operations are about to be created
  onSubmitOp() {
    console.log(JSON.stringify(this.OperationsArray));
    // tslint:disable-next-line:max-line-length
    this.jsonOperations = '{"CreateOperations":{"ProjectName":"' + this.pname + '","OperationName":' + JSON.stringify(this.OperationsArray) + '}}';
    console.log(this.jsonOperations);

    // tslint:disable-next-line:max-line-length
    this.http.post('http://' + API_ENDPOINT + ':8088/CreateOperation', this.jsonOperations).subscribe(data => {
      console.log(data);
      this.data = data;
      if (this.data.GenerateOperationResponse.Status === 'FAILED') {
        /* this.OperationsNotAdded = true;
         this.OperationsAdded = false;*/
        this.operation = false;
        this.addToast({
          title: 'Fail', msg: 'This operation already exists in your project, try anothher name please',
          timeout: 7000, theme: 'default', position: 'top-right', type: 'error'
        });
      } else {
        /*  this.OperationsAdded = true;
          this.OperationsNotAdded = false;*/
        this.addToast({
          title: 'Success', msg: 'Operation added with success to your project',
          timeout: 7000, theme: 'default', position: 'top-right', type: 'success'
        });
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

  // Redirect to Add Ressources page, attaching Project Name in the Query
  AddRessources() {
    this.router.navigate(['./addResources'], { queryParams: { project: this.pname } });
  }
  // Redirect to Add Ressources page, attaching Project Name in the Query
  AddJMS() {
    this.router.navigate(['./jmsinvoke'], { queryParams: { project: this.pname, type: this.ptype, client: this.pclient } });
  }
  // Show Upload Wsdl Divs in the same page (file and url)
  UploadWSDL() {
    this.showUpload = true;
    this.operation = false;

  }
  GenerateTest() {
    this.router.navigate(['./generatetest'], { queryParams: { project: this.pname, type: this.ptype, client: this.pclient } });
  }
  ExposeSoapOperation() {
    this.router.navigate(['./exposeSoap'], { queryParams: { project: this.pname, type: this.ptype, client: this.pclient } });
  }
  // Detect Uploaded file and copy its content in wsdlfile variable
  fileChangeWsdl(event) {
    // this.uploadwsdlurl = false;
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        let text = reader.result;
        this.wsdlfile = text;
      };
      reader.readAsText(input.files[index]);
    }
  }
  // Loading file content from the Url in input
  LoadFromUrl(f: NgForm) {
    console.log(f.value.wsdlurl);
    // this.uploadwsdlfile = false;
    this.http.get('http://' + API_ENDPOINT + ':8094/WsdlFromUrl?WSDLURL=' + f.value.wsdlurl).subscribe(data => {
      this.urldata = data;
      this.wsdlfile = this.urldata.FromUrlOutput;
      this.jsonWsdl = this.wsdlfile;
      console.log(this.wsdlfile);
    });

  }

  // Submit the Uploaded Wsdl Content, Show contained operations in table
  onSubmitUpload(f: NgForm) {
    this.WsdLOpsArray = [];
    // tslint:disable-next-line:max-line-length
    // console.log(this.wsdlfile);
    this.http.post('http://' + API_ENDPOINT + ':8091/CreateWsdl?projectName=' + this.pname + '&WsdlName=WSDL', this.wsdlfile).subscribe(data => {
      this.dataOps = data;
      console.log(this.dataOps.Operations.name);
      for (let i = 0; i < this.dataOps.Operations.name.length; i++) {
        this.WsdLOpsArray.push(this.dataOps.Operations.name[i]);
      }
      console.log(this.WsdLOpsArray[0]);

    });
    // tslint:disable-next-line:max-line-length
    this.addToast({ title: 'Success', msg: 'Wsdl File is added Successfully to Your Project', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
    this.showActions = true;
    this.modify = false;
    this.displayOperationsList = true;
    this.showUpload = false;
  }

  // Show Action Buttons
  ShowActions() {
    this.modify = !this.modify;
  }
  // Detect checked and unchecked Operations and modify the temporary List
  OnChecked(Opname: string, check: boolean) {
    if (check === true) {
      this.SelectedOperations.push(Opname);
    }
    // tslint:disable-next-line:one-line
    else {
      const index: number = this.SelectedOperations.indexOf(Opname);
      if (index !== -1) {
        this.SelectedOperations.splice(index, 1);
      }
    }
  }

  // Choose Logs for Selected Operations
  SelectOperations() {

    this.addLog = true;
    this.displayOperationsList = false;
    for (const i of this.SelectedOperations) {
      // tslint:disable-next-line:prefer-const
      console.log(i);
      const element: OperationCall = {};
      element.opname = i;
      element.exception = false;
      element.info = false;


      this.FinalOperations.push(element);
    }
    console.log(JSON.stringify(this.FinalOperations));

  }
  // Check all Operations
  CheckAll(f: NgForm) {
    console.log(f.value);
    console.log(f.value.opnames);

  }

  // Log Info Choice
  chooseLogInfo(opselected: string, check: boolean) {
    if (check) {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].info = true;
      console.log(JSON.stringify(this.FinalOperations));
    }
    // tslint:disable-next-line:one-line
    else {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].info = false;
      console.log(JSON.stringify(this.FinalOperations));
    }
  }

  // Log Exception Choice
  chooseLogException(opselected: string, check: boolean) {
    if (check) {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].exception = true;
      console.log(JSON.stringify(this.FinalOperations));
    }
    // tslint:disable-next-line:one-line
    else {
      this.FinalOperations[this.SelectedOperations.indexOf(opselected)].exception = false;
      console.log(JSON.stringify(this.FinalOperations));
    }
  }

  // Create selected Operations in project with choosen Logs
  SubmitOperationsToService() {
    this.addLog = false;
    //  this.addOpsStatus = true

    this.jsonSelectedOperations = '{"SelectedOperations":{"List":' + JSON.stringify(this.FinalOperations) + '}}';
    console.log(this.jsonSelectedOperations);

    // tslint:disable-next-line:max-line-length
    this.http.post('http://' + API_ENDPOINT + ':8092/CreateCallOperation?ProjectName=' + this.pname, this.jsonSelectedOperations).subscribe(data => {
      console.log(data);
      this.addLogdata = data;
      if (this.addLogdata.Response === "Success") {
        // tslint:disable-next-line:max-line-length
        this.addToast({ title: 'Success', msg: 'Call Processes are added successfully to your project', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
      }
      // tslint:disable-next-line:one-line
      else {
        // tslint:disable-next-line:max-line-length
        this.addToast({ title: 'Fail', msg: 'An error occured, Calls cannot be added to your project', timeout: 9000, theme: 'default', position: 'top-right', type: 'error' });
      }
    });
  }
  //create xsd for each selected operation
  CreateXSD() {
    //create xsds
    this.jsonSelectedOperations = '{"SelectedOperations":{"List":' + JSON.stringify(this.FinalOperations) + '}}';
    console.log(this.jsonSelectedOperations);
    this.http.post('http://' + API_ENDPOINT + ':9922/createXSD?project_name=' + this.pname, this.jsonSelectedOperations).subscribe(data => {
      let headers = new Headers();
      headers.append('enctype', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      console.log(data);
      console.log(JSON.stringify(this.SelectedOperations));

      if (this.SelectedOperations.length == 0)
        //    this.addXSDfail = true;
        this.addToast({ title: 'warning', msg: 'Operations are not selected, please check them', timeout: 9000, theme: 'default', position: 'top-right', type: 'warning' });
      else
        //this.addXSDSucc = true;
        this.addToast({ title: 'Success', msg: 'Operations XSD are created with suceess', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
    });
  }

  //generate documentation tibco service

  GenerateDocumentataion(pname: string) {
    console.log('*****' + this.pname);
    this.http.get('http://' + API_ENDPOINT + ':9797/generateDoc?project_name=' + this.pname).subscribe(data => {
      console.log(data);
    });

    this.addToast({ title: 'Loading', msg: 'Please wait', timeout: 3000, theme: 'default', position: 'top-right', type: 'wait' });
    setTimeout(() => {
      // tslint:disable-next-line:max-line-length
      this.addToast({ title: 'Success', msg: 'Documentation is generated successfully to your project', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });
    }, 3000);



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
  // call tibco service to generate documentation
  /*  GenerateDocumentataion(pname: string) {
      console.log('*****' + this.pname);
      this.http.get('http://' + API_ENDPOINT + ':9797/generateDoc?project_name=' + this.pname).subscribe(data => {
        console.log(data);

        this.documentataionAdded = true;

      });
    }
  */
}
