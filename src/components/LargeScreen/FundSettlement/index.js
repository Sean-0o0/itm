import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import LegendGroup from '../ClearingPlace/LegendGroup';
import ModuleChart from '../ClearingPlace/ModuleChart';
import EventReport from '../ClearingPlace/EventReport';
import FundManage from './FundManage';
import {
  FetchQueryModuleChartConfig,
  FetchQueryChartIndexConfig,
  FetchQueryChartIndexData,
  FetchQueryOptIdxStateStat,
  FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';

class FundSettlement extends React.Component {
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
    this.fetchChartConfigData();
    this.fetchIndexConfigData();
    this.fetchData();
    this.fetchOptIdxStateStat();
    this.fetchErrOrImpRpt();
  }

  // 图表配置数据
  fetchChartConfigData = () => {
    FetchQueryModuleChartConfig({
      screenPage: 2,
    })
      .then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          this.handleChartConfigData(records);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  // 指标配置数据
  fetchIndexConfigData = () => {
    FetchQueryChartIndexConfig({
      screenPage: 2,
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

  //资金交收数据
  fetchData = () => {
    FetchQueryChartIndexData({
      chartCode: "Fusettmanag"
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

  // 运作类指标状态统计
  fetchOptIdxStateStat = () => {
    FetchQueryOptIdxStateStat({
      chartCode: "settlementstatestat",
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
      screenPage: 2,
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
    const { datas = [], moduleCharts = [], indexConfig = [], optIdxStateStat = [], errOrImpRpt = [] } = this.state;
    const { dispatch } = this.props;

    return (
      <div className="flex1 flex-r cont-wrap">
        <div className=" wid66 flex-c cont-left">
          <LegendGroup optIdxStateStat={optIdxStateStat} />
          <FundManage datas={datas} />
        </div>
        <div className="wid34 flex-c">
          <div className="h50 pd10">
            {<ModuleChart
              records={moduleCharts[0]}
              indexConfig={indexConfig}
              tClass='title-r'
              dispatch={dispatch}
            />}
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
}))(FundSettlement);
