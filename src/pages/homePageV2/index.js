import React from 'react';
import { connect } from 'dva';
import {Row, Col, Result} from 'antd';
import work from '../../image/pms/work.png';
import { withRouter } from 'dva/router';
// import DynamicReminding from '../../components/HomePage/DynamicReminding';
import Notification from '../../components/HomePage/Notification';
import TodoBusiness from '../../components/HomePage/TodoBusiness';
import CommonFunction from '../../components/HomePage/CommonFunction';
import icon_normal from "../../image/pms/icon_milepost_normal.png";
class HomePage extends React.Component {
    render() {
        const { dispatch, BaseNewClass } = this.props;

        return (
          <div className="flex-c h100">
            {/*<Result*/}
            {/*  status="404"*/}
            {/*  title="建设中...敬请期待!"*/}
            {/*  // subTitle="Sorry, the page you visited does not exist."*/}
            {/*/>*/}
            <img src={work} alt="" className='head-img'/>
          </div>
        );
    }
}

export default withRouter(connect(({ homePage }) => ({
    liquidfillDatas: homePage.liquidfillDatas,
    BaseNewClass: homePage.BaseNewClass,
}))(HomePage));

