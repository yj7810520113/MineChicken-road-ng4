import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './screen/map/map.component';

import { D3Service } from 'd3-ng2-service';
import { DetailTimeSeriesComponent } from './screen/detail-time-series/detail-time-series.component'; // <-- import statement
// import 'rx-from-csv';



@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DetailTimeSeriesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
