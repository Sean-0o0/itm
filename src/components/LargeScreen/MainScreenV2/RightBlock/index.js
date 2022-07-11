import React from 'react';
import { connect } from 'dva';
import Asset from './Asset';
import Futures from './Futures';


class RightBlock extends React.Component {
    state = {

    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        const a = 1;

        return (
            <div className="flex-c h100">
                <div className="h50 flex-c">
                    <Asset/>
                </div>
                <div className="flex1 flex-c">
                    <Futures/>
                </div>
            </div>
        );
    }
}

export default connect(({ global }) => ({
}))(RightBlock);
