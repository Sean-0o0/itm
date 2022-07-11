import React from 'react';
import { Progress, Popover, Icon, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'dva/router';
import { FetchQueryUnfinishTargetList } from '../../../../../services/largescreen';
import RowItem from './RowItem';

class SubsidiaryIndex extends React.Component {
  state = {
    datas: [],
    uncompletedTask: [],
    total: 0
  };

  // componentWillMount() {
  //   this.state.timer = setInterval(() => {
  //     let { datas = [], COMPLTASKS } = this.state;
  //     this.setState({ COMPLTASKS: '0' });
  //     setTimeout(()=>{
  //       this.setState({ COMPLTASKS: COMPLTASKS });
  //     }, 1000);
  //   }, 5500);
  // }

//   let { datas = [] } = this.state;
// if (datas.length === 0){
//   const { GroupOpManagmHeadqrt = [] } = this.props;
//   this.setState({ datas: GroupOpManagmHeadqrt });
// } else {
//   this.setState({ datas: [] });
// }

  componentWillReceiveProps(nextProps) {
    const { GroupOpManagmHeadqrt = [], hightLight: oldTemp } = this.props;
    const { GroupOpManagmHeadqrt: nextData = [], hightLight: newTemp } = nextProps;
    const [data1 = {}, data2 = {}, data3 = {}, data4 = {}, data5 = {}, data6 = {}] = nextData;
    const { COMPLTASKS = '0', TOTALTASKS = '0' } = data6;
    if (JSON.stringify(GroupOpManagmHeadqrt) !== JSON.stringify(nextData)) {
      this.setState({ COMPLTASKS: COMPLTASKS });
      this.setState({ TOTALTASKS: TOTALTASKS });
      this.setState({ datas: nextData });
    }
    if (newTemp !== oldTemp){
      setTimeout(()=>{
        this.setState({ COMPLTASKS: '0' });
        setTimeout(()=>{
          this.setState({ COMPLTASKS: COMPLTASKS });
        }, 1000);
      }, 1000);
    }
  }

  //处理运行进度百分比
  getPercent = (data = {}) => {
    const { COMPLTASKS = '0', TOTALTASKS = '0' } = data;
    return ((Number.parseInt(COMPLTASKS) / Number.parseInt(TOTALTASKS)) * 100);
  };

  getPercent2(){
    let { COMPLTASKS = '0', TOTALTASKS = '0' } = this.state;
    return ((Number.parseInt(COMPLTASKS) / Number.parseInt(TOTALTASKS)) * 100);
  }

  //处理标题名称
  handleData = (data = {}) => {
    return (data.GROUPNAME === "" ? '-' : data.GROUPNAME);
  };

  //处理运行进度
  handleDataSecond = (data) => {
    return ((data.COMPLTASKS === "" ? '-' : data.COMPLTASKS) + "/" + (data.TOTALTASKS === "" ? '-' : data.TOTALTASKS));
  };

  queryUnfinishTargetList = (orgId, visible) => {
    if(visible){
      this.setState({ uncompletedTask: [], key: 0, total: 0 });
      FetchQueryUnfinishTargetList({
        chartCode: "GroupOpManagmHeadqrt",
        orgId
      })
        .then((ret = {}) => {
          const { code = 0, records = [] } = ret;
          if (code > 0) {
            const temp = this.sortArr(records, 'groupName');
            let key = 0;
            temp.forEach((ele) => {
              const { data = [] } = ele;
              if (data.length > 3) {
                key = 1
              }
            })
            this.setState({ uncompletedTask: temp, key: key, total: records.length });
          }
        })
        .catch(error => {
          message.error(!error.success ? error.message : error.note);
        });
    }
  }

  sortArr = (arr, name) => {
    let map = {};
    let myArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][name]) {
        if (!map[arr[i][name]]) {
          myArr.push({
            [name]: arr[i][name],
            data: [arr[i]]
          });
          map[arr[i][name]] = arr[i]
        } else {
          for (let j = 0; j < myArr.length; j++) {
            if (arr[i][name] === myArr[j][name]) {
              myArr[j].data.push(arr[i]);
              break
            }
          }
        }
      }
    }
    return myArr;
  }

  render() {
    let { datas = [], key = 0, uncompletedTask = [], total = 0 } = this.state;
    datas = datas.sort((x, y) => x.SNO - y.SNO);
    const [data1 = {}, data2 = {}, data3 = {}, data4 = {}, data5 = {}, data6 = {}] = datas;
    let content = <div>
      <Scrollbars
        autoHide
        style={{ height: '50rem', width: key === 0 ? '23rem' : '46rem' }}
      >
        {uncompletedTask.map((item = {}, index) => {
          const { data = [], groupName = '-' } = item;
          return (<div key={index} style={{ padding: '2rem', paddingBottom: index===uncompletedTask.length-1? '2rem':'0' }}>
            <div style={{ color: '#00ACFF' }}>
              <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
              {groupName}
            </div>
            {key === 0 ?
              <div className='clearfix'>
                {data.map((ele, pos) => {
                  return <RowItem ele={ele} key={pos} />
                })
                }
              </div> :
              <div className="double-list clearfix">
                {data.map((ele, pos) => {
                  return <RowItem ele={ele} key={pos} isDouble={1} />
                })
                }
              </div>
            }
          </div>)
        })
        }
      </Scrollbars>
    </div>
    if (total < 10) {
      content = <div style={{ width: key === 0 ? '23rem' : '46rem' }}>
        {uncompletedTask.map((item = {}, index) => {
          const { data = [], groupName = '-' } = item;
          return (<div key={index} style={{ padding: '2rem', paddingBottom: index===uncompletedTask.length-1? '2rem':'0' }}>
            <div style={{ color: '#00ACFF' }}>
              <Icon type="caret-right" style={{ fontSize: '1.833rem', marginRight: '.5rem' }} />
              {groupName}
            </div>
            {key === 0 ?
              <div className='clearfix'>
                {data.map((ele, pos) => {
                  return <RowItem ele={ele} key={pos} />
                })
                }
              </div> :
              <div className="double-list clearfix">
                {data.map((ele, pos) => {
                  return <RowItem ele={ele} key={pos} isDouble={1} />
                })
                }
              </div>
            }
          </div>)
        })
        }
      </div>
    }

    return (
      <div className='h100 pd10 bg-img pos-r'>
        <div className='flex-r pos-jj'>
          {/*跳转至兴证基金PC大屏页面*/}
          <Link to={`/fund`} target='_blank'><img src={[require('../../../../../image/icon_jj.png')]} className='icon-size' alt='' /></Link>
          <div className='flex-c bg-style-l'>
            <div className='fwb' style={{ lineHeight: '4.5rem' }}>{this.handleData(data1)}</div>
            <div className='blue' style={{ fontSize: '1.433rem' }}>运行进度：{this.handleDataSecond(data1)}</div>
            <div>
              <Popover overlayClassName="main-tooltip" content={content} title={`未完成指标 (${total})`} placement="right" trigger="click" onVisibleChange={(visible) => this.queryUnfinishTargetList(1, visible)}>
                <Progress percent={this.getPercent(data1)}
                  strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
              </Popover>
            </div>
          </div>

        </div>

        <div className='flex-r pos-gj'>
          <Link to={`/international`} target='_blank'><img src={[require('../../../../../image/icon_gj.png')]} className='icon-size'
            alt='' /></Link>
          <div className='flex-c bg-style-l'>
            <div className='fwb' style={{ lineHeight: '4.5rem' }}>{this.handleData(data2)}</div>
            <div className='blue' style={{ fontSize: '1.433rem' }}>运行进度：{this.handleDataSecond(data2)}</div>
            <div>
              <Popover overlayClassName="main-tooltip" content={content} title={`未完成指标 (${total})`} placement="right" trigger="click" onVisibleChange={(visible) => this.queryUnfinishTargetList(2, visible)}>
                <Progress percent={this.getPercent(data2)}
                  strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
              </Popover>
            </div>
          </div>
        </div>

        <div className='flex-r pos-yy'>
          <img src={[require('../../../../../image/icon_jtyy.png')]} className='icon-size' alt='' />
          <div className='flex-c bg-style-l'>
            <div className='fwb' style={{ lineHeight: '4.5rem' }}>{this.handleData(data3)}</div>
            <div className='blue' style={{ fontSize: '1.433rem' }}>运行进度：{this.handleDataSecond(data3)}</div>
            <div>
              <Popover overlayClassName="main-tooltip" content={content} title={`未完成指标 (${total})`} placement="right" trigger="click" onVisibleChange={(visible) => this.queryUnfinishTargetList(3, visible)}>
                <Progress percent={this.getPercent(data3)}
                  strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
              </Popover>
            </div>
          </div>
        </div>
        <div className='flex-r pos-qh'>
          <div className='flex-c bg-style-r'>
            <div className='fwb' style={{ lineHeight: '4.5rem' }}>{this.handleData(data4)}</div>
            <div className='blue' style={{ fontSize: '1.433rem' }}>运行进度：{this.handleDataSecond(data4)}</div>
            <div>
              <Popover overlayClassName="main-tooltip" content={content} title={`未完成指标 (${total})`} placement="right" trigger="click" onVisibleChange={(visible) => this.queryUnfinishTargetList(4, visible)}>
                <Progress percent={this.getPercent(data4)}
                  strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
              </Popover>
            </div>
          </div>
          <Link to={`/futures`} target='_blank'><img src={[require('../../../../../image/icon_qh.png')]} className='icon-size'
            alt='' /></Link>
        </div>

        <div className='flex-r pos-zg'>
          <div className='flex-c bg-style-r'>
            <div className='fwb' style={{ lineHeight: '4.5rem' }}>{this.handleData(data5)}</div>
            <div
              className='blue' style={{ fontSize: '1.433rem' }}>运行进度：{this.handleDataSecond(data5)}</div>
            <div>
              <Popover overlayClassName="main-tooltip" content={content} title={`未完成指标 (${total})`} placement="right" trigger="click" onVisibleChange={(visible) => this.queryUnfinishTargetList(5, visible)}>
                <Progress percent={this.getPercent(data5)}
                  strokeColor={{ '0%': '#9000FF', '100%': '#00ACFF' }} showInfo={false} />
              </Popover>
            </div>
          </div>
          <Link to={`/oprtRiskOfAsset`} target='_blank'>
            <img src={[require('../../../../../image/icon_zg.png')]} className='icon-size' alt='' />
          </Link>
        </div>

        <div className='pos-pro'>
          <div style={{ padding: '2.4rem 0 0 2.5rem' }}>
            <Progress type='dashboard' percent={this.getPercent2()}
              strokeColor={{ '0%': '#00ACFF', '100%': '#9000FF' }}
              format={() =>
                <div className='por-circle'>{data6.COMPLTASKS ? data6.COMPLTASKS : '-'}
                  <span className='fs24' style={{ fontWeight: 'normal' }}>/{data6.TOTALTASKS ? data6.TOTALTASKS : '-'}</span>
                  <br />
                  <span className='fs22'>{this.handleData(data6)}</span>
                </div>}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SubsidiaryIndex;
