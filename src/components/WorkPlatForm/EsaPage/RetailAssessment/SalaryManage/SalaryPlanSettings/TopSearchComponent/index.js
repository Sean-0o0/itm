import React, { Fragment } from 'react';
import { Row, Col, TreeSelect } from 'antd';

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
    const { gxyybDatas = [], orgId, selectedYyb } = this.props;
    return (
      <Fragment>
        <Row type="flex" justify="space-around" align="middle" style={{ borderBottom: '1px solid #EDF1F4' }}>
          <Col span={24}>
            <div className="m-top-pay-extra">
              <div style={{ margin: '0 1.5rem', padding: '3px 0' }}>
                <TreeSelect
                  // Value={selectedYybName}
                  defaultValue={orgId || selectedYyb}
                  showSearch
                  style={{ minWidth: '26rem' }}
                  dropdownClassName="esa-salaryPlanSettings-treeSelectDropdown"
                  getCalendarContainer={triggerNode => triggerNode.parentNode}
                  dropdownMatchSelectWidth
                  tree
                  disabled={orgId}
                  treeData={gxyybDatas}
                  placeholder="请选择营业部"
                  searchPlaceholder="搜索..."
                  multiple={false}
                  filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.props.handleYYBChange}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
export default TopSearchComponent;
