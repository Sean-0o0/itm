import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import LeftBlock from './LeftBlock';
import RightBlock from './RightBlock';
import TopBlock from './TopBlock';

import {
  FetchQueryChartIndexData,
  FetchQueryOptIdxStateStat,
  FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';

class RunManage extends React.Component {
  state = {
    datas: [],
    optIdxStateStat: [],
    errOrImpRpt: [],
    timer: '',
    firstMaxTime: '', //投保稽核第一批最早时间
    firstMinTime: '',//投保稽核第一批最迟时间
    secondMaxTime: '',//投保稽核第二批最早时间
    secondMinTime: '',//投保稽核第二批最迟时间
    list1: [],
    list2: [],
    list3: []
  };

  componentDidMount() {
    const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
    this.state.timer = setInterval(() => {
      //定时刷新
      // const loginStatus = localStorage.getItem('loginStatus');
      // if (loginStatus !== '1') {
      //   this.props.dispatch({
      //     type: 'global/logout',
      //   });
      // }
      this.fetchAllInterface();
    }, Number.parseInt(refreshWebPage, 10) * 1000);
    this.fetchAllInterface();
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }

  // 查询所有接口
  fetchAllInterface = async () => {
    await this.fetchErrOrImpRpt();
    this.fetchData();
    this.fetchOptIdxStateStat();
    this.fetchInsurAuditData();
    this.fetchOptIndictData();
  };

  // 运作类指标状态统计
  fetchOptIdxStateStat = () => {
    FetchQueryOptIdxStateStat({
      chartCode: 'Zbyxstatestat',
    })
      .then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          this.setState({ optIdxStateStat: records });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //重大事项查询
  fetchErrOrImpRpt = async () => {
    try {
      const res = await FetchQueryErrOrImpRpt({
        screenPage: 6,
      })
      const { data = [], code = 0, note = '' } = res;
      if (code > 0) {
        this.setState({ errOrImpRpt: data });
      }
    } catch (error) {
      message.error(!error.success ? error.message : error.note)
    }

  };

  // 业务数据
  fetchData = () => {
    FetchQueryChartIndexData({
      chartCode: 'ZBYXTaskState',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ datas: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //投保稽核
  fetchInsurAuditData = () => {
    FetchQueryChartIndexData({
      chartCode: 'OptMangm_InsurAudit',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        let list1 = [];
        let list2 = [];
        let list3 = [];
        if (code > 0) {
          this.setState({ InsurAuditData: data });
          for (let i = 0; i < data.length; i++) {
            if (data[i]) {
              if (data[i].GROUPNAME === '第一批') {
                list1.push(data[i]);
              } else if (data[i].GROUPNAME === '第二批') {
                list2.push(data[i]);
              } else{
                list3.push(data[i]);
              }
            }
          }
          this.setState({ list1: list1,
            list2: list2,
            list3: list3 });
        }
        // this.handleFirstData(this.state.list1);
        // this.handleSecondData(this.state.list2);
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //运营指标
  fetchOptIndictData = () => {
    FetchQueryChartIndexData({
      chartCode: 'OptMangm_OptIndict',
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ OptIndictData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleOptIdxStateData = records => {
    const tmpl = [];
    const data = [];
    const dataArr = [];
    records.forEach(item => {
      if (item.FID === '253' || item.FID === '254' || item.FID === '255') {
        data.push(item);
      }
    });
    for (let i = 0; i < data.length; i++) {
      dataArr.push([]);
      dataArr[i].push(data[i]);
    }
    records.forEach(item => {
      for (let i = 0; i < data.length; i++) {
        let id = data[i].ID;
        if (id === item.FID) {
          dataArr[i].push(item);
        }
      }
    });
    tmpl.push(dataArr);
    this.setState({ datas: tmpl });
  };

  // //处理投保稽核第一批数据
  // handleFirstData = (data) => {
  //   let dataReplace = [];
  //   let dataReplace2 = [];
  //   if (data.length > 0) {
  //     data.forEach(item => {
  //       if (typeof (item.STARTDATE) !== 'undefined') {
  //           item.STARTDATE = item.STARTDATE.replaceAll(':', '');
  //           // item.STARTDATE = parseInt(item.STARTDATE);
  //           dataReplace.push(item);
  //         }
  //       if (typeof (item.ENDDATE) !== 'undefined') {
  //         item.ENDDATE = item.ENDDATE.replaceAll(':', '');
  //         // item.ENDDATE = parseInt(item.ENDDATE);
  //         dataReplace2.push(item);
  //       }
  //       },
  //     );
  //   }
  //   let minTime;
  //   if(dataReplace.length>0){
  //     minTime = Math.min.apply(Math, dataReplace.map(function(o) {
  //       return o.STARTDATE;
  //     }));
  //     minTime = (minTime.toString().slice(0, 2) + ':' + minTime.toString().slice(2, 4) + ':' + minTime.toString().slice(4, 6));
  //   } else {
  //     minTime = '--:--:--'
  //   }
  //
  //   let maxTime = Math.max.apply(Math, dataReplace2.map(function(o) {
  //     return o.ENDDATE;
  //   }));
  //   maxTime = (typeof (dataReplace2.ENDDATE) === 'undefined') ? '--:--:--' : (maxTime.toString().slice(0, 2) + ':' + maxTime.toString().slice(2, 4) + ':' + maxTime.toString().slice(4, 6));
  //   this.setState({
  //     firstMaxTime: maxTime,
  //     firstMinTime: minTime,
  //   });
  //   return dataReplace;
  // };
  //
  // //处理投保稽核第二批数据
  // handleSecondData = (data) => {
  //   let dataReplace = [];
  //   let dataReplace2 = [];
  //   if (data.length > 0) {
  //     data.forEach(item => {
  //         if (typeof (item.STARTDATE) !== 'undefined') {
  //           item.STARTDATE = item.STARTDATE.replaceAll(':', '');
  //           item.STARTDATE = parseInt(item.STARTDATE);
  //           dataReplace.push(item);
  //         }
  //         if (typeof (item.ENDDATE) !== 'undefined') {
  //           item.ENDDATE = item.ENDDATE.replaceAll(':', '');
  //           item.ENDDATE = parseInt(item.ENDDATE);
  //           dataReplace2.push(item);
  //         }
  //       },
  //     );
  //   }
  //   let minTime;
  //   if(dataReplace.length>0){
  //     minTime = Math.min.apply(Math, dataReplace.map(function(o) {
  //       return o.STARTDATE;
  //     }));
  //     minTime = (minTime.toString().slice(0, 2) + ':' + minTime.toString().slice(2, 4) + ':' + minTime.toString().slice(4, 6));
  //   } else {
  //     minTime = '--:--:--'
  //   }
  //   let maxTime = Math.max.apply(Math, dataReplace2.map(function(o) {
  //     return o.ENDDATE;
  //   }));
  //   maxTime = (typeof (dataReplace2.ENDDATE) === 'undefined') ? '--:--:--' : (maxTime.toString().slice(0, 2) + ':' + maxTime.toString().slice(2, 4) + ':' + maxTime.toString().slice(4, 6));
  //   this.setState({
  //     secondMaxTime: maxTime,
  //     secondMinTime: minTime,
  //   });
  //   return dataReplace;
  // };

  render() {
    const {
      datas = [],
      optIdxStateStat = [],
      errOrImpRpt = [],
      InsurAuditData = [],
      OptIndictData = [],
      list1 = [],
      list2 = [],
      list3 = [],
      firstMaxTime = '', //投保稽核第一批最早时间
      firstMinTime = '',//投保稽核第一批最迟时间
      secondMaxTime = '',//投保稽核第二批最早时间
      secondMinTime = '',//投保稽核第二批最迟时间
    } = this.state;
    return (

      <div className='flex1 flex-c cont-wrap' style={{ color: '#C6E2FF' }}>
        <div>
          <TopBlock optIdxStateStat={optIdxStateStat} />
        </div>
        <div className='flex-r' style={{ height: 'calc(100% - 5rem)' }}>
          <div className='wid55 flex-c'>
            <LeftBlock datas={datas} InsurAuditData={InsurAuditData} list1={list1} list2={list2} list3={list3}
              firstMinTime={firstMinTime} firstMaxTime={firstMaxTime} secondMinTime={secondMinTime}
              secondMaxTime={secondMaxTime} />
          </div>
          <div className='wid45 flex-c'>
            <RightBlock OptIndictData={OptIndictData} errOrImpRpt={errOrImpRpt} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({}))(RunManage);
