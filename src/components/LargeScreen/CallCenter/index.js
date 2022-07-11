import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ChartBox from '../centralOpert/ChartBox';
import EventReport from '../ClearingPlace/EventReport';
import BuzinessState from './BuzinessState';
// import ModuleChart from '../ClearingPlace/ModuleChart';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
    FetchQueryChartDWData,
    FetchQueryChartIndexConfig,
    FetchQueryCallInfo,
    FetchQueryWK
} from '../../../services/largescreen';

class CallCenter extends React.Component {
    state = {
        indexConfig: {},              //图标指标配置
        moduleCharts: {},              //图标模块配置
        callCen: [],                  //业务情况
        top5CallInCon: [],            //呼入咨询业务top5
        top5CallInConXAxisData: [],
        top10NetDevVid: [],           //网开视频一级分公司等待客户数TOP10
        top10NetDevVidXAxisData: [],
        hjperBusVol: [],              //时段业务量
        hjperBusVolXAxisData: [],
        top5CusSucOnl: [],            //网开成功渠道客户TOP5
        top5CusSucOnlXAxisData: [],
        top10CusWait: [],             //网开复核一级分公司等待客户数TOP10
        top10CusWaitXAxisData: [],
        callIn: "",
        timer: '',
    };

    componentWillMount () {
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

    componentWillUnmount () {
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }
    }

    // 查询所有接口
    fetchAllInterface = async() => {
        await this.fetchChartConfigData();
        this.fetchIndexConfigData();
        this.fetchErrOrImpRpt();
        this.fetchDWData();
        this.fetchData();
        this.fetchQueryWK();
    }

    fetchQueryWK = () => {
        //网开视频一级分公司等待客户数TOP10
        FetchQueryWK({
            chartCode: "Top10NetDevVid",
        })
            .then((ret = {}) => {
                const { code = 0, resultlist = [] } = ret;
                if (code > 0) {
                    this.handleTop10NetDevVid(resultlist);
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

        //网开复核一级分公司等待客户数TOP10
        FetchQueryWK({
            chartCode: "Top10CusWait",
        })
            .then((ret = {}) => {
                const { code = 0, resultList = [] } = ret;
                if (code > 0) {
                    this.handleTop10CusWait(resultList);
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
                screenPage: 5,
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
            screenPage: 5,
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

    //数据查询
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "CallCen"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ callCen: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

        FetchQueryCallInfo({
            chartCode: ""
        })
            .then((ret = {}) => {
                const { code = 0, waitcnt = '' } = ret;
                if (code > 0) {
                    this.setState({ callIn: waitcnt });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //重大事项查询
    fetchErrOrImpRpt = () => {
        FetchQueryErrOrImpRpt({
            screenPage: 5,
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

    fetchDWData = () => {
        //呼入咨询业务top5
        FetchQueryChartDWData({
            chartCode: "Top5CallInCon"
        }).then((ret = {}) => {
            const { code = 0, data = [] } = ret;
            if (code > 0) {
                this.handleTop5CallInCon(data)
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
        //时段业务量
        FetchQueryChartDWData({
            chartCode: "HJPerBusVol"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.handleHjperBusVol(data)
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
        //网开成功渠道客户TOP5
        FetchQueryChartDWData({
            chartCode: "Top5CusSucOnl"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.handleTop5CusSucOnl(data)
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
        let tmpl = {};
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

    handleTop5CallInCon = records => {
        const xAxisData = records.map(m => m.business_name ? m.business_name : '');
        const top5CallInCon = records.map(m => m.business_count || 0);

        this.setState({
            top5CallInCon: top5CallInCon,
            top5CallInConXAxisData: xAxisData
        });
    };

    handleTop10NetDevVid = records => {
        const xAxisData = records.map(m => m.branch_name ? m.branch_name.slice(0, m.branch_name.length - 3) : '');
        const top10NetDevVid = records.map(m => m.wait_video || 0);
        // console.log(records)
        this.setState({
            top10NetDevVid: top10NetDevVid,
            top10NetDevVidXAxisData: xAxisData
        });
    };

    handleHjperBusVol = records => {
        const xAxisData = records.map(m => m.time ? m.time + ':00' : '');
        const hjperBusVol = [];
        const onway_audit = records.map(m => m.oneway_network_period_audit_count || 0);   //单向网开审核
        const vedio = records.map(m => m.vedio_period_deal_count || 0);
        const audit = records.map(m => m.audit_period_deal_count || 0);
        const callOnline = records.map(m => m.call_online_period_deal_count || 0);
        const callIn = records.map(m => m.call_in_period_deal_count || 0);
        const callVisit = records.map(m => m.call_visit_period_deal_count || 0);
        hjperBusVol.push(onway_audit)
        hjperBusVol.push(vedio)
        hjperBusVol.push(audit)
        hjperBusVol.push(callOnline)
        hjperBusVol.push(callIn)
        hjperBusVol.push(callVisit)

        this.setState({
            hjperBusVol: hjperBusVol,
            hjperBusVolXAxisData: xAxisData
        });
    };

    handleTop5CusSucOnl = records => {
        const xAxisData = records.map(m => m.channel_name ? m.channel_name : '');
        const top5CusSucOnl = records.map(m => m.channel_count || 0);
        this.setState({
            top5CusSucOnl: top5CusSucOnl,
            top5CusSucOnlXAxisData: xAxisData
        });
    };

    handleTop10CusWait = records => {
        const xAxisData = records.map(m => m.branch_name ? m.branch_name.slice(0, m.branch_name.length - 3) : '');
        const top10CusWait = records.map(m => m.wait_review || 0);
        this.setState({
            top10CusWait: top10CusWait,
            top10CusWaitXAxisData: xAxisData
        });
    };

    render () {
        const { indexConfig = {},
            moduleCharts = [],
            callCen = [],
            top5CallInCon = [],
            top5CallInConXAxisData = [],
            top10NetDevVid = [],
            top10NetDevVidXAxisData = [],
            hjperBusVol = [],
            hjperBusVolXAxisData = [],
            top5CusSucOnl = [],
            top5CusSucOnlXAxisData = [],
            top10CusWait = [],
            top10CusWaitXAxisData = [],
            errOrImpRpt = [],
            callIn = '',
        } = this.state;
        const { dispatch } = this.props;
        let netDevVid = 0;
        top10NetDevVid.forEach(item => {
            netDevVid += Number.parseInt(item);
        })

        return (
            <div className="flex1 flex-r cont-wrap">
                <div className="wid33 flex-c cont-left">
                    <div className="h33 pd10">
                        <ChartBox
                            data={top5CallInCon}
                            xAxisData={top5CallInConXAxisData}
                            tClass='title-l'
                            title='呼入咨询业务top5'
                            chartType='2'
                            chartConfig={moduleCharts[0]}
                            type='top5' />
                    </div>
                    <div className="h34 pd10">
                        <ChartBox
                            data={top10NetDevVid}
                            xAxisData={top10NetDevVidXAxisData}
                            tClass='title-l'
                            title='网开视频一级分公司等待客户数TOP10'
                            chartType='2'
                            chartConfig={moduleCharts[1]} />
                    </div>
                    <div className="h33 pd10">
                        <ChartBox
                            data={hjperBusVol}
                            xAxisData={hjperBusVolXAxisData}
                            tClass='title-l'
                            title='时段业务量'
                            chartType='4'
                            chartConfig={moduleCharts[2]} />
                    </div>
                </div>
                <div className="wid34">
                    <div className="h100 pd10">
                        <BuzinessState netDevVid={netDevVid} callCen={callCen} chartConfig={moduleCharts} indexConfig={indexConfig} callIn={callIn} dispatch={dispatch} />
                    </div>
                </div>
                <div className="wid33 flex-c">
                    <div className="h33 pd10">
                        <ChartBox
                            data={top5CusSucOnl}
                            xAxisData={top5CusSucOnlXAxisData}
                            tClass='title-r'
                            title='网开成功渠道客户TOP5'
                            chartType='2'
                            chartConfig={moduleCharts[6]}
                            type='top5' />
                    </div>
                    <div className="h34 pd10">
                        <ChartBox
                            data={top10CusWait}
                            xAxisData={top10CusWaitXAxisData}
                            tClass='title-r'
                            title='网开复核一级分公司等待客户数TOP10'
                            chartType='2'
                            chartConfig={moduleCharts[7]} />
                    </div>
                    <div className="h33 pd10">
                        <EventReport errOrImpRpt={errOrImpRpt} />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(CallCenter);
