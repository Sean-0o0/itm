import React, {Fragment, useState, useEffect, Component} from 'react';
import {connect} from 'dva';
import MemberInfoTab from '../../../components/pmsPage/MemberInfo/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

const MemberInfo = props => {
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
      <MemberInfoTab dictionary={props.dictionary} params={params}></MemberInfoTab>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(MemberInfo);
