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
import {
  MdAutocompleteModule,
  MdButtonModule, MdChipsModule, MdDatepickerModule, MdDialogModule, MdIconModule, MdInputModule, MdNativeDateModule,
  MdSelectModule
} from "@angular/material";
import {BusyConfig, BusyModule} from "angular2-busy";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {Ng2PageScrollModule} from "ng2-page-scroll";
import { TimeLineDialogComponent } from './screen/dialog/time-line-dialog/time-line-dialog.component';
import {FormsModule} from "@angular/forms";
import { CompareOffsetDialogComponent } from './screen/dialog/compare-offset-dialog/compare-offset-dialog.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { StartDialogComponent } from './screen/dialog/start-dialog/start-dialog.component';
import {BusyConfigFactory} from "./config/busy-config-factory";


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailTimeSeriesComponent,
    CompareOffsetComponent,
    SimulateTravelComponent,
    OverviewTimeSeriesComponent,
    CountLinkPieComponent,
    ControlPannelComponent,
    TimeLineDialogComponent,
    CompareOffsetDialogComponent,
    StartDialogComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MdChipsModule,
    MdIconModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdSelectModule,
    MdButtonModule,
    MdDialogModule,
    MdInputModule,
    MdAutocompleteModule,
    BusyModule,
    // BusyModule,
    // BusyModule.forRoot(
    //   new BusyConfig({
    //     message: '',
    //     // backdrop: false,
    //     template:'<div class="ng-busy-default-wrapper">' +
    //     '<div class="svgSpinner">' +
    //     '<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\n' +
    //     '<circle class="loadingPath" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>\n' +
    //     '</svg>' +
    //     '<div class="ng-busy-default-text"></div></div>',        // delay: 200,
    //     // minDuration: 200000,
    //     // wrapperClass: 'my-class'
    //   })
    // ),
    Ng2PageScrollModule,
    NgbModule.forRoot(),
  ],
  providers: [D3Service, SharedVariableService,FileReaderService,HttpService,
    {provide: BusyConfig, useFactory: BusyConfigFactory},
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
  entryComponents:[TimeLineDialogComponent,CompareOffsetDialogComponent,StartDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
