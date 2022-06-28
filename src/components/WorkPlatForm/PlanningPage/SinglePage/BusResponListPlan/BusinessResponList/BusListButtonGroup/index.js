import React from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import BusEvaluationSchemeModel from '../BusEvaluationSchemeModel';
import { EncryptBase64 } from '../../../../../../Common/Encrypt';
import LBFrameModal from '../../../../../../Common/BasicModal/LBFrameModal';
import { FetchLivebosLink } from '../../../../../../../services/amslb/user';
import {
  FetchAssessPlanOptStart,
  FetchAssessPlanRelease,
  FetchAssessPlanWfStart, FetchStartBusResponWorkflow,
} from '../../../../../../../services/planning/planning';

class BusListButtonGroup extends React.Component {
  state = {
    bussinessArray: [],
    orgList: [],
    headArray: [],
    defaultHead: {},

    orgId: 0,
    headId: 0,
    year: 2021,

    consultationVisible: false,
    submitVisible: false,
    releaseVisible: false,

    submitUrl: '',
    releaseUrl: '',
    url: '',

    payload:"",
    title:'',
    type:'',
  };


  componentDidMount() {

  }

  //关闭弹窗
  closeModal = () => {
    const {reloadTable} = this.props;
    this.setState({ consultationVisible: false, }, () => {
      reloadTable();
    });
  };

  //意见征求方法调用微服务接口
  submitRequest = () => {
    const { planIdStr } = this.props;
    //console.log("-----意见征求方法调用微服务接口--this.state.payload：---",this.state.payload);
    FetchAssessPlanOptStart({
      planId: planIdStr.substring(planIdStr.indexOf('=') + 1),
      optionemp:this.state.payload
  }).then((ret = {}) => {
      if (ret.code) {
        message.success(ret.note);
        this.closeModal();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  //提交审批方法调用微服务接口
  submitApprove = ()=>{
    const { planIdStr } = this.props;
    //console.log("---提交审批方法调用微服务接口--this.state.payload:-----",this.state.payload);
    // if(this.state.payload === ""){
    //   return message.error('考核小组成员不允许空值！');
    // }
    FetchStartBusResponWorkflow({
      planId: planIdStr.substring(planIdStr.indexOf('=') + 1),
      teamMember:this.state.payload
    }).then((ret = {}) => {
      if (ret.code) {
        message.success(ret.note);
        this.closeModal();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //考核方案发布调用微服务接口
  submitPush = ()=>{
    const { planIdStr } = this.props;
    FetchAssessPlanRelease({
      planId: planIdStr.substring(planIdStr.indexOf('=') + 1),
    }).then((ret = {}) => {
      if (ret.code) {
        message.success(ret.note);
        this.closeModal();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  callBackForModel = (params) => {
    this.setState({
      payload:params,
    })
  }

  //提交发布
  submitRelease = (messageObj) => {
    const { reloadTable } = this.props;
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      message.success('封存成功');
      this.closeModal();
      reloadTable();
    }
  };

  render() {
    const { consultationVisible, submitVisible, releaseVisible, url, submitUrl, releaseUrl } = this.state;
    const {palnStatus, authorities: { busResponList = [] } } = this.props;
    return <div style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>
       {/*判断用户是否具有按钮权限*/}
      {/*{busResponList.includes('assessPlanLead')*/}
      {/*&& <Link to={`/esa/planning/bussinessAssessment/${EncryptBase64(JSON.stringify({ planType: 1 }))}`}>*/}
      {/*  <Button style={{ flexShrink: 0, marginRight: '10px' }}*/}
      {/*          className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>新增</Button>*/}
      {/*</Link>*/}
      {/*}*/}
      {busResponList.includes('busResponAdd')
      && <Link to={`/esa/planning/bussinessResponse/${EncryptBase64(JSON.stringify({ planType: 2 }))}`}>
        <Button style={{ flexShrink: 0, marginRight: '10px' }}
                className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>新增</Button>
      </Link>
      }
      {/*{busResponList.includes('addDepartmentAssessPlan')*/}
      {/*&& <Link to={'/esa/planning/departmentAssessPlan'}>*/}
      {/*  <Button style={{ flexShrink: 0, marginRight: '10px' }}*/}
      {/*          className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>新增职能部门考核方案</Button>*/}
      {/*</Link>}*/}
      {busResponList.includes('busResponConsultation')
      && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                 onClick={() => {
                   const { planIdStr } = this.props;
                   const flag = planIdStr.substring(planIdStr.indexOf('=') + 1).length > 0 ? true : false;
                   if (!flag) {
                     return message.error('请勾选考核对象');
                   }
                   this.setState({
                     title:'意见征求',
                     type:'1',
                     consultationVisible: true,
                   });
                 }} style={{ marginRight: '10px', flexShrink: 0 }}>
        意见征求</Button>}
      {busResponList.includes('busResponSubmitForReview')
      && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                 onClick={() => {
                   const { planIdStr } = this.props;
                   const flag = planIdStr.substring(planIdStr.indexOf('=') + 1).length > 0 ? true : false;
                   if (!flag) {
                     return message.error('请勾选考核对象');
                   }
                   this.setState({
                     title:'提交审批',
                     type:'2',
                     consultationVisible: true,
                   });
                 }} style={{ marginRight: '10px', flexShrink: 0 }}>
        提交审批</Button>}

      {busResponList.includes('busResponSubmit')
      && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                 onClick={() => {
                   const { planIdStr } = this.props;
                   const flag = planIdStr.substring(planIdStr.indexOf('=') + 1).length > 0 ? true : false;
                   if (!flag) {
                     return message.error('请勾选考核对象');
                   }
                   this.setState({
                     title:'封存',
                     type:'3',
                     consultationVisible: true,
                   });
                 }} style={{ marginRight: '10px', flexShrink: 0 }}>
        封存</Button>}
      <BusEvaluationSchemeModel modalProps={{
        style: { overflowY: 'auto', top: '20rem' },
        destroyOnClose: true,
        title: this.state.title,
        type:this.state.type,
        palnStatus:palnStatus,
        visible: consultationVisible,
        onCancel: this.closeModal,
        onOk: this.state.type==='3'?this.submitPush:(this.state.type==='2'?this.submitApprove:this.submitRequest),
        callBackForModel: this.callBackForModel,
      }} />
      <LBFrameModal
        modalProps={{
          style: { top: '20rem' },
          destroyOnClose: true,
          title: '封存',
          width: '63rem',
          height: '15rem',
          visible: releaseVisible,
          onCancel: this.closeModal,
        }}
        frameProps={{
          height: '11rem',
          src: `${localStorage.getItem('livebos') || ''}${releaseUrl}`,
          onMessage: this.submitRelease,
        }}
      />
    </div>;
  }
}

export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(BusListButtonGroup);
