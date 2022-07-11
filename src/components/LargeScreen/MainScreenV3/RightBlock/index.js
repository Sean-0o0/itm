import React from 'react';
import { connect } from 'dva';
import Fund from './Fund';
// import International from './International';
import Asset from './Asset';

class RightBlock extends React.Component {
    state = {

    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        const {
            MFndTAFASurvey = [],
            FndClearingbusiness = [],
            AssetmMontSerComplt = [],
            MProgIndcPubOfferingProd = [],
            AssetmServiceCheckIndMont = [],
            hightLight = 0
            // MinterKeyIndicDetl = [],
            // MinterLiqdStatic = []
        } = this.props;

        return (
            <div className="flex-c h100">
                <div className="h47 flex-c">
                    <Fund
                        FndClearingbusiness={FndClearingbusiness}
                        MFndTAFASurvey={MFndTAFASurvey}
                        hightLight={hightLight}/>
                </div>
                <div className="h53 flex-c">
                    {/* <International
                        MinterKeyIndicDetl={MinterKeyIndicDetl}
                        MinterLiqdStatic={MinterLiqdStatic} /> */}
                    <Asset
                        AssetmMontSerComplt={AssetmMontSerComplt}
                        MProgIndcPubOfferingProd={MProgIndcPubOfferingProd}
                        AssetmServiceCheckIndMont={AssetmServiceCheckIndMont}
                        hightLight={hightLight}/>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(RightBlock);
