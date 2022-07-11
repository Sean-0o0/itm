import React from 'react';
import { connect } from 'dva';
import International from './International';
import Fund from './Fund';
import SubsidiaryIndex from './SubsidiaryIndex';

class MiddleBlock extends React.Component {
    state = {

    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {


        return (
            <div className="flex-c h100">
                <div className="h50 flex-c">
                    <SubsidiaryIndex/>
                </div>
                <div className="h50 flex-r">
                    <div className="flex1 flex-c h100">
                        <Fund />
                    </div>
                    <div className="flex1 flex-c h100 pd10">
                        <International />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(MiddleBlock);
