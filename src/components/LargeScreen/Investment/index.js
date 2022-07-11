import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ModulesChart from '../Investment/ModulesChart';
import EventReport from '../ClearingPlace/EventReport';
import RiskIndex from '../Capital/RiskIndex';
import DescTable from './DescTable';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';

class Investment extends React.Component {
    state = {
        datas: [],
        errOrImpRpt: [],
        moduleCharts: [],
        indexConfig: [],
        indIvOutProject: [],
        indIv: [],
        timer: '',
    };
    componentWillMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage');
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
        this.fetchData();
        this.fetchIndexConfigData();
        this.fetchErrOrImpRpt();
    }

    // 图表配置数据
    fetchChartConfigData = async() => {
        try {
            const res = await FetchQueryModuleChartConfig({
                screenPage: 8,
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
            screenPage: 8,
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
            screenPage: 8,
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
            chartCode: "IndIvRiskInd"
        })
            .then((ret = {}) => {
                const { code = 0, data = []} = ret;
                if (code > 0) {
                    this.setState({
                        datas: data,
                    });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

        FetchQueryChartIndexData({
            chartCode: "IndIvOutProject"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({
                        indIvOutProject: data,
                    });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

        FetchQueryChartIndexData({
            chartCode: "IndIv"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({
                        indIv: data,
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
        const {indIv = [], datas = [], moduleCharts = [], indexConfig = [], errOrImpRpt = [], indIvOutProject = [] } = this.state;
        const { dispatch } = this.props;

        return (
            <div className="flex1 flex-r cont-wrap">
                <div className="wid33 flex-c cont-left">
                    <div className="h66 pd10">
                        {<ModulesChart
                            records={moduleCharts[0]}
                            indexConfig={indexConfig}
                            indIv={indIv}
                            tClass='title-l'
                            dispatch={dispatch}
                        />}
                    </div>
                    <div className="h34 pd10">
                        <RiskIndex indIv={indIv} riskEvent={datas} tClass='title-l' chartConfig={moduleCharts[1]} />
                    </div>
                </div>
                <div className="wid34 flex-c">
                    <div className="h66 pd10">
                        {<ModulesChart
                            records={moduleCharts[2]}
                            indexConfig={indexConfig}
                            indIv={indIv}
                            tClass='title-l'
                            dispatch={dispatch}
                        />}
                    </div>
                    <div className="h34 pd10">
                        <DescTable indIvOutProject={indIvOutProject} chartConfig={moduleCharts[3]} />
                    </div>
                </div>
                <div className="wid33 flex-c">
                    <div className="h66 pd10">
                        {<ModulesChart
                            records={moduleCharts[4]}
                            indexConfig={indexConfig}
                            indIv={indIv}
                            tClass='title-l'
                            dispatch={dispatch}
                        />}
                    </div>
                    <div className="h34 pd10">
                        <EventReport errOrImpRpt={errOrImpRpt}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(Investment);
