import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import {SesameService, SESAME_CONFIG} from './sesame.service';

@NgModule({
    imports: [HttpModule]
})
export class SesameModule {
    static forRoot(apiEndpoint): ModuleWithProviders {
        return {
            ngModule: SesameModule,
            providers: [
                SesameService,
                {
                    provide: SESAME_CONFIG,
                    useValue: { apiEndpoint}
                }
            ]
        };
    }
 }
