import React, { Component, Fragment } from 'react';
import { Dropdown, Menu } from 'antd';
import { connect } from 'dva';
/**
 * 点击添加方案下拉菜单
 */
class AddPlanDropdwon extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handlePlanAdd=({ key }) => {
    const { handlePlanAdd } = this.props;
    if (handlePlanAdd && typeof handlePlanAdd === 'function') {
      handlePlanAdd(key);
    }
  }

  render() {
    const { dictionary } = this.props;
    const { EXAM_TYPE: examTypeData = [] } = dictionary;
    const menu = (
      <Menu onClick={value => this.handlePlanAdd(value)}>
        { 
          examTypeData.map((item) => {
            return <Menu.Item key={item.ibm}>{item.note}</Menu.Item>;
        })
        }
      </Menu>
    );
    return (
      <Fragment>
        <Dropdown overlay={menu} placement="bottomRight" getPopupContainer={() => document.getElementById('appraisal-add-plan-dropdown')}>
          <div style={{ height: '32px', lineHeight: '32px' }}>
            <a className="m-color">
              <i className="iconfont icon-add fs-inherit" />&nbsp;新方案
            </a>
          </div>
        </Dropdown>
      </Fragment>
    );
  }
}

export default connect(({ global = {} }) => ({
  dictionary: global.dictionary,
}))(AddPlanDropdwon);