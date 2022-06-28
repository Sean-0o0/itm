import React, { Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import { connect } from 'dva';
import RightContent from '../../../../../components/WorkPlatForm/PlanningPage/AccessPlan/AccessPlanDetail/RightContent';
import LeftContent from '../../../../../components/WorkPlatForm/PlanningPage/AccessPlan/AccessPlanDetail/LeftContent';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';

/**
 * 业务条线经营计划书
 */

class AccessPlanDetail extends React.Component {
  state = {
    planId: '',
    planType: '',
    planStatus:'',
    opr: false,
    headState:{},//考核方案列表的头部查询条件
    rollback:false,//是否要展示返回
  };
  payload ={
    hisplanId:'',
    planType:'',
  }

  componentWillMount() {
    this.getUrlParams();
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //   //console.log('-----组件将要更新-----');
  //   this.getUrlParams();
  // }

  // 获取url参数
  getUrlParams = () => {
    const { match: { params: { params: encryptParams = '' } } } = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    let headState = params.headState;
    let rollback = params.rollback;
    //console.log('-------详情页面的headState-----', headState);
    //console.log('-------opr-----', params);
    this.setState({
      planId: params.planId,
      planType: params.planType,
      planStatus:params.planStatus,
      headState:params.headState,
      rollback:params.rollback,
      //opr===undefined时(新增的opr参数,之前跳转的没传opr这个参数,没传的都默认为fasle) 默认为false
      opr: params.opr === undefined ? false : params.opr,
    });
    // return params;
  };

  handleClickCallback = (payload,rollback) => {
    ////console.log('------主页面----');
    ////console.log('------payload----', payload);
    this.payload.hisplanId = payload.hisplanId;
    this.payload.planType = payload.planType;
    this.setState({
      opr: true,
      rollback:rollback
    });
    ////console.log('------主页面-opr---', this);
  };

  render() {
    const { dictionary = [],match: { params: { params: encryptParams = '' } }} = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    const { planId = '', planType = '',planStatus='', opr,headState,rollback } = this.state;
    let rollbackflag = rollback;
    return (
      opr === false ? (
        <Fragment>
          <Row style={{ height: '100%' }}>
            <Col span={24} style={{ height: '100%' }}>
              <LeftContent planId={planId} planType={planType} planStatus={planStatus} dictionary={dictionary} opr={opr} icon2={true} getUrlParams={this.getUrlParams} handleClickCallback={this.handleClickCallback} rollback={rollbackflag} headState={headState}/>
            </Col>
            {/*<Col span={1} style={{ height: '100%' }}>*/}
            {/*  <RightContent planId={planId} planType={planType} dictionary={dictionary}*/}
            {/*                handleClickCallback={this.handleClickCallback} />*/}
            {/*</Col>*/}
          </Row>
        </Fragment>
      ) : (<Fragment>
        <Row style={{ height: '100%' }}>
          <Col span={24} style={{ height: '100%' }}>
            <LeftContent planId={this.payload.hisplanId} planType={this.payload.planType} opr={opr} getUrlParams={this.getUrlParams} rollback={rollbackflag} headState={headState}/>
          </Col>
        </Row>
      </Fragment>)
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(AccessPlanDetail);
