import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {D3, D3Service} from "d3-ng2-service";
import {FileReaderService} from "../../service/file-reader.service";
import {SharedVariableService} from "../../service/shared-variable.service";
import {HttpService} from "../../service/http.service";
import {ROAD_PATH_CONFIG} from "../../config/road-path-config";
import {LinkPathData} from "../DataTransModel";
import {ROAD_CONFIG} from "../../config/road-config";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private d3: D3; // <-- Define the private member which will hold the d3 reference
  @ViewChild('svg') private svgElement;
  @ViewChild('tooltip1') private tooltip1;
  busy:Subscription;

  private  timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');
  private  dateFormat = d3.timeFormat('%Y-%m-%d');
  private previousDate='1970-01-01';//作为是否需要取数据的标志
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
  private labelFormat=this.zh.format("%Y年%m月%d日 %H:%M:%S %A");

  private roadData=[];

  //和simulate的交互
  private linkPathData=new LinkPathData();



  constructor(element: ElementRef, d3Service: D3Service,private fileReader: FileReaderService,private sharedVariable:SharedVariableService,private http:HttpService,@Inject(ROAD_PATH_CONFIG) private roadPathConfig,@Inject(ROAD_CONFIG) private roadConfig) {
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
    let that=this;
    d3Svg.selectAll('line')
      .on('mouseover',function(d){
      //组织向screen冒泡
      d3.event.stopPropagation();
      let link_id=(d3.select(this).attr('id').replace('link',''));
      for(let index in that.roadPathConfig){
        for(let i=0;i<that.roadPathConfig[index].length;i++){
          if(link_id==(that.roadPathConfig[index])[i]){
            //正向x`
            if(parseInt(index)%2!=0) {
              that.linkPathData.link_ids = [(that.roadPathConfig[index])[i - 1], (that.roadPathConfig[index])[i]];
            }
            //反向
            else{
              that.linkPathData.link_ids = [(that.roadPathConfig[index])[i-1], (that.roadPathConfig[index])[i]];
            }
            that.sharedVariable.setLinkPathSubject(that.linkPathData);
          }
        }
      }

    //  tooltip
        d3.select(that.tooltip1.nativeElement).style("opacity",1.0);
        d3.select(that.tooltip1.nativeElement).html('长度'+that.roadConfig.roadConfig.filter(d1=>d1.link_id==link_id)[0].length+'宽度'+that.roadConfig.roadConfig.filter(d1=>d1.link_id==link_id)[0].width);
      })
      .on('mousemove',(d)=>{
        d3.select(that.tooltip1.nativeElement).style("left", (d3.event.pageX-550) + "px")
          .style("top", (d3.event.pageY + 20-125) + "px");
      })
      .on('mouseout',()=>{
        this.sharedVariable.setLinkPathSubject(null);
        d3.select(that.tooltip1.nativeElement).style("opacity",0.0);

      });
    d3Svg.on('mousedown',function(){
      //发送值为null，即为清空选集
      d3.select(that.tooltip1.nativeElement).style("opacity",0.0);

    })


    //设置路网的宽度
    this.busy=this.fileReader.readFileToJson('/assets/file/gy_contest_link_info.csv')
      .subscribe(x=>{
          x.forEach(d=>{
            d3Svg.select('#link'+d.link_ID).attr("stroke", "rgba(0, 255, 251, 0.5)");
            d3Svg.select('#link'+d.link_ID).attr("stroke-width", d.width);
            d3Svg.select('#link'+d.link_ID).attr("marker-start", "url(#arrow)");
            d3Svg.select('#link'+d.link_ID).attr("marker-end", "url(#roadEnd)");
          })
      })

    this.sharedVariable.getTimeNow()
      .subscribe(z=>{
        if(this.previousDate!=this.dateFormat(z)){
          this.previousDate=this.dateFormat(z);

          // this.http.getPredictData('/ajax/getroadstatus/'+this.previousDate)
          //   .subscribe(x=>{
          //     console.log(x)
          //     this.roadData=x;
          //   })
          this.busy=this.fileReader.readCDNCSVFileToJson('/map/'+this.previousDate)
            .map(x=>this.parseMapDatas(x))
            .subscribe(x=>{
              this.roadData=x;

              // 防止点击的时候，没有饼图的出现
              let xToDate=this.timeFormat(z);
              //设置时间
              d3.select('#dayTime').text(""+this.labelFormat(z))
              // console.log(this.roadData)
              let roadInfo=this.roadData.filter(d1=>{
                return d1.daydatetime==xToDate;
              });
              //传递数据给count-link-pie
              this.sharedVariable.setLinkSpeedOffsetSubject(roadInfo);
              // console.log(roadInfo);
              roadInfo.forEach(d1=>{
                d3Svg.select('#link'+d1.link_id).attr('stroke',this.sequentialScale(d1['speed_offset']));
              })
            })
        }
        let xToDate=this.timeFormat(z);
        //设置时间
        d3.select('#dayTime').text(""+this.labelFormat(z))
        // console.log(this.roadData)
        let roadInfo=this.roadData.filter(d1=>{
          return d1.daydatetime==xToDate;
        });
        //传递数据给count-link-pie
        this.sharedVariable.setLinkSpeedOffsetSubject(roadInfo);
        // console.log(roadInfo);
        roadInfo.forEach(d1=>{
          d3Svg.select('#link'+d1.link_id).attr('stroke',this.sequentialScale(d1['speed_offset']));
        })
      })


    this.sharedVariable.getLinkPathSubject()
      .subscribe(x=>{
        if(!x){
          this.unSelectedRoad();
        }
        else{
          this.selectedRoad((x['link_ids'])[1]);
        }
      })

  //  与饼图的path的交互
    this.sharedVariable.getPathSubject()
      .subscribe(x=>{
        if(x==null){
          d3Svg.selectAll('line').classed('unSelectedRoad',false);
        }
        else {
          d3Svg.selectAll('line').classed('unSelectedRoad',true);
          this.roadPathConfig['link_id_' + x].forEach(d => {
            d3Svg.select('#link'+d).classed('unSelectedRoad',false);
          })
        }
      })

  }



  parseMapDatas(d): any {
    // console.log(d);
    // console.log(that);
    let result = [];
    d.forEach((d1, i1) => {
      // console.log(d1.aver_speed_offset);
      result.push({
        daydatetime:d1['daydatetime'],
        link_id:d1.link_id,
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
  selectedRoad(x){
    d3.select(this.svgElement.nativeElement).selectAll('line').classed('unSelectedRoad',true);
    d3.select(this.svgElement.nativeElement).select('#link'+x).classed('unSelectedRoad',false);
  }
  unSelectedRoad(){
    d3.select(this.svgElement.nativeElement).selectAll('line').classed('unSelectedRoad',false);
  }
}
