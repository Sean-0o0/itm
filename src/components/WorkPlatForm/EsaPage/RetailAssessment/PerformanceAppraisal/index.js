import React, { Fragment } from 'react';
import { Row, Col, Modal, message } from 'antd';
import SearchAndListComponent from './Common/SearchAndListComponent';
import AppraisalPlanDetail from './Common/AppraisalPlanDetail';
import AddEditPlanModal from './Common/AddEditPlanModal';
import AuditModal from './Common/AuditModal';
import { getDictKey } from '../../../../../utils/dictUtils';
import {
  FetchoperateAppraisalProgramConf, // 绩效考核方案设置
  FetchqueryListAppraisalProgram, // 绩效考核方案查询
  FetchqueryListAppraisalProgramDetail, // 绩效考核方案明细
  FetchoperateEmpPrfmExamProgram, // 个人绩效考核方案设置
  FetchqueryListEmpPrfmExamProgram, // 个人绩效考核方案查询
  FetchqueryListEmpPrfmExamProgramDetail, // 个人绩效考核方案明细
  FetchqueryInfoAppraisalProgramWeight, // 绩效考核方案权重
} from '../../../../../services/EsaServices/performanceAssessment';
import { fetchObject } from '../../../../../services/sysCommon';
/**
 * 绩效考核方案
 */
class PerformanceAppraisal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '', // 当前选中条目id
      planList: [], // 方案列表
      total: 0, // 总条数
      planDetail: {}, // 方案详情
      // eslint-disable-next-line react/no-unused-state
      indexDetail: [], // 指标详情
      addEditPlanModal: {// 新增修改方案modal
        visible: false,
        type: '', // 操作类型 // 1|新增 2|修改
      },
      auditModal: { // 审核modal
        visible: false,
        type: '', // modal类型 // 1|营业部 2|分公司
      },
      queryPlanListParams: {
        current: 1, // 当前页码
        title: '', // 搜索主题
      },
    };
  }
  componentDidMount() {
    this.fetchPlanData();
  }

  UNSAFE_componentWillUpdate(nextProps){
    const { userBasicInfo={} } = nextProps;
    if(JSON.stringify(userBasicInfo) !== JSON.stringify(this.props.userBasicInfo)){
      this.fetchPlanData({orgNo : userBasicInfo.orgid || '1'});
    }
  }
  // 新增修改方案modal取消
  onAddEditPlanModalCancel=() => {
    const { addEditPlanModal } = this.state;
    this.setState({ addEditPlanModal: { ...addEditPlanModal, visible: false } });
  }
  // 审核modal取消
  onAuditModalCancel=() => {
    const { auditModal } = this.state;
    this.setState({ auditModal: { ...auditModal, visible: false } });
  }
  // 点击列表项
  handelListItemClick=(item) => {
    const { planList } = this.state;
    const planDetail = [...planList].find(elem => elem.tmplId === item.tmplId);
    this.setState({ selectedId: item.tmplId, planDetail });
    const { pageType } = this.props;
    if (pageType === '1') {
      this.fetchqueryListAppraisalProgramDetail({ tmplId: item.tmplId });
    } else {
      this.fetchqueryListEmpPrfmExamProgramDetail({ tmplId: item.tmplId });
    }
  }
  // 删除列表项
  handleDelete=(item) => {
    this.openConfirmModal({
      content: '此操作将永久删除该数据，是否继续？',
      onOk: () => {
        const { pageType } = this.props;
        if (pageType === '1') {
          this.fetchopreateAppraisalProgramConf({
            oprType: 3, tmplId: item.tmplId,
          }, () => {
            this.fetchPlanData();
          });
        } else {
          this.fetchoperateEmpPrfmExamProgram({
            oprType: 3, tmplId: item.tmplId,
          }, () => {
            this.fetchPlanData();
          });
        }
      },
    });
  }
  // 切换页码
  handlePageChange=(current) => {
    const { queryPlanListParams = {} } = this.state;
    this.setState({ queryPlanListParams: { ...queryPlanListParams, current } });
    this.fetchPlanData({ current });
  }
  // 新增方案
  handlePlanAdd=(value) => {
    const { addEditPlanModal } = this.state;
    this.setState({ addEditPlanModal: { ...addEditPlanModal, visible: true, type: '1', examType: value } });
    this.fetchIndexList(value);
  }
  // 搜索方案
  handleListSearch=(title) => {
    this.fetchPlanData({ title, current: 1 });
    this.setState({ queryPlanListParams: { title, current: 1 } });
  }
  // 方案修改
  handlePlanEdit=() => {
    const { selectedId, planDetail: { status }, addEditPlanModal } = this.state;
    if (!selectedId) {
      message.error('未选中任何考核方案！');
    } else if (status === '-1' || status === '0') {
      this.setState({ addEditPlanModal: { ...addEditPlanModal, visible: true, type: '2' } });
    } else {
      message.error('已提交审核的方案禁止修改！');
    }
  }
  // 新增修改方案提交
  handlePlanSubmit=(params, callback, onError) => {
    const { pageType ,versionId = '',orgId} = this.props;
    if (versionId) {
      Reflect.set(params, 'versionId', versionId)
      Reflect.set(params, 'orgNo', orgId)
    }
    if (pageType === '1') {
      this.fetchopreateAppraisalProgramConf(params, callback, onError);
    } else {
      this.fetchoperateEmpPrfmExamProgram(params, callback, onError);
    }
  }
  // 提交审批
  handleSubmitExamine=() => {
    const { selectedId, planDetail: { status } } = this.state;
    if (!selectedId) {
      message.error('未选中任何考核方案！');
    } else if (status === '0' || status === '-1') {
      this.openConfirmModal(
        { content: '是否确认提交？' },
        () => this.handleAudit(
          { tmplId: selectedId, oprType: '4' },
          () => this.fetchPlanData({}, true)
        )
      );
    } else {
      message.error('请选择未提交审批的方案！');
    }
  }
  // 营业部负责人审批
  handleDepartmentExamine=() => {
    const { selectedId, planDetail: { status }, auditModal } = this.state;
    if (!selectedId) {
      message.error('未选中任何考核方案！');
    } else if (status === '1') {
      this.setState({ auditModal: { ...auditModal, visible: true, type: '1' } });
    } else {
      message.error('审批中的方案才可进行营业部负责人审批！');
    }
  }
  // 分公司复核
  handleCompanyExamine=() => {
    const { selectedId, planDetail: { status }, auditModal } = this.state;
    if (!selectedId) {
      message.error('未选中任何考核方案！');
    } else if (status === '2') {
      this.setState({ auditModal: { ...auditModal, visible: true, type: '2' } });
    } else {
      message.error('营业部审批通过才可进行复核！');
    }
  }
  // 回退方案
  handlePlanReturn=() => {
    const { selectedId, planDetail } = this.state;
    if (!selectedId) {
      message.error('未选中任何考核方案！');
    }
    else if(planDetail.status === '0'){
      message.error('未提交审核，无需进行回退！');
    }
    else if(planDetail.status === '-1'){
      message.error('已被退回，无需进行回退！');
    }
    else {
      this.openConfirmModal(
        { content: '是否确认回退？' },
        () => this.handleAudit(
          { tmplId: selectedId, oprType: '7' }
          , () => this.fetchPlanData({}, true)
        )
      );
    }
  }
  // 获取列表数据
  fetchPlanData=(payload = {}, refreshSelectedId = false) => {
    const { pageType, orgId = '', versionId = ''} = this.props;
    if (orgId) {
      Reflect.set(payload, 'orgNo', orgId)
    }
    if (versionId) {
      Reflect.set(payload, 'versionId', versionId)
    }
    if (pageType === '1') {
      this.fetchqueryListAppraisalProgram({ ...payload }, refreshSelectedId);
    } else if (pageType === '2') { // 个人绩效考核方案
      this.fetchqueryListEmpPrfmExamProgram({ ...payload }, refreshSelectedId);
    }
  }
  // 确认框
  openConfirmModal=(options = {}, onOk, onCancel) => {
    const { theme = 'default-dark-theme' } = this.props;
    Modal.confirm({
      title: '提示',
      content: '确认进行该操作？',
      okText: '确定',
      cancelText: '取消',
      autoFocusButton: null,
      className: theme,
      okButtonProps: { className: 'm-btn-radius m-btn-headColor', style: { marginLeft: 0 } },
      cancelButtonProps: { className: 'm-btn-radius m-btn-gray' },
      onCancel: () => { if (typeof onCancel === 'function') onCancel(); },
      onOk: () => { if (typeof onOk === 'function') onOk(); },
      ...options,
    });
  }
  // 审批
  handleAudit=(payload = {}, callback, onError) => {
    const { pageType } = this.props;
    if (pageType === '1') {
      this.fetchopreateAppraisalProgramConf(payload, () => { callback(); this.fetchPlanData({}, true); }, onError);
    } else {
      this.fetchoperateEmpPrfmExamProgram(payload, () => { callback(); this.fetchPlanData({}, true); }, onError);
    }
  }
  // 绩效考核方案设置
  fetchopreateAppraisalProgramConf=(payload = {}, callback, onError) => {
    FetchoperateAppraisalProgramConf({ ...payload }).then((res) => {
      const { code, note } = res;
      if (code > 0) {
        message.success(note);
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        message.error(note);
        if (typeof onError === 'function') {
          onError();
        }
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
      if (typeof onError === 'function') {
        onError();
      }
    });
  }
  // 绩效考核方案查询
  fetchqueryListAppraisalProgram=(payload = {}, refreshSelectedId = false) => {
    const { userBasicInfo = {} } = this.props;
    const { queryPlanListParams = {}, selectedId } = this.state;
    const pagination = { paging: 1, pageSize: 10, total: -1, orgNo: userBasicInfo.orgid || '' };
    if(userBasicInfo.orgid){
      FetchqueryListAppraisalProgram({ ...pagination, ...queryPlanListParams, ...payload }).then((res) => {
        const { code, note, records = [], total } = res;
        if (code > 0) {
          this.setState({
            planList: records,
            total,
          });
          if (!refreshSelectedId) {
            this.setState({ selectedId: records.length > 0 ? records[0].tmplId : '', planDetail: records.length > 0 ? records[0] : {} });
          } else {
            const obj = records.find(item => item.tmplId === selectedId);
            this.setState({ selectedId: this.state.selectedId, planDetail: obj || {} });
          }
          if (records.length > 0) {
            this.fetchqueryListAppraisalProgramDetail({ tmplId: refreshSelectedId ? selectedId : records[0].tmplId });
          }
        } else {
          message.error(note);
        }
      }).catch((e) => {
        message.error(!e.success ? e.message : e.note);
      });
    }

  }
  // 绩效考核方案明细
  fetchqueryListAppraisalProgramDetail=(payload = {}) => {
    FetchqueryListAppraisalProgramDetail({ ...payload }).then((res) => {
      const { code, note, records = [] } = res;
      if (code > 0) {
        this.setState({ indexDetail: records });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 个人绩效考核方案设置
  fetchoperateEmpPrfmExamProgram=(payload = {}, callback, onError) => {
    FetchoperateEmpPrfmExamProgram({ ...payload }).then((res) => {
      const { code, note } = res;
      if (code > 0) {
        message.success(note);
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        message.error(note);
        if (typeof onError === 'function') {
          onError();
        }
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
      if (typeof onError === 'function') {
        onError();
      }
    });
  }
  // 个人绩效考核方案查询
  fetchqueryListEmpPrfmExamProgram=(payload = {}, refreshSelectedId = false) => {
    const { userBasicInfo = {} } = this.props;
    const { id = '' } = payload;
    const { queryPlanListParams = {}, selectedId } = this.state;
    const pagination = { paging: 1, pageSize: 10, total: -1, orgNo: userBasicInfo.orgid || '' };
    if(userBasicInfo.orgid){
      FetchqueryListEmpPrfmExamProgram({ ...pagination, ...queryPlanListParams, ...payload }).then((res) => {
        const { code, note, records = [], total } = res;
        if (code > 0) {
          if (id) { // 查询单记录
            this.setState({ planDetail: records.length > 0 ? records[0] : {} });
          } else { // 查询列表
            this.setState({
              planList: records,
              total,
            });
            if (!refreshSelectedId) {
              this.setState({ selectedId: records.length > 0 ? records[0].tmplId : '', planDetail: records.length > 0 ? records[0] : {} });
            } else {
              const obj = records.find(item => item.tmplId === selectedId);
              this.setState({ selectedId: this.state.selectedId, planDetail: obj || {} });
            }
            if (records.length > 0) {
              this.fetchqueryListEmpPrfmExamProgramDetail({ tmplId: refreshSelectedId ? selectedId : records[0].tmplId });
            }
          }
        } else {
          message.error(note);
        }
      }).catch((e) => {
        message.error(!e.success ? e.message : e.note);
      });
    }

  }
  // 个人绩效考核方案明细
  fetchqueryListEmpPrfmExamProgramDetail=(payload = {}) => {
    FetchqueryListEmpPrfmExamProgramDetail({ ...payload }).then((res) => {
      const { code, note, records = [] } = res;
      if (code > 0) {
        this.setState({ indexDetail: records });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 新增时获取必选指标
  fetchIndexList=(value) => {
    const { versionId } =this.props;
    let condition = {
      is_must: '1',
      indi_type: value,
    }
    if (versionId) {
      condition.version = versionId;
    }
    fetchObject('JXZB', { condition }).then((res) => {
      const { note, code, records } = res;
      if (code > 0) {
        if (records) {
          const indexList = [...records].map(indexObj => {
            let initialCvrtRatio = '';
            if ((indexObj.CVRT_SCORE || indexObj.CVRT_SCORE === '0') && indexObj.EXAM_STD) {
              initialCvrtRatio = (parseFloat(indexObj.CVRT_SCORE) / parseFloat(indexObj.EXAM_STD)).toFixed(2);
            }
            return {
              id: indexObj.ID,
              examIndi: indexObj.EXAM_INDI,
              indiName: indexObj.INDI_NAME,
              indiCode: indexObj.INDI_CODE,
              examWeight: indexObj.PRFM_WEIGHT,
              isMust: indexObj.IS_MUST,
              scoreBtm: indexObj.SCORE_BTM,
              scoreTop: indexObj.SCORE_TOP,
              scoreModeId: indexObj.SCORE_MODE,
              weightBtm: indexObj.WEIGHT_BTM,
              weightTop: indexObj.WEIGHT_TOP,
              zeroThld: indexObj.ZERO_THLD,
              pctThld: indexObj.PCT_THLD,
              bizQtyUnit: indexObj.BIZ_QTY_UNIT,
              pctThldUnit: indexObj.PCT_THLD_UNIT,
              cvrtRatio: initialCvrtRatio,
              isRvs: indexObj.IS_RVS,
              std1Score: indexObj.CVRT_SCORE,
              examStd1: indexObj.EXAM_STD,
              elgThld: indexObj.ELG_THLD,
              version: indexObj.VERSION,
            }
          });
          this.setState({ indexList });
        } else {
          this.setState({ indexList: [] });
        }
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 绩效考核方案权重查询
  fetchqueryInfoAppraisalProgramWeight=() => {
    FetchqueryInfoAppraisalProgramWeight({}).then((res) => {
      const { code, note, records = [] } = res;
      if (code > 0) {
        this.setState({ indexDetail: records });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  render() {
    const {
      dictionary: {
        [getDictKey('BMLB')]: depClass = [], // 部门类别
        [getDictKey('AREA_CLASS')]: area = [], // 适用大区
        [getDictKey('ZBLX')]: examTypeList = [], // 指标类型
      },
      pageType,
      versionId,
      orgId,
      vorgName,
      vexamClass
    } = this.props;
    const { selectedId, addEditPlanModal, auditModal, planList, planDetail, indexDetail, queryPlanListParams: { current }, total, indexList = [] } = this.state;
    const pagination = { current, total };
    return (
      <Fragment>
        <Row style={{ height: '100%' }} className="mt10 esa-scrollbar">
          <Col xs={6} sm={6} lg={6} xl={6} className="h100" style={{ borderRight: '1px solid #e8e8e8' }}>
            {/* 左侧搜索以及考核列表 */}
            <SearchAndListComponent
              selectedId={selectedId}
              planList={planList}
              pagination={pagination}
              handelListItemClick={this.handelListItemClick}
              handleDelete={this.handleDelete}
              handlePageChange={this.handlePageChange}
              handlePlanAdd={this.handlePlanAdd}
              handleListSearch={this.handleListSearch}
              pageType={pageType}
            />
          </Col>
          <Col xs={18} sm={18} lg={18} xl={18} className="h100">
            {/* 右侧考核操作 指标详情 */}
            <AppraisalPlanDetail total={this.state.total}
              planDetail={planDetail}
              handlePlanEdit={this.handlePlanEdit}
              handleSubmitExamine={this.handleSubmitExamine}
              handleDepartmentExamine={this.handleDepartmentExamine}
              handleCompanyExamine={this.handleCompanyExamine}
              handlePlanReturn={this.handlePlanReturn}
              indexDetail={indexDetail}
              pageType={pageType}
            />
          </Col>
        </Row>
        {
          addEditPlanModal.visible && (
          <AddEditPlanModal
            versionId={versionId}
            vorgName={vorgName}
            vexamClass={vexamClass}
            orgId={orgId}
            {...addEditPlanModal}
            onCancel={this.onAddEditPlanModalCancel}
            depClass={depClass}
            examTypeList={examTypeList}
            area={area}
            indexDetail={indexDetail}
            planDetail={planDetail}
            indexList={indexList}
            handlePlanSubmit={this.handlePlanSubmit}
            pageType={pageType}
            fetchPlanData={this.fetchPlanData}
            userBasicInfo={this.props.userBasicInfo}
          />
        )}
        { auditModal.visible && <AuditModal {...auditModal} selectedId={selectedId} onCancel={this.onAuditModalCancel} handleAudit={this.handleAudit} /> }
      </Fragment>
    );
  }
}
export default PerformanceAppraisal;
