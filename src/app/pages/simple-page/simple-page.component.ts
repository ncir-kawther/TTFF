import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as shape from 'd3-shape';
/*import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import {
  single,
  generateData
} from '../shared/chartData';*/
import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, Validators, ControlContainer, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { API_ENDPOINT } from '../../app.constants';
@Component({
  selector: 'app-simple-page',
  templateUrl: './simple-page.component.html',
  styleUrls: ['./simple-page.component.css',
    '../../../../node_modules/ng2-toasty/style-bootstrap.css',
    '../../../../node_modules/ng2-toasty/style-default.css',
    '../../../../node_modules/ng2-toasty/style-material.css']
  ,
  encapsulation: ViewEncapsulation.None

})
export class SimplePageComponent implements OnInit {

  public sub: any;
  public data: any;
  public basic: boolean;
  public pname: any;
  public dataprojects: any;
  public upload: boolean;
  public serviceUrl: string;
  public uploadPaths = [];
  public selected: string;
  private ProjectsArray: Array<any> = [];
  public ProjectsUploadArray: Array<any> = [];
  public ProjectName: any;
  public showdivsucc: boolean;
  public showdivfail: boolean;
  public deleteSuccess: boolean;
  position = 'top-right';
  title: string;
  msg: string;
  showClose = true;
  timeout = 5000;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;
  //  address :string;
  filesToUpload: Array<File> = [];
  // relativePath :string;
  constructor(
    private route: ActivatedRoute,
    private router: Router, private http: HttpClient, private toastyService: ToastyService) { }

  ngOnInit() {
    //  this.serviceUrl = '192.168.110.41';
    this.basic = true;
    this.upload = false;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log(params);
        // Defaults to 0 if no query param provided.
        this.pname = params['project'];
        console.log(this.pname);
      });
    this.GetListProjectUpload('userX');
  }

  GetListProjectUpload(username: string) {
    this.http.get('http://' + API_ENDPOINT + ':9935/GetListProjectUpload?project_upload_owner=' + username).subscribe(data => {
      this.dataprojects = data;
      for (const elt of this.dataprojects.resultSet.record) {
        this.ProjectsUploadArray.push(elt);
      }
      console.log(this.ProjectsUploadArray);
    });
    this.http.get('http://' + API_ENDPOINT + ':8084/GetProject?Username=' + username).subscribe(data => {
      this.dataprojects = data;
      for (const elt of this.dataprojects.resultSet.record) {
        this.ProjectsArray.push(elt);
      }
      console.log(this.ProjectsArray);
    });
  }

  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    //  this.position = options.position ? options.position : this.position;
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
  OnUpload(name2: string) {
    //this.router.navigate(['./dashboard'], { queryParams: { project: name2 } });
    this.upload = !this.upload;
    this.showdivfail = false;
    //this.operation = false;
  }

  DeleteField(pname: string, index) {
    this.pname = pname;
    console.log(this.pname);
    this.http.get('http://' + API_ENDPOINT + ':9946/DeleteProjectUpload?project_name=' + this.pname).subscribe(data => {

      this.ProjectsUploadArray.splice(index, 1);

      console.log(data);
      //this.deleteSuccess = true;
      this.addToast({ title: 'Success', msg: 'Project deleted with success', timeout: 9000, theme: 'default', position: 'top-right', type: 'success' });

    });

  }

}
