import {Component, OnInit, ViewChild} from '@angular/core';
import {FileReaderService} from "../../service/file-reader.service";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import {SharedVariableService} from "../../service/shared-variable.service";


@Component({
  selector: 'app-detail-time-series',
  templateUrl: './detail-time-series.component.html',
  styleUrls: ['./detail-time-series.component.css']
})
export class DetailTimeSeriesComponent implements OnInit {
  @ViewChild('svg') svgElement;
  private margin = {top: 100, right: 100, bottom: 100, left: 100};

  private width = 960 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;


  private parseYear = d3.timeParse('%Y');
  private parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
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
  //面积图上的线条
  private deficit_line;
  //x轴
  private gXaxis;
  private defs_deficitMask;

  //--------------------------------------------
  private intervalTimer = 500;
//        时间为2016-03-30
  private currentCursor = 1458432000000;
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
//        绘制矩形的g
    this.aver_speed_offsets = this.svg.append('g')
      .attr('class', 'governments')
      .attr('clip-path', 'url(#clipAxes)');
//        绘制面积图上的线条,
    this.deficit_line = this.svg.append('path')
      .attr('class', 'surplus-deficit-line');
    this.gXaxis = this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')');
    this.defs_deficitMask = this.defs.append('mask').attr('id', 'deficitMask').append('path').attr('fill', 'white').attr('opacity', 1);


    this.fileReader.readFileToJson('/assets/file/areaData_2min.csv')
    // this.fileReader.readFileToJson('/assets/file/data_offset3.3.csv')
      .map((d) => {
        return this.parseAreaDatas(d)
      })
      .subscribe(
        (x) => d3.interval(() => {
            this.dataSpan = x;
            this.intervalTimeLine(this)
          }, this.intervalTimer
        )
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

    that.currentCursor += 1000 * 60 * 2;
    //传递当前时间到Subject
    this.sharedVariable.setTimeNow(this.currentCursor);



    // console.log(new Date(that.currentCursor));
    let data = that.dataSpan;
    // console.log(data);
    that.x.domain([that.currentCursor - 1000 * 60 * 60 * 6, that.currentCursor + 1000 * 60 * 60 * 6]);
    that.y.domain([0, 0.7]);
    that.area.y0(that.y(0));
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
//            修改mask
    that.defs_deficitMask.attr("d", () => {
      return that.area(data);
    });

//移除元素
    that.aver_speed_offsets.selectAll("rect")
    // .data([])
    // .exit()
      .remove();
    that.aver_speed_offsets.selectAll("rect")
      .data(nowSpanInterval)
      .enter().append("rect")
      .attr("x", function (d) {
        return that.x(d.startDate);
      })
      .attr("y", (d) => that.y(d.aver_speed_offset))
      .attr("width", function (d, i) {
        return that.x(d.endDate) - that.x(d.startDate) + 0.2;
      })
      .attr("height", (d) => {
        return that.height - that.y(d.aver_speed_offset)
      })
      .attr("fill", function (d) {
//                    console.log(d.areaColor)
        return d.areaColor;
      })
    // .attr("mask", "url(#deficitMask)")
    // .on("mouseover", function (d) {
    //   // showLabel(d);
    // })
    // .on("mouseout", function () {
    //   // should think of a better way of doing that
    //   // ideally should be showing/hiding not appending/removing
    //   d3.select(".annotation-group").remove();
    // })
    that.gXaxis.call(that.xAxis);
//
//
// //            console.log(nowSpan);
//     that.deficit_line.datum(nowSpan)
//       .attr("d", that.line);

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

  ready(error, data): any {
    console.log(data);
    console.log(this);
    this.dataSpan = data;
    let interval = d3.interval(() => this.intervalTimeLine, this.intervalTimer);
//            interval.

  }

}
