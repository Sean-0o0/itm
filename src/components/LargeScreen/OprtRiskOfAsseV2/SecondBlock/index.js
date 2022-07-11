import React, { Component } from 'react'
import LeftBlock from './LeftBlock';
import RightBlock from './RightBlock';


export class SecondBlock extends Component {
    render() {        
        
        const { serviceCheck = [], moduleCharts = [], excptOrManual =[] } = this.props
        return (
            <div className="flex-r h30">
                <div className="wid67 flex-c h100">
                    <LeftBlock data={serviceCheck} chartConfig={moduleCharts[2]}/>
                </div>
                {/* <div className="wid33 flex-c h100">
                    <RightBlock operCheck={operCheck} chartConfig={moduleCharts[1]}/>
                </div> */}
                <div className="wid33 flex-c h100">
                    <RightBlock excptOrManual={excptOrManual} chartConfig={moduleCharts[3]}/>
                </div>
            </div>
        )
    }
}

export default SecondBlock
