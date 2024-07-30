import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {LIBRARY_CONFIG} from './auth.module';
import {RouterTestingModule} from '@angular/router/testing';
import {Router, UrlTree} from '@angular/router';
import {of} from 'rxjs';
import {userInfoStub} from '../sesame.service.spec';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{provide: LIBRARY_CONFIG, useValue: []}]
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

describe('check url tree redirection', () => {

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
    parseUrl: jasmine.createSpy('parseUrl'),
    navigate: jasmine.createSpy('navigate')
  }

  const createAuthService = () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: LIBRARY_CONFIG, useValue: []},
        {provide: Router, useValue: mockRouter},
      ]
    });
    return TestBed.inject(AuthService);
  };

  it('should redirect to dedicated page route when user is not logged in or unauthorized', () => {
    const service = createAuthService();
    service.roles.next(['nope']);
    service.homeUrl = '/my-home';
    const urlTree = new UrlTree();
    mockRouter.parseUrl.and.returnValue(urlTree);

    service.authorizeThenRedirect(userInfoStub);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(urlTree);
  });
});


describe('check home page redirection', () => {

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
    navigate: jasmine.createSpy('navigate')
  }

  const createAuthService = () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: LIBRARY_CONFIG, useValue: []},
        {provide: Router, useValue: mockRouter},
      ]
    });
    return TestBed.inject(AuthService);
  };

  it('should redirect to home page route when user is allowed', () => {
    const service = createAuthService();
    service.roles.next(['ROLE1']);
    service.homeUrl = '/my-home';
    service.authorizeThenRedirect(userInfoStub);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-home']);
  });
});

describe('check Authorization', () => {
  const createAuthService = () => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{provide: LIBRARY_CONFIG, useValue: []}]
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
