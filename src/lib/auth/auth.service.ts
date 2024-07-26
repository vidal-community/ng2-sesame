import { Inject, Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import { LIBRARY_CONFIG } from './auth.module';
import {UserInfo} from '../sesame.service';
import {Router, UrlTree} from '@angular/router';
import {map} from 'rxjs/operators';

export type AuthConfig = {groups: string[], homeUrl: string};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  roles = new BehaviorSubject<string[]>(null);
  homeUrl: string;

  constructor(
    @Inject(LIBRARY_CONFIG) config: AuthConfig,
    private router: Router,
  ){
    this.roles.next(config.groups);
    this.homeUrl = config.homeUrl;
  }

  getRoles(): string[] {
    return this.roles.getValue();
  }

  checkAuthorized(userInfo: Observable<UserInfo>): Observable<UrlTree | boolean> {
    return userInfo.pipe(
      map(userInfo => {
        return this.doAuthorize(userInfo);
      })
    );
  }

  doAuthorize(userInfo: UserInfo) {
    if (!userInfo) {
      return this.router.parseUrl('disconnected');
    }
    const authorized = this.hasAnyRoles(userInfo, this.getRoles());
    if (!authorized) {
      return this.router.parseUrl('unauthorized');
    }
    return true;
  }

  hasAnyRoles(userInfo: UserInfo, roles: Array<string>): boolean {
    return roles.some((role) => userInfo && userInfo.roles && (userInfo.roles.indexOf(role) !== -1));
  };

  authorizeThenRedirect(userInfo: UserInfo) {
    const result = this.doAuthorize(userInfo);
    if (result instanceof UrlTree) {
      this.router.navigateByUrl(result);
    } else {
      this.router.navigate([this.homeUrl]);
    }
  }
}
