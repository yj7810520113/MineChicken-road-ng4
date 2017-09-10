import {Component, OnInit, ViewChild} from '@angular/core';
import {FileReaderService} from "../../service/file-reader.service";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import {SharedVariableService} from "../../service/shared-variable.service";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'app-detail-time-series',
  templateUrl: './detail-time-series.component.html',
  styleUrls: ['./detail-time-series.component.css']
})
export class DetailTimeSeriesComponent implements OnInit {
  @ViewChild('svg') svgElement;
  busy:Subscription;

  private margin = {top: 20, right: 20, bottom: 20, left: 30};

  private width = 860 - this.margin.left - this.margin.right;
  private height = 150 - this.margin.top - this.margin.bottom;


  private parseYear = d3.timeParse('%Y');
  private parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
  private formatDate=d3.timeFormat('%Y-%m-%d %H:%M:%S');
  //渐变色比例尺
  private gradientMapXScale = d3.scaleLinear()
    .domain([0, 30 * 24])
    .range(["0%", "100%"]);
  private gradientMapColorScale = d3.scaleLinear()
    .interpolate(d3.interpolateLab)
    .domain([0, 0.2, 0.55, 0.7, 1])
    .range(['#2a9d8f', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']);
  private svg;
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

  constructor(private fileReader: FileReaderService,private sharedVariable:SharedVariableService) {
  }

  ngOnInit() {
    this.svg = d3.select(this.svgElement.nativeElement).append('g').attr('transform','translate('+this.margin.left+","+this.margin.top+")");

    this.defs = this.svg.append('defs');


    this.x = d3.scaleTime()
      .range([0, this.width]);

    this.y = d3.scaleLinear()
      .range([this.height, 0]);

    this.xAxis = d3.axisBottom()
      .scale(this.x)
      .tickFormat(d3.timeFormat('%H:%M'))
      .ticks(d3.timeHour.every(1));

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
    this.deficit_area = this.svg.append('path');
      // .attr('id', 'surplus-deficit-area  ');
    this.deficit_line = this.svg.append('path')
      .attr('class', 'surplus-deficit-line');
    this.gXaxis = this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')');
    this.gYaxis = this.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,' + 0 + ')');
    this.yAxis = d3.axisLeft()
      .scale(this.y)
      .tickFormat(d3.format('.0%'))
      .tickValues([0,0.25,0.5,0.7])
      .tickPadding(2)
      .tickSize(2);

    //绘制渐变色


    this.busy=this.fileReader.readFileToJson('/assets/file/areaData_2min.csv')
    // this.fileReader.readFileToJson('/assets/file/data_offset3.3.csv')
      .map((d) => {
        return this.parseAreaDatas(d)
      })
      .subscribe((x)=> {
          this.dataSpan = x;
        }
        // (x) => setInterval(() => {
        //     this.dataSpan = x;
        //     this.intervalTimeLine(this)
        //   }, this.intervalTimer
        // )
      );
    this.sharedVariable.getTimeNow()
      .subscribe(x=>{
        this.currentCursor=x;
        this.svg.select('.currentTimeLineLabel').select('text').text(this.formatDate(new Date(x)));
        if(this.dataSpan) {
          this.renderTimeLine(this);
        }
      })


    // Observable.merge(this.fileReader.readFileToJson('/assets/file/areaData_2min.csv'),
    //   this.fileReader.readFileToJson('/assets/file/data_offset3.3.csv'))
    //   .subscribe(x => console.log(x))

    //=============================================================
    //  测试数据
//     d3.queue()
//       .defer(d3.csv, "../../../assets/file/areaData_2min.csv", this.parseAreaDatas)
//       //        .defer(d3.csv, "budget-deficit-gdp.csv", parseBudgetDeficit)
//       //        .defer(d3.csv, "governments.csv", parseGovernments)
//       .await((error, data) => {
//         console.log(data);
//         console.log(this);
//         this.dataSpan = data;
//         let interval = d3.interval(() => this.intervalTimeLine(this), this.intervalTimer);
// //            interval.
//
//       });

  }

  //timeline动画
  renderTimeLine(that): any {

    // that.currentCursor += 1000 * 60 * 60*6;
    // //传递当前时间到Subject
    // this.sharedVariable.setTimeNow(this.currentCursor);



    // console.log(new Date(that.currentCursor));
    let data = that.dataSpan;
    // console.log(data);
    that.x.domain([that.currentCursor - 1000 * 60 * 60 * 12, that.currentCursor + 1000 * 60 * 60 * 12]);
    that.y.domain([0, 0.7]);
    that.area.y0(that.y(0));
    //根据x.domain从新设置gradientMapXScale的domain
    that.gradientMapXScale.domain([0,(that.x.domain()[1]-that.x.domain()[0])/(1000*60*2)]);
    let nowSpan = data.filter((g) => {
      return g.daydatetime >= that.x.domain()[0] && g.daydatetime <= that.x.domain()[1];
    })
    let nowSpanInterval = d3.pairs(nowSpan).map(x => {
      return {
        areaColor: that.areaLinearGradient(x[0].aver_speed_offset),
        startDate: x[0].daydatetime,
        endDate: x[1].daydatetime,
        aver_speed_offset: x[0].aver_speed_offset,
      }
    });
//    绘制渐变色
    let linearGradientEnter=d3.select(this.svgElement.nativeElement).select('#barFillLinearDetail')
      .selectAll('stop')
      .data(nowSpan);

    let linearGradientEnterStop=linearGradientEnter
      .enter()
      .append('stop')
      .merge(linearGradientEnter)
      .attr("offset", (d,i)=> { return this.gradientMapXScale(i); })
      .attr("stop-color", d=> { return this.gradientMapColorScale(d.aver_speed_offset); })
      .attr("stop-opacity", 1);
    linearGradientEnter.exit().remove();


    that.gXaxis.call(that.xAxis);
    that.gYaxis.call(that.yAxis);



    //添加当前时间的位置
    if(that.svg.select('.currentTimeLine')._groups[0][0]==undefined) {
      that.svg.append('g').attr('class', 'currentTimeLine').append('line')
        .attr('x1', ((that.x.range()[1] - that.x.range()[0]) / 2))
        .attr('y1', (that.y.range()[0]))
        .attr('x2', ((that.x.range()[1] - that.x.range()[0]) / 2))
        .attr('y2', (that.y.range()[1]));
      that.svg.append('g').attr('class','currentTimeLineLabel')
        .append('text')
        .attr('x',((that.x.range()[1] - that.x.range()[0]) / 2)-50)
        .attr('y',0);
    }


    let who=that;
    that.deficit_area.datum(nowSpan)
      .attr("d", that.area)
      .attr('fill','url(#barFillLinearDetail)')
      .on('mousedown',function(){
        let clickTime=who.x.invert(d3.mouse(this)[0]);
        let longTime=new Date(clickTime).getTime();
        who.sharedVariable.setTimeNow(Math.round(longTime/(1000*60*2))*1000*60*2);
      });
    that.deficit_line.datum(nowSpan)
      .attr("d", that.area);
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
        aver_speed_offset: parseFloat(d1['aver_speed_offset']),
      })
    })

    // console.log(result);
//        console.log(d3.timeFormat('%Y-%m-%d %H-%M-%S').format(d.daydatetime));
    return result;
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

//   ready(error, data): any {
//     console.log(data);
//     console.log(this);
//     this.dataSpan = data;
//     let interval = d3.interval(() => this.intervalTimeLine, this.intervalTimer);
// //            interval.
//
//   }

}
