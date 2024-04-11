import React, { Fragment, useState, useEffect, Component } from 'react';
import { connect } from 'dva';
import AttendanceStatisticTab from '../../../components/pmsPage/AttendanceStatistic/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const AttendanceStatistic = props => {
  const [params, setParams] = useState({}); //路径参数
  const {
    location: { query = {} },
    match: {
      params: { params: encryptParams = '' },
    },
  } = props;
  useEffect(() => {
    if (props.match.params.params !== undefined) {
      setParams(JSON.parse(DecryptBase64(encryptParams)));
    }
    return () => {};
  }, [props]);
  return (
    <Fragment>
      <AttendanceStatisticTab
        dictionary={props.dictionary}
        authorities={props.authorities}
        params={params}
        {...props}
      ></AttendanceStatisticTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(AttendanceStatistic);
