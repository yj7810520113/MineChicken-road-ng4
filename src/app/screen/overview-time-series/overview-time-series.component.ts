import {Component, OnInit, ViewChild} from '@angular/core';
import {FileReaderService} from "../../service/file-reader.service";
import {SharedVariableService} from "../../service/shared-variable.service";

@Component({
  selector: 'app-overview-time-series',
  templateUrl: './overview-time-series.component.html',
  styleUrls: ['./overview-time-series.component.css']
})
export class OverviewTimeSeriesComponent implements OnInit {
  @ViewChild('svg') svgElement;
  private margin = {top: 100, right: 100, bottom: 100, left: 100};

  private width = 960 - this.margin.left - this.margin.right;
  private height = 260 - this.margin.top - this.margin.bottom;


  private parseYear = d3.timeParse('%Y');
  private parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
  //渐变色比例尺
  private gradientMapXScale = d3.scaleLinear()
    .domain([0, 30 * 24])
    .range(["0%", "100%"]);
  private gradientMapColorScale = d3.scaleLinear()
    .interpolate(d3.interpolateLab)
    .domain([0, 0.2, 0.55, 0.7, 1])
    .range(['#42bd41', '#42bd41', '#ffb74d', '#ff8a65', '#e84e40']);
  private svg;
  private defs;
  private x;
  private y;
  private xAxis;
  private yAxis;
  private area;
  private line;
  //矩形的g
  private aver_speed_offsets;

  private deficit_area ;

  //面积图上的线条
  private deficit_line;
  //x轴
  private gXaxis;
  private defs_deficitMask;


  private dataSpan;

  constructor(private fileReader: FileReaderService,private sharedVariable:SharedVariableService) {
  }

  ngOnInit() {
    this.svg = d3.select(this.svgElement.nativeElement);


    this.defs = this.svg.append('defs');


    this.x = d3.scaleTime()
      .range([0, this.width]);

    this.y = d3.scaleLinear()
      .range([this.height, 0]);

    this.xAxis = d3.axisBottom()
      .scale(this.x)
      .tickFormat(d3.timeFormat('%m-%d'))
      .ticks(d3.timeMonday.every(1));

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
      .attr('id', 'clipAxesOverview')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);
    this.deficit_area = this.svg.append('path')

//        绘制矩形的g
    this.aver_speed_offsets = this.svg.append('g')
      .attr('class', 'governments')
      // .attr('clip-path', 'url(#clipAxesOverview)');
//        绘制面积图上的线条,
    this.deficit_line = this.svg.append('path')
      .attr('class', 'surplus-deficit-line');
    this.gXaxis = this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')');
    // this.defs_deficitMask = this.defs.append('mask').attr('id', 'deficitMask').append('path').attr('fill', 'white').attr('opacity', 1);


    this.fileReader.readFileToJson('/assets/file/data_offset_day.csv')
    // this.fileReader.readFileToJson('/assets/file/data_offset3.3.csv')
      .map((d) => {
        return this.parseAreaDatas(d)
      })
      .subscribe(x=>{
        this.dataSpan=x;
        this.intervalTimeLine(this);
      }
        // (x) => d3.interval(() => {
        //     this.dataSpan = x;
        //     this.intervalTimeLine(this)
        //   }, this.intervalTimer
        // )
      );


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
  intervalTimeLine(that): any {

    // console.log(new Date(that.currentCursor));
    let data = that.dataSpan;
    console.log(data);
    that.x.domain(d3.extent(data,d=>d.daydatetime));
    that.y.domain([0, 0.7]);
    that.area.y0(that.y(0));
    let nowSpan = data.sort((a,b)=>a.daydatetime-b.daydatetime);
    let nowSpanInterval = d3.pairs(nowSpan).map(x => {
      return {
        areaColor: that.areaLinearGradient(x[0].aver_speed_offset),
        startDate: x[0].daydatetime,
        endDate: x[1].daydatetime,
        aver_speed_offset: x[0].aver_speed_offset,
      }
    });
//    绘制渐变色
    let linearGradientEnter=this.svg.select('#barFillLinearOverView')
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
//
//
// //            console.log(nowSpan);
    that.deficit_area.datum(nowSpan)
      .attr("d", that.area)
      .attr('fill','url(#barFillLinearOverView)');
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

}
