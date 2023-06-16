import React, {Fragment, useState, useEffect, Component} from 'react';
import {connect} from 'dva';
import MonthlyAssessmentTab from '../../../components/pmsPage/MonthlyAssessment/index';
import {DecryptBase64} from '../../../components/Common/Encrypt';

const MonthlyAssessment = props => {
  const [params, setParams] = useState({}); //路径参数
  const {
    location: {query = {}},
    match: {
      params: {params: encryptParams = ''},
    },
  } = props;
  useEffect(() => {
    if (props.match.params.params !== undefined) {
      console.log("JSON.parse(DecryptBase64(encryptParams))", JSON.parse(DecryptBase64(encryptParams)))
      setParams(JSON.parse(DecryptBase64(encryptParams)));
    }
    return () => {
    };
  }, [props]);
  return (
    <Fragment>
      <MonthlyAssessmentTab dictionary={props.dictionary} params={params}></MonthlyAssessmentTab>
    </Fragment>
  );
};
export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(MonthlyAssessment);
