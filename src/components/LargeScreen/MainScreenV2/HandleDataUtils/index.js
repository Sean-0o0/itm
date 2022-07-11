//chenjian--- 处理集团主屏上完成比例图表样式和数据的工具类
const HandleDataUtils = {
  //处理运行进度百分比
  getPercent(data){
    return ((data.COMPLTASKS / data.TOTALTASKS) * 100);
  },

  //处理标题名称
  handleData (data){
    return (data.GROUPNAME === "" ? '-' : data.GROUPNAME);
  },

  //处理完成状态
  handleComplete (data){
    return (data.COMPLTASKS === data.TOTALTASKS ? "已完成" : "进行中");
  },

  //处理样式
  handleStyle  (data){
    return (data.COMPLTASKS === data.TOTALTASKS ? "#00ACFF" : "#F7B432");
  },

  //处理完成比 n/m
  handleDataSecond(data) {
    return ((data.COMPLTASKS === "" ? '-':data.COMPLTASKS)+"/"+(data.TOTALTASKS === "" ? '-':data.TOTALTASKS));
  },
}

export default HandleDataUtils;
