import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideNgScales } from '../../../ng-scales/src';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNgScales()
  ]
};
