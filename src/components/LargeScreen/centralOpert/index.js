import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ChartBox from './ChartBox';
import EventReport from '../ClearingPlace/EventReport';
import BuzinessStateV2 from './BuzinessStateV2';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
    FetchQueryChartESBData,
} from '../../../services/largescreen';
import TOP5BusinessAuditCentralTime from './TOP5BusinessAuditCentralTime';

class CentralOpert extends React.Component {
    state = {
        moduleCharts: {},//指标状态说明
        top10BusVolDis: [],//TOP10业务量
        top10ToDoBusVolDis: [],
        top10BusVolDIsCom: [],
        top10BacklogNumber: [],
        top5Per: [],
        top5Org: [],
        perBusVol: [],
        monBusVol: [],
        cenOpr: [],//业务情况数据
        errOrImpRpt: [], //重大事项
        xAxisData: [], //x轴数据
        perBusVolXAxisData: [],
        monBusVolXAxisData: [],
        monBusVolFqqdArr: [],
        perBusVolFqqdArr: [],
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
        },  Number.parseInt(refreshWebPage, 10)* 1000);
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
        this.fetchErrOrImpRpt();
        this.fetchESBData();
        this.fetchData();
    }

    // 图表配置数据
    fetchChartConfigData = async () => {
        try {
            const res = await FetchQueryModuleChartConfig({
                screenPage: 3,
            })
            const { records = [], code = 0, note = '' } = res;
            if (code > 0) {
                this.handleChartConfigData(records);
            }
        } catch (error) {
            message.error(!error.success ? error.message : error.note)
        }
    };

    //数据查询
    fetchData = () => {
        FetchQueryChartIndexData({
            chartCode: "CenOpr"
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ cenOpr: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

    };

    //重大事项查询
    fetchErrOrImpRpt = () => {
        FetchQueryErrOrImpRpt({
            screenPage: 3,
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

    fetchESBData = () => {
        //TOP10业务量展示
        FetchQueryChartESBData({
            chartCode: "TOP10BusVolDis"
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.handleTop10BusVolDis(records)
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
        //TOP10待办业务量展示（按业务分类）
        FetchQueryChartESBData({
            chartCode: "TOP10ToDoBusVolDis"
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.handleTop10ToDoBusVolDis(records)
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
        //TOP10待办业务量（按分公司）
        FetchQueryChartESBData({
            chartCode: "TOP10BacklogNumber"
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.handleTOP10BacklogNumber(records)
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
        //TOP10业务量（按分公司）
        // FetchQueryChartESBData({
        //     chartCode: "TOP10BusVolDIsCom"
        // })
        //     .then((ret = {}) => {
        //         const { code = 0, records = [] } = ret;
        //         if (code > 0) {
        //             this.handleTop10BusVolDIsCom(records)
        //         }
        //     })
        //     .catch(error => {
        //         message.error(!error.success ? error.message : error.note);
        //     });
        //时段业务量
        FetchQueryChartESBData({
            chartCode: "PerBusVol"
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.handlePerBusVol(records);
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
        //月度业务量
        FetchQueryChartESBData({
            chartCode: "MonBusVol"
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.handleMonBusVol(records);
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
        //top5个人耗时
        FetchQueryChartESBData({
            chartCode: "TOP5PerBusExamTime"
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.handleTop5Per(records);
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
        //top5机构耗时
        FetchQueryChartESBData({
            chartCode: "TOP5OrgBusExamTime"
        })
            .then((ret = {}) => {
                const { code = 0, records = [] } = ret;
                if (code > 0) {
                    this.handleTop5Org(records);
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });

    };

    handleTOP10BacklogNumber = records => {
        const xAxisData = records.map(m => m.fgsmc ? m.fgsmc.slice(0, m.fgsmc.length - 3) : '');
        const top10BusVolDIsCom = records.map(m => m.ywsl || 0);
        this.setState({
            top10BacklogNumber: top10BusVolDIsCom,
            xAxisData: xAxisData
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

    handleTop10BusVolDis = records => {
        const item = records.map(m => m.ywdm || '');
        const busiTotal = records.map(m => m.zywbs || '');
        const top10BusVolDis = [];
        for (let i = 0; i < item.length; i++) {
            if (busiTotal[i] > 0) {
                let tmpl = {
                    name: item[i],
                    value: busiTotal[i]
                };
                top10BusVolDis.push(tmpl);
            }
        }
        this.setState({
            top10BusVolDis: top10BusVolDis,
        });
    };

    handleTop10ToDoBusVolDis = records => {
        const item = records.map(m => m.ywmc || '');
        const busiTotal = records.map(m => m.ywsl || '');
        const top10ToDoBusVolDis = [];
        for (let i = 0; i < item.length; i++) {
            let tmpl = {
                name: item[i],
                value: busiTotal[i]
            };
            top10ToDoBusVolDis.push(tmpl);
        }
        this.setState({
            top10ToDoBusVolDis: top10ToDoBusVolDis,
        });
    };

    // handleTop10BusVolDIsCom = records => {
    //     const xAxisData = records.map(m => m.fgsmc ? m.fgsmc.slice(0, m.fgsmc.length - 3) : '');
    //     const top10BusVolDIsCom = records.map(m => m.zywbs || 0);
    //     this.setState({
    //         top10BusVolDIsCom: top10BusVolDIsCom,
    //         xAxisData: xAxisData
    //     });
    // };

    handlePerBusVol = records => {
        const sdArr = records.map(m => m ? (m.sd + ':00') : '');//日期
        const fqqdArr = records.map(m => m ? m.fqqd : '');//渠道
        const tmpl = {};
        fqqdArr.forEach(item => {
            tmpl[item] = [];
        });
        let newRqArr = [];//x轴数据
        for (let i = 0; i < sdArr.length; i++) {
            if (newRqArr.indexOf(sdArr[i]) === -1) {
                newRqArr.push(sdArr[i]);
            }
        }
        let newFqqdArr = [];//渠道分组
        for (let i = 0; i < fqqdArr.length; i++) {
            if (newFqqdArr.indexOf(fqqdArr[i]) === -1) {
                newFqqdArr.push(fqqdArr[i]);
            }
        }
        records.forEach(item => {
            newFqqdArr.forEach(m => {
                if (item.fqqd === m) {
                    tmpl[m].push(item);
                }
            })
        })
        // console.log(tmpl)
        this.setState({
            perBusVol: tmpl,
            perBusVolXAxisData: newRqArr,
            perBusVolFqqdArr: newFqqdArr
        });
    };
    getDateFomatter = (data) => {
        let fomatter = data.slice(4, data.length);
        fomatter = `${fomatter.slice(0, 2)}-${fomatter.slice(2)}`;
        return fomatter;
    }
    handleMonBusVol = records => {
        const rqArr = records.map(m => m ? this.getDateFomatter(m.rq) : '');//日期
        const fqqdArr = records.map(m => m ? m.fqqd : '');//渠道
        const tmpl = {};
        fqqdArr.forEach(item => {
            tmpl[item] = [];
        });
        let newRqArr = [];//x轴数据
        for (let i = 0; i < rqArr.length; i++) {
            if (newRqArr.indexOf(rqArr[i]) === -1) {
                newRqArr.push(rqArr[i]);
            }
        }
        let newFqqdArr = [];//渠道分组
        for (let i = 0; i < fqqdArr.length; i++) {
            if (newFqqdArr.indexOf(fqqdArr[i]) === -1) {
                newFqqdArr.push(fqqdArr[i]);
            }
        }
        records.forEach(item => {
            newFqqdArr.forEach(m => {
                if (item.fqqd === m) {
                    tmpl[m].push(item);
                }
            })
        })
        this.setState({
            monBusVol: tmpl,
            monBusVolXAxisData: newRqArr,
            monBusVolFqqdArr: newFqqdArr
        });
    };
    handleTop5Per = records => {
        const ywmc = records.map(m => m.ywmc || '');
        const pjbllcsc = records.map(m => m.pjbllcsc || '');
        const top5Per = [];
        for (let i = 0; i < ywmc.length && i < 5; i++) {
            if (pjbllcsc[i] >= 0) {
                let tmpl = {
                    ywmc: `${(i + 1) + '.' + ywmc[i]}`,
                    pjbllcsc: pjbllcsc[i]
                };
                top5Per.push(tmpl);
            }
        }
        this.setState({
            top5Per: top5Per,
        });
    };
    handleTop5Org = records => {
        const ywmc = records.map(m => m.ywmc || '');
        const pjbllcsc = records.map(m => m.pjbllcsc || '');
        const top5Org = [];
        for (let i = 0; i < ywmc.length && i < 5; i++) {
            if (pjbllcsc[i] >= 0) {
                let tmpl = {
                    ywmc: `${(i + 1) + '.' + ywmc[i]}`,
                    pjbllcsc: pjbllcsc[i]
                };
                top5Org.push(tmpl);
            }
        }
        this.setState({
            top5Org: top5Org,
        });
    };

    render() {
        const { moduleCharts = [],
            cenOpr = [],
            xAxisData = [],
            monBusVolXAxisData = [],
            perBusVolXAxisData = [],
            top10BusVolDis = [],
            top10ToDoBusVolDis = [],
            top10BusVolDIsCom = [],
            top10BacklogNumber = [],
            top5Per = [],
            top5Org = [],
            perBusVol = {},
            monBusVol = {},
            monBusVolFqqdArr = [],
            perBusVolFqqdArr = [],
            errOrImpRpt = [] } = this.state;
        return (
            <div className="flex1 flex-r cont-wrap">
                <div className="wid33 flex-c cont-left">
                    <div className="h33 pd10">
                        <ChartBox
                            data={top10BusVolDis}
                            tClass='title-l'
                            title='TOP10业务量展示'
                            chartType='1'
                            chartConfig={moduleCharts[0]} />
                    </div>
                    <div className="h34 pd10">
                        <ChartBox
                            data={top10ToDoBusVolDis}
                            tClass='title-l'
                            title='TOP10待办业务量展示（按业务分类）'
                            chartType='1'
                            chartConfig={moduleCharts[1]} />
                    </div>
                    <div className="h33 pd10">
                        <ChartBox
                            data={top10BacklogNumber}
                            // data={top10BusVolDIsCom}
                            xAxisData={xAxisData}
                            tClass='title-l'
                            title='TOP10待办业务量（按分公司）'
                            chartType='2'
                            chartConfig={moduleCharts[2]} />
                    </div>
                </div>
                <div className="wid34">
                    <div className="h67 pd10">
                        <BuzinessStateV2 cenOpr={cenOpr} chartConfig={moduleCharts[3]} />
                    </div>
                    <div className="h33 pd10">
                        <TOP5BusinessAuditCentralTime
                            top5Per={top5Per}
                            top5Org={top5Org}
                            xAxisData={perBusVolXAxisData}
                            tClass='title-c'
                            title='TOP5业务审核中心耗时'
                            chartType='3'
                            fqqdArr={perBusVolFqqdArr}
                            chartConfig={moduleCharts[4]}
                        />
                    </div>
                </div>
                <div className="wid33 flex-c">
                    <div className="h33 pd10">
                        <ChartBox
                            data={perBusVol}
                            xAxisData={perBusVolXAxisData}
                            tClass='title-r'
                            title='时段业务量'
                            chartType='3'
                            fqqdArr={perBusVolFqqdArr}
                            chartConfig={moduleCharts[5]} />
                    </div>
                    <div className="h34 pd10">
                        <ChartBox
                            data={monBusVol}
                            xAxisData={monBusVolXAxisData}
                            tClass='title-r'
                            title='月度业务量'
                            chartType='3'
                            fqqdArr={monBusVolFqqdArr}
                            chartConfig={moduleCharts[6]} />
                    </div>
                    <div className="h33 pd10">
                        <EventReport errOrImpRpt={errOrImpRpt} height='19rem' />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(CentralOpert);
