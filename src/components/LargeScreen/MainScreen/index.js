import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import SubCorporation from './SubCorporation';
import HeadQuarters from './HeadQuarters';
import SubCorporationFooter from './SubCorporationFooter';
import { FetchQueryModuleChartConfig, FetchQueryErrOrImpRptStat } from '../../../services/largescreen';

class MainScreen extends React.Component {
    state = {
        errCountsArr: [], //子公司异常或重大事项统计总数
        // fundErrCounts: "", // 兴证基金-异常或重大事项统计总数
        // futuresErrCounts: "", // 兴证期货-异常或重大事项统计总数
        // assetErrCounts: "", // 兴证资管-异常或重大事项统计总数
        // intErrCounts: "", // 兴证国际-异常或重大事项统计总数
        // capitalErrCounts: "", // 兴证资本-异常或重大事项统计总数
        // investmentErrCounts: "", // 兴证投资-异常或重大事项统计总数
        records: [],
        moduleCharts: [],
        timer: '',
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
            this.fetchData();
        }, Number.parseInt(refreshWebPage, 10) * 1000);
        this.fetchData();
    }

    componentWillUnmount() {
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }
    }

    // 兴证投资查询
    fetchData = () => {
        FetchQueryErrOrImpRptStat({
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.setState({
                    errCountsArr: records,
                })
                // records.forEach(item => {
                //     const { dydp = "", cnt = "" } = item;
                //     if (dydp === "7") {
                //         this.setState({ fundErrCounts: cnt });
                //     } else if (dydp === "9") {
                //         this.setState({ futuresErrCounts: cnt });
                //     } else if (dydp === "10") {
                //         this.setState({ assetErrCounts: cnt });
                //     } else if (dydp === "11") {
                //         this.setState({ intErrCounts: cnt });
                //     } else if (dydp === "12") {
                //         this.setState({ capitalErrCounts: cnt });
                //     } else if (dydp === "8") {
                //         this.setState({ investmentErrCounts: cnt });
                //     }
                // });
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });

        FetchQueryModuleChartConfig({
            screenPage: 0
        }).then((ret = {}) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                this.handleChartConfigData(records);
            }
        }).catch(error => {
            message.error(!error.success ? error.message : error.note);
        });
    };

    handleChartConfigData = records => {
        let tmpl = [[], []];
        records.forEach(item => {
            const { displayOrder } = item;
            const position = displayOrder ? Number.parseInt(displayOrder.slice(0, 1)) : 0;
            const orderNum = displayOrder ? displayOrder.slice(1) : 0;
            if (position > 0 && orderNum > 0) {
                tmpl[position - 1].push(item);
                item.displayOrder = orderNum;
            }
        });
        if (tmpl[0].length > 0 && tmpl[1].length > 0) {
            tmpl[0] = tmpl[0].sort((x, y) => x.displayOrder - y.displayOrder);
            tmpl[1] = tmpl[1].sort((x, y) => x.displayOrder - y.displayOrder);
        } else {
            tmpl = [[], []];
        }
        this.setState({
            moduleCharts: tmpl,
            records: records
        });
    };

    render() {
        // const { fundErrCounts = "", futuresErrCounts = "", assetErrCounts = "", intErrCounts = "", capitalErrCounts = "", investmentErrCounts = "" } = this.state;
        const { moduleCharts = [], errCountsArr = [], records } = this.state;
        const { dispatch } = this.props;

        return (
            <div className="flex1 flex-c cont-wrap">
                <SubCorporation moduleCharts={moduleCharts[0]} errCountsArr={errCountsArr} dispatch={dispatch} />
                <HeadQuarters records={records} dispatch={dispatch} />
                <SubCorporationFooter moduleCharts={moduleCharts[1]} errCountsArr={errCountsArr} dispatch={dispatch} />
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(MainScreen);