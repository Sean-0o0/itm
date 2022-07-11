import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import LegendGroup from './LegendGroup';
import BusinessInfoMorn from './BusinessInfoMorn';
import BusinessInfoNoon from './BusinessInfoNoon';
import BusinessInfoComp from './BusinessInfoComp';
import ModuleChart from './ModuleChart';
import EventReport from './EventReport';
import {
  FetchQueryModuleChartConfig,
  FetchQueryChartIndexConfig,
  FetchQueryOptIdxStateStat,
  FetchQueryErrOrImpRpt,
  FetchQueryOptIdxState,
} from '../../../services/largescreen';

class ClearingPlace extends React.Component {
  state = {
    moduleCharts: [], // 图表配置
    indexConfig: {}, // 指标配置
    optIdxStateStat: [],  // 运作类指标状态统计
    errOrImpRpt: [], //重大事项查询
    // timer: '',
    optIdxData: []
  };

  componentWillMount() {
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
    }, Number.parseInt(refreshWebPage, 10)* 1000);
    this.fetchAllInterface();
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
  }
  // 查询所有接口
  fetchAllInterface = async () => {
    //查询图表模块和指标配置
    await this.fetchChartConfigData();
    this.fetchIndexConfigData();
    this.fetchOptIdxStateStat();
    this.fetchErrOrImpRpt();
    this.fetchOptIdxStateData();
  }

  // 图表配置数据
  fetchChartConfigData = async () => {

    try {
      const res = await FetchQueryModuleChartConfig({
        screenPage: 1,
      })
      const { records = [], code = 0, note = '' } = res;
      if (code > 0) {
        this.handleChartConfigData(records);
      }
    } catch (error) {
      message.error(!error.success ? error.message : error.note)
    }
  };

  // 指标配置数据
  fetchIndexConfigData = () => {
    FetchQueryChartIndexConfig({
      screenPage: 1,
    })
      .then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          this.handleIndexConfigData(records);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  fetchOptIdxStateData = () => {
    FetchQueryOptIdxState({
      chartCode: "ZbqueryTaskState",
    })
      .then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          this.handleOptIdxStateData(records);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  // 运作类指标状态统计
  fetchOptIdxStateStat = () => {
    FetchQueryOptIdxStateStat({
      chartCode: "ZbqueryTaskStatestat",
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
      screenPage: 1,
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

  handleOptIdxStateData = records => {
    const tmpl = [];
    const morn = [];
    const noon = [];
    const comp = [];
    const mornarr = []; //上午指标
    const noonarr = []; //下午指标
    const comparr = []; //日终指标
    records.forEach(item => {
      if (item.fid === '2') {
        morn.push(item);
      } else if (item.fid === '21') {
        noon.push(item);
      } else if (item.fid === '45') {
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
        let id = morn[i].id;
        if (id === item.fid) {
          mornarr[i].push(item);
        }
      }
      for (let i = 0; i < noon.length; i++) {
        let id = noon[i].id;
        if (id === item.fid) {
          noonarr[i].push(item);
        }
      }
      for (let i = 0; i < comp.length; i++) {
        let id = comp[i].id;
        if (id === item.fid) {
          comparr[i].push(item);
        }
      }
    });
    tmpl.push(mornarr);
    tmpl.push(noonarr);
    tmpl.push(comparr);
    this.setState({ optIdxData: tmpl });
  };

  handleChartConfigData = records => {
    const tmpl = [];
    for (let i = 1; i <= records.length; i++) {
      tmpl.push([]);
    }
    records.forEach(item => {
      if (item.chartType !== "0") {
        const { displayOrder } = item;
        const orderNum = Number.parseInt(displayOrder);
        tmpl[orderNum - 1].push(item);
      }

    });
    this.setState({ moduleCharts: tmpl });
  };

  handleIndexConfigData = records => {
    const codeArr = records.map(m => m.chartCode);
    const tmpl = {};
    codeArr.forEach(item => {
      tmpl[item] = [];
    });
    records.forEach(item => {
      if (tmpl[item.chartCode]) {
        tmpl[item.chartCode].push(item);
      }
    });
    this.setState({ indexConfig: tmpl });
  };

  render() {
    const { optIdxData = [], moduleCharts = [], indexConfig = [], optIdxStateStat = [], errOrImpRpt = [] } = this.state;
    const { dispatch } = this.props;
    // const { optIdxData } = this.props;
    let optIdxMorn = [];
    let optIdxNoon = [];
    let optIdxComp = [];
    if (optIdxData.length) {
      optIdxMorn = optIdxData[0];
      optIdxNoon = optIdxData[1];
      optIdxComp = optIdxData[2];
    }
    return (
      <div className="flex1 flex-r cont-wrap">
        <div className=" wid66 flex-c cont-left">
          <LegendGroup optIdxStateStat={optIdxStateStat} />
          <BusinessInfoMorn optIdxMorn={optIdxMorn} />
          <div className="flex1 clearfix">
            <BusinessInfoNoon optIdxNoon={optIdxNoon} />
            <BusinessInfoComp optIdxComp={optIdxComp} />
          </div>
        </div>
        <div className="wid34 flex-c">
          <div className="h50 pd10">
            <ModuleChart
              records={moduleCharts[1]}
              indexConfig={indexConfig}
              tClass='title-r'
              dispatch={dispatch}
            />
          </div>
          <div className="h50 pd10">
            <EventReport errOrImpRpt={errOrImpRpt} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(ClearingPlace);
