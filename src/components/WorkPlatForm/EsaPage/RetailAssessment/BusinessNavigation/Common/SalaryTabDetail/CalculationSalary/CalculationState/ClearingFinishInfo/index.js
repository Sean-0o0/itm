import React, { Fragment } from 'react';
import { Progress } from 'antd';

/**
 *  考核导航-计算薪酬-计算状态-结算完成页面组件
 */
class ClearingFinishInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <Fragment>
        <div>
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <div>
              <Progress type="circle" percent={100} format={() => <span style={{ color: 'black' }}>100%</span>} className="esa-salaryNavigation-progress" />
            </div>
            <div>
              <span className="esa-salaryNavigation-trial-status">结算完成</span>
            </div>
          </div>
        </div>
      </Fragment >
    );
  }
}
export default ClearingFinishInfo;
