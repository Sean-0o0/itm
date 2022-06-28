import React from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import ShareInput from '../EvaluationSchemeModel/FilterModel';
import EvaluationSchemeModel from '../EvaluationSchemeModel';
import { EncryptBase64 } from '../../../../../../../Common/Encrypt';
import LBFrameModal from '../../../../../../../Common/BasicModal/LBFrameModal';
import { FetchLivebosLink } from '../../../../../../../../services/amslb/user';
import {
  FetchAssessPlanOptStart,
  FetchAssessPlanRelease,
  FetchAssessPlanWfStart,
} from '../../../../../../../../services/planning/planning';

class ListButtonGroup extends React.Component {
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

  //获取livebos对象的url
  fetchLBUrl = (type, methodName, params) => {
    //type=1的时候为意见征求 2为提交审批 3为发布
    const { planIdStr } = this.props;
    const flag = planIdStr.substring(planIdStr.indexOf('=') + 1).length > 0 ? true : false;
    flag && FetchLivebosLink({
      object: 'TASSESS_PLAN_BASEINFO',
      method: methodName,
      params: { PLANID: planIdStr.substring(planIdStr.indexOf('=') + 1) },
    }).then((ret = {}) => {
      const { data = '' } = ret;
      if (data) {
        if (type === 1) {
          this.setState({
            url: data,
            consultationVisible: true,
          });
        } else if (type === 2) {
          this.setState({
            submitUrl: data,
            submitVisible: true,
          });
        } else if (type === 3) {
          this.setState({
            releaseUrl: data,
            releaseVisible: true,
          });
        }

      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    if (!flag) {
      message.error('请勾选考核对象');
    }
  };

  //关闭弹窗
  closeModal = () => {
    const {reloadTable} = this.props;
    this.setState({ consultationVisible: false, }, () => {
      reloadTable();
    });
  };

  //chenjian-意见征求方法调用微服务接口
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

  //chenjian-提交审批方法调用微服务接口
  submitApprove = ()=>{
    const { planIdStr } = this.props;
    //console.log("---提交审批方法调用微服务接口--this.state.payload:-----",this.state.payload);
    if(this.state.payload === ""){
      return message.error('考核小组成员不允许空值！');
    }
    FetchAssessPlanWfStart({
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

  //chenjian-考核方案发布调用微服务接口
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

  //提交意见征求
  submitConsultation = (messageObj) => { // iframe的回调事件
    const { reloadTable } = this.props;
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      message.success('意见征求成功');
      this.closeModal();
      reloadTable();
    }
  };

  //提交审批
  handleSubmit = (messageObj) => {
    const { reloadTable } = this.props;
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      message.success('提交成功');
      this.closeModal();
      reloadTable();
    }
  };

  //提交发布
  submitRelease = (messageObj) => {
    const { reloadTable } = this.props;
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.closeModal();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      message.success('发布成功');
      this.closeModal();
      reloadTable();
    }
  };

  render() {
    const { consultationVisible, submitVisible, releaseVisible, url, submitUrl, releaseUrl } = this.state;
    const {palnStatus, authorities: { assessPlanBusList = [] } } = this.props;

    //定义权限数组
    //const authsArray = Object.keys(authorities)
    // addBussinessAssessment  新增业务条线
    // addDepartmentAssessPlan 新增职能部门
    // assessPlanConsultation              意见征求
    // assessPlanLead    新增高管
    // assessPlanSubmitForReview  提交审核
    // assessPlanSubmitForReview   发布
    return <div style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>
      {/* 判断用户是否具有按钮权限 */}
      {/*{assessPlanBusList.includes('assessPlanLead')*/}
      {/*&& <Link to={`/esa/planning/bussinessAssessment/${EncryptBase64(JSON.stringify({ planType: 1 }))}`}>*/}
      {/*  <Button style={{ flexShrink: 0, marginRight: '10px' }}*/}
      {/*          className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>新增高管考核方案</Button>*/}
      {/*</Link>*/}
      {/*}*/}
      {assessPlanBusList.includes('AssessPlanBusAdd')
      && <Link to={`/esa/planning/bussinessAssessment/${EncryptBase64(JSON.stringify({ planType: 2 }))}`}>
        <Button style={{ flexShrink: 0, marginRight: '10px' }}
                className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>新增</Button>
      </Link>
      }
      {/*{assessPlanBusList.includes('addDepartmentAssessPlan')*/}
      {/*&& <Link to={'/esa/planning/departmentAssessPlan'}>*/}
      {/*  <Button style={{ flexShrink: 0, marginRight: '10px' }}*/}
      {/*          className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'>新增职能部门考核方案</Button>*/}
      {/*</Link>}*/}
      {assessPlanBusList.includes('AssessPlanBusOption')
      && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                 onClick={() => {
                   // this.fetchLBUrl(1, 'TASSESS_PLAN_BASEINFO_OPTION')
                   //两个按钮(意见征求,提交审批)  之前调用livebos方法
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
      {assessPlanBusList.includes('AssessPlanBusSubmit')
      && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                 onClick={() => {
                   // this.fetchLBUrl(1, 'TASSESS_PLAN_BASEINFO_OPTION')
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

      {assessPlanBusList.includes('AssessPlanBusRelease')
      && <Button className='fcbtn m-btn-border m-btn-middle m-btn-border-headColor btn-1c'
                 onClick={() => {
                   //this.fetchLBUrl(3, 'TASSESS_PLAN_BASEINFO_FB');
                   // this.fetchLBUrl(1, 'TASSESS_PLAN_BASEINFO_OPTION')
                   const { planIdStr } = this.props;
                   const flag = planIdStr.substring(planIdStr.indexOf('=') + 1).length > 0 ? true : false;
                   if (!flag) {
                     return message.error('请勾选考核对象');
                   }
                   this.setState({
                     title:'发布',
                     type:'3',
                     consultationVisible: true,
                   });
                 }} style={{ marginRight: '10px', flexShrink: 0 }}>
        发布</Button>}
      <EvaluationSchemeModel modalProps={{
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
      {/*<EvaluationSchemeModel modalProps={{*/}
      {/*  style: { overflowY: 'auto', top: '10rem' },*/}
      {/*  destroyOnClose: true,*/}
      {/*  title: '提交审批',*/}
      {/*  fontcolor: 'red',*/}
      {/*  width: '80rem',*/}
      {/*  height: '60rem',*/}
      {/*  visible: submitVisible,*/}
      {/*  onCancel: this.closeModal,*/}
      {/*  onOk: this.closeModal,*/}
      {/*}} />*/}
      <LBFrameModal
        modalProps={{
          style: { top: '20rem' },
          destroyOnClose: true,
          title: '发布',
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
}))(ListButtonGroup);
