import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
 templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})

// tslint:disable-next-line:comment-format
//<sf-form [schema]="mySchema"></sf-form>

export class ButtonComponent {
  mySchema = {
    "properties": {
      "email": {
        "type": "string",
        "description": "email",
        "format": "email"
      },
      "password": {
        "type": "string",
        "description": "Password"
      },
      "rememberMe": {
        "type": "boolean",
        "default": false,
        "description": "Remember me"
      }
    },
    "required": ["email","password","rememberMe"]
  };



}
