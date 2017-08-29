export class LinkPathData {
  //路径名称：1,2,3,4,5,6
  link_path:number;
  //路径的id：[id1,id2]，其中id1为起始点，id2为结束点，id2代表路径的id，id2若为undefined则表示起始点
  link_ids:Array<String>;
  //预测的时间（默认为10分钟预测一次）
  predictDateTime:number;
}
