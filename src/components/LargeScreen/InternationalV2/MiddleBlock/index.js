import React, { Component } from 'react';
import EventReport from '../../ClearingPlace/EventReport';
import InterAbnRepor from '../../InternationalV2/MiddleBlock/InterAbnReport'
import ModuleChart from '../../ClearingPlace/ModuleChart';
import SpecialBusIndex from './SpecialBusIndex';

export class MiddleBlock extends Component {
    render() {
        const { specialDatas = [], moduleCharts = [], indexConfig = [], dispatch = [], errOrImpRpt = [], InterAbnReport = [] } = this.props;
        return (
            <div className="flex-r " style={{ height:'33.3%'}}>
              <div className="wid33 flex-c h100">
                <div className="h100 pd10">
                  <SpecialBusIndex specialDatas={specialDatas} chartConfig={moduleCharts[2]}/>
                </div>
              </div>
                <div className="wid33 flex-c h100">
                    <div className="h100 pd10">
                        <ModuleChart
                            records={moduleCharts[5]}
                            indexConfig={indexConfig}
                            tClass='title-c'
                            dispatch={dispatch}
                        />
                    </div>
                </div>
                <div className="wid34 flex-r h100">
                    <div className="wid100 h100 pd10">
                        <EventReport  errOrImpRpt = {errOrImpRpt} />
                    </div>
                </div>
            </div>
        )
    }
}

export default MiddleBlock
