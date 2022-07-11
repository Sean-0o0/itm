import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import TopContent from './TopContent';
import SecondBlock from './SecondBlock';
import ThirdBlock from './ThirdBlock';
import ForthBlock from './ForthBlock';
import FootBlock from './FootBlock';
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';
import MiddleBlock from './MiddleBlock';
import LeftContent from './LeftContent';


class OprtRiskOfAsset extends React.Component {
    state = {
        moduleCharts: [],
        indexConfig: [],
        errOrImpRpt: [], //重大事项查询
        timer: '',
        assetmMontSerComplt: [],
        operCheck: [],
        serviceCheck: [],
        intqueryStat: [],
        excptOrManual: [],
        serChk: []
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
        this.fetchData("AssetmMontSerComplt");
        this.fetchIndexConfigData();
        this.fetchErrOrImpRpt();
        this.fetchOperCheck("AssetmOperCheckIndList");
        this.fetchServiceCheck("AssetmServiceCheckIndMont");
        this.fetchIntqueryStat("AssetmIndIntqueryStat");
        this.fetchExcptOrManual("AssetmExcptOrManual");
        this.fetchSerChk("AssetmSerChkIndmont");
    }

    // 指标配置数据
    fetchIndexConfigData = () => {
        FetchQueryChartIndexConfig({
            screenPage: 10,
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

    // 图表配置数据
    fetchChartConfigData = async() => {
        try {
            const res = await FetchQueryModuleChartConfig({
                screenPage: 10,
            })
            const { records = [], code = 0, note = '' } = res;
            if (code > 0) {
                this.handleChartConfigData(records);
            }
        } catch (error) {
            message.error(!error.success ? error.message : error.note)
        }

    };

    //指标状态
    fetchData = (chartCode) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ assetmMontSerComplt: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //重大事项查询
    fetchErrOrImpRpt = () => {
        FetchQueryErrOrImpRpt({
            screenPage: 10,
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

    //关键运营检查指标列表
    fetchOperCheck = ( chartCode ) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ operCheck: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //异常/手工确认指标表
    fetchExcptOrManual = ( chartCode ) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ excptOrManual: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //运营业务检查指标监控
    fetchServiceCheck = ( chartCode ) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ serviceCheck: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //资管运营检查指标监控列表
    fetchIntqueryStat = ( chartCode ) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ intqueryStat: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    //业务检查指标监控
    fetchSerChk = ( chartCode ) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ serChk: data });
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
        const { moduleCharts, indexConfig, assetmMontSerComplt, errOrImpRpt, operCheck, serviceCheck, intqueryStat, excptOrManual, serChk } = this.state;
        return (
            <div className="flex-c cont-wrap-sub OprtRisk" style={{color:"#C6E2FF"}}>
                <div style={{height:'85rem'}}>
                    <TopContent assetmMontSerComplt={assetmMontSerComplt} operCheck={operCheck} moduleCharts={moduleCharts} serviceCheck={serviceCheck} excptOrManual={excptOrManual}/>
                    <ThirdBlock errOrImpRpt={errOrImpRpt} indexConfig={indexConfig} moduleCharts={moduleCharts}/>
                </div>
                <div className="flex-c" style={{height:'90rem'}}>
                    <FootBlock serChk={serChk} intqueryStat={intqueryStat}/>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(OprtRiskOfAsset);
