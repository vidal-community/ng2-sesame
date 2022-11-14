import {ModuleWithProviders, NgModule} from '@angular/core';
import {JwtUtils, SesameService, SESAME_CONFIG} from './sesame.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule]
})
export class SesameModule {
  static forRoot(apiEndpoint): ModuleWithProviders<SesameModule> {
    return {
      ngModule: SesameModule,
      providers: [
        SesameService,
        JwtUtils,
        {
          provide: SESAME_CONFIG,
          useValue: {apiEndpoint}
        }
      ]
    };
  }
}
