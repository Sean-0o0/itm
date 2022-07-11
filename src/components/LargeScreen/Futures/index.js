import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ModuleChart from '../ClearingPlace/ModuleChart';
import AccountMonitor from './AccountMonitor';
import HaveClearing from './HaveClearing';
import EventReport from '../ClearingPlace/EventReport';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
    // FetchQueryChartDWData,
    // FetchQueryAccountProperty
} from '../../../services/largescreen';

class Futures extends React.Component {
    state = {
        accountMonitoring: [],//账户监控
        settleCompletion: [],//结算完成时间
        moduleCharts: [],
        indexConfig: [],
        errOrImpRpt: [], //重大事项查询
        timer: '',
        // nonstandardCnt: [], //未规范客户数量
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
        this.fetchErrOrImpRpt();
        this.fetchData();
        // this.fetchDW();
    }

    //数据查询
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "AccountMonitoring"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ accountMonitoring: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

        FetchQueryChartIndexData({
            chartCode: "Settlecompletion"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ settleCompletion: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

        // FetchQueryAccountProperty({
        //     chartCode: ""
        // })
        //     .then((ret = {}) => {
        //         const { code = 0, data = [] } = ret;
        //         if (code > 0) {
        //             this.setState({ nonstandardCnt: data });
        //         }
        //     })
        //     .catch(error => {
        //         message.error(!error.success ? error.message : error.note);
        //     });
    };

    // 未规范客户数量
    // fetchDW = () => {
    //     FetchQueryChartDWData({
    //         chartCode: "AccountMonitoring"
    //     })
    //         .then((ret = {}) => {
    //             const { code = 0, data = [] } = ret;
    //             if (code > 0) {
    //                 this.setState({
    //                     nonstandardCnt: data
    //                 })
    //             }
    //         })
    //         .catch(error => {
    //             message.error(!error.success ? error.message : error.note);
    //         });
    // };

    // 图表配置数据
    fetchChartConfigData = () => {
        FetchQueryModuleChartConfig({
            screenPage: 9,
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
            screenPage: 9,
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

    //重大事项查询
    fetchErrOrImpRpt = () => {
        FetchQueryErrOrImpRpt({
            screenPage: 9,
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
            const { displayOrder } = item;
            const orderNum = Number.parseInt(displayOrder);
            tmpl[orderNum - 1].push(item);
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
        const { settleCompletion = [], accountMonitoring = [], moduleCharts = [], indexConfig = [], errOrImpRpt = [] } = this.state;
        const { dispatch } = this.props;

        return (
            <div className="flex1 flex-r cont-wrap">
                <div className="wid33 flex-c cont-left">
                    <div className="flex1 pd10">
                        {<ModuleChart
                            records={moduleCharts[0]}
                            indexConfig={indexConfig}
                            tClass='title-l'
                            dispatch={dispatch}
                        />}
                    </div>
                    <div className="flex1 pd10">
                        <AccountMonitor accountMonitoring={accountMonitoring} settleCompletion={settleCompletion} chartConfig={moduleCharts[1]} />
                    </div>
                </div>
                <div className="wid34 pd10">
                    <HaveClearing settleCompletion={settleCompletion} chartConfig={moduleCharts[2]} />
                </div>
                <div className="wid33 flex-c">
                    <div className="h50 pd10">
                        {<ModuleChart
                            records={moduleCharts[3]}
                            indexConfig={indexConfig}
                            tClass='title-l'
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
}))(Futures);
