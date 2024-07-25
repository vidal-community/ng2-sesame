import {inject, TestBed} from '@angular/core/testing';
import {JwtUtils, SESAME_CONFIG, SesameService} from './sesame.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AuthService} from './auth/auth.service';

export const userInfoStub = {
  jwt: 'cyH1EfP_VfNaQfNoBZ8W2Q',
  username: 'toto',
  mail: 'toto@vidal.fr',
  roles: ['ROLE1', 'ROLE2']
};

const jwtToken = 'dummy.' + btoa(JSON.stringify(userInfoStub)) + '.dummy';

describe('SesameService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const jwtUtils = new JwtUtils();

  jwtUtils.validate = () => {
  };

  const mockAuthService = {
    refreshCurrentRoute() {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        {provide: SESAME_CONFIG, useValue: {apiEndpoint: 'http://sesame/api'}},
        {provide: JwtUtils, useValue: jwtUtils},
        {provide: AuthService, useValue: mockAuthService},
        SesameService
      ]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve UserInfo',
    inject([SesameService], (sesame: SesameService) => {
      sesame.userInfo().subscribe((userInfo) =>
        expect(userInfo.username).toEqual('toto')
      );
      flushTestData();
    })
  );

  it('should has role ROLE1',
    inject([SesameService], (sesame: SesameService) => {
      sesame.hasRole('ROLE1').subscribe((hasRole) =>
        expect(hasRole).toBeTruthy()
      );
      flushTestData();
    })
  );

  it('should has one role NOT_AVAILABLE,ROLE1',
    inject([SesameService], (sesame: SesameService) => {
      sesame.hasAnyRoles(['NOT_AVAILABLE', 'ROLE1']).subscribe((hasRole) =>
        expect(hasRole).toBeTruthy()
      );
      flushTestData();
    })
  );

  it('should call server for login',
    inject([SesameService], (sesame: SesameService) => {
      sesame.login('toto', 'password');

      const keysReqs = httpTestingController.match('http://sesame/api/keys/public');
      const checkReq = httpTestingController.expectOne('http://sesame/api/user/jwt/check');

      keysReqs[0].flush('FAKE_KEY');
      keysReqs[1].flush('FAKE_KEY');
      checkReq.flush(jwtToken);

      const req = httpTestingController.expectOne('http://sesame/api/user/jwt');
      expect(req.request.method).toEqual('GET');
      expect(req.request.withCredentials).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('toto:password'));
    })
  );

  function flushTestData() {
    const keysReq = httpTestingController.expectOne('http://sesame/api/keys/public');
    const checkReq = httpTestingController.expectOne('http://sesame/api/user/jwt/check');

    keysReq.flush('FAKE_KEY');
    checkReq.flush(jwtToken);
  }

});
