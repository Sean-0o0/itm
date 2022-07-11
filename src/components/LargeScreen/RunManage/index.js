import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import LegendGroup from '../ClearingPlace/LegendGroup';
import BusinessInfoMorn from './BusinessInfoMorn';
import EventReport from '../ClearingPlace/EventReport';
import BusinessInfoNoon from './BusinessInfoNoon';
import BusinessInfoComp from './BusinessInfoComp';
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
  };
  componentDidMount() {
    const refreshWebPage = localStorage.getItem('refreshWebPage');
    this.state.timer = setInterval(() => {
      //定时刷新
      const loginStatus = localStorage.getItem('loginStatus');
      if (loginStatus !== '1') {
        this.props.dispatch({
          type: 'global/logout',
        });
      }
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
  fetchAllInterface = () => {
    this.fetchData();
    this.fetchOptIdxStateStat();
    this.fetchErrOrImpRpt();
  }

  // 运作类指标状态统计
  fetchOptIdxStateStat = () => {
    FetchQueryOptIdxStateStat({
      chartCode: "Zbyxstatestat",
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
  fetchErrOrImpRpt = () => {
    FetchQueryErrOrImpRpt({
      screenPage: 6,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ errOrImpRpt: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  // 业务数据
  fetchData = () => {
    FetchQueryChartIndexData({
      chartCode: "ZBYXTaskState"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.handleOptIdxStateData(data);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleOptIdxStateData = records => {
    const tmpl = [];
    const morn = [];
    const noon = [];
    const comp = [];
    const mornarr = [];
    const noonarr = [];
    const comparr = [];
    records.forEach(item => {
      if (item.FID === '253') {
        morn.push(item);
      } else if (item.FID === '254') {
        noon.push(item);
      } else if (item.FID === '255') {
        comp.push(item);
      }
    });
    for (let i = 0; i < morn.length; i++) {
      mornarr.push([]);
      mornarr[i].push(morn[i]);
    }
    for (let i = 0; i < noon.length; i++) {
      noonarr.push([]);
      noonarr[i].push(noon[i]);
    }
    for (let i = 0; i < comp.length; i++) {
      comparr.push([]);
      comparr[i].push(comp[i]);
    }
    records.forEach(item => {
      for (let i = 0; i < morn.length; i++) {
        let id = morn[i].ID;
        if (id === item.FID) {
          mornarr[i].push(item);
        }
      }
      for (let i = 0; i < noon.length; i++) {
        let id = noon[i].ID;
        if (id === item.FID) {
          noonarr[i].push(item);
        }
      }
      for (let i = 0; i < comp.length; i++) {
        let id = comp[i].ID;
        if (id === item.FID) {
          comparr[i].push(item);
        }
      }
    });
    tmpl.push(mornarr);
    tmpl.push(noonarr);
    tmpl.push(comparr);
    this.setState({ datas: tmpl });
  };

  render() {
    const { datas = [], optIdxStateStat = [], errOrImpRpt = [] } = this.state;

    return (
      <div className="flex1 flex-r cont-wrap">
        <div className=" wid100 flex-c cont-left">
          <LegendGroup optIdxStateStat={optIdxStateStat} />
          <BusinessInfoMorn datas={datas[0]} />
          <div className="flex1 flex-r">
            <BusinessInfoNoon datas={datas[1]} />
            <BusinessInfoComp datas={datas[2]} />
            <div className="wid40 pd10">
              <EventReport errOrImpRpt={errOrImpRpt} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(RunManage);
