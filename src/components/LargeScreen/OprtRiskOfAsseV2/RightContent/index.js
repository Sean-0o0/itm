import React, { Component } from 'react'
import TopBlock from './TopBlock';
import BottomBlock from './BottomBlock';


export class RightContent extends Component {
    render() {
        const { operCheck = [], moduleCharts = [], excptOrManual =[] } = this.props
        return (
            <div className="h100 wid100">
                <div className="wid100 flex-c h50">
                    <TopBlock operCheck={operCheck} chartConfig={moduleCharts[1]}/>
                </div>
                <div className="wid100 flex-c h50">
                    <BottomBlock excptOrManual={excptOrManual} chartConfig={moduleCharts[3]}/>
                </div>
            </div>
        )
    }
}

export default RightContent
