import React, { Component } from 'react';
import { Progress, Tooltip } from 'antd';
import CountUp from 'react-countup';

export class ProgressChart extends Component {
  constructor(props) {
    super(props);
    const { item = {} } = this.props;
    const { COMPLTSTEPNUM } = this.props;
    this.state = {
      timer: '',
      COMPLTSTEPNUM: COMPLTSTEPNUM
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item = {}, hightLight : newTemp } = nextProps;
    const { hightLight : oldTemp = 0 } = this.props;
    const { COMPLTSTEPNUM = '0', TOTALTASKS = '0' } = item;
    if ( newTemp === 5 && newTemp!==oldTemp){
      this.setState({ COMPLTSTEPNUM: '0' });
      setTimeout(() => {
        this.setState({ COMPLTSTEPNUM: COMPLTSTEPNUM });
      }, 500);
    }else {
      this.setState({ COMPLTSTEPNUM: COMPLTSTEPNUM });
    }
  }

  getCOMPLTSTEPNUM() {
    const { COMPLTSTEPNUM = '0' } = this.state;
    return COMPLTSTEPNUM;
  }

    getPercent = (data = {}) => {
      const { COMPLTSTEPNUM = '0' } = this.state;
        if (data.COMPLTSTEPNUM && data.GROUPSTEPNUM) {
            return ((COMPLTSTEPNUM / data.GROUPSTEPNUM) * 100);
        }
        return 0;
    };

    //处理完成状态和样式
    handleComplete = (data = {}) => {
        let StatusAndColor = { status: '未开始', strokeColor: { '0%': '#157EF4', '100%': '#00D8FF' }, color: '#AAA' };
        if (data.GROUPSTATUS) {
            switch (data.GROUPSTATUS) {
                case '0':
                    StatusAndColor.status = '未开始';
                    break;
                case '1':
                    StatusAndColor.status = '进行中';
                    StatusAndColor.strokeColor = { '0%': '#F7B432', '100%': '#FFE401' };
                    StatusAndColor.color = "#F7B432";
                    break;
                case '2':
                    StatusAndColor.status = '已完成';
                    StatusAndColor.color = "#00ACFF";
                    break;
                case '3':
                    StatusAndColor.status = '异常';
                    StatusAndColor.strokeColor = { '0%': '#E10019', '100%': '#FF6C00' };
                    StatusAndColor.color = "#E23C39";
                    break;
                default:
                    break;
            }
        }
        return StatusAndColor;
    };

    //处理标题名称
    handleData = (data = {}) => {
        return (data.GROUPNAME === '' ? '-' : data.GROUPNAME);
    };

    //获取当前步骤
    getCurrent = (item = {}) => {
        const { data = [] } = item;
        let name = '-';
        for (let i = 0; i < data.length; i++) {
            const ele = data[i] || {};
            if (i === 0) {
                if (ele.SUBSTATE === '0' || ele.SUBSTATE === '1' || ele.SUBSTATE === '3') {
                    name = ele.IDX_NM || '-';
                    break;
                } else if (ele.SUBSTATE === '2' && data.length === 1) {
                    name = ele.IDX_NM || '-';
                    break;
                }
            } else if (i > 0) {
                if (ele.SUBSTATE === '1' || ele.SUBSTATE === '3') {
                    name = ele.IDX_NM || '-';

                    break;
                } else if (i === data.length - 1 && ele.SUBSTATE === '2') {
                    name = ele.IDX_NM;
                }
            }
        }
        return name;
    };

    render() {
        const { item = {} } = this.props;

        return (
            <div className='pos-r flex-r' style={{ alignItems: 'center' }}>
                <Tooltip title={this.getCurrent(item)} placement="rightTop">
                    <Progress type='dashboard' percent={this.getPercent(item)}
                        format={() => <div
                            style={{ color: `${this.handleComplete(item).color}`, fontWeight: 'bold' }}>
                          <CountUp start={0} end={this.getCOMPLTSTEPNUM()} duration="3" />/{item.GROUPSTEPNUM ? item.GROUPSTEPNUM : '-'}<br />
                          <span
                                className='fs16' style={{ fontWeight: 'normal', verticalAlign: '40%' }}>{this.handleComplete(item).status}
                          </span>
                        </div>}
                        strokeColor={this.handleComplete(item).strokeColor} />
                </Tooltip>
                <div className='pos-a pgs-pos'>
                    {this.handleData(item)}
                </div>
            </div>
        )
    }
}

export default ProgressChart
