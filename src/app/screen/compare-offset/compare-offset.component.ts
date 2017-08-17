import {Component, OnInit} from '@angular/core';
import {FileReaderService} from "../../service/file-reader.service";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import {SharedVariableService} from "../../service/shared-variable.service";

@Component({
  selector: 'app-compare-offset',
  templateUrl: './compare-offset.component.html',
  styleUrls: ['./compare-offset.component.css']
})
export class CompareOffsetComponent implements OnInit {

//    <!--本地化-->
  private zh = d3.timeFormatLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["¥", ""],
    dateTime: "%a %b %e %X %Y",
    date: "%Y/%-m/%-d",
    time: "%H:%M:%S",
    periods: ["上午", "下午"],
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    shortDays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  });
  private svg = d3.select('svg');
  private marginTop = 30;
  private gMargin = 5;
  private marginLeft = 30;
  private plotWidth = 400;
  private areaHeight = 40;
  private gradientHeight = 10;
  private textLabelParse = d3.timeParse('%Y-%m-%d %H:%M:%S');
  private textLabelFormat = d3.timeFormat('%m-%d %w')
  private timeFormat = d3.timeFormat('%H:%M:%S');
  private parseDate = d3.timeParse('%H:%M:%S');
//渐变色比例尺
  private gradientMapXScale = d3.scaleLinear()
    .domain([0, 30 * 24])
    .range(["0%", "100%"]);
  private gradientMapColorScale = d3.scaleLinear()
    .interpolate(d3.interpolateLab)
    .domain([0, 0.2, 0.55, 0.7, 1])
    .range(['#42bd41', '#42bd41', '#ffb74d', '#ff8a65', '#e84e40']);
  private defs = d3.select('svg').append('defs');

//area图比例尺


  private timeXScale = d3.scaleTime()
    .range([0, this.plotWidth])
    .domain([this.parseDate('00:00:00'), this.parseDate('23:58:00')]);
  private xAxis = d3.axisBottom()
    .scale(this.timeXScale)
    .tickFormat(d3.timeFormat('%H'))
    .ticks(d3.timeHour.every(1));

  private areaNormalYScale = d3.scaleLinear()
    .domain([0, 0.2])
    .range([this.areaHeight, 0]);
  private areaClearYScale = d3.scaleLinear()
    .domain([0.2, 0.55])
    .range([this.areaHeight, 0]);
  private areaBusyYScale = d3.scaleLinear()
    .domain([0.55, 0.7])
    .range([this.areaHeight, 0]);
  private areaVeryBusyYScale = d3.scaleLinear()
    .domain([0.7, 1])
    .range([this.areaHeight, 0]);
  private areaYScales = [this.areaNormalYScale, this.areaClearYScale, this.areaBusyYScale, this.areaVeryBusyYScale];

  constructor(private fileReader: FileReaderService,private sharedVariable:SharedVariableService) {
  }

  ngOnInit() {
    // Observable.merge(this.fileReader.readFileToJson('/assets/file/渐变颜色1.csv'),
    //   this.fileReader.readFileToJson('/assets/file/渐变颜色2.csv'),
    //   this.fileReader.readFileToJson('/assets/file/渐变颜色3.csv'),
    //   this.fileReader.readFileToJson('/assets/file/渐变颜色4.csv'),
    //   this.fileReader.readFileToJson('/assets/file/渐变颜色5.csv'),
    //   this.fileReader.readFileToJson('/assets/file/渐变颜色6.csv'),
    //   this.fileReader.readFileToJson('/assets/file/渐变颜色7.csv'),
    // )
    //   .map((x) => this.parseAreaDatas(x))
    //   .subscribe((x)=>console.log(x))
    // this.fileReader.
    this.sharedVariable.getTimeNow().subscribe((x)=>{
      console.log(x);

    })

  }

  parseAreaDatas(d): any {
    //        console.log(d3.timeFormat('%Y-%m-%d %H-%M-%S').format(d.daydatetime));
    let result = [];
    d.forEach((d1, i1) => {
      result.push({
        daydatetime: d1.daydatetime,
//        daydatetime:parseDate(d.daydatetime,'Y-m-d H:M:S'),
        aver_speed_offset: parseFloat(d1.aver_speed_offset),
      })
    });
    return result;

  }

  sequentialIndexScale(x): string {


//    if(x<=0){
//        return '#42bd41';
//    }
//    else if(x<=0.2)
//        return '#42bd41';
//    else if(x<=0.55)
//        return '#fff176';
//    else if(x<=0.7)
//        return '#ffb74d';
//    else if(x<=1){
//        return '#e84e40';
//    }

    if (x == 0)
      return '#42bd41';
    else if (x == 1)
      return '#fff176';
    else if (x == 2)
      return '#ffb74d';
    else if (x == 3) {
      return '#e84e40';
    }
  }
}
