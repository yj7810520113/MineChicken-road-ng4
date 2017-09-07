import {INetConfig} from "./Inet-config";
import {InjectionToken} from "@angular/core";

export const NetConfig: INetConfig = {
  //阿里云服务器配置低，太慢，更改sql查询方式的结果为csv的结果，用七牛云cdn加速读取结果
  // CDN_BASE_URL:'http://192.168.71.179/cdn/mr',
  CDN_BASE_URL:'http://cdn.mmcode.top/cdn/mr',
  CSV_BASE_URL: 'http://localhost:4200',
  SERVICE_BASE_URL: 'http://192.168.71.179:8080/MineChicken-Road'

}
export let NET_CONFIG = new InjectionToken<INetConfig>('app.config');
