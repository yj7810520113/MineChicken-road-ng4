import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {D3, D3Service} from "d3-ng2-service";
import {FileReaderService} from "../../service/file-reader.service";
import {SharedVariableService} from "../../service/shared-variable.service";
import {HttpService} from "../../service/http.service";
import {ROAD_PATH_CONFIG} from "../../config/road-path-config";
import {LinkPathData} from "../DataTransModel";
import {ROAD_CONFIG} from "../../config/road-config";
import {Subscription} from "rxjs/Subscription";
import {Subject} from "rxjs/Subject";
import {isUndefined} from "util";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private d3: D3; // <-- Define the private member which will hold the d3 reference
  @ViewChild('svg') private svgElement;
  // @ViewChild('tooltip1') private tooltip1;
  // @ViewChild('tooltipSvg') private tooltipSvg;
  busy: Subscription;

  private timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');
  private dateFormat = d3.timeFormat('%Y-%m-%d');
  private previousDate = '1970-01-01';//作为是否需要取数据的标志
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
  private labelFormat = this.zh.format("%Y年%m月%d日 %H:%M:%S %A");

  private roadData = [];

  //和simulate的交互
  private linkPathData = new LinkPathData();


  constructor(element: ElementRef, d3Service: D3Service, private fileReader: FileReaderService, private sharedVariable: SharedVariableService, private http: HttpService, @Inject(ROAD_PATH_CONFIG) private roadPathConfig, @Inject(ROAD_CONFIG) private roadConfig) {
    this.d3 = d3Service.getD3(); // <-- obtain the d3 object from the D3 Service
    // this.parentNativeElement = element.nativeElement;
    // fileReader.readFileToJson('/assets/file/gy_contest_link_info.csv').subscribe((x => console.log(x)
    // ))
    //   ;
  }

  // private readSingleFile(e):String {
  //   let fileName = e.files[0];
  //   console.log(fileName);
  //   if (!fileName) {
  //     return;
  //   }
  //   let reader = new FileReader();
  //   reader.onload = file => {
  //     let contents: any = file.target;
  //     this.text = contents.result;
  //   };
  //   reader.readAsText(fileName);
  //   console.log(reader.readAsText(fileName))
  // }

  // 初始化map及其宽度
  ngOnInit() {
    let d3Svg = d3.select(this.svgElement.nativeElement);


    // d3Svg.selectAll('line').on('mousedown',d=>{
    //   console.log(d3Svg.select('line').node());
    // });
    let that = this;
    d3Svg.selectAll('line')
      .on('mouseover', function (d) {
        //阻止向screen冒泡
        d3.event.stopPropagation();
        let link_id = (d3.select(this).attr('id').replace('link', ''));
        for (let index in that.roadPathConfig) {
          for (let i = 0; i < that.roadPathConfig[index].length; i++) {
            if (link_id == (that.roadPathConfig[index])[i]) {
              //正向x`
              if (parseInt(index) % 2 != 0) {
                that.linkPathData.link_ids = [(that.roadPathConfig[index])[i - 1], (that.roadPathConfig[index])[i]];
              }
              //反向
              else {
                that.linkPathData.link_ids = [(that.roadPathConfig[index])[i - 1], (that.roadPathConfig[index])[i]];
              }
              that.sharedVariable.setLinkPathSubject(that.linkPathData);
            }
          }
        }

        //  tooltip
        //     d3.select(that.tooltip1.nativeElement).style("opacity",1.0);
        //     d3.select(that.tooltip1.nativeElement).html('长度'+that.roadConfig.roadConfig.filter(d1=>d1.link_id==link_id)[0].length+'宽度'+that.roadConfig.roadConfig.filter(d1=>d1.link_id==link_id)[0].width);
      })
      // .on('mousemove',(d)=>{
      //   d3.select(that.tooltip1.nativeElement).style("left", (d3.event.pageX-550) + "px")
      //     .style("top", (d3.event.pageY + 20-125) + "px");
      // })
      .on('mouseout', () => {
        this.sharedVariable.setLinkPathSubject(null);
        // d3.select(that.tooltip1.nativeElement).style("opacity",0.0);

      });
    // d3Svg.on('mousedown',function(){
    //   //发送值为null，即为清空选集
    // d3.select(that.tooltip1.nativeElement).style("opacity",0.0);
    //
    // })


    //设置路网的宽度
    this.busy = this.fileReader.readCDNCSVFileToJson('/assets/file/gy_contest_link_info')
      .subscribe(x => {
        x.forEach(d => {
          //修改tooltip的bug，x，y均平移0.1
          // console.log(d)
          d3Svg.select('#link' + d.link_ID).attr('x2',parseFloat(d3Svg.select('#link' + d.link_ID).attr('x2'))+0.1);
          d3Svg.select('#link' + d.link_ID).attr('y2',parseFloat(d3Svg.select('#link' + d.link_ID).attr('y2'))+0.1);

          d3Svg.select('#link' + d.link_ID).attr("stroke", "rgba(0, 255, 251, 0.5)");
          d3Svg.select('#link' + d.link_ID).attr("stroke-width", d.width);
          d3Svg.select('#link' + d.link_ID).attr("marker-start", "url(#arrow)");
          d3Svg.select('#link' + d.link_ID).attr("marker-end", "url(#roadEnd)");
        })
      })

    this.sharedVariable.getTimeNow()
      .subscribe(z => {
        this.tooltipTimeSuject.next(z);
        if (this.previousDate != this.dateFormat(z)) {
          this.previousDate = this.dateFormat(z);

          // this.http.getPredictData('/ajax/getroadstatus/'+this.previousDate)
          //   .subscribe(x=>{
          //     console.log(x)
          //     this.roadData=x;
          //   })
          this.busy = this.fileReader.readCDNCSVFileToJson('/map/' + this.previousDate)
            .map(x => this.parseMapDatas(x))
            .subscribe(x => {
              this.roadData = x;

              // 防止点击的时候，没有饼图的出现
              let xToDate = this.timeFormat(z);
              //设置时间
              d3.select('#dayTime').text("" + this.labelFormat(z))
              // console.log(this.roadData)
              let roadInfo = this.roadData.filter(d1 => {
                return d1.daydatetime == xToDate;
              });
              //传递数据给count-link-pie
              this.sharedVariable.setLinkSpeedOffsetSubject(roadInfo);
              // console.log(roadInfo);
              roadInfo.forEach(d1 => {
                d3Svg.select('#link' + d1.link_id).attr('stroke', this.sequentialScale(d1['speed_offset']));
              })
            })
        }
        let xToDate = this.timeFormat(z);
        //设置时间
        d3.select('#dayTime').text("" + this.labelFormat(z))
        // console.log(this.roadData)
        let roadInfo = this.roadData.filter(d1 => {
          return d1.daydatetime == xToDate;
        });
        //传递数据给count-link-pie
        this.sharedVariable.setLinkSpeedOffsetSubject(roadInfo);
        // console.log(roadInfo);
        roadInfo.forEach(d1 => {
          d3Svg.select('#link' + d1.link_id).attr('stroke', this.sequentialScale(d1['speed_offset']));
        })
      })


    this.sharedVariable.getLinkPathSubject()
      .subscribe(x => {
        if (!x) {
          this.unSelectedRoad();
        }
        else {
          this.selectedRoad((x['link_ids'])[1]);
        }
      })

    //  与饼图的path的交互
    this.sharedVariable.getPathSubject()
      .subscribe(x => {
        if (x == null) {
          d3Svg.selectAll('line').classed('unSelectedRoad', false);
        }
        else {
          d3Svg.selectAll('line').classed('unSelectedRoad', true);
          this.roadPathConfig['link_id_' + x].forEach(d => {
            d3Svg.select('#link' + d).classed('unSelectedRoad', false);
          })
        }
      })



  //  *-----------------------tooltip--------------------------------

  }


  parseMapDatas(d): any {
    // console.log(d);
    // console.log(that);
    let result = [];
    d.forEach((d1, i1) => {
      // console.log(d1.aver_speed_offset);
      result.push({
        daydatetime: d1['daydatetime'],
        link_id: d1.link_id,
        speed_offset: parseFloat(d1['speed_offset']),
      })
    })
    return result;
  }

  //路网的颜色映射
  sequentialScale(x): string {
    if (x <= 0) {
      return '#2a9d8f';
    }
    else if (x <= 0.2)
      return '#2a9d8f';
    else if (x <= 0.55)
      return '#e9c46a';
    else if (x <= 0.7)
      return '#f4a261';
    else if (x <= 1) {
      return '#e76f51';
    }
  }

  //选中的路径的颜色
  selectedRoad(x) {
    d3.select(this.svgElement.nativeElement).selectAll('line').classed('unSelectedRoad', true);
    d3.select(this.svgElement.nativeElement).select('#link' + x).classed('unSelectedRoad', false);
  }

  unSelectedRoad() {
    d3.select(this.svgElement.nativeElement).selectAll('line').classed('unSelectedRoad', false);
  }


//  ----------------------ng4------------------------------
  busyTooltip:Subscription;
  //时间订阅
  private tooltipTimeSuject=new Subject();
  link_id = '未知';
  link_length = 0;
  link_width = 0;
  private currentTime = '2016-03-01';
  private formatDate = d3.timeFormat('%Y-%m-%d %H:%M:%S');
  //渐变色比例尺
  private gradientMapXScale = d3.scaleLinear()
    .domain([0, 30 * 24])
    .range(["0%", "100%"]);
  private gradientMapColorScale = d3.scaleLinear()
    .interpolate(d3.interpolateLab)
    .domain([0, 0.2, 0.55, 0.7, 1])
    .range(['#2a9d8f', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']);
  private tooltipSvg;
  private defs;
  private x;
  private y;
  private xAxis;
  private yAxis;
  private area;
  private line;
  // //矩形的g
  // private aver_speed_offsets;
  //面积图上的线条
  private deficit_line;
  //面积图
  private deficit_area;
  //x轴
  private gXaxis;
  private gYaxis;

  private defs_deficitMask;

  //--------------------------------------------
  private intervalTimer = 3000;
//        时间为2016-03-30
  private currentCursor = 1458432000000;

  private dataSpan;
  private margin = {top: 20, right: 0, bottom: 20, left: 30};

  private width = 750 - this.margin.left - this.margin.right;
  private height = 200 - this.margin.top - this.margin.bottom;

  private tooltipLinkSubject=new Subject();

  shownTooltip(t) {

    this.link_id = t;
    this.link_length = this.roadConfig.roadConfig.filter(d1 => d1.link_id == t)[0].length;
    this.link_width = this.roadConfig.roadConfig.filter(d1 => d1.link_id == t)[0].width;
    this.busyTooltip=this.http.getRoadDayData('/ajax/getroadday/' + this.link_id + '/' + this.previousDate)
      .map(x=>this.parseAreaDatas(x))
      .subscribe(x => this.renderTooltipPlot(x));
    this.tooltipTimeSuject.subscribe(x=>{
      if(this.tooltipSvg&&this.tooltipSvg.select('.currentTimeLine')) {
        this.tooltipSvg.select('.currentTimeLine').select('line').attr('x1', this.x(x)).attr('x2', this.x(x));
      }
    })
  }

//  渲染tooltip的图形
  renderTooltipPlot(data) {
    // console.log(new Date(that.currentCursor));
    // console.log(d3.select('#tooltipSvg'))
    data=data.sort((a,b)=>a.daydatetime-b.daydatetime);
    this.tooltipSvg = d3.select('#tooltipSvg').append('g').attr('transform','translate('+this.margin.left+","+this.margin.top+")");

    this.defs = this.tooltipSvg.append('defs');


    this.x = d3.scaleTime()
      .range([0, this.width]);

    this.y = d3.scaleLinear()
      .range([this.height, 0]);

    this.xAxis = d3.axisBottom()
      .scale(this.x)
      .tickFormat(d3.timeFormat('%H时'))
      .ticks(d3.timeHour.every(2));

    this.yAxis = d3.axisLeft()
      .scale(this.y);
    this.area = d3.area()
      .x((d) => {
        return this.x(d.daydatetime);
      })
      .y1((d) => {
        return this.y(d.aver_speed_offset);
      });

    this.line = d3.line()
      .x((d) => {
        return this.x(d.daydatetime);
      })
      .y((d) => {
        return this.y(d.aver_speed_offset);
      });
    //            添加clippath
    this.defs.append('clipPath')
      .attr('id', 'clipAxes')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);
// //        绘制矩形的g
//     this.aver_speed_offsets = this.svg.append('g')
//       .attr('class', 'governments')
//       .attr('clip-path', 'url(#clipAxes)');
//        绘制面积图上的线条,
    this.deficit_area = this.tooltipSvg.append('path');
    // .attr('id', 'surplus-deficit-area  ');
    this.deficit_line = this.tooltipSvg.append('path')
      .attr('class', 'surplus-deficit-line');
    this.gXaxis = this.tooltipSvg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')');
    this.gYaxis = this.tooltipSvg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,' + 0 + ')');
    this.yAxis = d3.axisLeft()
      .scale(this.y)
      .tickFormat(d3.format('.0%'))
      .tickValues([0,0.25,0.5,0.7,1])
      .tickPadding(2)
      .tickSize(2);


    //previousDate
    let parsePreviousDate = d3.timeParse('%Y-%m-%d');

    // console.log(parsePreviousDate(this.previousDate));
    this.x.domain([parsePreviousDate(this.previousDate).getTime(),parsePreviousDate(this.previousDate).getTime()+1000*60*60*24]);
    this.y.domain([0, 1]);
    this.area.y0(this.y(0));
    //根据x.domain从新设置gradientMapXScale的domain
    this.gradientMapXScale.domain([0,(this.x.domain()[1]-this.x.domain()[0])/(1000*60*2)]);
    // let nowSpanInterval = d3.pairs(nowSpan).map(x => {
    //   return {
    //     areaColor: this.areaLinearGradient(x[0].aver_speed_offset),
    //     startDate: x[0].daydatetime,
    //     endDate: x[1].daydatetime,
    //     aver_speed_offset: x[0].aver_speed_offset,
    //   }
    // });
    // console.log(nowSpanInterval)
//    绘制渐变色
    let linearGradientEnter=d3.select('#tooltipSvg').select('#tooltipBarFillLinearDetail')
      .selectAll('stop')
      .data(data);

    let linearGradientEnterStop=linearGradientEnter
      .enter()
      .append('stop')
      .merge(linearGradientEnter)
      .attr("offset", (d,i)=> { return this.gradientMapXScale(i); })
      .attr("stop-color", d=> { return this.gradientMapColorScale(d.aver_speed_offset); })
      .attr("stop-opacity", 1);
    linearGradientEnter.exit().remove();


    this.gXaxis.call(this.xAxis);
    this.gYaxis.call(this.yAxis);



    //添加当前时间的位置
    if(this.tooltipSvg.select('.currentTimeLine')._groups[0][0]==undefined) {
      this.tooltipSvg.append('g').attr('class', 'currentTimeLine').append('line')
        .attr('x1', ((this.x.range()[1] - this.x.range()[0]) / 2))
        .attr('y1', (this.y.range()[0]))
        .attr('x2', ((this.x.range()[1] - this.x.range()[0]) / 2))
        .attr('y2', (this.y.range()[1]));
      // this.tooltipSvg.append('g').attr('class','currentTimeLineLabel')
      //   .append('text')
      //   .attr('x',((this.x.range()[1] - this.x.range()[0]) / 2)-50)
      //   .attr('y',0);
    }


    let who=this;
    this.deficit_area.datum(data)
      .attr("d", this.area)
      .attr('fill','url(#tooltipBarFillLinearDetail)')
      .on('mousedown',function(){
        let clickTime=who.x.invert(d3.mouse(this)[0]);
        let longTime=new Date(clickTime).getTime();
        who.sharedVariable.setTimeNow(Math.round(longTime/(1000*60*2))*1000*60*2);
      });
    this.deficit_line.datum(data)
      .attr("d", this.area);
  }

  areaLinearGradient(x): string {
    if (x <= 0) {
      return 'url(#normalLinear)';
    }
    else if (x <= 0.2)
      return 'url(#clearLinear)';
    else if (x <= 0.55)
      return 'url(#busyLinear)';
    else if (x <= 0.7)
      return 'url(#veryBusyLinear)';
    else if (x <= 1) {
      return 'url(#veryveryBusyLinear)';
    }
  }

  parseAreaDatas(d): any {
    // console.log(d);
    // console.log(that);
    const parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
    let result = [];
    d.forEach((d1, i1) => {
      // console.log(d1.aver_speed_offset);
      result.push({
        daydatetime: parseDate(d1['daydatetime'], 'Y-m-d H:M:S'),
        aver_speed_offset:d1['speed_offset']<=0?0:d1['speed_offset'],
      })
    })

    // console.log(result);
//        console.log(d3.timeFormat('%Y-%m-%d %H-%M-%S').format(d.daydatetime));
    return result;
  }
}
