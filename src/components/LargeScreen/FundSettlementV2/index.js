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
  FetchGetRiskIndexTaskMon
} from '../../../services/largescreen';

class FundSettlement extends React.Component {
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
    this.fetchData();
    this.fetchOptIdxStateStat();
    this.fetchErrOrImpRpt();
    this.fetchImplFundData();
    this.fetchZDInstrtData();
    this.fetchOverviewData();
    this.fetchBankDepositData();
    this.fetchProvData();
    this.fetchGetRiskIndexTaskMon();
  }

  fetchGetRiskIndexTaskMon = () => {
    FetchGetRiskIndexTaskMon({
    })
      .then((ret = {}) => {
        const { code = -1, result = '[]' } = ret;
        if (code > 0) {
          const record = JSON.parse(result);
          this.setState({
            riskIndex: record
          })
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 图表配置数据
  fetchChartConfigData = async () => {
    try {
      const res = await FetchQueryModuleChartConfig({
        screenPage: 2,
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

  //资金划付执行情况
  fetchImplFundData = () => {
    FetchQueryChartIndexData({
      chartCode: "FundSettlm_ImplFundTrans"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ ImplFundData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //中登指令执行
  fetchZDInstrtData = () => {
    FetchQueryChartIndexData({
      chartCode: "FundSettlm_ZDInstrtExec"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ zdInstrtData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //交收总览
  fetchOverviewData = () => {
    FetchQueryChartIndexData({
      chartCode: "fundSettlm_OverviewSettlm"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ overviewData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //资金交收执行情况
  fetchData = () => {
    FetchQueryChartIndexData({
      chartCode: "fundSettlm_ExecSettlement"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ fundSettlmData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //银行存放比
  fetchBankDepositData = () => {
    FetchQueryChartIndexData({
      chartCode: "fundSettlm_BankDepositRatio"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ BankDepositData: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  //备付金尚未交付
  fetchProvData = () => {
    FetchQueryChartIndexData({
      chartCode: "fundSettlm_ProvNotYetDelivered"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ ProvData: data });
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
    const { riskIndex = [], datas = [], moduleCharts = [], indexConfig = [], errOrImpRpt = [], zdInstrtData = [], overviewData = [], fundSettlmData = [], BankDepositData = [], ProvData = [], ImplFundData = [] } = this.state;
    const { dispatch } = this.props;

    return (
      <div className="flex1 flex-r cont-wrap FundSettlement" style={{ color: "#C6E2FF" }}>
        <div className=" wid25 flex-c">
          <LeftBlock ImplFundData={ImplFundData} zdInstrtData={zdInstrtData} />
        </div>
        <div className="wid50 flex-c">
          <MiddleBlock overviewData={overviewData} fundSettlmData={fundSettlmData} BankDepositData={BankDepositData} />
        </div>
        <div className="wid25 flex-c">
          <RightBlock ProvData={ProvData} errOrImpRpt={errOrImpRpt} riskIndex={riskIndex} />
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(FundSettlement);
