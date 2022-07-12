import React from 'react';
import { connect } from 'dva';
import {Row, Col, Result} from 'antd';
import { withRouter } from 'dva/router';
// import DynamicReminding from '../../components/HomePage/DynamicReminding';
import Notification from '../../components/HomePage/Notification';
import TodoBusiness from '../../components/HomePage/TodoBusiness';
import CommonFunction from '../../components/HomePage/CommonFunction';
class HomePage extends React.Component {
    render() {
        const { dispatch, BaseNewClass } = this.props;

        return (
          <div className="flex-c h100">
            <Result
              status="404"
              title="建设中...敬请期待!"
              // subTitle="Sorry, the page you visited does not exist."
            />
          </div>
        );
    }
}

export default withRouter(connect(({ homePage }) => ({
    liquidfillDatas: homePage.liquidfillDatas,
    BaseNewClass: homePage.BaseNewClass,
}))(HomePage));

