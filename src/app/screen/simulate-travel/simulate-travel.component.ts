import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ROAD_CONFIG} from "../../config/road-config";
import {ROAD_PATH_CONFIG} from "../../config/road-path-config";
import {HttpService} from "../../service/http.service";
import {log} from "util";
import {LinkPathData} from "../DataTransModel";
import {SharedVariableService} from "../../service/shared-variable.service";
@Component({
  selector: 'app-simulate-travel',
  templateUrl: './simulate-travel.component.html',
  styleUrls: ['./simulate-travel.component.css']
})
export class SimulateTravelComponent implements OnInit {
  @ViewChild('svg') svgElement;
  private linkPathData=new LinkPathData();
  private simulateData=[];

  private pathPlot;

  private margin={top:50,left:20,right:-20,bottom:50,plotGap:10};
  private svgWidth=450;
  private svgHeight=4000;

  private parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
  private dateFormat = d3.timeFormat('%Y-%m-%d');
  private previousDate='1970-01-01';//作为是否要刷新y轴的标志
  private linkPathsRange=[];
  private xScales;//xScale 利用linkPathsRange生成
  private yScale;
  private lines;//线段生成器



  constructor(private http:HttpService,private sharedVariable:SharedVariableService,@Inject(ROAD_CONFIG) private roadConfig,@Inject(ROAD_PATH_CONFIG) private roadPathConfig) { }

  ngOnInit() {

    let lengthMap=new Map();
    lengthMap.set('start',0);
    this.roadConfig.roadConfig.forEach(d=>{
      lengthMap.set(d['link_id'],parseInt(d['length']));
    })

    /*
    生成每个路径的x坐标
     */
    let link_id_1_range=[];
    let link_id_2_range=[];
    let link_id_3_range=[];
    let link_id_4_range=[];
    let link_id_5_range=[];
    let link_id_6_range=[];
    //link_id_1,link_id_2元素一一对应
    //这个位置是start的位置
    // link_id_1_range.push(0);
    this.roadPathConfig['link_id_1'].reduce((sum,d,i)=>{
      link_id_1_range.push((sum+lengthMap.get(d)));
      return  sum+lengthMap.get(d);
    },0)
    // console.log(link_id_1_range);
    //这个位置是end的位置
    this.roadPathConfig['link_id_2'].reverse().reduce((sum,d,i)=>{
      // if(i==0){
      //   link_id_2_range.push(sum);
      // }
      link_id_2_range.push(sum-lengthMap.get(d))
      return sum-lengthMap.get(d);
    },link_id_1_range[link_id_1_range.length-1]);
    // console.log(link_id_2_range);

    //link_id_3，link_id_4元素的话，link_id_3前面去掉三个元素
    // link_id_3_range.push(0);
    this.roadPathConfig['link_id_3'].reduce((sum,d)=>{
      link_id_3_range.push((sum+lengthMap.get(d)));
      return  sum+lengthMap.get(d);
    },0)
    // console.log(link_id_3_range);
    // link_id_4_range.push(link_id_3_range[link_id_3_range.length-1]-link_id_3_range[2]);
    this.roadPathConfig['link_id_4'].reverse().reduce((sum,d,i)=>{
      // if(i==0){
      //   link_id_4_range.push(sum);
      // }
      link_id_4_range.push(sum-lengthMap.get(d))
      return sum-lengthMap.get(d);
    },link_id_3_range[link_id_3_range.length-1]-link_id_3_range[3]);
    // console.log(link_id_4_range);

    //link_id_5,link_id_6元素的话，link_id_5前面去掉一个元素
    // link_id_5_range.push(0);
    this.roadPathConfig['link_id_5'].reduce((sum,d)=>{
      link_id_5_range.push((sum+lengthMap.get(d)));
      return  sum+lengthMap.get(d);
    },0)
    // console.log(link_id_5_range);
    this.roadPathConfig['link_id_6'].reverse().reduce((sum,d,i)=>{
      // if(i==0){
      //   link_id_6_range.push(sum);
      // }
      link_id_6_range.push(sum-lengthMap.get(d));
      return sum-lengthMap.get(d);
    },link_id_5_range[link_id_5_range.length-1]-link_id_5_range[1]);
    // console.log(link_id_6_range);

    this.linkPathsRange.push(link_id_1_range,link_id_2_range,link_id_3_range,link_id_4_range,link_id_5_range,link_id_6_range);
    let sumLength=link_id_1_range[link_id_1_range.length-1]+link_id_3_range[link_id_3_range.length-1]+link_id_5_range[link_id_5_range.length-1];
    this.xScales=[d3.scaleOrdinal()
      .domain(this.roadPathConfig['link_id_1'])
      .range(link_id_1_range.map(dx=>dx*((this.svgWidth-this.margin.left-this.margin.right-2*this.margin.plotGap)/sumLength))),
      d3.scaleOrdinal()
        .domain(this.roadPathConfig['link_id_2'].reverse())
        .range(link_id_2_range.map(dx=>(dx*((this.svgWidth-this.margin.left-this.margin.right-2*this.margin.plotGap)/sumLength)))),
      d3.scaleOrdinal()
        .domain(this.roadPathConfig['link_id_3'])
        .range(link_id_3_range.map(dx=>this.margin.plotGap+(link_id_1_range[link_id_1_range.length-1]+dx)*((this.svgWidth-this.margin.left-this.margin.right-2*this.margin.plotGap)/sumLength))),
      d3.scaleOrdinal()
        .domain(this.roadPathConfig['link_id_4'].reverse())
        .range(link_id_4_range.map(dx=>this.margin.plotGap+(link_id_1_range[link_id_1_range.length-1]+dx)*((this.svgWidth-this.margin.left-this.margin.right-2*this.margin.plotGap)/sumLength))),
      d3.scaleOrdinal()
        .domain(this.roadPathConfig['link_id_5'])
        .range(link_id_5_range.map(dx=>2*this.margin.plotGap+(link_id_1_range[link_id_1_range.length-1]+link_id_3_range[link_id_3_range.length-1]+dx)*((this.svgWidth-this.margin.left-this.margin.right-2*this.margin.plotGap)/sumLength))),
      d3.scaleOrdinal()
        .domain(this.roadPathConfig['link_id_6'].reverse())
        .range(link_id_6_range.map(dx=>2*this.margin.plotGap+((link_id_1_range[link_id_1_range.length-1]+link_id_3_range[link_id_3_range.length-1]+dx)*((this.svgWidth-this.margin.left-this.margin.right-2*this.margin.plotGap)/sumLength))))];





  //  获取数据
    this.http.getPredictData('MineChicken-Road/ajax/getpredictdata/2016-03-01')
      .map(x=>this.parseTravelDatas(x))
      .subscribe(x=>{
        this.simulateData=this.simulateData.concat(x);
        this.renderPlot(this.simulateData);
      });


  //  监听鼠标移动的事件，获取link_path和link_id和predictDateTime
    this.sharedVariable.getLinkPathSubjectImmediately()
      .subscribe(x=>{
        if(x==null){
          this.pathPlot.selectAll('path').call(this.mouseOutCss,this);
        }
        else {
          let filterData = this.simulateData.filter(d => {
            return d.linkId == x.link_ids[0] || d.linkId == x.link_ids[1];
          });
          this.renderMouseMovePlot(filterData)
        }
    })
  }
  //渲染图形
  renderPlot(data){
    let svg=d3.select(this.svgElement.nativeElement);
    let predictNest=d3.nest()
      .key(d=>d.linkPath)
      .key(d=>{
        return d.predictDateTime;
      })
      .entries(data);
    if(this.dateFormat(data[0].predictArriveTime)!=this.previousDate){
      //如果时间不相等，则重置时间
      this.previousDate=this.dateFormat(data[0].predictArriveTime);

      this.yScale=d3.scaleTime()
        .domain(d3.extent(data,function(d){return d.predictDateTime}))
        .range([0,this.svgHeight]);
      // console.log(this.yScale(1456761622000));
      //重置坐标映射
      this.lines=[d3.line()
        .x(d=>this.xScales[0](d.linkId))
        .y(d=>this.yScale(d.predictArriveTime)),
        d3.line()
          .x(d=>this.xScales[1](d.linkId))
          .y(d=>this.yScale(d.predictArriveTime)),
        d3.line()
          .x(d=>this.xScales[2](d.linkId))
          .y(d=>this.yScale(d.predictArriveTime)),
        d3.line()
          .x(d=>this.xScales[3](d.linkId))
          .y(d=>this.yScale(d.predictArriveTime)),
        d3.line()
          .x(d=>this.xScales[4](d.linkId))
          .y(d=>this.yScale(d.predictArriveTime)),
        d3.line()
          .x(d=>this.xScales[5](d.linkId))
          .y(d=>this.yScale(d.predictArriveTime))];
      // let pathDatag=svg.append('g');
      // let pathDat=pathDatag.selectAll('path')
      //   .data(data)
      //   .enter()
      //   .append('path')
      //   .attr('d',(d,i)=> {
      //     // console.log(d);
      //     return this.lines[d.linkPath-1](d.values)
      //   })
      //   .attr("fill", "none")
      //   .attr('stroke','black')
      //   .attr('stroke-width',1);

      //每个link_path_id对应一个link_id_
      let svgEnter=svg.selectAll('g')
        .data(predictNest);
       let svgEnterg=svgEnter.enter()
        .append('g')
        .attr('class',(d,i)=>'link_id_'+(i+1))
          .merge(svgEnter);
       // svgEnter().exit().remove();

      //生成path的g和path
      let plotEnter=svgEnterg.selectAll('g')
        .data(d=>{return d.values})
        .enter()
        .append('path')
        .attr('d',(d,i)=> {
          //逆向道路
          if(((d.values)[0].linkPath)%2==0){
            d.values.unshift({
              predictDateTime: (d.values)[0].predictDateTime, linkId: 'start', predictArriveTime: (d.values)[0].predictDateTime, linkPath:(d.values)[0].linkPath
            })
            return this.lines[(d.values)[0].linkPath-1](d.values)
          }
          //正向道路
          else{
            d.values.unshift({
              predictDateTime: (d.values)[0].predictDateTime, linkId: 'start', predictArriveTime: (d.values)[0].predictDateTime, linkPath:(d.values)[0].linkPath
            })
            return this.lines[(d.values)[0].linkPath-1](d.values)
          }

          })
        .attr("class", (d)=>'link_id_'+((d.values)[0].linkPath))
        .on('mousemove',(d,i)=>{
          // console.log(this);
          var x = d3.mouse(svg.select('path').node())[0];
          // console.log(x);
          // console.log(d);
          // console.log(this.getXAxisDomain(d,x));
          this.sharedVariable.setLinkPathSubject(this.getXAxisDomain(d,x));

        })
        .on('mouseout',()=>{
          // this.pathPlot.call(this.mouseOutCss,this);
          this.sharedVariable.setLinkPathSubject(null);
        });
      this.pathPlot=svgEnterg;



    }
    else{

    }
  }
  //渲染鼠标移动到选中的区域
  renderMouseMovePlot(data){
    let svg=d3.select(this.svgElement.nativeElement);

    //将路段变成透明度=0.5
    this.pathPlot.selectAll('path').call(this.mouseMoveCss,this);



    let predictNest=d3.nest()
      .key(d=>d.linkPath)
      .key(d=>{
        return d.predictDateTime;
      })
      .entries(data);
    let svgEnter=svg.append('g')
      .attr('class','mousemoveplot')
      .selectAll('g')
      .data(predictNest);
    let svgEnterg=svgEnter.enter()
      .append('g')
      .attr('class',(d,i)=>'link_id_'+(i+1))
      .merge(svgEnter);
    // svgEnter().exit().remove();

    //生成path的g和path
    let plotEnter=svgEnterg.selectAll('g')
      .data(d=>{return d.values})
      .enter()
      .append('path')
      .attr('d',(d,i)=> {
          return this.lines[(d.values)[0].linkPath-1](d.values)
        }
      )
      .attr("class", (d)=>'link_id_'+((d.values)[0].linkPath));
;
  }

  //根据鼠标mouseover时候的时候返回result
  getXAxisDomain(d,mouseX){
    // console.log(d)
    // console.log(mouseX);
    //1,2,3range()从小到大，2,4,6range()从大到小
    if((d.values)[0].linkPath==1){
      let ranges=this.xScales[0].range();
      // console.log(range);
      let index=0;
      for(let t=0;t<ranges.length;t++){
        this.xScales[0].range()
        if(ranges[t]>mouseX){
          index=t;
          break;
        }
      }
      this.linkPathData.link_ids=[this.xScales[0].domain()[index-1],this.xScales[0].domain()[index]];
      this.linkPathData.link_path=1;
      this.linkPathData.predictDateTime=d.values[0].predictDateTime;
      return this.linkPathData;
      }
    else if((d.values)[0].linkPath==3){
      let ranges=this.xScales[2].range();
      // console.log(range);
      let index=0;
      for(let t=0;t<ranges.length;t++){
        if(ranges[t]>=mouseX){
          index=t;
          break;
        }
      }
      this.linkPathData.link_ids=[this.xScales[2].domain()[index-1],this.xScales[2].domain()[index]];
      this.linkPathData.link_path=3;
      this.linkPathData.predictDateTime=d.values[0].predictDateTime;
      return this.linkPathData;
    }
    else  if((d.values)[0].linkPath==5){
      let ranges=this.xScales[4].range();
      // console.log(range);
      let index=0;
      for(let t=0;t<ranges.length;t++){
        if(ranges[t]>=mouseX){
          index=t;
          break;
        }
      }
      this.linkPathData.link_ids=[this.xScales[4].domain()[index-1],this.xScales[4].domain()[index]];
      this.linkPathData.link_path=5;
      this.linkPathData.predictDateTime=d.values[0].predictDateTime;
      return this.linkPathData;

    }
    else if((d.values)[0].linkPath==2){
      let ranges=this.xScales[1].range();
      let index=0;
      for(let t=0;t<ranges.length;t++){
        if(ranges[t]<=mouseX){
          index=t;
          break;
        }
      }
      this.linkPathData.link_ids=[this.xScales[1].domain()[index-1],this.xScales[1].domain()[index]];
      this.linkPathData.link_path=2;
      this.linkPathData.predictDateTime=d.values[0].predictDateTime;
      return this.linkPathData;
    }
    else  if((d.values)[0].linkPath==4){
      let ranges=this.xScales[3].range();
      // console.log(range);
      let index=0;
      for(let t=0;t<ranges.length;t++){
        if(ranges[t]<=mouseX){
          index=t;
          break;
        }
      }
      this.linkPathData.link_ids=[this.xScales[3].domain()[index-1],this.xScales[3].domain()[index]];
      this.linkPathData.link_path=4;
      this.linkPathData.predictDateTime=d.values[0].predictDateTime;
      return this.linkPathData;
    }
    else if((d.values)[0].linkPath==6){
      let ranges=this.xScales[5].range();

      let index=0;
      for(let t=0;t<ranges.length;t++){
        if(ranges[t]<=mouseX){
          index=t;
          break;
        }
      }
      this.linkPathData.link_ids=[this.xScales[5].domain()[index-1],this.xScales[5].domain()[index]];
      this.linkPathData.link_path=6;
      this.linkPathData.predictDateTime=d.values[0].predictDateTime;
      return this.linkPathData;
    }
  }



  parseTravelDatas(d){
    let result=[];
    d.forEach((d1,i1)=>{
      result.push({
        predictDateTime:d1['predict_datetimespan'],
        linkId:d1['link_id'],
        predictArriveTime:d1['predict_arrive_time'],
        linkPath:d1['link_path']
      })
    })
    return result;
  }

//  s鼠标移动到上面去的时候的css
  mouseMoveCss(selection,that){
    let svg=d3.select(that.svgElement.nativeElement);
    //移除单个路段的选中效果
    svg.selectAll('.mousemoveplot').remove();
    selection.classed('link_id_mousemove',true);
  }
//  鼠标移开时候的css
  mouseOutCss(selection,that){
    let svg=d3.select(that.svgElement.nativeElement);
    //移除单个路段的选中效果
    svg.selectAll('.mousemoveplot').remove();
    //移除所有路段的透明效果
    selection.classed('link_id_mousemove',false);
  }

}
