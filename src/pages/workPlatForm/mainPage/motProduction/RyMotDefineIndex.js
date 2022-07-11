import React, { Fragment } from 'react';
import { connect } from 'dva';

import RYMotDefineIndex from '../../../../components/WorkPlatForm/MainPage/MotProduction/RyMotDefineIndex';


class RyMotDefineIndex extends React.Component {
    render() {
        const { dictionary = {}, userBasicInfo = {} } = this.props

        return (
            <Fragment>


                {/* 员工定义事件 */}
                <RYMotDefineIndex dictionary={dictionary} userBasicInfo={userBasicInfo} />

            </Fragment>
        );
    }
}

export default connect(({ motEvent, global }) => ({
    dictionary: global.dictionary,
    authorities: global.authorities,
    userBasicInfo: global.userBasicInfo,

}))(RyMotDefineIndex);
