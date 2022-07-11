import React from 'react';
import { Input } from 'antd';

class InputSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  onClick=() => {
    const { handleListRefresh } = this.props;
    if (typeof handleListRefresh === 'function') {
      handleListRefresh();
    }
  }
  onSearch=(value) => {
    const { handleKeywordChange } = this.props;
    if (typeof handleKeywordChange === 'function') {
      handleKeywordChange(value);
    }
  }
  render() {
    return (
      <div className="dis-fx alc" style={{ padding: '0 16px' }}>
        <Input
          className="mot-prod-search-input"
          prefix={<i className="iconfont icon-search fs-inherit" />}
          onInput={e => this.onSearch(e.target.value)}
        />
        <span className="mot-prod-search-input-btn" title="刷新Kafka Connector连接器状态" onClick={this.onClick}>
          <i className="iconfont icon-refresh1 mot-icon" />
        </span>
      </div>
    );
  }
}
export default InputSearch;

