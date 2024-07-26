import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Observable, of, ReplaySubject, zip} from 'rxjs';
import * as jsrsasign from 'jsrsasign';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {SesameHttpService} from './sesame-http.service';
import {AuthService} from './auth/auth.service';

export const SESAME_CONFIG = new InjectionToken('sesame.config');

export interface SesameConfig {
  apiEndpoint: string;
}

export const JWT_COOKIE = 'authentication-jwt';

export interface UserInfo {
  jwt: string;
  roles: Array<string>;
  username: string;
  mail: string;
}

export type UserInfoCallback = (userInfo: UserInfo, userInfoOld?: UserInfo) => void;

@Injectable({
  providedIn: 'root'
})
export class JwtUtils {
  validate(jwt, pem) {
    const isValid = jsrsasign.KJUR.jws.JWS.verify(jwt, pem, ['RS256']);
    if (!isValid) {
      throw new Error('jwt is not valid');
    }
  }

  parse(jwt) {
    const jwtSplit = jwt.split('.');
    return JSON.parse(jsrsasign.b64utos(jwtSplit[1]));
  }
}

@Injectable({
  providedIn: 'root'
})
export class SesameService {

  private pemObservable: Observable<string>;
  private userInfoObservable = new ReplaySubject<UserInfo>(1);

  constructor(private sesameHttp: SesameHttpService,
              private jwtUtils: JwtUtils,
              private authService: AuthService,
              @Inject(SESAME_CONFIG) private sesameConfig: SesameConfig) {
    this.pemObservable = sesameHttp.getPem();
    this.check();
  }

  public hasAnyRoles(roles: Array<string>): Observable<boolean> {
    return this.userInfo().pipe(map(userInfo => {
        return this.authService.hasAnyRoles(userInfo, roles);
      }
    ));
  };

  public hasRole(role: string): Observable<boolean> {
    return this.hasAnyRoles([role]);
  };

  public login(username, password): void {
    this.doOnUserInfo(undefined);

    const jwtObservable = this.sesameHttp.getJwtToken(username, password);

    zip(jwtObservable, this.pemObservable)
    .pipe(
      map(([jwt, pem]) => this.checkJwt(jwt, pem)),
    )
    .subscribe(userInfo => {
      this.doOnUserInfo(userInfo);
      this.authService.authorizeThenRedirect(userInfo);
    });
  }

  public logout(): void {
    this.sesameHttp.logout().subscribe(() => {
      this.deleteCookie(JWT_COOKIE);
      this.doOnUserInfo(undefined);
      this.authService.authorizeThenRedirect(undefined);
    });
  }

  public userInfo(): Observable<UserInfo> {
    return this.userInfoObservable;
  }

  public myFaceUrl(): Observable<string> {
    return this.userInfo().pipe(mergeMap(userInfo => {
      if (!userInfo) {
        return of(undefined);
      }
      return this.faceUrl(userInfo.username);
    }));
  }

  public faceUrl(login: string): Observable<string> {
    return this.sesameHttp.faceUrl(login);
  }

  private checkJwt(jwt, pem): UserInfo {
    this.jwtUtils.validate(jwt, pem);
    const userInfo = this.jwtUtils.parse(jwt);
    this.setCookie(JWT_COOKIE, jwt, 360, '/');
    userInfo.jwt = jwt;
    return userInfo;
  };

  private doOnUserInfo(userInfo: UserInfo) {
    this.userInfoObservable.next(userInfo);
  }

  checkAuthorized() {
    return this.authService.checkAuthorized(this.userInfo());
  }

  private getCookie(name: string): string {
    const ca: Array<string> = document.cookie.split(';');
    const caLen: number = ca.length;
    const cookieName = name + '=';
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return undefined;
  }

  private deleteCookie(name) {
    this.setCookie(name, '', -1);
  }

  private setCookie(name: string, value: string, expireDays: number, path = '') {
    const d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires: string = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + (path.length > 0 ? '; path=' + path : '');
  }

  private check(): void {
    if (!this.getCookie(JWT_COOKIE)) {
      this.doOnUserInfo(null);
      return;
    }
    const httpCheck = this.sesameHttp.check();
    zip(this.pemObservable, httpCheck)
    .pipe(
      map(([pem, jwt]) => this.checkJwt(jwt, pem)),
    )
    .subscribe({
      next: (userInfo) => this.doOnUserInfo(userInfo),
      error: () => this.doOnUserInfo(undefined)
    });
  }
}
