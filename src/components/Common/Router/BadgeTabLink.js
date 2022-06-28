import React from 'react';
import { Badge } from 'antd';
import TabLink from './TabLink';

const BadgeTabLink = ({ count, ...other }) => (
  <Badge count={count} className="m-badge m-badge-pink" style={{ marginLeft: '-1.3rem', top: '1.49rem' }}>
    <TabLink {...other} />
  </Badge>
);
export default BadgeTabLink;
