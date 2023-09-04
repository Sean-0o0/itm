import React from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import HomePageTab from '../../components/pmsPage/HomePage';

//首页
const HomePage = props => <HomePageTab {...props} />;

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(HomePage);
