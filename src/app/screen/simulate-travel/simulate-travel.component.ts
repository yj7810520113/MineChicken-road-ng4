import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ROAD_CONFIG} from "../../config/road-config";
import {ROAD_PATH_CONFIG} from "../../config/road-path-config";
import {HttpService} from "../../service/http.service";

@Component({
  selector: 'app-simulate-travel',
  templateUrl: './simulate-travel.component.html',
  styleUrls: ['./simulate-travel.component.css']
})
export class SimulateTravelComponent implements OnInit {
  @ViewChild('svg') svgElement;

  private parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');
  private linkPathsRange=[];



  constructor(private http:HttpService,@Inject(ROAD_CONFIG) private roadConfig,@Inject(ROAD_PATH_CONFIG) private roadPathConfig) { }

  ngOnInit() {

    let lengthMap=new Map();
    this.roadConfig.roadConfig.forEach(d=>{
      lengthMap.set(d['link_id'],parseInt(d['length']));
    })

    //生成每个路径的各个阶段的长度



    let link_id_1_range=[];
    let link_id_2_range=[];
    let link_id_3_range=[];
    let link_id_4_range=[];
    let link_id_5_range=[];
    let link_id_6_range=[];
    // let sum=0;
    //link_id_1,link_id_2元素一一对应
    //这个位置是start的位置
    link_id_1_range.push(0);
    this.roadPathConfig['link_id_1'].reduce((sum,d)=>{
      link_id_1_range.push((sum+lengthMap.get(d)));
      return  sum+lengthMap.get(d);
    },0)
    console.log(link_id_1_range);
    //这个位置是end的位置
    this.roadPathConfig['link_id_2'].reverse().reduce((sum,d,i)=>{
      if(i==0){
        link_id_2_range.push(sum);
      }
      link_id_2_range.push(sum-lengthMap.get(d))
      return sum-lengthMap.get(d);
    },link_id_1_range[link_id_1_range.length-1]);
    console.log(link_id_2_range);

    //link_id_3，link_id_4元素的话，link_id_3前面去掉三个元素
    link_id_3_range.push(0);
    this.roadPathConfig['link_id_3'].reduce((sum,d)=>{
      link_id_3_range.push((sum+lengthMap.get(d)));
      return  sum+lengthMap.get(d);
    },0)
    console.log(link_id_3_range);
    // link_id_4_range.push(link_id_3_range[link_id_3_range.length-1]-link_id_3_range[2]);
    this.roadPathConfig['link_id_4'].reverse().reduce((sum,d,i)=>{
      if(i==0){
        link_id_4_range.push(sum);
      }
      link_id_4_range.push(sum-lengthMap.get(d))
      return sum-lengthMap.get(d);
    },link_id_3_range[link_id_3_range.length-1]-link_id_3_range[3]);
    console.log(link_id_4_range);

    //link_id_5,link_id_6元素的话，link_id_5前面去掉一个元素
    link_id_5_range.push(0);
    this.roadPathConfig['link_id_5'].reduce((sum,d)=>{
      link_id_5_range.push((sum+lengthMap.get(d)));
      return  sum+lengthMap.get(d);
    },0)
    console.log(link_id_5_range);
    this.roadPathConfig['link_id_6'].reverse().reduce((sum,d,i)=>{
      if(i==0){
        console.log(sum);
        link_id_6_range.push(sum);
      }
      link_id_6_range.push(sum-lengthMap.get(d));
      return sum-lengthMap.get(d);
    },link_id_5_range[link_id_5_range.length-1]-link_id_5_range[1]);
    console.log(link_id_6_range);

    this.linkPathsRange.push(link_id_1_range,link_id_2_range,link_id_3_range,link_id_4_range,link_id_5_range,link_id_6_range);



  //  获取数据
    this.http.getPredictData('MineChicken-Road/ajax/getpredictdata/2016-03-01')
      .map(x=>this.parseTravelDatas(x))
      .subscribe(x=>console.log(x));
    console.log(this.roadConfig.roadConfig);
    console.log(Object.keys(this.roadPathConfig));
  }

  renderPlot(data){

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
//        console.log(d3.timeFormat('%Y-%m-%d %H-%M-%S').format(d.daydatetime));
    return result;
  }

}
