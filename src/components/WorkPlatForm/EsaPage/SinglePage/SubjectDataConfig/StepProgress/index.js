import React, { Component, Fragment } from 'react';
import { Steps } from 'antd';
/**
 * 主题数据配置步骤条组件
 */
class StepProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { current = 0 } = this.props;
    return (
      <Fragment>
        <Steps
          type="navigation"
          current={current}
          className="site-navigation-steps"
        >
          <Steps.Step
            title="第一步：选择基础数据"
          />
          <Steps.Step
            title="第二步：计算基期数据"
          />
        </Steps>
      </Fragment>
    );
  }
}
export default StepProgress;
