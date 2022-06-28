/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import classNames from 'classnames';
import { InfiniteTable } from 'react-virtualized-table';
import LoadMore from 'react-virtualized-table/dist/Antd/LoadMore';
import Pagination from 'react-virtualized-table/dist/Antd/Pagination';
import hasMoreRows from 'react-virtualized-table/dist/Antd/hasMoreRows';
import PropTypes from 'prop-types';
import defaultShowLoadMore from './defaultShowLoadMore';
import styles from './FixedTable.less';

class FixedTable extends Component {
  static propTypes = {
    showLoadMore: PropTypes.func,
    onTopReachedThreshold: PropTypes.number,
    onEndReachedThreshold: PropTypes.number,
  };

  static defaultProps = {
    ...InfiniteTable.defaultProps,
    showLoadMore: defaultShowLoadMore,
    onTopReachedThreshold: 56,
    onEndReachedThreshold: 200,
  };

  _renderFooter = () => {
    const {
      paging,
      loading,
      current,
      pageSize,
      total,
      showLoadMore,
      onLoadMore,
      onPaging,
      onShowSizeChange,
    } = this.props;

    if (!paging) {
      return (
        <LoadMore
          loading={loading}
          hasMoreRows={false}
          onClick={onLoadMore}
        />
      );
    }

    if (showLoadMore(this.props)) {
      return (
        <LoadMore
          loading={loading}
          hasMoreRows={hasMoreRows(this.props)}
          onClick={onLoadMore}
        />
      );
    }

    if (!loading && current === 1 && total === 0) {
      return <div style={{ margin: '4rem 0', textAlign: 'center' }}>暂无数据</div>;
    }

    return (
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onPaging}
        onShowSizeChange={onShowSizeChange}
      />
    );
  }

  render() {
    const className = classNames('m-virtualized-table', styles.table);

    return (
      <div className={className}>
        <InfiniteTable {...this.props} renderFooter={this._renderFooter} />
      </div>
    );
  }
}

export default FixedTable;
