import React, { Component } from 'react'
import LeftBlock from './LeftBlock';

export class FootBlock extends Component {
    render() {
        const { overview=[], coreBusIndex=[], metricsIndex=[], saleIndex=[], taIndex=[], moduleCharts = []} = this.props
        return (
            <div className="flex-c flex1">
                <div className="wid100 flex-c h100">
                    <LeftBlock chartConfig = {moduleCharts[8]} overview={overview} coreBusIndex={coreBusIndex} metricsIndex={metricsIndex} saleIndex={saleIndex} taIndex={taIndex}/>
                </div>
            </div>
        )
    }
}

export default FootBlock
