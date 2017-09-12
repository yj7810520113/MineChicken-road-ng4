// import {BusyConfig} from "angular2-busy";
//
// export class  BusyConfigFactory  extends BusyConfig{
//   message= '';
//                                 // backdrop: false,
//   template='<div class="ng-busy-default-wrapper">' +
//   '<div class="svgSpinner">' +
//   '<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\n' +
//   '<circle class="loadingPath" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>\n' +
//   '</svg>' +
//   '<div class="ng-busy-default-text"></div></div>';       // delay: 200,
//   // minDuration: 200000,
//   // wrapperClass: 'my-class'
//   delay=0;
//   minDuration= 0;
//   backdrop: true;
//   wrapperClass= 'ng-busy';
//
// }
import {BusyConfig} from "angular2-busy";

export function  BusyConfigFactory() {
  return new BusyConfig({
   message: '',
                                // backdrop: false,
    template:'<div class="ng-busy-default-wrapper">' +
  '<div class="svgSpinner">' +
  '<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">\n' +
  '<circle class="loadingPath" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>\n' +
  '</svg>' +
  '<div class="ng-busy-default-text"></div></div>',     // delay: 200,
  });
}
