import React from 'react';
import ModuleChart from './ModuleChart';
import {
  FetchQueryChartDWData,
  FetchQueryModuleChartConfig,
} from '../../../services/largescreen';
import { message } from 'antd';

class Subsidiary extends React.Component {
  state = {
    moduleCharts: [],              //图标模块配置
    top5NetChanSuc: [],               //网开成功渠道TOP5客户
    top5NetChanSucXAxisData: [],
    top10NetTodoBus: [],              //网开业务TOP10待办业务量
    top10NetTodoBusXAxisData: [],
    NetAllCheckBusNum: "",             //网开复核总业务量
    NetDealBusNum: "",                 //网开复核处理数
    NetPassBusNum: "",                 //网开复核通过数
  };

  componentWillMount() {
    const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
    // this.state.timer = setInterval(() => {
    //     //定时刷新
    //     this.fetchAllInterface();
    // }, Number.parseInt(refreshWebPage, 10) * 1000);
    this.fetchChartConfigData();
    this.fetchAllInterface();
  }

  componentWillReceiveProps(nextprops) {
    const { display = [] } = this.props;
    const { display: nextDisplay = [] } = nextprops;
    if (JSON.stringify(display) !== JSON.stringify(nextDisplay)) {
      this.handleChartConfigData(nextDisplay)
    }
  }

  // 查询所有接口
  fetchAllInterface = () => {
    this.fetchDWData();
  }

  // 图表配置数据
  fetchChartConfigData = () => {
    const { display = [] } = this.props;
    FetchQueryModuleChartConfig({
      screenPage: 15,
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        this.setState({
          moduleCharts: records
        }, () => {
          this.handleChartConfigData(display)
        })
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  fetchDWData = () => {
    //网开成功渠道TOP5客户
    FetchQueryChartDWData({
      chartCode: "Top5NetChanSuc"
    }).then((ret = {}) => {
      const { code = 0, data = [] } = ret;
      if (code > 0) {
        this.handleTop5NetChanSuc(data)
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
    //网开业务TOP10待办业务量
    FetchQueryChartDWData({
      chartCode: "Top10NetTodoBus"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.handleTop10NetTodoBus(data)
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
    //网开复核总业务量
    FetchQueryChartDWData({
      chartCode: "NetAllCheckBusNum"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({
            NetAllCheckBusNum: data[0] ? data[0].checkcount : 0,
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
    //网开复核处理数和通过数
    FetchQueryChartDWData({
      chartCode: "NetDealPassBusNum"
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({
            NetDealBusNum: data[0] ? data[0].dealcnt : 0,
            NetPassBusNum: data[0] ? data[0].passcnt : 0
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleChartConfigData = (display = []) => {
    const tmpl = [];
    const { moduleCharts = [] } = this.state;
    display.forEach((item, index) => {
      const chart = item.slice(0, -2);
      for (let i = 0; i < moduleCharts.length; i++) {
        const { chartCode = '' } = moduleCharts[i];
        if (chart === chartCode) {
          tmpl.push(moduleCharts[i]);
          break;
        }
      }
    })
    for (let i = 0; i < moduleCharts.length; i++) {
      const { chartCode = '' } = moduleCharts[i];
      const codes = tmpl.map(item=>item.chartCode||'')
      if(!codes.includes(chartCode)){
        tmpl.push(moduleCharts[i]);
        break;
      }
    }
    this.setState({ moduleCharts: display.length ? tmpl : moduleCharts });
  };

  handleTop5NetChanSuc = records => {
    const xAxisData = records.map(m => m.channelName ? m.channelName : '');
    const count = records.map(m => m.count || 0);
    this.setState({
      top5NetChanSuc: count,
      top5NetChanSucXAxisData: xAxisData
    });
  };

  handleTop10NetTodoBus = records => {
    const xAxisData = records.map(m => m.branchNo ? m.branchNo : '');
    const count = records.map(m => m.count || 0);
    this.setState({
      top10NetTodoBus: count,
      top10NetTodoBusXAxisData: xAxisData
    });
  };

  render() {
    const {
      top5NetChanSuc = [],               //网开成功渠道TOP5客户
      top5NetChanSucXAxisData = [],
      top10NetTodoBus = [],              //网开业务TOP10待办业务量
      top10NetTodoBusXAxisData = [],
      NetAllCheckBusNum = "",             //网开复核总业务量
      NetDealBusNum = "",                 //网开复核处理数
      NetPassBusNum = "",
      moduleCharts = [],
    } = this.state;
    console.log('moduleCharts', moduleCharts)

    return (
      <div className="flex1 flex-c cont-wrap subsidiary">
        <div className="h33 flex-r cont-left">
          <div className="wid33 pd10">
            <ModuleChart tClass="title-l" record={moduleCharts[0] || {}} />
          </div>
          <div className="wid34 pd10">
            <ModuleChart tClass="title-c" record={moduleCharts[1] || {}} />
          </div>
          <div className="wid33 pd10">
            <ModuleChart tClass="title-r" record={moduleCharts[2] || {}} />
          </div>
          {/* <div className="wid34 pd10">
            <ModuleChart tClass="title-c" record={{ chartTitle: "全部业务", chartCode: '2', chartType: '1' }} NetAllCheckBusNum={NetAllCheckBusNum} NetDealBusNum={NetDealBusNum} />
          </div>
          <div className="wid33 pd10">
            <ModuleChart tClass="title-r" record={{ chartTitle: "网开成功渠道TOP5客户", chartCode: '3', chartType: '2' }} top5NetChanSuc={top5NetChanSuc} top5NetChanSucXAxisData={top5NetChanSucXAxisData} />
          </div> */}
        </div>
        <div className="h34 flex-r">
          <div className="wid33 pd10">
            <ModuleChart tClass="title-l" record={moduleCharts[3] || {}} />
          </div>
          <div className="wid34 pd10">
            <ModuleChart tClass="title-c" record={moduleCharts[4] || {}} />
          </div>
          <div className="wid33 pd10">
            <ModuleChart tClass="title-r" record={moduleCharts[5] || {}} />
          </div>
          {/* <div className="wid33 pd10">
            <ModuleChart tClass="title-l" record={{ chartTitle: "集运分公司TOP10待办业务量", chartCode: '4', chartType: '10' }} top10NetTodoBus={top10NetTodoBus} top10NetTodoBusXAxisData={top10NetTodoBusXAxisData} />
          </div>
          <div className="wid34 pd10">
            <ModuleChart tClass="title-c" record={{ chartTitle: "待办业务", chartCode: '5', chartType: '1' }} />
          </div>
          <div className="wid33 pd10">
            <ModuleChart tClass="title-r" record={{ chartTitle: "网开TOP10待办业务量（按营业部）", chartCode: '6', chartType: '2' }} />
          </div> */}
        </div>
        <div className="h33 flex-r">
          <div className="wid33 pd10">
            <ModuleChart tClass="title-l" record={moduleCharts[6] || {}} />
          </div>
          <div className="wid34 pd10">
            <ModuleChart tClass="title-c" record={moduleCharts[7] || {}} />
          </div>
          <div className="wid33 pd10">
            <ModuleChart tClass="title-r" record={moduleCharts[8] || {}} />
          </div>
          {/* <div className="wid33 pd10">
            <ModuleChart tClass="title-l" record={{ chartTitle: "集运TOP10待办业务量（按营业部）", chartCode: '7', chartType: '10' }} />
          </div>
          <div className="wid34 pd10">
            <ModuleChart tClass="title-c" record={{ chartTitle: "时段图", chartCode: '8', chartType: '3' }} />
          </div>
          <div className="wid33 pd10">
            <ModuleChart tClass="title-r" record={{ chartTitle: "数字督办", chartCode: '9', chartType: '1' }} />
          </div> */}
          {/* <div className="wid33 pd10">
            <ModuleChart tClass="title-r" record={{chartTitle:"业务受理时长TOP5", chartCode: '10', chartType: '1'}}/>
          </div> */}
        </div>
      </div>
    );
  }
}

export default Subsidiary;