import React, { Component } from 'react';
import { Popover } from 'antd';
import TaskItem from './TaskItem';

export class ClearItem extends Component {

    getStatusW = (status) =>{
        if(status === '1'){
            return '进行中';
        }else if(status === '2'){
            return '已完成';
        }else if(status === '3'){
            return '异常';
        }else if(status === '0'){
            return '未开始';
        }else {
          return '未开始';
        }
    }

    getIcon = (status) =>{
        if(status === '1'){
            return 'icon_underway.png';
        }else if(status === '2'){
            return 'icon_completed.png';
        }else if(status === '3'){
            return 'icon_abnormal.png';
        }else if(status === '0'){
            return 'icon_nostart.png';
        }else {
          return 'icon_nostart.png';
        }
    }

    getColor = (status) =>{
        if(status === '1'){
            return '#F7B432';
        }else if(status === '2'){
            return '#00ACFF';
        }else if(status === '3'){
            return '#E23C39';
        }else {
            return '#AAAAAA';
        }
    }

    getRGBColor = (status) =>{
        if(status === '1'){
            return 'rgba(267, 180, 50, 0.5)';
        }else if(status === '2'){
            return 'rgba(0, 172, 255, 0.5)';
        }else if(status === '3'){
            return 'rgba(226, 60, 57, 0.5)';
        }else {
            return 'rgba(170, 170, 170, 0.5)';
        }
    }
//获取当前步骤
getCurrentIndex = (item = {}) => {
  let curentIndex = 0;
  const { data = [] } = item;
  // let name = '-';
  for (let i = 0; i < data.length; i++) {
    const ele = data[i] || {};
    if (i === 0) {
      if (ele.SUBSTATE === '0') {
        // name = ele.IDX_NM || '-';
      curentIndex = 0;//状态为未开始则当前步为第一条

        break;
      }
    } else if (i > 0) {
      if (ele.SUBSTATE === '1') {
        // name = ele.IDX_NM || '-';
       curentIndex = i;//状态进行中，获取当前步
        break;
      }else if (i === data.length - 1 && ele.SUBSTATE === '2') {
        // name = ele.IDX_NM;
        curentIndex =data.length-1;//状态为已完成则当前步为最后一条


      }
    }
  }
  return curentIndex;
};
    render() {
        // const { data = {} } = this.props;
        const { records = [] } = this.props;
        const status = records[0]?records[0].GROUPSTATUS:'0';
        const name = records[0]?records[0].GROUPNAME:'暂无数据';
        let current = {} , //当前步骤
            curentIndex = 0,   //当前步骤位置
            overTime = false;   //是否超时
        // for(let i = 0; i < records.length ; i++){
        //     if(records[i].SUBSTATE === '1' || records[i].SUBSTATE === '3' ){
        //         current = records[i];
        //         curentIndex = i;
        //         break;
        //     }
        // }
        // if(current === {} && curentIndex === 0){
        //     if(status === '2'){//状态为已完成则当前步为最后一条
        //         curentIndex = records.length-1
        //         current = records[curentIndex];
        //     }else{//状态为未开始则当前步为第一条
        //         curentIndex = 0
        //         current = records[curentIndex];
        //     }
        // }
        let percent = 0;//计算进度条进度
        if(records.length > 0 && records[0]){
            percent = records[0].COMPLTSTEPNUM / records[0].GROUPSTEPNUM * 100;
        }
        percent = percent + '%';
        const moudleInfo = records.map(item =>{
            return {'IDX_NM':item.IDX_NM,STATE:item.SUBSTATE}
        });
        const content = (
            <ul className="timeline-wrapper" style={{ marginBottom: '0' }}>
                {moudleInfo.map((item, index) =>
                    (<TaskItem infoItem={item} order={index} current={this.getCurrentIndex(records)}/>))}
            </ul>
        );
        if(status !== '2' && records[0] && records[0].ENDDATE && Date.parse(records[0].ENDDATE)< new Date()){
            overTime = true;
        }
        return (
            <div className='flex1 clear-content flex-c' style={{ padding: '2rem 2rem 0', fontSize: '1.633rem' }}>
                <div style={{ height: '7rem' }}>
                    <div className="content-item flex-r">
                        <div className="flex1 flex-r">
                            {/* <img className="data-item-img" src={[require("../../../../../../image/icon_all.png")]} alt="" /> */}
                            <div className="item-title" style={{ fontSize: '1.733rem', fontWeight: 'bold' }}>{name}</div>
                        </div>
                        <div className="flex-r" style={{ width: '9.5rem' }}>
                            <img className="data-item-img" src={[require("../../../../../../image/"+this.getIcon(status))]} alt="" />
                            <div className="item-title-state" style={{ fontSize: '1.633rem' }}>{this.getStatusW(status)}</div>
                        </div>
                    </div>
                </div>
                <div className="flex1 flex-c">
                    <div className="flex-r" style={{ width: '100%' }}>
                        {/* <div className="flex1">清算进度
                            <Popover content={content} title={name}>
                                <img src={[require("../../../../../../image/bg_detail.png")]} alt="" style={{ width: "1.633rem", marginLeft: '.677rem' }} />
                            </Popover>
                        </div> */}
                        <div style={{ fontSize: "1.5rem", color:overTime?'#CDFF00':''}}>
                            {
                                overTime?<span>超时</span>:''
                            }
                            {records[0] && records[0].STARTDATE?records[0].STARTDATE.substring(11,19):'--:--:--'} - {records[records.length-1] && records[records.length-1].ENDDATE?records[records.length-1].ENDDATE.substring(11,19):'--:--:--'}
                        </div>
                        <div className="flex1">
                        </div>
                        <div>{records[0]?records[0].COMPLTSTEPNUM:''} / {records[0]?records[0].GROUPSTEPNUM:''}</div>
                    </div>
                    <div className="clear-process pos-r">
                        <Popover content={content} title={name} style={{ left: 'calc('+percent+' - 1rem)'}}>
                            <div className="clear-process-data" style={{ backgroundColor: this.getColor(status), width: percent }}></div>
                            <div className="pos-a clear-process-dot" style={{ left: 'calc('+percent+' - 1rem)',borderColor: this.getColor(status)}}></div>
                        </Popover>
                    </div>
                    <div className="clear-tip flex-r" style={{ boxShadow:'0 0 2rem '+this.getColor(current.SUBSTATE)+' inset'}}>
                        <div className="flex1" style={{ paddingLeft: '1rem' }}>{curentIndex+1}. {current.IDX_NM}</div>
                        <div className="flex-r" style={{ width: '8.5rem' }}>
                            <img className="data-item-img" src={[require("../../../../../../image/"+this.getIcon(current.SUBSTATE))]} alt="" />
                            <div className="item-title-state" style={{ fontSize: '1.633rem', color:this.getColor(current.SUBSTATE)}}>{this.getStatusW(current.SUBSTATE)}</div></div>
                        <div className="border-tri"
                            style={{ left: 'calc('+percent+' - 1rem)', borderColor: "transparent transparent "+this.getRGBColor(current.SUBSTATE)+"" }}>
                        </div>
                        <div className="border-tri2"></div>
                        <div className="border-tri3"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ClearItem
