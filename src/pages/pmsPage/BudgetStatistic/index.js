import React, { Fragment, useState, useEffect, Component } from 'react';
import { connect } from 'dva';
import BudgetStatisticTab from '../../../components/pmsPage/BudgetStatistic/index';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
const BudgetStatistic = props => {
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
      <BudgetStatisticTab
        dictionary={props.dictionary}
        params={params}
        {...props}
      ></BudgetStatisticTab>
    </Fragment>
  );
};
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(BudgetStatistic);
