import React from 'react';
import { connect } from 'dva';
import {
  FetchQueryChartIndexConfig,
  FetchQueryModuleChartConfig,
} from '../../../services/largescreen';
import { message, Tooltip } from 'antd';
import OverallView from './CenterPage/OverallView';
import UseFee from './CenterPage/UseFee';
import ReturnDep from './LeftPage/ReturnDep';
import NoTitleStyleModuleChart from '../ClearingPlace/ModuleChart/NoTitleStyleModuleChart';
import RiskNote from './RightPage/RiskNote';
import ProcessImpl from './RightPage/ProcessImpl';
import AttributiveClassify from './LeftPage/AttributiveClassify';
class BusinessUnit extends React.Component {
  state = {
    indexConfig: [],
    moduleCharts: [{
      chartCode:"FutursBrokerageTrd",
      chartTitle:"",
      chartNote:"",
      screenPage: 9,
      chartType: 2,
      refreshTime:"",
      leftVerticalUnit:"",
      leftUnitPlace: 1,
      rightVerticalUnit: "",
      rightUnitPlace:"2",
      horizontalUnit:"",
      displayOrder:"8",
      secondaryDisplayOrder:"",
      zjgxrq:"20210807",
      status:""}]
  };

  componentDidMount() {
    this.fetchAllInterface();
  }

  // 查询所有接口
  fetchAllInterface = async () => {
    await this.fetchChartConfigData();
    this.fetchIndexConfigData();
  }


  handleChartConfigData = records => {
    const tmpl = [];
    for (let i = 1; i <= records.length; i++) {
      tmpl.push([]);
    }
    records.forEach(item => {
      const { displayOrder } = item;
      const orderNum = Number.parseInt(displayOrder);
      tmpl[orderNum - 1].push(item);
    });
    this.setState({ moduleCharts: tmpl });
  };

  // 图表配置数据
  fetchChartConfigData = async () => {
    try {
      const res = await FetchQueryModuleChartConfig({
        screenPage: 16,
      });
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
      screenPage: 16,
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

  handleIndexConfigData = records => {
    const codeArr = records.map(m => m.chartCode);
    const tmpl = {};
    codeArr.forEach(item => {
      tmpl[item] = [];
    });
    records.forEach(item => {
      if (Object.keys(item).length && item.indexCode) {
        item.indexCode = item.indexCode.toUpperCase();
      }
      if (tmpl[item.chartCode]) {
        tmpl[item.chartCode].push(item);
      }
    });
    this.setState({ indexConfig: tmpl });
  };

  render() {
    const { moduleCharts = [], indexConfig = [] } = this.state;
    const { dispatch } = this.props;
    return (
      <div className="flex1 flex-r cont-wrap" style={{height: 'calc(100% - 5rem)' }}>
        <div className="wid33 h100 flex-c cont-left">
          <AttributiveClassify chartConfig={moduleCharts[0]}/>

          <ReturnDep chartConfig={moduleCharts[1]}/>
        </div>
        <div className="wid34">
          <OverallView chartConfig={moduleCharts[2]} />
          <UseFee chartConfig={moduleCharts[3]} />
        </div>
        <div className="wid33 flex-c">
          <div className="h50 pd10">
            <div className="ax-card flex-c flex1">
              <div className="card-title title-r">佣金/成本交易监控</div>
              <NoTitleStyleModuleChart
                businessUnit={true}
                records={moduleCharts[4]}
                indexConfig={indexConfig}
                tClass='title-c-nomage'
                dispatch={dispatch}
              />
            </div>
          </div>

          <ProcessImpl chartConfig={moduleCharts[5]}/>

          <RiskNote chartConfig={moduleCharts[6]} />

        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(BusinessUnit);
