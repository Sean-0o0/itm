import React, {} from 'react';
import TradingUnitZYPanoramaTitle from './TradingUnitZYPanoramaTitle';
import TradingUnitZYPanoramaTab from './TradingUnitZYPanoramaTab';

class TradingUnitZLPanorama extends React.Component {
    state = {
    }
    render() {
        return (
            <div className='tradingunitpanorama-box'>
                <TradingUnitZYPanoramaTitle />
                <TradingUnitZYPanoramaTab />
            </div>
        );
    }
}

export default TradingUnitZLPanorama;
