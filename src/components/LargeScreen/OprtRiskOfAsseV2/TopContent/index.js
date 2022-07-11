import React, { Component } from 'react'
import RightContent from '../RightContent';
import LeftContent from '../LeftContent';
import MiddleBlock from '../MiddleBlock';


export class TopContent extends Component {
    render() {
        const { assetmMontSerComplt = [], moduleCharts=[],serviceCheck = [],excptOrManual = [],operCheck = [] } = this.props;
        return (
            <div className="flex-r h60 wid100">
                <div className="wid33 h100">
                    <LeftContent data={serviceCheck} chartConfig={moduleCharts[2]}/>
                </div>
                <div className="wid34 h100">
                    <MiddleBlock assetmMontSerComplt={assetmMontSerComplt} chartConfig={moduleCharts[0]}/>
                </div>
                <div className="wid33 h100">
                    <RightContent operCheck={operCheck} excptOrManual={excptOrManual} moduleCharts={moduleCharts}/>
                </div>
            </div>
        )
    }
}
export default TopContent
