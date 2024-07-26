import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {SESAME_CONFIG, SesameConfig} from './sesame.service';

@Injectable({
  providedIn: 'root'
})
export class SesameHttpService {

  constructor(private http: HttpClient,
              @Inject(SESAME_CONFIG) private sesameConfig: SesameConfig) {
  }

  getPem(): Observable<string> {
    return this.http.get(`${this.sesameConfig.apiEndpoint}/keys/public`, {responseType: 'text'});
  }

  getJwtToken(username: string, password: string): Observable<string> {

    const authdata = btoa(username + ':' + password);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${authdata}`
    });

    return this.http
    .get(`${this.sesameConfig.apiEndpoint}/user/jwt`, {
      withCredentials: true, headers,
      responseType: 'text'
    });
  }

  public faceUrl(login: string): Observable<string> {
    return this.http
    .get(`${this.sesameConfig.apiEndpoint}/face/${login}`, {responseType: 'text'})
    .pipe(catchError(() => of(undefined)));
  }

  check(): Observable<string> {
    return this.http
    .get(`${this.sesameConfig.apiEndpoint}/user/jwt/check`, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  public logout(): Observable<void> {
    return this.http.get<void>(`${this.sesameConfig.apiEndpoint}/user/jwt/logout`, {withCredentials: true});
  }
}
