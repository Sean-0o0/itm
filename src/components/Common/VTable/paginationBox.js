import React, { PureComponent } from 'react';
import { Pagination } from 'antd';
import styles from './index.less';

class PaginationBox extends PureComponent {
  onPageChange = (...args) => {
    const { onPageChange } = this.props;
    if (onPageChange) {
      onPageChange(...args);
    }
  }
  onPageSizeChange = (...args) => {
    const { onPageSizeChange } = this.props;
    if (onPageSizeChange) {
      onPageSizeChange(...args);
    }
  }
  render() {
    const {
      showSelectedCount = false,
      selectedCount = 0,
      current = 1,
      pageSize = 20,
      total = 0,
      selectedContent = '',
    } = this.props;
    return (
      <div className={styles.footer}>
        <span style={{ fontSize: '1.333rem', color: '#484747', lineHeight: '3rem', visibility: `${showSelectedCount && selectedCount > 0 ? 'visible' : 'hidden'}` }}>
          {selectedContent || <i style={{ color: '#2daae4', fontStyle: 'normal', paddingRight: '0.5rem' }}>{selectedCount}</i>}
          {selectedContent ? '' : '条记录被选中'}
        </span>
        <Pagination
          className="m-paging"
          current={current}
          pageSize={pageSize}
          total={total > 2000 ? 2000 : total}
          onChange={this.onPageChange}
          onShowSizeChange={this.onPageSizeChange}
          showSizeChanger
          showLessItems
          showQuickJumper
          showTotal={() => `共${total}条`}
        />
      </div>
    );
  }
}

export default PaginationBox;
