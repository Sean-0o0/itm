import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ModuleChart from '../ClearingPlace/ModuleChart';
import EventReport from '../ClearingPlace/EventReport';
import RiskIndex from './RiskIndex';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';

class Capital extends React.Component {
    state = {
        notes: '',
        datas: [],
        errOrImpRpt: [],
        moduleCharts: [],
        indexConfig: [],
        timer: '',
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
    fetchAllInterface = async () => {
        await this.fetchChartConfigData();
        this.fetchData();
        this.fetchIndexConfigData();
        this.fetchErrOrImpRpt();
    }

    // 图表配置数据
    fetchChartConfigData = async () => {
        try {
            const res = await FetchQueryModuleChartConfig({
                screenPage: 12,
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
            screenPage: 12,
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
            screenPage: 12,
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

    //风控指标
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "IndCapRiskInd"
        })
            .then((ret = {}) => {
                const { code = 0, data = [], note = '' } = ret;
                if (code > 0) {
                    this.setState({
                        datas: data,
                        notes: note,
                    });
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
        const { notes = '', datas = [], moduleCharts = [], indexConfig = [], errOrImpRpt = [] } = this.state;
        const { dispatch } = this.props;

        return (
            <div className="flex1 flex-r cont-wrap">
                <div className="wid33 flex-c cont-left">
                    <div className="h50 pd10">
                        {<ModuleChart
                            records={moduleCharts[0]}
                            indexConfig={indexConfig}
                            tClass='title-l'
                            dispatch={dispatch}
                        />}
                    </div>
                    <div className="h50 pd10">
                        {<ModuleChart
                            records={moduleCharts[1]}
                            indexConfig={indexConfig}
                            tClass='title-l'
                            dispatch={dispatch}
                        />}
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
                        {<ModuleChart
                            records={moduleCharts[3]}
                            indexConfig={indexConfig}
                            tClass='title-l'
                            dispatch={dispatch}
                        />}
                    </div>
                </div>
                <div className="wid33 flex-c">
                    <div className="h50 pd10">
                        <RiskIndex note={notes} riskEvent={datas} tClass='title-r' chartConfig={moduleCharts[4]} />
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
}))(Capital);

