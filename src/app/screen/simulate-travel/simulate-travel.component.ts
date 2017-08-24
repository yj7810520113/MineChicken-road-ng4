import {Component, Inject, OnInit} from '@angular/core';
import {ROAD_CONFIG} from "../../config/road-config";
import {ROAD_PATH_CONFIG} from "../../config/road-path-config";

@Component({
  selector: 'app-simulate-travel',
  templateUrl: './simulate-travel.component.html',
  styleUrls: ['./simulate-travel.component.css']
})
export class SimulateTravelComponent implements OnInit {

  constructor(@Inject(ROAD_CONFIG) private roadConfig,@Inject(ROAD_PATH_CONFIG) private roadPathConfig) { }

  ngOnInit() {
    console.log(this.roadConfig.roadConfig);
    console.log(Object.keys(this.roadPathConfig));
    let lengthMap=new Map();
    this.roadConfig.roadConfig.forEach(d=>{
      lengthMap.set(d['link_id'],d['length'])
    })
    Object.keys(this.roadPathConfig).forEach(d=>{
      let lengthSum=0;
      let lengths='';
      this.roadPathConfig[d].forEach(d1=>{
        lengths+=lengthMap.get(d1)+',';
        lengthSum+=parseInt(lengthMap.get(d1));
      })
      console.log(lengths);
      console.log(lengths.split(",").reverse().join(','));
      console.log(lengthSum);

    })
  }

}
