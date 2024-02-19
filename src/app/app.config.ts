import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DialogModule } from '@angular/cdk/dialog';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(DialogModule)],
};
