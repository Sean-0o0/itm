import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import LegendGroup from '../ClearingPlace/LegendGroup';
import ModuleChart from '../ClearingPlace/ModuleChart';
import EventReport from '../ClearingPlace/EventReport';
import ClearingBusiness from './ClearingBusiness';
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
    fetchChartConfigData = () => {
        FetchQueryModuleChartConfig({
            screenPage: 11,
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
            chartCode: "IndIntqueryTaskState"
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

    // 指标状态统计
    fetchOptIdxStateStat = () => {
        FetchQueryOptIdxStateStat({
            chartCode: "IndIntqueryStatestat",
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.setState({ indIntqueryStatestat: records });
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
        const { sfjyr='1', datas = [], moduleCharts = [], indexConfig = [], indIntqueryStatestat = [], errOrImpRpt = [] } = this.state;
        // console.log(indIntqueryStatestat)
        const { dispatch } = this.props;
        
        return (
            <div className="flex1 flex-r cont-wrap">
                <div className="wid66 flex-c cont-left">
                    <div className="h50 flex-c" >
                        <LegendGroup optIdxStateStat={indIntqueryStatestat} />
                        <ClearingBusiness taskState={datas} sfjyr={sfjyr}/>
                    </div>
                    <div className="h50 flex-r">
                        <div className="flex1 pd10">
                            {<ModuleChart
                                records={moduleCharts[0]}
                                indexConfig={indexConfig}
                                tClass='title-l'
                                dispatch={dispatch}
                            />}
                        </div>
                        <div className="flex1 pd10">
                            {<ModuleChart
                                records={moduleCharts[1]}
                                indexConfig={indexConfig}
                                tClass='title-l'
                                dispatch={dispatch}
                            />}
                        </div>
                    </div>
                </div>
                <div className="wid34 flex-c">
                    <div className="h50 pd10">
                        {<ModuleChart
                            records={moduleCharts[2]}
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
}))(International);