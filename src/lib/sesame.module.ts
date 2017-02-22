import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import {SesameService, JwtUtils,SESAME_CONFIG} from './sesame.service';

@NgModule({
    imports: [HttpModule]
})
export class SesameModule {
    static forRoot(apiEndpoint): ModuleWithProviders {
        return {
            ngModule: SesameModule,
            providers: [
                SesameService,
                JwtUtils,
                {
                    provide: SESAME_CONFIG,
                    useValue: { apiEndpoint}
                }
            ]
        };
    }
 }
