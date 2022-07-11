import React from 'react';
// import { message } from 'antd';
import Fund from './Fund';
import Futures from './Futures';
import Asset from './Asset';
import Internationality from '../SubCorporationFooter/Internationality';
import Capital from '../SubCorporationFooter/Capital';
import Investment from '../SubCorporationFooter/Investment';
// import { FetchQueryChartIndexData } from '../../../../services/largescreen';

class SubCorporationHeader extends React.Component {
    // state = {
    //     fundCompletionStatus: [], // 兴证基金-结算完成情况
    //     accountMonitoring: [], // 兴证期货-账户监控
    //     futuresCompletionStatus: [], // 兴证期货-结算完成情况
    //     assetCompletionStatus: [], // 兴证资管-结算完成情况
    // };

    // componentDidMount() {
    //     const refreshWebPage = localStorage.getItem('refreshWebPage');
    //     this.fetchData();
    //     this.fetchInterval = setInterval(() => {
    //         const loginStatus = localStorage.getItem('loginStatus');
    //         if (loginStatus !== '1') {
    //             this.props.dispatch({
    //                 type: 'global/logout',
    //             });
    //         }
    //         this.fetchData();
    //     }, Number.parseInt(refreshWebPage, 10) * 1000);
    // }

    // componentWillUnmount() {
    //     if (this.fetchInterval) {
    //         clearInterval(this.fetchInterval);
    //     }
    // }

    //数据查询
    // fetchData = () => {

    // FetchQueryChartIndexData({
    //     chartCode: "XzjjSettleCompletion"
    // }).then((ret = {}) => {
    //     const { code = 0, data = [] } = ret;
    //     if (code > 0) {
    //         this.setState({ fundCompletionStatus: data });
    //     }
    // }).catch(error => {
    //     message.error(!error.success ? error.message : error.note);
    // });

    // FetchQueryChartIndexData({
    //     chartCode: "AccountMonitoring"
    // }).then((ret = {}) => {
    //     const { code = 0, data = [] } = ret;
    //     if (code > 0) {
    //         this.setState({ accountMonitoring: data });
    //     }
    // }).catch(error => {
    //     message.error(!error.success ? error.message : error.note);
    // });

    // FetchQueryChartIndexData({
    //     chartCode: "Settlecompletion"
    // }).then((ret = {}) => {
    //     const { code = 0, data = [] } = ret;
    //     if (code > 0) {
    //         this.setState({ futuresCompletionStatus: data });
    //     }
    // }).catch(error => {
    //     message.error(!error.success ? error.message : error.note);
    // });

    // FetchQueryChartIndexData({
    //     chartCode: "IndAssMgt"
    // }).then((ret = {}) => {
    //     const { code = 0, data = [] } = ret;
    //     if (code > 0) {
    //         this.setState({ assetCompletionStatus: data });
    //     }
    // }).catch(error => {
    //     message.error(!error.success ? error.message : error.note);
    // });
    // };

    render() {
        const { moduleCharts = [], errCountsArr = [], dispatch } = this.props;
        let fundErrCounts = '';
        let futuresErrCounts = '';
        let assetErrCounts = '';
        let intErrCounts = '';
        let capitalErrCounts = '';
        let investmentErrCounts = '';
        errCountsArr.forEach(item => {
            const { dydp = "", cnt = "" } = item;
            if (dydp === "7") {
                fundErrCounts = cnt;
            } else if (dydp === "9") {
                futuresErrCounts = cnt;
            } else if (dydp === "10") {
                assetErrCounts = cnt;
            } else if (dydp === "11") {
                intErrCounts = cnt;
            } else if (dydp === "12") {
                capitalErrCounts = cnt;
            } else if (dydp === "8") {
                investmentErrCounts = cnt;
            }
        });
        let sucorporation = [];
        const sumOfLine = moduleCharts.length;
        moduleCharts.forEach((item) => {
            const { chartCode, chartTitle } = item;
            let itemDom = null;
            switch (chartCode) {
                case 'XZJJ':
                    itemDom = <Fund chartTitle={chartTitle} fundErrCounts={fundErrCounts} dispatch={dispatch} sumOfLine={sumOfLine}/>;
                    break;
                case 'XZQH':
                    itemDom = <Futures chartTitle={chartTitle} futuresErrCounts={futuresErrCounts} dispatch={dispatch} sumOfLine={sumOfLine}/>;
                    break;
                case 'XZZG':
                    itemDom = <Asset chartTitle={chartTitle} assetErrCounts={assetErrCounts} dispatch={dispatch} sumOfLine={sumOfLine}/>;
                    break;
                case 'XZGJ':
                    itemDom = <Internationality chartTitle={chartTitle} intErrCounts={intErrCounts} dispatch={dispatch} sumOfLine={sumOfLine}/>;
                    break;
                case 'XZZB':
                    itemDom = <Capital chartTitle={chartTitle} capitalErrCounts={capitalErrCounts} dispatch={dispatch} sumOfLine={sumOfLine}/>;
                    break;
                case 'XZTZ':
                    itemDom = <Investment chartTitle={chartTitle} investmentErrCounts={investmentErrCounts} dispatch={dispatch} sumOfLine={sumOfLine}/>;
                    break;
                default:
                    break;
            }
            sucorporation.push(itemDom);
        })

        return (
            <div className="h31 flex-r">
                {
                    sucorporation.map((item,index)=>{
                        return item;
                    })
                }
                {/* {moduleCharts.XZJJ&&moduleCharts.XZJJ.displayOrder&&moduleCharts.XZJJ.displayOrder.slice(0,1)==='1' ?
                    (<Fund fundErrCounts={fundErrCounts} dispatch={dispatch} />) : ''}
                {moduleCharts.XZQH&&moduleCharts.XZQH.displayOrder&&moduleCharts.XZQH.displayOrder.slice(0,1)==='1' ? 
                    (<Futures futuresErrCounts={futuresErrCounts} dispatch={dispatch} />) : ''}
                {moduleCharts.XZZG&&moduleCharts.XZZG.displayOrder&&moduleCharts.XZZG.displayOrder.slice(0,1)==='1' ? 
                    (<Asset assetErrCounts={assetErrCounts} dispatch={dispatch} />) : ''}
                {moduleCharts.XZGJ&&moduleCharts.XZGJ.displayOrder&&moduleCharts.XZGJ.displayOrder.slice(0,1)==='1' ? 
                    (<Internationality intErrCounts={intErrCounts} dispatch={dispatch}/>) : ''}
                {moduleCharts.XZZB&&moduleCharts.XZZB.displayOrder&&moduleCharts.XZZB.displayOrder.slice(0,1)==='1' ? 
                    (<Capital capitalErrCounts={capitalErrCounts} dispatch={dispatch}/>) : ''}
                {moduleCharts.XZTZ&&moduleCharts.XZTZ.displayOrder&&moduleCharts.XZTZ.displayOrder.slice(0,1)==='1' ? 
                    (<Investment investmentErrCounts={investmentErrCounts} dispatch={dispatch}/>) : ''} */}
            </div>
        );
    }
}

export default SubCorporationHeader;
