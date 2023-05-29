import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import HomePageTab from '../../../components/pmsPage/HomePage';

//首页
function HomePage(props) {
  useEffect(() => {
    return () => {};
  }, []);
  return <HomePageTab {...props} />;
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(HomePage);