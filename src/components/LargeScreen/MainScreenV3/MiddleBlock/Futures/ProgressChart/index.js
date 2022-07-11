import React, { Component } from 'react';
import { Progress, Tooltip } from 'antd';
import CountUp from "react-countup";
export class ProgressChart extends Component {

  constructor(props) {
    super(props);
    const { item = {} } = this.props;
    const { COMPLTASKS = '0'} = item;
    this.state = {
      timer: '',
      COMPLTASKS: COMPLTASKS
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item = {}, hightLight : newTemp } = nextProps;
    const { hightLight : oldTemp } = this.props
    const { COMPLTASKS = '0', TOTALTASKS = '0' } = item;
    if( newTemp === 3 && newTemp !== oldTemp){
      this.setState({ COMPLTASKS: '0' });
      setTimeout(()=>{
        this.setState({ COMPLTASKS: COMPLTASKS });
      }, 500);
    } else {
      this.setState({ COMPLTASKS: COMPLTASKS });
    }
  }

  getPercent = (num, total) => {
    const { COMPLTASKS = '0'}  = this.state;
    return ((Number.parseInt(COMPLTASKS) / Number.parseInt(total)) * 100);
  };

  getCOMPLTASKS(){
    const { COMPLTASKS = '0'}  = this.state;
    return COMPLTASKS
  }

  //处理完成状态和样式
  handleComplete = (data) => {
    let StatusAndColor = { strokeColor: { '0%': '#157EF4', '100%': '#00D8FF' }, color: '#AAA' };
    switch (data) {
      case '1':
        StatusAndColor.strokeColor = { '0%': '#F7B432', '100%': '#FFE401' };
        StatusAndColor.color = "#F7B432";
        break;
      case '2':
        StatusAndColor.color = "#00ACFF";
        break;
      case '3':
        StatusAndColor.strokeColor = { '0%': '#E10019', '100%': '#FF6C00' };
        StatusAndColor.color = "#E23C39";
        break;
      default:
        break;
    }

    return StatusAndColor;
  };

  render() {
    const { item = {} } = this.props;
    const { COMPLTASKS = '0',
      CURRENTTASK = "-",
      GROUPNAME = "-",
      GROUPSTATE = "0",
      GROUPSTATENM = "未开始",
      TOTALTASKS = "0" } = item;
    return (
      <div className='pos-r flex-r' style={{ alignItems: 'center' }}>
        {/* <Tooltip title={CURRENTTASK}> */}
          <Progress type='dashboard' percent={this.getPercent(COMPLTASKS, TOTALTASKS)}
            format={() => <div
              style={{ color: this.handleComplete(GROUPSTATE).color, fontWeight: 'bold' }}><CountUp start={0} end={this.getCOMPLTASKS()} duration="3" />/{TOTALTASKS}<br /><span
                className='fs16' style={{ fontWeight: 'normal', verticalAlign: '40%' }}>{GROUPSTATENM}</span></div>}
            strokeColor={this.handleComplete(GROUPSTATE).strokeColor} />
        {/* </Tooltip> */}
        <div className='pos-a pgs-pos'>
          {GROUPNAME}
        </div>
      </div>
    )
  }
}

export default ProgressChart
