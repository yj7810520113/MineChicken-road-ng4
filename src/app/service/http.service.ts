import {Inject, Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {NET_CONFIG} from "../config/net-config";
import {INetConfig} from "../config/Inet-config";

@Injectable()
export class HttpService {

  constructor(private http:Http,@Inject(NET_CONFIG) private netConfig:INetConfig) {}
  getPredictData(url:string){
    return this.http.get(this.netConfig.SERVICE_BASE_URL+url)
      .map(x=>x.json());
  }

}
