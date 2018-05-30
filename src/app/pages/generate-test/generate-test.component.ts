import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { OperationCall } from '../../operation-call';
import { OperationXml } from '../../operation-xml';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { CardToggleDirective } from './../../shared/card/card-toggle.directive';
import { cardToggle, cardClose } from './../../shared/card/card-animation';
import { ResourcesComponent } from './../resources/resources.component';
import { API_ENDPOINT } from '../../app.constants';



@Component({
  selector: 'app-generate-test',
  templateUrl: './generate-test.component.html',
  styleUrls: ['./generate-test.component.css',
    '../../../../node_modules/ng2-toasty/style-bootstrap.css',
    '../../../../node_modules/ng2-toasty/style-default.css',
    '../../../../node_modules/ng2-toasty/style-material.css',
  ],
  // directives: CardToggleComponent,
  encapsulation: ViewEncapsulation.None,
  animations: [cardToggle, cardClose],
})
export class GenerateTestComponent implements OnInit {
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

  public uploadwsdlurl: boolean;
  public uploadwsdlfile: boolean;
  public upload: boolean;
  public configuretest: boolean;
  public testchoice: boolean;
  public jdbcCon: boolean;

  public showActions: boolean;
  public wsdlfile: any;
  public urldata: any;
  public jsonWsdl: any;
  public dataOps: any;
  public testdata: any;
  public sub: any;
  public dataRes: any;
  public data: any;
  public displayOperationsList: boolean;
  public SelectedOperations: Array<string> = [];
  public FinalOperations: Array<OperationCall> = [];
  public WsdLOpsArray: Array<string> = [];

  public opname: string;
  public configInput: boolean;
  public configOutput: boolean;
  private newAttribute: string;
  public sqlDirectPath: string;
  OpXmlItem: OperationXml = {} as {};

  public RessourcesJDBCArray: Array<any> = [];



  pclient: string;
  ptype: string;
  pname: string;
  position = 'bottom-right';
  msg: string;
  showClose = true;
  timeout = 5000;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;
  private OperationsXml: Array<OperationXml> = [];
  // This array is used to save both Response and Request xml files for every Operation before and after being configured;

  constructor(private router: Router, private http: HttpClient, private toastyService: ToastyService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.upload = true;
    this.testchoice = false;
    this.uploadwsdlfile = true;
    this.uploadwsdlurl = true;
    this.jdbcCon = false;
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
    this.GetRessourcesJDBC('JDBC');
  }
  // Notification Function
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
  //  On File Upload
  fileChange(event) {

    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        let text = reader.result;
        this.wsdlfile = text;
        // console.log(this.wsdlfile);
      };
      reader.readAsText(input.files[index]);
    }
  }
  // Loading file content from the Url in input
  LoadFromUrl(f: NgForm) {
    console.log(f.value.wsdlurl);

    this.http.get('http://' + API_ENDPOINT + ':8094/WsdlFromUrl?WSDLURL=' + f.value.wsdlurl).subscribe(data => {
      this.urldata = data;
      this.wsdlfile = this.urldata.FromUrlOutput;
      this.jsonWsdl = this.wsdlfile;
      // console.log(this.wsdlfile);
    });

  }



  // Submit the Uploaded Wsdl Content, Show contained operations in table
  onSubmitUpload(f: NgForm) {
    // tslint:disable-next-line:max-line-length

    this.http.post('http://' + API_ENDPOINT + ':8096/GenerateTest?ProjectName=' + this.pname + '&ProjectClient=' + this.pclient + '&ProjectType=' + this.ptype + '&UserName=UserX', this.wsdlfile).subscribe(data => {
      console.log(data);
      this.dataOps = data;
      console.log(this.dataOps.Operations);

      if (!this.dataOps.Operations.Status) {

        this.addToast({
          title: 'Fail', msg: 'This Project already has a Test Project',
          timeout: 7000, theme: 'default', position: 'top-right', type: 'error'        
});
        setTimeout(() => {

          this.addToast({
            title: 'Delete it First', msg: 'You can delete and generate a new Test Project',
            timeout: 7000, theme: 'default', position: 'top-right', type: 'warning'          
});
        }, 1000);
      } else {
        for (let elt of this.dataOps.Operations.Operation) {
          console.log(elt);
          this.sqlDirectPath = elt.location;
          this.WsdLOpsArray.push(elt);
        }
        //   console.log(this.WsdLOpsArray);

        this.addToast({
          title: 'Loading', msg: 'Creating Test Project',
          timeout: 2000, theme: 'default', position: 'top-right', type: 'wait'
        });
        setTimeout(() => {

          this.addToast({
            title: 'Success', msg: 'Test Project is created and configured with success',
            timeout: 9000, theme: 'default', position: 'top-right', type: 'success'          
});
        }, 3000);
        this.uploadwsdlfile = false;
        this.uploadwsdlurl = false;
        this.jdbcCon = true;
        this.testchoice = true;

      }

    });
  }


  CallXmlForRequest(name: string) {
    console.log(name);
    let i: any;
    for (i of this.WsdLOpsArray) {
      if (i.name === name) {
        const req: string = i.name + 'Request';
        this.OpXmlItem = {};
        this.http.post('http://' + API_ENDPOINT + ':8099/GetXmlContent', i.location + 'Request.xml').subscribe(
          data => {
            this.OpXmlItem.operationName = name;
            console.log(this.OpXmlItem.operationName);
            this.OpXmlItem.opRequest = data['XML2JSON'];
            // console.log( this.OpXmlItem.opRequest);
          });
      }
    }

    this.configInput = true;
  }
  CallXmlForResponse(name: string) {
    console.log(name);
    console.log(name);
    let i: any;
    for (i of this.WsdLOpsArray) {
      if (i.name === name) {
        const req: string = i.name + 'Response';
        this.OpXmlItem = {};

        this.http.post('http://' + API_ENDPOINT + ':8099/GetXmlContent', i.location + 'Response.xml').subscribe(
          data => {
            this.OpXmlItem.operationName = name;
            console.log(this.OpXmlItem.operationName);
            this.OpXmlItem.opResponse = data['XML2JSON'];
            // console.log( this.OpXmlItem.opResponse);
          });
      }    
}
    this.configOutput = true;
  }

  // Submit new configured xml file (Request)

  OnSubmitTestRequest(f: NgForm, name: string) {
    console.log(f.value);
    console.log(name);
    let i: any;
    for (i of this.WsdLOpsArray) {
      if (i.name === name) {
        // tslint:disable-next-line:max-line-length
        this.http.post('http://' + API_ENDPOINT + ':8093/ModifyXmlContent', i.location + 'Request.xml' + f.value.XmlNewContent).subscribe(
          data => {
            console.log(data);
          });
      }
    }
    this.addToast({
      title: 'Success', msg: 'Operation Input is successfully saved',
      timeout: 3000, theme: 'default', position: 'top-right', type: 'success'
    });
    this.configInput = false;
  }
  // Submit new configured xml file (Response)
  OnSubmitTestResponse(f: NgForm, name: string) {
    console.log(f.value);
    console.log(name);
    let i: any;
    for (i of this.WsdLOpsArray) {
      if (i.name === name) {
        // tslint:disable-next-line:max-line-length
        this.http.post('http://' + API_ENDPOINT + ':8093/ModifyXmlContent', i.location + 'Response.xml' + f.value.XmlNewContent).subscribe(
          data => {
            console.log(data);
          });
      }
    }
    this.addToast({      
title: 'Success', msg: 'Operation Output is successfully saved',
      timeout: 3000, theme: 'default', position: 'top-right', type: 'success'
    });
    this.configOutput = false;
  }

  // Get saved Jdbc Cnx to be displayed for the user
  GetRessourcesJDBC(ressource_type: string) {

    this.http.get('http://' + API_ENDPOINT + ':9920/getRessources?ressource_type=' + ressource_type).subscribe(data => {
      this.dataRes = data;
      for (const elt of this.dataRes.ressources.ressourceconfigname) {
        this.RessourcesJDBCArray.push(elt);
      }
      console.log(this.RessourcesJDBCArray);
    });
  }

  // Add chosen Jdbc Cnx to Test Project

  AddexistantJDBCRessource() {
    this.addToast({
      title: '', msg: 'JDBC Connection is being ²&',
      timeout: 2000, theme: 'default', position: 'top-right', type: 'wait'
    });
    this.jdbcCon = false;
    console.log(this.newAttribute);
    const name_config = this.newAttribute;

    // tslint:disable-next-line:max-line-length
    this.http.get('http://' + API_ENDPOINT + ':9907/addExistantJDBC?config_name=' + name_config + '&project_name=' + this.pname + '_Test')
      .subscribe
      (data => {
        console.log(data);
        this.data = data;
        console.log(this.data.responce.status);
        //  this.ProjectName = ff.value.pname;

        if (this.data.responce.status === 'failed') {
          this.addToast({
            title: 'Fail', msg: 'An error occured, please check the project resources',
            timeout: 7000, theme: 'default', position: 'top-right', type: 'error'
          });
        }
        // tslint:disable-next-line:one-line
        else {
          this.addToast({
            title: 'Success', msg: 'JDBC Resource added successfully to your test project',
            timeout: 7000, theme: 'default', position: 'top-right', type: 'successs'
          });
        }
      });
    this.jdbcCon = false;
    console.log(this.sqlDirectPath);
    this.http.post('http://' + API_ENDPOINT + ':8070/ChangeCnx?CnxName=' + name_config, this.sqlDirectPath)
      .subscribe
      (data => {
        console.log(data);
      });
  }


}
