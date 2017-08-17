import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MapComponent} from './screen/map/map.component';

import {D3Service} from 'd3-ng2-service';
import {DetailTimeSeriesComponent} from './screen/detail-time-series/detail-time-series.component';
import {FileReaderService} from "./service/file-reader.service";
import {HttpModule} from "@angular/http";
import {NET_CONFIG, NetConfig} from "./config/net-config";
import { CompareOffsetComponent } from './screen/compare-offset/compare-offset.component';
import {SharedVariableService} from "./service/shared-variable.service"; // <-- import statement
// import 'rx-from-csv';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailTimeSeriesComponent,
    CompareOffsetComponent
  ],
  imports: [
    HttpModule,
    BrowserModule
  ],
  providers: [D3Service, FileReaderService,SharedVariableService,
    {
      provide: NET_CONFIG,
      useValue: NetConfig,
    },],
  bootstrap: [AppComponent]
})
export class AppModule {
}
