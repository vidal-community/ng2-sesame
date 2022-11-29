import {TestBed} from '@angular/core/testing';
import {JWT_COOKIE, JwtUtils, SesameService, UserInfo} from './sesame.service';
import {SesameHttpService} from './sesame-http.service';
import {of} from 'rxjs';

let sesame: SesameService;

const userInfoStub = {
  username: 'toto',
  mail: 'toto@vidal.fr',
  roles: ['ROLE1', 'ROLE2']
} as UserInfo;

const sesameHttpMock = {
  'getPem' : jasmine.createSpy('getPem'),
  'getJwtToken' : jasmine.createSpy('getJwtToken'),
  'faceUrl' : jasmine.createSpy('faceUrl'),
  'check' : jasmine.createSpy('check'),
  'logout' : jasmine.createSpy('logout')
};

const jwtToken = 'dummy.' + btoa(JSON.stringify(userInfoStub)) + '.dummy';
const cookie = 'authentication-jwt=dummy.eyJ1c2VybmFtZSI6InRvdG8iLCJtYWlsIjoidG90b0B2aWRhbC5mciIsImxhbmd1YWdlIjp7ImNvZGUiOiJmcmEiLCJsYWJlbCI6IkZyYW5jYWlzIn0sInJvbGVzIjpbIlJPTEUxIiwiUk9MRTIiXX0=.dummy';

function clearMocks() {
  sesameHttpMock.getPem.calls.reset();
  sesameHttpMock.getJwtToken.calls.reset();
  sesameHttpMock.faceUrl.calls.reset();
  sesameHttpMock.check.calls.reset();
  sesameHttpMock.logout.calls.reset();
}

describe('SesameService', () => {
  const jwtUtils = new JwtUtils();

  jwtUtils.validate = () => {
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SesameHttpService, useValue: sesameHttpMock},
        {provide: JwtUtils, useValue: jwtUtils},
        SesameService
      ]
    });
    clearMocks();
    sesameHttpMock.getPem.and.returnValue(of('pem'));
  });

  describe('when already logged with cookie', () => {

    beforeEach(() => {
      document.cookie = cookie;
      sesameHttpMock.check.and.returnValue(of(jwtToken));
      sesame = TestBed.inject(SesameService);
    });

    it('should retrieve UserInfo', () => {
      sesame.userInfo().subscribe((userInfo) => {
          expect(userInfo.username).toEqual('toto');
        }
      );
    });

    it('should logout', () => {
      sesameHttpMock.logout.and.returnValue(of(null));
      sesame.logout();
      sesame.userInfo().subscribe((userInfo) => {
          expect(userInfo).toBe(undefined);
        }
      );
    });

    it('should has role ROLE1', () => {
      sesame.hasRole('ROLE1').subscribe((hasRole) =>
        expect(hasRole).toBeTruthy()
      );
    });

    it('should has one role NOT_AVAILABLE,ROLE1', () => {
      sesame.hasAnyRoles(['NOT_AVAILABLE', 'ROLE1']).subscribe((hasRole) =>
        expect(hasRole).toBeTruthy()
      );
    });

    it('should check server and retrieve logged user with cookie', () => {
      expect(sesameHttpMock.getPem).toHaveBeenCalledTimes(1);
      expect(sesameHttpMock.getJwtToken).toHaveBeenCalledTimes(0);
      expect(sesameHttpMock.check).toHaveBeenCalledTimes(1);
    });

  });

  describe('when not logged', () => {
    beforeEach(() => {
      document.cookie = JWT_COOKIE + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';;
      sesame = TestBed.inject(SesameService);
    });

    it('should not check server when cookie is not present', () => {
      expect(sesameHttpMock.getPem).toHaveBeenCalledTimes(1);
      expect(sesameHttpMock.getJwtToken).toHaveBeenCalledTimes(0);
      expect(sesameHttpMock.check).toHaveBeenCalledTimes(0);
    });

    it('should call server for login', () => {

      sesameHttpMock.getJwtToken.and.returnValue(of(jwtToken));

      sesame.login('toto', 'password');

      expect(sesameHttpMock.getPem).toHaveBeenCalledTimes(1);
      expect(sesameHttpMock.getJwtToken).toHaveBeenCalledTimes(1);
      expect(sesameHttpMock.check).toHaveBeenCalledTimes(0);
    });
  });

});
