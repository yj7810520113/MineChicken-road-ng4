import {Inject, Injectable} from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {inject} from "@angular/core/testing";
import {NET_CONFIG} from "../config/net-config";
import {INetConfig} from "../config/Inet-config";
import {ROAD_PATH_CONFIG} from "../config/road-path-config";
import {IRoadPathConfig} from "../config/Iroad-path-config";
import {SharedVariableService} from "./shared-variable.service";
// import  'rx-from-csv';
// import {Observable} from "rxjs/Observable";

@Injectable()
export class FileReaderService {
  private shared;
  //
  constructor(private http: Http, @Inject(NET_CONFIG) private net_config: INetConfig,@Inject(ROAD_PATH_CONFIG) private road_path_config:IRoadPathConfig) {
    // this.shared=this.sharedVariabel;
  }

  //
  // readFileToJson(path: string) {
  //   Observable.fromCSV(path)
  //     .subscribe((data) => {
  //       console.log(data);
  //     });
  // }
  readCDNCSVFileToJson(path: string): any {
    console.log("CDN:"+this.net_config.CDN_BASE_URL + path+".csv")
    return this.http.get(this.net_config.CDN_BASE_URL + path+".csv")
      .map((x) => {
        // console.log(x);
        return this.csvToJson(x.text());
      });
  }


  readFileToJson(path: string): any {
    return this.http.get(this.net_config.CSV_BASE_URL + path)
      .map((x) => {
        // console.log(x);
        return this.csvToJson(x.text());
      });
  }

  csvToJson(str: string): any {
    // console.log(str);
    let lines = str.split('\n');
    let result = [];
    let headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
        var obj = {};
        var objs = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
          obj[(headers[j].replace(/\r/, ''))] = objs[j];
        }
          result.push(obj);


    }
    // console.log('111111111111111');
    // console.log(JSON.stringify(result));
    return result;
  }

}
