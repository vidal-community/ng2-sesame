import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-authorization-message',
  templateUrl: './authorization-message.component.html',
  styleUrls: ['./authorization-message.component.css']
})
export class AuthorizationMessageComponent {
  message = '';
  constructor(private activatedRoute: ActivatedRoute) {
    this.message = this.activatedRoute.snapshot.data.message;
  }
}
