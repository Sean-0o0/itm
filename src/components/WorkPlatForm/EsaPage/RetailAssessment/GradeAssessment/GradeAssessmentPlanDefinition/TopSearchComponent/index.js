import React, { Fragment } from 'react';
import { Card, Input, Button } from 'antd';

const { Search } = Input;

/**
 * 查询搜索组件
 */
class TopSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <Fragment>
        <Card style={{ height: '100%' }} className="m-card">
          <div style={{ padding: '10px 15px' }}>
            <div style={{ textAlign: 'left' }} >
              <span className="navigation-search-right-labels">营业部</span>
              <Search
                readOnly
                placeholder="input search text"
                style={{ width: '15%' }}
                defaultValue="信息部"
              />
              <span className="navigation-search-right-labels">考核类别</span>
              <Search
                readOnly
                placeholder="请选择"
                style={{ width: '15%' }}
                defaultValue=""
              />
              <span className="navigation-search-right-labels">定级类型</span>
              <Search
                readOnly
                placeholder="请选择"
                style={{ width: '15%' }}
                defaultValue=""
              />
              <Button type="button" className="m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ 'margin-left': '10px' }} onClick={this}>查询</Button>
              <Button type="button" className="m-btn-border m-btn-middle m-btn-border-headColor btn-1c" style={{ 'margin-left': '10px' }} onClick={this}>重置</Button>
            </div>
          </div>
        </Card>
      </Fragment>
    );
  }
}
export default TopSearchComponent;
