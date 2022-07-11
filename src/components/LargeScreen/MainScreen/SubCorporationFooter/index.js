import React from 'react';
import Internationality from './Internationality';
import Capital from './Capital';
import Investment from './Investment';
import Fund from '../SubCorporation/Fund';
import Futures from '../SubCorporation/Futures';
import Asset from '../SubCorporation/Asset';

class SubCorporationHeader extends React.Component {

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
                {/* {moduleCharts[0]&&moduleCharts[0].displayOrder&&moduleCharts[0].displayOrder.slice(0,1)==='2' ?
                    (<Fund fundErrCounts={fundErrCounts} dispatch={dispatch} />) : ''}
                {moduleCharts.XZQH&&moduleCharts.XZQH.displayOrder&&moduleCharts.XZQH.displayOrder.slice(0,1)==='2' ? 
                    (<Futures futuresErrCounts={futuresErrCounts} dispatch={dispatch} />) : ''}
                {moduleCharts.XZZG&&moduleCharts.XZZG.displayOrder&&moduleCharts.XZZG.displayOrder.slice(0,1)==='2' ? 
                    (<Asset assetErrCounts={assetErrCounts} dispatch={dispatch} />) : ''}
                {moduleCharts.XZGJ&&moduleCharts.XZGJ.displayOrder&&moduleCharts.XZGJ.displayOrder.slice(0,1)==='2' ? 
                    (<Internationality intErrCounts={intErrCounts} dispatch={dispatch}/>) : ''}
                {moduleCharts.XZZB&&moduleCharts.XZZB.displayOrder&&moduleCharts.XZZB.displayOrder.slice(0,1)==='2' ? 
                    (<Capital capitalErrCounts={capitalErrCounts} dispatch={dispatch}/>) : ''}
                {moduleCharts.XZTZ&&moduleCharts.XZTZ.displayOrder&&moduleCharts.XZTZ.displayOrder.slice(0,1)==='2' ? 
                    (<Investment investmentErrCounts={investmentErrCounts} dispatch={dispatch}/>) : ''} */}
            </div>
        );
    }
}

export default SubCorporationHeader;
