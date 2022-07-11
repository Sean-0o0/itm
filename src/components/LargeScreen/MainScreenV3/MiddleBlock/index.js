import React from 'react';
import { connect } from 'dva';
// import Asset from './Asset';
import Futures from './Futures';
import International from './International';
import SubsidiaryIndex from './SubsidiaryIndex';

class MiddleBlock extends React.Component {
    state = {

    };

    componentDidMount() {

    }


    render() {
        const { GroupOpManagmHeadqrt = [],
            // AssetmMontSerComplt = [],
            // MProgIndcPubOfferingProd = [],
            // AssetmServiceCheckIndMont = [],
            MinterKeyIndicDetl = [],
            MinterLiqdStatic = [],
            MFutuOperOverview = [],
            MFutuKeyIndicDetl = [],
            hightLight} = this.props;

        return (
            <div className="flex-c h100">
                <div className="h47 flex-c">
                    <SubsidiaryIndex GroupOpManagmHeadqrt={GroupOpManagmHeadqrt} hightLight={hightLight}/>
                </div>
                <div className="h53 flex-r">
                    <div className="flex1 flex-c h100">
                        <International
                        MinterKeyIndicDetl={MinterKeyIndicDetl}
                        MinterLiqdStatic={MinterLiqdStatic}
                        hightLight={hightLight}/>
                        {/* <Asset
                        AssetmMontSerComplt={AssetmMontSerComplt}
                        MProgIndcPubOfferingProd={MProgIndcPubOfferingProd}
                        AssetmServiceCheckIndMont={AssetmServiceCheckIndMont} /> */}
                    </div>
                    <div className="flex1 flex-c h100">
                        <Futures
                          MFutuKeyIndicDetl={MFutuKeyIndicDetl}
                          MFutuOperOverview={MFutuOperOverview}
                          hightLight={hightLight}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(MiddleBlock);
