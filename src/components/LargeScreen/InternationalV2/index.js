import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import TopBlock from './TopBlock';
import MiddleBlock from './MiddleBlock';
import LeftBlock from './LeftBlock';
import RightBlock from './RightBlock';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
    FetchQueryOptIdxStateStat,
    FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';

class International extends React.Component {
    state = {
        datas: [],
        errOrImpRpt: [],
        indIntqueryStatestat: [],
        moduleCharts: [],
        indexConfig: [],
        timer: '',
        sfjyr: '1',
    };
    componentWillMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage') ? localStorage.getItem('refreshWebPage') : "20";
        this.state.timer = setInterval(() => {
            //定时刷新
            // const loginStatus = localStorage.getItem('loginStatus');
            // if (loginStatus !== '1') {
            //     this.props.dispatch({
            //         type: 'global/logout',
            //     });
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
    fetchAllInterface = async() => {
        await this.fetchChartConfigData();
        this.fetchIndexConfigData();
        this.fetchData();
        this.fetchOptIdxStateStat();
        this.fetchErrOrImpRpt();
        this.fetchSpecialData();
        this.fetchmonitorData();
        this.fetchAbnReport();
        // this.fetchQueryJyrHk();
    }

    // 是否香港交易日
    // fetchQueryJyrHk = () => {
    //     FetchQueryJyrHk({
    //     })
    //         .then((ret = {}) => {
    //             const { code = 0, records = [] } = ret;
    //             if (code > 0) {
    //                 this.setState({
    //                     sfjyr: records[0]&&records[0].sfjyr? records[0].sfjyr:'1'
    //                 });
    //             }
    //         })
    //         .catch(error => {
    //             message.error(!error.success ? error.message : error.note);
    //         });
    // };

    // 图表配置数据
    fetchChartConfigData = async() => {
        try {
            const res = await FetchQueryModuleChartConfig({
                screenPage: 11,
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
            screenPage: 11,
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

    //指标状态
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "InterqueryTaskState"
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

    //异常业务说明
    fetchAbnReport = () => {
        FetchQueryChartIndexData({
            chartCode: "InterAbnReport"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ InterAbnReport: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //特殊运营业务指标状态
    fetchSpecialData = () => {
        FetchQueryChartIndexData({
            chartCode: "InterquerySobus"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ specialDatas: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

    };

    //数据监控
    fetchmonitorData = () => {
        FetchQueryChartIndexData({
            chartCode: "InterqueryDatamon"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ monitorDatas: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

    };

    // 指标状态统计
    fetchOptIdxStateStat = () => {
        FetchQueryChartIndexData({
            chartCode: "InterqueryStatestat",
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ InterqueryStatestat: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //重大事项查询
    fetchErrOrImpRpt = () => {
        FetchQueryErrOrImpRpt({
            screenPage: 11,
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
            if (Object.keys(item) && item.indexCode) {
                item.indexCode = item.indexCode.toUpperCase();
            }
            if (tmpl[item.chartCode]) {
                tmpl[item.chartCode].push(item);
            }
        });
        this.setState({ indexConfig: tmpl });
    };
    render() {
        const { datas = [], moduleCharts = [], indexConfig = [], InterqueryStatestat = [], errOrImpRpt = [], specialDatas = [], monitorDatas = [], InterAbnReport = [] } = this.state;
        const { dispatch } = this.props;
        return (
            <div className="flex-c cont-wrap-sub" style={{ color: "#C6E2FF" }}>
                <div style={{height:'97rem'}}>
                    <TopBlock dispatch={dispatch} moduleCharts={moduleCharts} InterqueryStatestat={InterqueryStatestat} datas={datas} indexConfig={indexConfig} monitorDatas={monitorDatas} chartConfig={moduleCharts[10]} />
                    <MiddleBlock dispatch={dispatch} moduleCharts={moduleCharts} InterqueryStatestat={InterqueryStatestat} specialDatas={specialDatas} indexConfig={indexConfig} errOrImpRpt={errOrImpRpt} InterAbnReport={InterAbnReport} />
                </div>
                <div className="flex-r" style={{height:'66rem'}}>
                    <LeftBlock dispatch={dispatch} moduleCharts={moduleCharts} indexConfig={indexConfig} />
                    <RightBlock dispatch={dispatch} moduleCharts={moduleCharts} indexConfig={indexConfig} />
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(International);
