import {Injectable} from '@angular/core';
import {GuardResult, MaybeAsync} from '@angular/router';
import {SesameService} from '../sesame.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private sesameService: SesameService) {
    this.sesameService = sesameService;
  }

  checkAuthorized(): MaybeAsync<GuardResult> {
    return this.sesameService.checkAuthorized();
  }
}

