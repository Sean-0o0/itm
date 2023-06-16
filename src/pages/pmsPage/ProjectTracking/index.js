import React, {Fragment} from 'react';
import {connect} from 'dva';
import ProjectTrackingTab from '../../../components/pmsPage/ProjectTracking/index';

const ProjectTracking = props => {

  return (
    <Fragment>
      <ProjectTrackingTab dictionary={props.dictionary}/>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(ProjectTracking);
