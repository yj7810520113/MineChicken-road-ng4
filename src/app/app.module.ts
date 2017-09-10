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
import { SimulateTravelComponent } from './screen/simulate-travel/simulate-travel.component';
import {HttpService} from "./service/http.service";
import { OverviewTimeSeriesComponent } from './screen/overview-time-series/overview-time-series.component';
import { CountLinkPieComponent } from './screen/count-link-pie/count-link-pie.component';
import { ControlPannelComponent } from './screen/control-pannel/control-pannel.component'; // <-- import statement
// import 'rx-from-csv';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdChipsModule, MdDatepickerModule, MdIconModule, MdNativeDateModule} from "@angular/material";
import {BusyConfig, BusyModule} from "angular2-busy";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {Ng2PageScrollModule} from "ng2-page-scroll";


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailTimeSeriesComponent,
    CompareOffsetComponent,
    SimulateTravelComponent,
    OverviewTimeSeriesComponent,
    CountLinkPieComponent,
    ControlPannelComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    MdChipsModule,
    MdIconModule,
    MdDatepickerModule,
    MdNativeDateModule,
    BusyModule,
    BusyModule.forRoot(
      new BusyConfig({
        // message: 'Don\'t panic!',
        // backdrop: false,
        // template: '<div>{{message}}</div>',
        // delay: 200,
        // minDuration: 200000,
        // wrapperClass: 'my-class'
      })
    ),
    Ng2PageScrollModule,
  ],
  providers: [D3Service, FileReaderService,SharedVariableService,HttpService,
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
