import { Inject, Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import { LIBRARY_CONFIG } from './auth.module';
import {UserInfo} from '../sesame.service';
import {Router, UrlTree} from '@angular/router';
import {map} from 'rxjs/operators';

export type AuthConfig = {groups: string[]};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  roles = new BehaviorSubject<string[]>(null);

  constructor(
    @Inject(LIBRARY_CONFIG) config: AuthConfig,
    private router: Router,
){
    this.roles.next(config.groups);
  }

  getRoles(): string[] {
    return this.roles.getValue();
  }

  checkAuthorized(userInfo: Observable<UserInfo>, isAuthorized: Observable<boolean>): Observable<UrlTree | boolean> {
    return combineLatest([userInfo, isAuthorized]).pipe(
      map(([userInfo, authorized]) => {
        if (!userInfo) {
          return this.router.parseUrl('disconnected');
        }

        if (!authorized) {
          return this.router.parseUrl('unauthorized');
        }

        return true;
      })
    );
  }

  refreshCurrentRoute() {
    const path = this.router.config.find(route => '/' + route.path !== this.router.url)?.path;
    this.router.navigate(['/' + path ?? '']);
  }
}
