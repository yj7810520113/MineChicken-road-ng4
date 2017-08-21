import {Component, OnInit, ViewChild} from '@angular/core';
import {FileReaderService} from "../../service/file-reader.service";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/filter';

import {SharedVariableService} from "../../service/shared-variable.service";

@Component({
  selector: 'app-compare-offset',
  templateUrl: './compare-offset.component.html',
  styleUrls: ['./compare-offset.component.css']
})
export class CompareOffsetComponent implements OnInit {
  private selectedDate;
  private selectedDate1=['2016-03-01','2016-03-02','2016-03-03','2016-03-04','2016-03-05','2016-03-06','2016-03-07'];
  private selectedDate2=['2016-04-01','2016-04-02','2016-04-03','2016-04-04','2016-04-05','2016-04-06','2016-04-07','2016-04-08','2016-04-09'];

  private previousDate='2016-02-28';
  //svg的图形数据
  private data;
  @ViewChild('svg') svgElement;

//-----------------------d3相关参数-------------------------------
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
  private dateFormat = d3.timeFormat('%Y-%m-%d');
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
  private defs;

//area图比例尺


  private timeXScale = d3.scaleTime()
    .range([0, this.plotWidth])
    .domain([this.parseDate('00:00:00'), this.parseDate('23:58:00')]);
  private xAxis = d3.axisBottom()
    .scale(this.timeXScale)
    .tickFormat(d3.timeFormat('%H'))
    .ticks(d3.timeHour.every(1));

  //分别定义三种颜色的比例尺
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



    let svg=d3.select(this.svgElement.nativeElement);
    this.defs= svg.append('defs');

    //获取数据
    this.fileReader.readFileToJson('/assets/file/areaData_2min.csv')
      .map((d) => {
        return this.parseAreaDatas(d)
      })
      .subscribe((x)=>{
        this.data=x;
    });
    //订阅时间
    this.sharedVariable.getTimeNow().subscribe((x)=>{
      //test
      if(Math.round(Math.random())==0){
        this.selectedDate=this.selectedDate1;
      }
      else
        this.selectedDate=this.selectedDate2;




      let nowDate=this.dateFormat(x);
      // console.log(nowDate);
      // console.log(this.data);
      let nowDatas=[];
      //时间相同什么事都不干
      if(nowDate==this.previousDate){
      }
      //否则过滤数据重新绘图
      else{
        this.previousDate=nowDate;
        for(let i=0;i<this.selectedDate.length;i++) {
          let nowData = this.data.filter((d) => {
            if(d.daydatetime.indexOf(this.selectedDate[i])==-1){
              return false;
            }
            else{
              return true;
            }
          });
          nowDatas.push(nowData);
        }

      //  利用得到的nowData重新绘图
        this.renderPlot(nowDatas);

      }

      //只用更改坐标线的平移情况
      // console.log(nowDatas);

    })

  }
  renderPlot(datas){
//    每一块area和gradient作为一个g区域
    let svg=d3.select(this.svgElement.nativeElement);
    let gRowN=svg.selectAll('svg>g')
      .data(datas);
      let gRowNEnter=gRowN.enter()
      .append('g').merge(gRowN)
      .attr('transform',(d,i)=>{return 'translate(0,'+(this.areaHeight+this.gradientHeight+this.gMargin)*i+')'})
      gRowN.exit().remove();
      console.log(gRowN);

    //---------------------------绘制渐变色
//    添加渐变色
    let linearGragientN=this.defs.selectAll('linearGradient')
      .data(datas);
      let linearGradientEnter=linearGragientN.enter()
      .append('linearGradient')
      .attr('id',function(d,i){
        return 'dailyLinearGradient'+i;
      })
      .attr('x1','0%')
      .attr('y1','0%')
      .attr('x2','100%')
      .attr('y2','0%')
      .attr('spreadMethod','pad')
      .merge(linearGragientN);
      linearGragientN.exit().remove();
    let linearGradientEnterStop=linearGradientEnter.selectAll('stop')
      .data(function (d) {
        return d
      });
      linearGradientEnterStop.enter()
      .append('stop')
        .merge(linearGradientEnterStop)
      .attr("offset", (d,i)=> { return this.gradientMapXScale(i); })
      .attr("stop-color", d=> { return this.gradientMapColorScale(d.aver_speed_offset); })
      .attr("stop-opacity", 1);
      linearGradientEnterStop.exit().remove();


//绘制渐变色填充的矩形
//     console.log(gRowN);
    // console.log(gRowNEnter);
    // console.log(gRowNEnter.selectAll());
    //清除svg>g下面的所有子元素
    gRowNEnter.selectAll('*').remove();
     let gradientRectEnter=gRowNEnter
        .append('rect')
      .attr('x',this.marginLeft)
      .attr('y',(d,i)=> {
        return this.areaHeight;
      })
      .attr('height',this.gradientHeight)
      .attr('width',this.plotWidth)
      .attr('fill',(d,i)=> {
        return 'url(#dailyLinearGradient'+i+')';
      })
      // gradientRect.exit().remove();
//    添加时间刻度
//    只需要在最后一个添加坐标轴就好了

    gRowNEnter.filter((d,i)=>{
      // console.log(i);
      return i==(datas.length-1)?true:false;
    }).append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate('+this.marginLeft+',' + ((this.areaHeight+this.gradientHeight))+ ')')
      .call(this.xAxis);


//    -----------------------------------------绘制area图
//    添加clippath
    gRowNEnter.append('clipPath')
      .attr('id','areaClipPath')
      .append('rect')
      .attr('x',0)
      .attr('y',0)
      .attr('height',this.areaHeight-2)
      .attr('width',this.plotWidth);
    let areaPlotN=gRowNEnter.append('g')
      .attr('transform','translate('+this.marginLeft+','+'0)');


//    console.log(areaPlotN.data(function (d) {
//        return d;
//    }));
//     console.log(areaPlotN._groups[0]);
    areaPlotN._groups[0].forEach((d1)=>{

      this.areaYScales.forEach((d2,i2)=> {
        let area = d3.area()
          .x(d=>{
            return this.timeXScale(this.parseDate(d.daydatetime.substr(11,20)));
          })
          .y0(()=> {
            return this.areaYScales[i2](0);
          })
          .y1(d=>{
//                    console.log(d.daydatetime+","+d2.domain()[0]+","+(d.aver_speed_offset-d2.domain()[0]));
//                    console.log(i2+","+d2(d.aver_speed_offset)+",");
            return d2(d.aver_speed_offset);
          });
        d3.select(d1).append('path')
          .attr('d',function(){
            return area(d1.__data__)})
          .style('fill',this.sequentialIndexScale(i2))
          .attr('clip-path','url(#areaClipPath)')
      })


    });
    //    添加日期标志
    let labelFormat=this.zh.format("%Y年%b %A");
    areaPlotN.append('g').append('text')
      .attr('x','-20')
      .attr('y',20)
      .text(d=> {
        return labelFormat((this.textLabelParse(d[0].daydatetime)));
      })
//    areaPlotN.append('path')
//        .attr('d',(d)=>{
//            areaYScales.forEach(function (yScale) {
//                let area = d3.area()
//                    .x(function (d) {
//                        console.log(x(parseDate(d.daydatetime)));
//                        return x(parseDate(d.daydatetime))
//                    })
//                    .y0(function (d) {
//                        return 0
//                    })
//                    .y1(function (d) {
//                        return areaYScales[0](d.aver_speed_offset)
//                    });
//
//            })
//
//        });
//    areaYScales.forEach(function (yScale) {
//        let area=d3.area()
//            .x(function(d){return x(parseDate(d.daydatetime))})
//            .y0(function(d){return 0})
//            .y1(function(d){return yScale(d.aver_speed_offset)});
//        areaPlotN.append('path')
//            .attr('d',function(d){return area(d)})
//            .attr('fill','#ABEDD8')
//    });
//    var area_data = d3.area()
//        .x(function(d) {return x(d.x);	})
//        .y0(function(d) {return y(d.low);	})
//        .y1(function(d) {return y(d.high);	});
//    var area = area_data(area1);
//    svg.append('path')
//        .attr('d', area)
//        .style("fill", "#ABEDD8");
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
