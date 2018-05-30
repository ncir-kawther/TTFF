import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as Quill from 'quill';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { OperationCall } from '../../operation-call';
import {OperationXml} from '../../operation-xml' ;
import { HttpModule } from '@angular/http';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import {CardToggleDirective} from './../../shared/card/card-toggle.directive';
import {cardToggle, cardClose} from './../../shared/card/card-animation';
import { Input } from '@angular/core';
import { GenerateTestComponent } from '../generate-test/generate-test.component';
import { API_ENDPOINT } from '../../app.constants';


@Component({
  selector: 'app-test-cases',
  templateUrl: './test-cases.component.html',
  styleUrls: ['./test-cases.component.css']
})
export class TestCasesComponent implements OnInit {

  @Input() GeneratedTest: GenerateTestComponent;

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

  public sub: any;
  public opname: string;
  public configInput: boolean;
  public configOutput: boolean;
  private newAttribute: string;
  OpXmlItem: OperationXml = {} as {};
  public TestCasesArray: Array<string> = [];
  public WsdLOpsArray = this.GeneratedTest.WsdLOpsArray;

  constructor(private router: Router, private http: HttpClient, private toastyService: ToastyService,  private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      console.log(params);
      // Defaults to 0 if no query param provided.
      this.opname = params['testopname'];
      console.log(this.opname);
    });
    this.OpXmlItem = {};
    this.configInput = false;
    this.configOutput = false;
  }


CallXmlForRequest(name: string) {
  console.log(name);
  let i: any;
  for (i of this.WsdLOpsArray){
  if ( i.name === name ) {
    const req: string = i.name + 'Request';
   this.OpXmlItem = {};
  this.http.post('http://' + API_ENDPOINT + ':8099/GetXmlContent', i.location + 'Request.xml').subscribe(
    data => {
      this.OpXmlItem.operationName = name;
      console.log(this.OpXmlItem.operationName);
    this.OpXmlItem.opRequest = data['XML2JSON'];
  // console.log( this.OpXmlItem.opRequest);
  });
  }}

  this.configInput = true;
  }
  CallXmlForResponse(name: string){
    console.log(name);
    console.log(name);
  let i: any;
  for (i of this.WsdLOpsArray){
  if ( i.name === name ) {
    const req: string = i.name + 'Response';
   this.OpXmlItem = {};
  this.http.post('http://' + API_ENDPOINT + ':8099/GetXmlContent', i.location + 'Response.xml').subscribe(
    data => {
      this.OpXmlItem.operationName = name;
      console.log(this.OpXmlItem.operationName);
    this.OpXmlItem.opResponse = data['XML2JSON'];
   // console.log( this.OpXmlItem.opResponse);
  });
  }}
  this.configOutput = true;
  }

  OnSubmitTestRequest(f: NgForm, name: string) {
  console.log(f.value);
  console.log(name);
  let i: any;
  for (i of this.WsdLOpsArray){
    if ( i.name === name ) {
// tslint:disable-next-line:max-line-length
this.http.post('http://' + API_ENDPOINT + ':8093/ModifyXmlContent', i.location + 'Request.xml' + f.value.XmlNewContent ).subscribe(
    data => {
      console.log(data);
    });
    }
  }
  this.addToast ({title: 'Success', msg: 'Operation Input is successfully saved',
   timeout: 3000, theme: 'default', position: 'top-right', type: 'success'});
   this.configInput = false;
  }

  OnSubmitTestResponse(f: NgForm, name: string) {
    console.log(f.value);
    console.log(name);
    let i: any;
    for (i of this.WsdLOpsArray){
      if ( i.name === name ) {
// tslint:disable-next-line:max-line-length
this.http.post('http://' + API_ENDPOINT + ':8093/ModifyXmlContent', i.location + 'Response.xml' + f.value.XmlNewContent ).subscribe(
      data => {
        console.log(data);
      });
      }
    }

    this.addToast ({title: 'Success', msg: 'Operation Output is successfully saved',
     timeout: 3000, theme: 'default', position: 'top-right', type: 'success'});
     this.configOutput = false;
    }

    addFieldValue() {
      console.log(this.TestCasesArray);
      console.log(this.newAttribute);
      this.TestCasesArray.push(this.newAttribute);
      this.newAttribute = '';
    }
    // Delete Operation From Temporary List
    deleteFieldValue(index) {
      console.log(index);
      this.TestCasesArray.splice(index, 1);
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

}
