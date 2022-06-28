import React, { Component, Fragment } from 'react';
import { Button } from 'antd';

/**
 * 步骤条控制页脚
*/
class PageFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 点击确定
  onOk = () => {
    const { onOk } = this.props;
    if (typeof onOk === 'function') {
      onOk();
    }
  }

  // 点击上一步
  toPreStep = () => {
    const { toPreStep } = this.props;
    if (typeof toPreStep === 'function') {
      toPreStep();
    }
  }

  // 点击下一步
  toNextStep = () => {
    const { toNextStep } = this.props;
    if (typeof toNextStep === 'function') {
      toNextStep();
    }
  }

  render() {
    const { current = 0, total = 0 } = this.props;
    return (
      <Fragment>
        <div className="tr bd-top pt6 pb6">
          {/* {current !== 0 && <Button className="m-btn-radius m-btn-headColor mr12" onClick={this.toPreStep}>上一步</Button>} */}
          {current === 0 && <Button className="m-btn-radius m-btn-headColor mr12" onClick={this.toNextStep}>下一步</Button>}
          {current === total && <Button className="m-btn-radius m-btn-headColor mr12" onClick={this.onOk}>确定</Button>}
        </div>
      </Fragment>
    );
  }
}
export default PageFooter;
