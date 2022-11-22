import {TestBed} from '@angular/core/testing';
import {JwtUtils, SESAME_CONFIG, SesameService, UserInfo} from './sesame.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

let sesame: SesameService;

const userInfoStub = {
  username: 'toto',
  mail: 'toto@vidal.fr',
  roles: ['ROLE1', 'ROLE2']
} as UserInfo;

const jwtToken = 'dummy.' + btoa(JSON.stringify(userInfoStub)) + '.dummy';

describe('SesameService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const jwtUtils = new JwtUtils();

  jwtUtils.validate = () => {
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        {provide: SESAME_CONFIG, useValue: {apiEndpoint: 'http://sesame/api'}},
        {provide: JwtUtils, useValue: jwtUtils},
        SesameService
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    sesame = TestBed.inject(SesameService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve UserInfo', () => {
    sesame.userInfo().subscribe((userInfo) => {
        expect(userInfo.username).toEqual('toto');
      }
    );
    flushTestData();
  });

  it('should has role ROLE1', () => {
    sesame.hasRole('ROLE1').subscribe((hasRole) =>
      expect(hasRole).toBeTruthy()
    );
    flushTestData();
  });

  it('should has one role NOT_AVAILABLE,ROLE1', () => {
    sesame.hasAnyRoles(['NOT_AVAILABLE', 'ROLE1']).subscribe((hasRole) =>
      expect(hasRole).toBeTruthy()
    );
    flushTestData();
  });

  it('should call server for login', () => {
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

    httpTestingController.verify();
  });

  function flushTestData() {
    const keysReq = httpTestingController.expectOne('http://sesame/api/keys/public');
    const checkReq = httpTestingController.expectOne('http://sesame/api/user/jwt/check');

    keysReq.flush('FAKE_KEY');
    checkReq.flush(jwtToken);
  }

});
