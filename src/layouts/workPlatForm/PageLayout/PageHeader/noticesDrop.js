import React from 'react';
import { Badge } from 'antd';
import DropdownBox from '../../../../components/Common/DropdownBox';

export default class NoticesDrop extends React.PureComponent {
  getDropdownBoxTitle = () => {
    return (
      <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ display: 'inline-block', width: '100%', height: '100%' }}>
        <Badge status="processing" text={<i className="iconfont icon-bell" />} />
      </a>
    );
  }
  getDropbox = () => {
    return (
      <a href="#" onClick={e => e.preventDefault()} style={{ color: '#666', textAlign: 'center', display: 'block', padding: '1rem 0' }}>
        <span>暂无数据</span>
      </a>
    );
  }
  render() {
    const dropdownBoxProps = {
      id: 'notices',
      title: this.getDropdownBoxTitle(),
      dropbox: this.getDropbox(),
    };
    return (
      <DropdownBox
        {...dropdownBoxProps}
      />
    );
  }
}
