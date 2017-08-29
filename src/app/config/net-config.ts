import {INetConfig} from "./Inet-config";
import {InjectionToken} from "@angular/core";

export const NetConfig: INetConfig = {
  CSV_BASE_URL: 'http://localhost:4200/',
  SERVICE_BASE_URL: 'http://mmcode.top:8080/'

}
export let NET_CONFIG = new InjectionToken<INetConfig>('app.config');
