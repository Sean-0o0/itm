import React from 'react';
import { message } from 'antd';
import Chart from './Chart';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryCallInfo,
    FetchQueryChartIndexData,
    FetchQueryWK
} from '../../../../../services/largescreen';

class CallCenter extends React.Component {
    state = {
        moduleCharts: {},
        titleCharts: {},
        indexConfig: {},
        callCen: [],
        callIn: ''
    };

    componentDidMount() {
        const refreshWebPage = localStorage.getItem('refreshWebPage');
        this.fetchAllInterface();
        this.fetchInterval = setInterval(() => {
            const loginStatus = localStorage.getItem('loginStatus');
            if (loginStatus !== '1') {
                this.props.dispatch({
                    type: 'global/logout',
                });
            }
            this.fetchAllInterface();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
    }

    componentWillUnmount() {
        if (this.fetchInterval) {
            clearInterval(this.fetchInterval);
        }
    }

    fetchAllInterface = () => {
        this.fetchChartConfigData();
        this.fetchIndexConfigData();
        this.fetchData();
        this.fetchQueryWK();
    }

    fetchQueryWK = () => {
        //网开视频一级分公司等待客户数TOP10
        FetchQueryWK({
            chartCode: "Top10NetDevVid",
        })
            .then((ret = {}) => {
                const { code = 0, resultList = [] } = ret;
                if (code > 0) {
                    const top10CusWait = resultList.map(m => m.wait_review || 0);
                    let netDevVid = 0;
                    top10CusWait.forEach(item => {
                        netDevVid += Number.parseInt(item);
                    })
                    this.setState({
                        netDevVid: netDevVid
                    })
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    }

    //待办业务数数据查询
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

    // 图表配置数据
    fetchChartConfigData = () => {
        FetchQueryModuleChartConfig({
            screenPage: 5,
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
            screenPage: 5,
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.handleIndexConfigData(records);
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    handleChartConfigData = records => {
        records.forEach(item => {
            const { chartCode = "" } = item;
            if (chartCode === "HJProBusPro") {
                this.setState({ moduleCharts: item });
            } else if (chartCode === "ToDoSerPro") {
                this.setState({ titleCharts: item });
            }
        });
    };

    handleIndexConfigData = records => {
        const codeArr = records.map(m => m.chartCode);
        const tmpl = {};
        codeArr.forEach(item => {
            tmpl[item] = [];
        });
        records.forEach(item => {
            const { chartCode = "" } = item;
            if (chartCode === "HJProBusPro") {
                tmpl[item.chartCode].push(item);
            }
        });
        this.setState({ indexConfig: tmpl });
    };

    render() {
        const { netDevVid = 0,callIn = '-', callCen = [], moduleCharts = {}, indexConfig = {}, titleCharts = {} } = this.state;
        const { chartTitle = '--' } = this.props;
        let callCenArr = [];
        for (let i = 0; i < 2; i++) {
            callCenArr.push();
        }
        callCen.forEach(element => {
            const code = element.IDX_CODE;
            switch (code) {
                case 'HJZX007':
                    callCenArr[0] = element;
                    break;
                case 'HJZX003':
                    callCenArr[1] = element;
                    break;
                default:
                    break;
            }
        });

        return (
            <div className="flex-c zb-data-item h100">
                <div className="card-title-sec">{chartTitle}</div>
                <div className="flex1 zjyw-cont tc flex-c">
                    {/* <div className="h10 fs16">{titleCharts.chartTitle ? titleCharts.chartTitle : ''}</div> */}
                    <div className="clearfix h25">
                        <div className="fl wid30 yyyw-item h100">
                            <div className="fs16 lh20 h33">呼入呼叫服务待办</div>
                            <div className="yyyw-num">{callIn}&nbsp;<span className="fs16 fwn">笔</span></div>
                        </div>
                        <div className="fl wid40 yyyw-item h100">
                            <div className="fs16 lh20 h33">{callCenArr[0] && callCenArr[0].IDX_NM ? callCenArr[0].IDX_NM + '待办' : '-'}</div>
                            <div className="yyyw-num">{netDevVid}&nbsp;<span className="fs16 fwn">笔</span></div>
                        </div>
                        <div className="fl wid30 yyyw-item h100">
                            <div className="fs16 lh20 h33">{callCenArr[1] && callCenArr[1].IDX_NM ? callCenArr[1].IDX_NM + '待办': '-'}</div>
                            <div className="yyyw-num">{callCenArr[1] && callCenArr[1].RESULT ? callCenArr[1].RESULT : '-'}&nbsp;<span className="fs16 fwn">笔</span></div>
                        </div>
                    </div>
                    <div className="h8 fs16">{moduleCharts.chartTitle ? moduleCharts.chartTitle : ''}</div>
                    {/* <div style={{ height: "20rem" }}> */}
                    <div style={{ height: "67%" }}>
                        <Chart
                            configData={moduleCharts}
                            indexConfig={indexConfig}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default CallCenter;
