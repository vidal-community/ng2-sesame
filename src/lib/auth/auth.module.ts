import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorizationMessageComponent} from './message/authorization-message.component';
import {AuthConfig} from './auth.service';

export const LIBRARY_CONFIG = new InjectionToken<{groups: string[]}>('LIBRARY_CONFIG');

const authRoutes: Routes = [
  {path: 'unauthorized', component: AuthorizationMessageComponent, data: {message: 'Droits insuffisants pour accéder à l\'application'}},
  {path: 'disconnected', component: AuthorizationMessageComponent, data: {message: 'Veuillez vous connecter pour accéder à l\'application'}},
];

@NgModule({
  declarations: [
    AuthorizationMessageComponent
  ],
  imports: [
    RouterModule.forChild(authRoutes),
  ],
})
export class AuthModule {
  static forRoot(config: AuthConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: LIBRARY_CONFIG, useValue: config }
      ]
    };
  }
}
