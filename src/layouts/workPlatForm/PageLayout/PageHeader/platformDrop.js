import React from 'react';
import DropdownBox from '../../../../components/Common/DropdownBox';

export default class PlatformDrop extends React.PureComponent {
  getDropdownBoxTitle = () => {
    return (
      <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ display: 'inline-block', width: '100%', height: '100%' }}>
        <span className="hide-menu">方案</span>
        <i className="iconfont icon-down-solid-arrow" style={{ fontSize: '1rem', paddingLeft: '0.5rem' }} />
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
      id: 'platform',
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
