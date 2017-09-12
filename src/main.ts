import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {platformBrowser} from "@angular/platform-browser";
import {SharedVariableService} from "./app/service/shared-variable.service";
import {FileReaderService} from "./app/service/file-reader.service";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
// platformBrowser().bootstrapModuleFactory()
