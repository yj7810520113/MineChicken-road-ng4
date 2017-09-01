import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {SharedVariableService} from "../../service/shared-variable.service";
import {ROAD_PATH_CONFIG} from "../../config/road-path-config";

@Component({
  selector: 'app-count-link-pie',
  templateUrl: './count-link-pie.component.html',
  styleUrls: ['./count-link-pie.component.css']
})
export class CountLinkPieComponent implements OnInit {
  @ViewChild('svg') private svgElement;
  @ViewChild('svg1') private svgElement1;
  @ViewChild('svg2') private svgElement2;
  @ViewChild('svg3') private svgElement3;
  @ViewChild('svg4') private svgElement4;
  @ViewChild('svg5') private svgElement5;
  @ViewChild('svg6') private svgElement6;


  private mainRadius=250/2;
  private mainArc = d3.arc()
    .innerRadius(this.mainRadius - 20)
    .outerRadius(this.mainRadius - 80);
  private areaRadius=100/2;
  private areaArc=d3.arc()
    .innerRadius(this.areaRadius-10)
    .outerRadius(this.areaRadius-32);

  constructor(private shariedVariable:SharedVariableService,@Inject(ROAD_PATH_CONFIG) private roadPathConfig) { }

  ngOnInit() {
    d3.select(this.svgElement.nativeElement).select('g').append('g').attr('class','slices');
    d3.select(this.svgElement1.nativeElement).select('g').append('g').attr('class','slices1');
    d3.select(this.svgElement2.nativeElement).select('g').append('g').attr('class','slices2');
    d3.select(this.svgElement3.nativeElement).select('g').append('g').attr('class','slices3');
    d3.select(this.svgElement4.nativeElement).select('g').append('g').attr('class','slices4');
    d3.select(this.svgElement5.nativeElement).select('g').append('g').attr('class','slices5');
    d3.select(this.svgElement6.nativeElement).select('g').append('g').attr('class','slices6');



    this.shariedVariable.getLinkSpeedOffsetSubject()
      .subscribe(x=>{
        //渲染所有路段的饼图
        this.renderMainPlot(x);
      //  分路段渲染图形
        let datas=[];
        for(let roadPathEle in this.roadPathConfig){
          let xs=x.values.filter(d=>{
            return this.roadPathConfig[roadPathEle].indexOf(d.link_id)!=-1;
          })
          datas.push(xs);
        }
        this.renderAreaaPlot(datas);
      })

  }

//  渲染所有路段的图形
  renderMainPlot(data){

    // console./log(data)
    // console.log(this.totalLinksPieData(data.values))
    let svg=d3.select(eval("this.svgElement.nativeElement")).select('g').select('.slices');
    let pie = d3.pie()
      .value(function(d) { return d.value; })
      .sort(null);



    let pieSvg = svg.selectAll('path.slice').remove();
    // pieSvg.remove();
    let slice=svg.selectAll('path.slice')
      .data(pie(this.totalLinksPieData(data.values)),d=>d.value);
    slice.enter().append("path")
      .attr("fill", (d)=> {
        return this.sequentialScale(d.data.key); })
        .attr('class','slice')
      .attr("d", d=>{
       return  this.mainArc(d)});


  }

  //  分路段渲染图形图形
  renderAreaaPlot(data){

    for(let index in data) {
      // console.log("this.svgElement"+(parseInt(index)+1)+".nativeElement")
      let svg = d3.select(eval("this.svgElement"+(parseInt(index)+1)+".nativeElement")).select('g').select('.slices'+(parseInt(index)+1));
      let pie = d3.pie()
        .value(function (d) {
          return d.value;
        })
        .sort(null);


      let pieSvg = svg.selectAll('path.slice').remove();
      // pieSvg.remove();
      let slice = svg.selectAll('path.slice')
        .data(pie(this.totalLinksPieData(data[index])), d => d.value);
      slice.enter().append("path")
        .attr("fill", (d) => {
          return this.sequentialScale(d.data.key);
        })
        .attr('class', 'slice')
        .attr("d", d => {
          return this.areaArc(d)
        });
    }


  }
  //完整的路网的信息
  totalLinksPieData(data){
    let pieData=[];
    let pieDataMap=d3.map();
    pieDataMap.set('normal',0);
    pieDataMap.set('busy',0);
    pieDataMap.set('verybusy',0);
    pieDataMap.set('veryverybusy',0);
    data.map(d=>{
      let aver_speed_offset=parseFloat(d.speed_offset);
      if(aver_speed_offset<=0){
        pieDataMap.set('normal',pieDataMap.get('normal')+1);
      }
      else if(aver_speed_offset<=0.2){
        pieDataMap.set('normal',pieDataMap.get('normal')+1);
      }
      else if(aver_speed_offset<=0.55){
        pieDataMap.set('busy',pieDataMap.get('busy')+1);
      }
      else if(aver_speed_offset<=0.7){
        pieDataMap.set('verybusy',pieDataMap.get('verybusy')+1);
      }
      else{
        pieDataMap.set('veryverybusy',pieDataMap.get('veryverybusy')+1);
      }
    });
    for(let key of pieDataMap.keys()){
      pieData.push({key:key,value:pieDataMap.get(key)})
    }
    return pieData;

  }
  //路网的颜色映射
  sequentialScale(x): string {
    if (x =='normal') {
      return '#42bd41';
    }
    else if (x =='busy')
      return '#fff176';
    else if (x =='verybusy')
      return '#ffb74d';
    else if (x =='veryverybusy') {
      return '#e84e40';
    }
  }



}
