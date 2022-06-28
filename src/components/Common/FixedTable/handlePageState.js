/* eslint-disable react/sort-comp, react/no-unused-state */
import React from 'react';
import { message } from 'antd';
import defaultParseResponse from './defaultParseResponse';

const handlePageState = ({
  onLoadPage,
  parseResponse = defaultParseResponse,
  paging = 1,
} = {}) => (component) => {
  class HandlePageState extends React.Component {
    state = {
      data: [],
      loading: false,
      current: 0,
      pageSize: 20,
      total: 1,
      paging,
    };

    _isMounted = true;

    componentWillUnmount() {
      this._isMounted = false;
    }

    setPageState = (state, callback) => {
      if (!this._isMounted) return;

      this.setState(state, callback);
    }

    loadPage = async (current) => {
      try {
        const { pageSize } = this.state;
        // 发起分页请求
        const responseObj = await onLoadPage({
          current,
          pageSize,
          paging,
        }, this.props);
        // 解析响应，提取分页数据
        const { total, records } = parseResponse(responseObj);

        this.setPageState({
          current,
          loading: false,
          total,
          data: [...this.state.data, ...records],
        });
      } catch (error) {
        message.error(!error.success ? (error.message || error) : error.note);
        this.setPageState({
          loading: false,
        });
      }
    }

    onLoadMore = () => {
      const { loading, current } = this.state;

      if (loading) return;

      this.setPageState({
        loading: true,
      }, () => this.loadPage(current + 1));
    }

    onPaging = (current = 1) => {
      if (this.state.loading) return;

      this.setPageState({
        loading: true,
        data: [],
      }, () => this.loadPage(current));
    }

    onShowSizeChange = (current, pageSize) => {
      if (this.loading) return;

      this.setPageState({
        loading: true,
        data: [],
        pageSize,
      }, () => this.loadPage(current));
    }

    render() {
      const pageState = {
        handlers: this._handlers,
        state: this.state,
      };

      return React.createElement(component, {
        ...this.props,
        pageState,
      });
    }

    _handlers = {
      onLoadMore: this.onLoadMore,
      onPaging: this.onPaging,
      onShowSizeChange: this.onShowSizeChange,
    };
  }

  return HandlePageState;
};

export default handlePageState;
