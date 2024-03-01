import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import HomePageTab from '../../../components/pmsPage/HomePage';

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  roleData: global.roleData,
}))(HomePageTab);