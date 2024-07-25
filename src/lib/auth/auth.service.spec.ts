import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {LIBRARY_CONFIG} from './auth.module';
import {RouterTestingModule} from '@angular/router/testing';
import {SesameService, UserInfo} from '../sesame.service';
import {Router, UrlTree} from '@angular/router';
import {of} from 'rxjs';
import {AuthGuard} from './auth.guard';
import {userInfoStub} from '../sesame.service.spec';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers:[{provide: LIBRARY_CONFIG, useValue: []}]
    });
    service = TestBed.inject(AuthService);
  });

  it('should get authorized role', () => {
    service.roles.next(['ROLE_ADMIN', 'GRPGAP-DPT-DEV']);
    expect(service.getRoles()).toEqual(['ROLE_ADMIN', 'GRPGAP-DPT-DEV']);
  });
});

describe('checkAuthorized', () => {
  const createAuthService = () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers:[{provide: LIBRARY_CONFIG, useValue: []}]
    });
    return TestBed.inject(AuthService);
  };
  it('should redirect when no connected user', (done ) => {
    const service = createAuthService();
    service.checkAuthorized(of(undefined), of(false)).subscribe((result) => {
      expect(result).toBeInstanceOf(UrlTree);
      done();
    });
  });

  it('should redirect when user is not allowed', (done ) => {
    const service = createAuthService();
    service.checkAuthorized(of(userInfoStub), of(false)).subscribe((result) => {
      expect(result).toBeInstanceOf(UrlTree);
      done();
    });
  });

  it('should allow route when user is allowed', (done ) => {
    const service = createAuthService();
    service.checkAuthorized(of(userInfoStub), of(true)).subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

});
