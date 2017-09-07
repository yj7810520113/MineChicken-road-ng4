import {Component, OnInit, ViewChild} from '@angular/core';
import {FileReaderService} from "../../service/file-reader.service";
import {SharedVariableService} from "../../service/shared-variable.service";
import {select} from "d3-selection";

@Component({
  selector: 'app-overview-time-series',
  templateUrl: './overview-time-series.component.html',
  styleUrls: ['./overview-time-series.component.css']
})
export class OverviewTimeSeriesComponent implements OnInit {
  @ViewChild('svg') svgElement;
  private margin = {top: 20, right: 20, bottom: 20, left: 30};

  private width = 860 - this.margin.left - this.margin.right;
  private height = 100 - this.margin.top - this.margin.bottom;


  private parseYear = d3.timeParse('%Y');
  private parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
  //渐变色比例尺
  //4*92是因为一天有4个统计的时间段，分别为晚上、早高峰、日平峰、晚高峰，92是因为3月31天4月30听，5月31天
  private gradientMapXScale = d3.scaleLinear()
    .domain([0, 4*92])
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
  //矩形的g
  private aver_speed_offsets;

  private deficit_area ;

  //面积图上的线条
  private deficit_line;
  //x轴
  private gXaxis;
  private gYaxis;
  private defs_deficitMask;

  //画图的数据
  private dataSpan;

  //brush
  private brush;
  private gBrush;

  //2016年3月1号
  private startSpanTime=1456761600000;
  //2016年5月31号
  private endSpanTime=1464624000000;

  constructor(private fileReader: FileReaderService,private sharedVariable:SharedVariableService) {
  }

  ngOnInit() {
    this.svg = d3.select(this.svgElement.nativeElement).append('g').attr('transform','translate('+this.margin.left+","+this.margin.top+")");;


    this.defs = this.svg.append('defs');


    this.x = d3.scaleTime()
      .domain([1456761600000,1464624000000])
      .range([0, this.width]);

    this.y = d3.scaleLinear()
      .range([this.height, 0]);

    this.xAxis = d3.axisBottom()
      .scale(this.x)
      .tickFormat(d3.timeFormat('%m-%d'))
      .ticks(d3.timeMonday.every(1));

    this.yAxis = d3.axisLeft()
      .scale(this.y)
      .tickFormat(d3.format('.0%'))
      .tickValues([0,0.25,0.5,0.7])
      .tickPadding(2)
      .tickSize(2);
      // .ticks(d3.timeMonday.every(1));

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
    this.gYaxis = this.svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,' + 0 + ')');
    // this.defs_deficitMask = this.defs.append('mask').attr('id', 'deficitMask').append('path').attr('fill', 'white').attr('opacity', 1);

    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, this.height]])
      .on("start brush", ()=>{
        if (!d3.event.selection) return; // Ignore empty selections.
        var extent = d3.event.selection.map(this.x.invert, this.x);
      })
      .on("end", ()=>{
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        var d0 = d3.event.selection.map(this.x.invert),
          d1 = d0.map(Math.round);

        // If empty when rounded, use floor & offset instead.
        if (d1[0] >= d1[1]) {
          d1[0] = Math.floor(d0[0]);
          d1[1] = d1[0] + 1;
        }

        // d3.select(this).transition().call(brush.move, d1.map(x));
      });


    this.gBrush=this.svg.append("g")
      .attr("class", "brush")
      .call(this.brush);

      //-----------------------------------
      //http://blockbuilder.org/mbostock/6498000
      //----------------------------------
      this.gBrush.selectAll(".overlay")
      .each((d)=>{ d.type = "selection"; }) // Treat overlay interaction as move.
      .on("mousedown touchstart", ()=>{
          let mouse=d3.mouse(d3.select(this.svgElement.nativeElement).select('.brush').node());

        let  cx = mouse[0];
        let selectTime=new Date(this.x.invert(cx)).getTime();
        if(selectTime+1000*60*60*12>this.endSpanTime){
          this.gBrush.call(this.brush.move, [this.endSpanTime-1000*60*60*24,this.endSpanTime].map(this.x));
        }
        else if(selectTime-1000*60*60*12<this.startSpanTime){
          this.gBrush.call(this.brush.move, [this.startSpanTime,this.startSpanTime+1000*60*60*24].map(this.x));
      }
      else {
          this.gBrush.call(this.brush.move, [new Date(this.x.invert(cx)).getTime()-1000*60*60*12,new Date(this.x.invert(cx)).getTime()+1000*60*60*12].map(this.x));
        }
      //  设置nowTime
      this.sharedVariable.setTimeNow(Math.round(selectTime/(1000*60*2))*1000*60*2);

      }); // Recenter before brushing.
    // this.gBrush =this.svg.append("g")
    //   .attr("class", "brush")
    //   .call(this.brush);
    //移动brush的位置
    this.sharedVariable.getTimeNow()
      .subscribe(x=>{
        this.gBrush.call(this.brush.move, [x-1000*60*60*12,x+1000*60*60*12].map(this.x));
      })


    this.fileReader.readFileToJson('/assets/file/data_offset_day.csv')
    // this.fileReader.readFileToJson('/assets/file/data_offset3.3.csv')
      .map((d) => {
        return this.parseAreaDatas(d)
      })
      .subscribe(x=>{
        this.dataSpan=x;
        this.overViewTimeLine(this);
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
  brushcentered():any{
    console.log(this)
    let mouse=d3.mouse(this);
    console.log(mouse)
  }

  overViewTimeLine(that): any {

    // console.log(new Date(that.currentCursor));
    let data = that.dataSpan;
    that.x.domain(d3.extent(data,d=>d.daydatetime));
    that.y.domain([0, 0.7]);
    that.area.y0(that.y(0));
    let nowSpan = data.sort((a,b)=>a.daydatetime-b.daydatetime);
    // let nowSpanInterval = d3.pairs(nowSpan).map(x => {
    //   return {
    //     areaColor: that.areaLinearGradient(x[0].aver_speed_offset),
    //     startDate: x[0].daydatetime,
    //     endDate: x[1].daydatetime,
    //     aver_speed_offset: x[0].aver_speed_offset,
    //   }
    // });
//    绘制渐变色
    let linearGradientEnter=d3.select(this.svgElement.nativeElement).select('#barFillLinearOverView')
      .selectAll('stop')
      .data(nowSpan);

    let linearGradientEnterStop=linearGradientEnter
      .enter()
      .append('stop')
      // .merge(linearGradientEnter)
      .attr("offset", (d,i)=> { return this.gradientMapXScale(i); })
      .attr("stop-color", d=> { return this.gradientMapColorScale(d.aver_speed_offset); })
      .attr("stop-opacity", 1);
    linearGradientEnter.exit().remove();



//
//
// //            console.log(nowSpan);
    that.deficit_area.datum(nowSpan)
      .attr("d", that.area)
      .attr('fill','url(#barFillLinearOverView)');
    that.deficit_line.datum(nowSpan)
      .attr("d", that.area);

    that.gXaxis.call(that.xAxis);
    that.gYaxis.call(that.yAxis)
  }

  brushMoved(){

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
//  --------------------------------angular----------------------------------------
  private paused=false;
  pauseClick(){
    this.paused=!this.paused;
    this.sharedVariable.setPauser(this.paused);
  }

}
