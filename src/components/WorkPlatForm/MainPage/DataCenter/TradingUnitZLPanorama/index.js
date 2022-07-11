import React, { Fragment } from 'react';
import TradingUnitZLPanoramaTitle from './TradingUnitZLPanoramaTitle';
import TradingUnitZLPanoramaTab from './TradingUnitZLPanoramaTab';

class TradingUnitZLPanorama extends React.Component {
    state = {
        
    }
    render() {
        return (
            <div className='tradingunitpanorama-box'>
                <TradingUnitZLPanoramaTitle />
                <TradingUnitZLPanoramaTab />
            </div>
        );
    }
}

export default TradingUnitZLPanorama;
