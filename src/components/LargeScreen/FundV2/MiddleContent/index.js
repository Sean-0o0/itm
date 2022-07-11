import React, { Component } from 'react';
import ModuleChart from '../../ClearingPlace/ModuleChart';
import ClearIndex from './ClearIndex';

export class MiddleContent extends Component {
    render() {
        const { moduleCharts = [], indexConfig = [], dispatch = [], qsywData = []} = this.props;
        return (
            <div className="flex-c h100 wid34">
                <div className="flex-c h60">
                    <ClearIndex qsywData={qsywData} chartConfig = {moduleCharts[0]}/>
                </div>
                <div className="flex-c h40">
                    <div className="flex1 pd10">
                        <ModuleChart
                            records={moduleCharts[6]}
                            indexConfig={indexConfig}
                            tClass='title-c'
                            dispatch={dispatch}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default MiddleContent
