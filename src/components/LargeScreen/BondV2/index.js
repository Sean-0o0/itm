import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import LeftBlock from './LeftBlock';
import MiddleBlock from './Middleblock';
import RightBlock from './RightBlock'
import {
  FetchQueryModuleChartConfig,
  FetchQueryChartIndexConfig,
  FetchQueryChartIndexData,
  FetchQueryOptIdxStateStat,
  FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';

class Bond extends React.Component {
  state = {
    datas: [],
    optIdxStateStat: [],
    errOrImpRpt: [],
    riskIndex: [],
    timer: '',
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
    await this.fetchChartConfigData();
    this.fetchIndexConfigData();
    this.fetchDebtSettleData();
    this.fetchClearSettleData();
    this.fetchFundTransferData();
    this.fetchDataProcessData();
    this.fetchRiskAlertData();
    this.fetchData();
    this.fetchOptIdxStateStat();
    this.fetchErrOrImpRpt();
  }

  // 图表配置数据
  fetchChartConfigData = async () => {
    try {
      const res = await FetchQueryModuleChartConfig({
        screenPage: 4,
      })
      const { records = [], code = 0 } = res;
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
      screenPage: 4,
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

  //中债登结算业务
  fetchDebtSettleData = () => {
    FetchQueryChartIndexData({
      chartCode: "BankBusCDC"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ zdzData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //上清所结算业务
  fetchClearSettleData = () => {
    FetchQueryChartIndexData({
      chartCode: "BankBusSHC"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ sqsData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //资金划拨业务
  fetchFundTransferData = () => {
    FetchQueryChartIndexData({
      chartCode: "BankBusFUT"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ zjhbData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //数据报表
  fetchData = () => {
    FetchQueryChartIndexData({
      chartCode: "BankBusBSnJE"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ sjbbData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //结算进度
  fetchDataProcessData = () => {
    FetchQueryChartIndexData({
      chartCode: "BankBusJSJDZB"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ jsjdData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

    //风险提示
    fetchRiskAlertData = () => {
      FetchQueryChartIndexData({
        chartCode: "BankRiskAlert"
      })
        .then((ret = {}) => {
          const { code = 0, data = [] } = ret;
          if (code > 0) {
            this.setState({ fxtsData: data });
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
      screenPage: 4,
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
    const { fxtsData = [], errOrImpRpt = [], sqsData = [], jsjdData = [], sjbbData = [], zjhbData = [], zdzData = [], indexConfig = [], moduleCharts = [] } = this.state;
    return (
      <div className="flex1 flex-r cont-wrap Bond" style={{ color: "#C6E2FF" }}>
        <div className=" wid30 flex-c">
          <LeftBlock zdzData={zdzData} sqsData={sqsData} jsjdData={jsjdData}/>
        </div>
        <div className="wid40 flex-c">
          <MiddleBlock jsjdData={jsjdData} sjbbData={sjbbData} indexConfig={indexConfig} moduleCharts={moduleCharts} />
        </div>
        <div className="wid30 flex-c">
          <RightBlock zjhbData={zjhbData} errOrImpRpt={errOrImpRpt} fxtsData={fxtsData} jsjdData={jsjdData}/>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(Bond);
