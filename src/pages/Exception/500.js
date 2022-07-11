import React from 'react';
// import { Link } from 'dva/router';
// import Exception from '../../components/Exception';
import ErrorPage from './Error.js';

export default () => (
  // <Exception type="500" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
  <ErrorPage type="500" />
);
