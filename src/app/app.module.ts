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
import {SharedVariableService} from "./service/shared-variable.service";
import {ROAD_PATH_CONFIG, RoadPathConfig} from "./config/road-path-config";
import {ROAD_CONFIG, RoadConfig} from "./config/road-config";
import { SimulateTravelComponent } from './screen/simulate-travel/simulate-travel.component'; // <-- import statement
// import 'rx-from-csv';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailTimeSeriesComponent,
    CompareOffsetComponent,
    SimulateTravelComponent
  ],
  imports: [
    HttpModule,
    BrowserModule
  ],
  providers: [D3Service, FileReaderService,SharedVariableService,
    {
      provide: NET_CONFIG,
      useValue: NetConfig,
    },
    {
      provide:ROAD_PATH_CONFIG,
      useValue:RoadPathConfig,
    },
    {
      provide:ROAD_CONFIG,
      useValue:RoadConfig,
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
