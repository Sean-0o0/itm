import React, { Component } from 'react';
import EventReport from '../../ClearingPlace/EventReport';
// import EventTarget from './EventTarget';
import ModuleChart from '../../ClearingPlace/ModuleChart';
import CoreIndex from './CoreIndex';
import BottomBlock from '../RightContent/BottomBlock';

export class RightContent extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const { dispatch, moduleCharts = [], indexConfig = [], hxzbData = [], ycbgData = [], sgqrData = [] } = this.props;

        return (
            <div className="flex-c h100 wid33">
                <div className="flex-c h60">
                    <div className="h50 pd10">
                        <CoreIndex dataList={hxzbData} chartConfig={moduleCharts[3]} />
                    </div>
                    <div className="h50 pd10">
                        <ModuleChart
                            records={moduleCharts[5]}
                            indexConfig={indexConfig}
                            tClass='title-r'
                            dispatch={dispatch}
                        />
                    </div>
                </div>
                <div className="flex-r h40">
                    <div className="wid50 h100">
                        <BottomBlock
                            excptOrManual={sgqrData}
                            chartConfig={moduleCharts[9]}
                        />
                    </div>
                    <div className="wid50 h100 pd10">
                        <EventReport
                            errOrImpRpt={ycbgData}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default RightContent
