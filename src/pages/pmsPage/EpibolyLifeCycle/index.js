import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import EpibolyLifeCyclePage from '../../../components/pmsPage/EpibolyLifeCycle/index';
class EpibolyLifeCycle extends Component {
    render() {
        return (
            <React.Fragment>
                <EpibolyLifeCyclePage></EpibolyLifeCyclePage>
            </React.Fragment>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(EpibolyLifeCycle);