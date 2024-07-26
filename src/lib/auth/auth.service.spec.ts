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

  it('should have any role', () => {
    service.roles.next(['ROLE_ADMIN', 'GRPGAP-DPT-DEV']);
    expect(service.hasAnyRoles(userInfoStub, ['ROLE_ADMIN', 'GRPGAP-DPT-DEV'])).toEqual(false);
    expect(service.hasAnyRoles(userInfoStub, ['ROLE1'])).toEqual(true);
  });
});

describe('check Authorization', () => {
  const createAuthService = () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers:[{provide: LIBRARY_CONFIG, useValue: []}]
    });
    return TestBed.inject(AuthService);
  };

  it('should redirect when no connected user', (done ) => {
    const service = createAuthService();
    service.checkAuthorized(of(undefined)).subscribe((result) => {
      expect(result).toBeInstanceOf(UrlTree);
      done();
    });
  });

  it('should redirect when no connected user', () => {
    const service = createAuthService();
    expect(service.doAuthorize(undefined)).toBeInstanceOf(UrlTree);
  });

  it('should redirect when user is not allowed', () => {
    const service = createAuthService();
    service.roles.next(['ROLE_ADMIN']);
    expect(service.doAuthorize(userInfoStub)).toBeInstanceOf(UrlTree);
  });

  it('should allow route when user is allowed', () => {
    const service = createAuthService();
    service.roles.next(['ROLE1']);
    expect(service.doAuthorize(userInfoStub)).toBe(true);
  });

});
