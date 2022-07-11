import React, { Component } from 'react';
import ModuleChart from '../../ClearingPlace/ModuleChart';

class RightBlock extends Component {
    render() {
        const { moduleCharts = [], indexConfig = [], dispatch = [] } = this.props;
        return (
            <>
                <div className="flex-c wid33">
                    <div className="flex1 pd10">
                        <ModuleChart
                            records={moduleCharts[6]}
                            indexConfig={indexConfig}
                            tClass='title-c'
                            dispatch={dispatch}
                        />
                    </div>
                    <div className="flex1 pd10">
                        <ModuleChart
                            records={moduleCharts[8]}
                            indexConfig={indexConfig}
                            tClass='title-c'
                            dispatch={dispatch}
                        />
                    </div>
                </div>
                <div className="flex-c wid34">
                    <div className="flex1 pd10">
                        <ModuleChart
                            records={moduleCharts[7]}
                            indexConfig={indexConfig}
                            tClass='title-r'
                            dispatch={dispatch}
                        />
                    </div>
                    <div className="flex1 pd10">
                        <ModuleChart
                            records={moduleCharts[4]}
                            indexConfig={indexConfig}
                            tClass='title-r'
                            dispatch={dispatch}
                        />
                    </div>
                </div>
            </>
        )
    }
}

export default RightBlock
