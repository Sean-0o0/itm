import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import LeftContent from './LeftContent';
import MiddleContent from './MiddleContent';
import RightContent from './RightContent';
import CoreBusIndex from './CoreBusIndex';
import OverviewGroup from './OverviewGroup';
import MetricsIndex from './MetricsIndex';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';
import SaleIndex from './SaleIndex';
import TAIndex from './TAIndex';
//import FootBlock from './FootBlock';


class Fund extends React.Component {
    state = {
        xzjjSettleCompletion: [],//核心运营情况
        moduleCharts: [],
        indexConfig: [],
        qsywData: [], //清算业务
        fazbData: [], //FA指标检测
        tazbData: [], //TA指标检测
        hxzbData: [], //核心指标
        ycbgData: [], //异常或重大事项报告
        sgqrData: [], //异常/手工确认指标表
        zbjkData: [], //兴全详细指标监控
        zbhzData: [], //兴全详细指标汇总统计（总任务)
        timer: '',
        sfjyr: '1',
        datas: [],
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

    // 图表配置数据
    fetchChartConfigData = async () => {
        try {
            const res = await FetchQueryModuleChartConfig({
                screenPage: 7,
            })
            const { records = [], code = 0, note = '' } = res;
            if (code > 0) {
                this.handleChartConfigData(records);
            }
        } catch (error) {
            message.error(!error.success ? error.message : error.note)
        }
    };

    // 查询图标指标配置
    fetchQueryChartIndexData = (chartCode) => {
        FetchQueryChartIndexData({
            chartCode: chartCode,
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    if (chartCode === "XzjjSettleCompletion") {
                        this.setState({ qsywData: data });
                    } else if (chartCode === "FndFAIndexmonitor") {
                        this.setState({ fazbData: data });
                    } else if (chartCode === "FndTAIndexmonitor") {
                        this.setState({ tazbData: data });
                    } else if (chartCode === "FndCoreIndex") {
                        this.setState({ hxzbData: data });
                    }
                    // else if (chartCode === "FndAbnormalityReport"){
                    //     this.setState({ycbgData : data });
                    // }
                    else if (chartCode === "FndmExcptOrManual") {
                        this.setState({ sgqrData: data });
                    } else if (chartCode === "FndIndexmonitor") {
                        this.setState({ zbjkData: data });
                    } else if (chartCode === "FndIndexSummStatic") {
                        this.setState({ zbhzData: data });
                    }
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    componentWillUnmount() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }
    }

    // 查询所有接口
    fetchAllInterface = async () => {
        await this.fetchChartConfigData();
        this.fetchIndexConfigData();
        this.fetchQueryErrOrImpRpt();
        this.fetchQueryChartIndexData("XzjjSettleCompletion");
        this.fetchQueryChartIndexData("FndFAIndexmonitor");
        this.fetchQueryChartIndexData("FndTAIndexmonitor");
        this.fetchQueryChartIndexData("FndCoreIndex");
        // this.fetchQueryChartIndexData("FndAbnormalityReport");
        this.fetchQueryChartIndexData("FndmExcptOrManual");
        this.fetchQueryChartIndexData("FndIndexmonitor");
        this.fetchQueryChartIndexData("FndIndexSummStatic");
    }
    // 指标配置数据
    fetchIndexConfigData = () => {
        FetchQueryChartIndexConfig({
            screenPage: 7,
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
            if (tmpl[item.chartCode]) {
                tmpl[item.chartCode].push(item);
            }
        });
        this.setState({ indexConfig: tmpl });
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

    //异常或重大事项报告
    fetchQueryErrOrImpRpt = () => {
        FetchQueryErrOrImpRpt({
            screenPage: 7,
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({
                        ycbgData: data
                    })
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    }

    render() {
        const { moduleCharts = [], indexConfig = [],
            qsywData = [], fazbData = [], tazbData = [],
            hxzbData = [], ycbgData = [], sgqrData = [],
            zbjkData = [], zbhzData = []
        } = this.state;

        let gzzbList = [], tzxtList = [], zxxtList = [], tazbList = [];

        for (let i = 0; i < zbjkData.length; i++) {
            if (zbjkData[i].FGROUP === '估值指标监控') {
                gzzbList.push(zbjkData[i]);
            } else if (zbjkData[i].FGROUP === 'O32投资系统指标监控') {
                tzxtList.push(zbjkData[i]);
            } else if (zbjkData[i].FGROUP === '直销系统指标监控') {
                zxxtList.push(zbjkData[i]);
            } else {
                tazbList.push(zbjkData[i]);
            }
        }
        const { dispatch } = this.props;
        return (
            <div className=" fund flex-c cont-wrap-sub" style={{ color: "#C6E2FF" }}>
                <div className="flex-r wid100" style={{ height: '85rem' }}>
                    <LeftContent moduleCharts={moduleCharts} dispatch={dispatch} indexConfig={indexConfig} fazbData={fazbData} tazbData={tazbData} />
                    <MiddleContent moduleCharts={moduleCharts} dispatch={dispatch} indexConfig={indexConfig} qsywData={qsywData} />
                    <RightContent sgqrData={sgqrData} moduleCharts={moduleCharts} dispatch={dispatch} indexConfig={indexConfig} hxzbData={hxzbData} ycbgData={ycbgData} />
                </div>
                <div className="flex-c" style={{ height: '75rem' }}>
                    <OverviewGroup zbhzData={zbhzData} chartConfig={moduleCharts[8]} />
                    <div className="flex-r" style={{ height: '100%' }}>
                        <div className="wid67 flex-c h100 ">
                            <CoreBusIndex dataList={gzzbList} />
                            <div className="h26  flex-r ">
                                <MetricsIndex dataList={tzxtList} />
                                <SaleIndex dataList={zxxtList} />
                            </div>
                        </div>
                        <TAIndex dataList={tazbList} />
                    </div>
                    {/* <FootBlock moduleCharts={moduleCharts} overview={zbhzData} coreBusIndex={gzzbList} metricsIndex={tzxtList} saleIndex={zxxtList} taIndex={tazbList} /> */}
                </div>

            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(Fund);
