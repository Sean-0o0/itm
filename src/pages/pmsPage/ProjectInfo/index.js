import React, { Fragment } from 'react';
import { connect } from 'dva';
import ProjectInfoTab from '../../../components/pmsPage/ProjectInfo/index';
const ProjectInfo = (props) => {
    return (
        <Fragment>
            <ProjectInfoTab dictionary={props.dictionary}></ProjectInfoTab>
        </Fragment>
    );
};
export default connect(({ global }) => ({
    dictionary: global.dictionary,
}))(ProjectInfo);