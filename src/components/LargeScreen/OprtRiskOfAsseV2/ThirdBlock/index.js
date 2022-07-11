import React, { Component } from 'react'
import EventReport from '../../ClearingPlace/EventReport';
import ModuleChart from '../../ClearingPlace/ModuleChart';

export class ThirdBlock extends Component {
    render() {
        const { dispatch, datas = [], moduleCharts = [], indexConfig = [], errOrImpRpt = [] } = this.props;
        return (
            <div className="flex-r h40">
                <div className="wid33 h100 pd10">
                    <ModuleChart
                        records={moduleCharts[4]}
                        indexConfig={indexConfig}
                        tClass='title-l'
                        dispatch={dispatch}
                    />
                </div>
                <div className="wid34 h100 pd10">
                        {<ModuleChart
                            records={moduleCharts[5]}
                            indexConfig={indexConfig}
                            tClass='title-c'
                            dispatch={dispatch}
                        />}
                </div>
                <div className="wid33 h100 pd10">
                    <EventReport errOrImpRpt={errOrImpRpt} chartConfig={moduleCharts[6]} />
                </div>
            </div>
        )
    }
}

export default ThirdBlock
