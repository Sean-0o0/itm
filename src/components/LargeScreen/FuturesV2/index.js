import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import TopBlock from './TopBlock';
import BottomBlock from './BottomBlock';
import MiddleBlock from './MiddleBlock'
import {
    FetchQueryModuleChartConfig,
    FetchQueryChartIndexConfig,
    FetchQueryChartIndexData,
    FetchQueryErrOrImpRpt,
} from '../../../services/largescreen';
import BottomBlockV2 from './BottomBlockV2';

class Futures extends React.Component {
    state = {
        moduleCharts: [],
        indexConfig: [],
        errOrImpRpt: [], //重大事项查询
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
        this.fetchIndexConfigData();
        this.fetchData("FutursClearingbusiness");
        this.fetchData("FutursRegulatorySub");
        this.fetchData("FutursPermissionsetting");
        this.fetchData("FutursFundsettlement");
        this.fetchData("FutursTrdRiskControl");
        this.fetchErrOrImpRpt();
    }

    //数据查询
    fetchData = (chartCode) => {
        FetchQueryChartIndexData({
            chartCode: chartCode
        })
            .then((ret = {}) => {
                const { code = 0, data = [] } = ret;
                if (code > 0) {
                    this.setState({ [chartCode]: data });
                }
            })
            .catch(error => {
                message.error(!error.success ? error.message : error.note);
            });
    };

    // 图表配置数据
    fetchChartConfigData = async () => {
        try {
            const res = await FetchQueryModuleChartConfig({
                screenPage: 9,
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
            if (Object.keys(item).length && item.indexCode) {
                item.indexCode = item.indexCode.toUpperCase();
            }
            if (tmpl[item.chartCode]) {
                tmpl[item.chartCode].push(item);
            }
        });
        this.setState({ indexConfig: tmpl });
    };

    render() {
        const { moduleCharts = [],
            indexConfig = [],
            errOrImpRpt = [],
            FutursClearingbusiness = [],
            FutursRegulatorySub = [],
            FutursPermissionsetting = [],
            FutursFundsettlement = [],
            FutursTrdRiskControl = [] } = this.state;
        const { dispatch } = this.props;

        return (
            <div className="flex-c cont-wrap-sub" style={{ height: 'calc(175vh - 20.332rem)' }}>
                <div className="h60 flex-r">
                    <TopBlock dispatch={dispatch} moduleCharts={moduleCharts} indexConfig={indexConfig} FutursClearingbusiness={FutursClearingbusiness} FutursRegulatorySub={FutursRegulatorySub} FutursPermissionsetting={FutursPermissionsetting} FutursFundsettlement={FutursFundsettlement} />
                </div>
                <div className="h20 flex-r">
                    <BottomBlock dispatch={dispatch} moduleCharts={moduleCharts} indexConfig={indexConfig} errOrImpRpt={errOrImpRpt} FutursTrdRiskControl={FutursTrdRiskControl} />
                </div>
                <div className="h20 flex-r">
                    <BottomBlockV2 dispatch={dispatch} moduleCharts={moduleCharts} indexConfig={indexConfig} FutursFundsettlement={FutursFundsettlement} />
                </div>
            </div>
        );
    }
}
export default connect(({ global }) => ({
}))(Futures);
