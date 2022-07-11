import React, { Component } from 'react'
import ModuleChart from '../../ClearingPlace/ModuleChart';
import TextChart from '../../ClearingPlace/ModuleChart/TextChart';
import EventReport from '../../ClearingPlace/EventReport';
export default class BottomBlock extends Component {

    render() {
        const { dispatch, moduleCharts = [], indexConfig = [], errOrImpRpt = [], FutursTrdRiskControl } = this.props;
        return (
            <div className="flex-r flex1 ">
                <div className="wid33  pd10">
                    <ModuleChart
                        records={moduleCharts[13]}
                        indexConfig={indexConfig}
                        tClass='title-l'
                        dispatch={dispatch}
                    />
                </div>
                <div className="wid34 pd10">
                    <TextChart
                        records={moduleCharts[14]}
                        indexConfig={indexConfig}
                        tClass='title-c'
                        dispatch={dispatch}
                        futursTrdRiskControl={FutursTrdRiskControl}
                    />
                </div>
                <div className="wid33 pd10">
                    <EventReport errOrImpRpt={errOrImpRpt} chartConfig={moduleCharts[15]}/>
                </div>
            </div>
        )
    }
}
