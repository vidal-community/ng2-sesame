import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationMessageComponent } from './authorization-message.component';
import { ActivatedRoute } from '@angular/router';

describe('AuthorizationMessageComponent', () => {
  let component: AuthorizationMessageComponent;
  let fixture: ComponentFixture<AuthorizationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizationMessageComponent ],
      providers: [{provide: ActivatedRoute, useValue: {snapshot: {data: {message: 'test message'}}}}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display message', () => {
    expect(component.message).toBe('test message');
  });
});
