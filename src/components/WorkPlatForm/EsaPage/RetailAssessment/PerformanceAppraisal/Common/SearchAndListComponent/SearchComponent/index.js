import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
/**
 * 搜索组件
 */
class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleListSearch=(value) => {
    const { handleListSearch } = this.props;
    if (handleListSearch && typeof handleListSearch === 'function') {
      handleListSearch(value);
    }
  }
  render() {
    return (
      <Fragment>
        <div className="m-form ant-form" style={{ margin: '0' }}>
          <Input.Search
            placeholder="搜索主题"
            onSearch={value => this.handleListSearch(value)}
          />
        </div>

      </Fragment>
    );
  }
}

export default SearchComponent;
