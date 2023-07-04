import React, {Fragment, useState, useEffect, Component} from 'react';
import {connect} from 'dva';
import ProjectMemberStatisticsInfoTab from '../../../components/pmsPage/ProjectMemberStatisticsInfo/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

const ProjectMemberStatisticsInfo = props => {
  const [params, setParams] = useState({}); //路径参数
  const {
    location: {query = {}},
    match: {
      params: {params: encryptParams = ''},
    },
  } = props;
  useEffect(() => {
    if (props.match.params.params !== undefined) {
      setParams(JSON.parse(DecryptBase64(encryptParams)));
    }
    return () => {
    };
  }, [props]);
  return (
    <Fragment>
      <ProjectMemberStatisticsInfoTab dictionary={props.dictionary}
                                      params={params} {...props}></ProjectMemberStatisticsInfoTab>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(ProjectMemberStatisticsInfo);
