import React from 'react';
import Bar from '../Bond/Chart/Bar';

class Bond extends React.Component {
    render() {
        const { dispatch, chartTitle = '--' } = this.props;
        return (
            <div className="flex-c zb-data-item h100">
                <div className="card-title-sec">{chartTitle}</div>
                {/* <div className="chart-box2 flex1" style={{ height: "23rem" }}> */}
                <div className="chart-box2 bond-cont">
                    <Bar dispatch={dispatch}/>
                </div>
            </div>
        );
    }
}
export default Bond;
