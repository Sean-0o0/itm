import React from 'react';
import { Spin } from 'antd';
import styles from '../../global.less';

export default () => (
  <Spin size="large" className={styles.globalSpin} />
);
