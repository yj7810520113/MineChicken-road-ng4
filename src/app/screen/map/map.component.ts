import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {D3, D3Service} from "d3-ng2-service";
import {FileReaderService} from "../../service/file-reader.service";
import {SharedVariableService} from "../../service/shared-variable.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private d3: D3; // <-- Define the private member which will hold the d3 reference
  @ViewChild('svg') private svgElement;

  constructor(element: ElementRef, d3Service: D3Service, fileReader: FileReaderService,private sharedVariable:SharedVariableService) {
    this.d3 = d3Service.getD3(); // <-- obtain the d3 object from the D3 Service
    // this.parentNativeElement = element.nativeElement;
    fileReader.readFileToJson('/assets/file/gy_contest_link_info.txt').subscribe((x => console.log(x)
  ))
    ;
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
    // console.log(new FileReader().readAsText('../../assets/file/gy_contest_link_info.txt'));
    // d3.csv('../../assets/file/gy_contest_link_info.txt', function (d) {
    //   d.forEach(function (d1,i1) {
    //     let road=d3Svg.select('#'+d1.link_id.replace(/\d{9}(\d{4})\d{6}/,'$1'));
    //     road.ch
    //   })
    // })
    let roadMap = new Map();
    $.get('../../../assets/file/gy_contest_link_info.txt', function (d) {
      let ls = d.split('\n');
      for (let eles of ls) {
        let ele = eles.split(',');
        roadMap.set(ele[0].replace(/\d{9}(\d{4})\d{6}/, '$1'), ele[2]);
      }
      $('g').each(function (d) {
//        console.log(this);
        let id = $(this).attr('id').replace(/_x\d(\d{1})_(\d{3}).*/, '$1$2');
//        console.log(id.replace(/_x\d(\d{1})_(\d{3}).*/,'$1$2'));
        if (roadMap.has(id)) {
//            $(this).children(':first').attr("stroke-linecap","butt");
          $(this).children(':first').attr("stroke", "rgba(0, 255, 251, 0.5)");
          $(this).children(':first').attr("stroke-width", roadMap.get(id));
          $(this).children(':first').attr("marker-start", "url(#arrow)");
          $(this).children(':first').attr("marker-end", "url(#roadEnd)");
        }

      })
    });

    //  初始化录完之后，播放动画
    this.roadAnimation()

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

// 动画播放路网交通流情况
  roadAnimation(): void {
    // console.log(this.sequentialScale(0.5));
    d3.csv('../../../assets/file/data_offset3.3.csv', (error, data) => {
      let sortByKey = d3.nest()
        .key(function (d) {
          return d.daydatetime;
        })
        .sortKeys(d3.ascending)
        .entries(data);
      let count = 0;
      console.log(sortByKey)

      setInterval(() => {
        $('#dayTime').text((sortByKey[count])['key']);

        //传递参数
        this.sharedVariable.setLinkSpeedOffsetSubject(sortByKey[count]);

        (sortByKey[count])['values'].forEach((d, i) => {
          let link_id = d['link_id'].substring(0, 1) + "_" + d['link_id'].substring(1, 4);
          //            console.log(link_id)
          //            $(this).children(':first').attr("stroke-linecap","butt");
          //                $('g[id*="'+link_id+'"]').children(':first').attr("stroke",sequentialScale(d['speed']));
          //            console.log(d3.select('g[id*="'+link_id+'"]'));
          var t = d3.transition()
            .duration(300)
            .ease(d3.easeExpInOut);
          // console.log(this);
          d3.select('g[id*="' + link_id + '"] >line').transition(t).attr('stroke', this.sequentialScale(d['speed_offset']))
        })
        //        console.log(count);
        count++;
      }, 300)
    });
  }


}
