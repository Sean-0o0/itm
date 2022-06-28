import React, { Component, Fragment } from 'react';
import { Row, Col, message } from 'antd';
import lodash from 'lodash';
import BasicModal from '../../../../../../Common/BasicModal';
import BaseInfo from '../AddEditAppraisalPlan/BaseInfo';
import PersonalBaseInfo from '../AddEditAppraisalPlan/PersonalBaseInfo';
import MandatorySelectedIndex from '../AddEditAppraisalPlan/MandatorySelectedIndex';
import AlternativeIndex from '../AddEditAppraisalPlan/AlternativeIndex';
import Examiners from '../AddEditAppraisalPlan/Examiners';
import IndexModal from '../AddEditAppraisalPlan/IndexModal';
import AssessmentYearModal from '../AddEditAppraisalPlan/AssessmentYearModal';
// import SalesDepartmentModal from '../AddEditAppraisalPlan/SalesDepartmentModal';
import SalesDepartmentModal from '../../../../Common/SalesDepartmentModal';
import ExaminersModal from '../AddEditAppraisalPlan/ExaminersModal';
import { FetchqueryInfoAppraisalProgramWeight } from '../../../../../../../services/EsaServices/performanceAssessment';

/**
 * 新增修改方案
 */

// 两种计分方式-选择指标表格编辑不同
const scoreMode1 = ['6', '4', '5'];// 单位计分制，直接计分，标准折算
const scoreMode2 = ['7', '1'];// 百分制，按完成率

const digit = 2; // 表格小数位
class AddEditPlanModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexModal: { // 指标modal
        visible: false,
      },
      assessmentYearModal: { // 考核年度
        visible: false,
        selectedKeys: '',
      },
      salesDepartmentModal: { // 营业部
        visible: false,
        selectedKeys: [], // 默认选中项
      },
      examinerModal: {
        visible: false,
        selectedKeys: {},
      },
      checkKeyList: [], // 考核人员
      programWeight: {}, // 权重
      depClass: '', // 部门类别
      deptList: [],
      YEAR_NAME: '',
    }
  }
  componentDidMount() {
    const { planDetail: { examYear: year = '', orgNo = '', depClass = '' }, type } = this.props;
    if (type === '2') {
      this.fetchqueryInfoAppraisalProgramWeight({ year, orgNo, depClass });
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ depClass, assessmentYearModal: { visible: false, selectedKeys: year } });
    }
  }
  // 基本信息表单引用
  onBaseInfoRef = (e) => {
    this.baseInfoRef = e;
  }
  // 指标modal取消
  onIndexModalCancel = () => {
    const { indexModal } = this.state;
    this.setState({ indexModal: { ...indexModal, visible: false } });
  }
  // 指标表格
  onAlternativeIndexRef=(ref) => {
    this.alternativeIndexRef = ref;
  }
  // 必选指标表格
  onRequireIndexRef=(ref) => {
    this.requireIndexRef = ref;
  }
  // 考核年度modal取消
  onAssessmentYearModalCancel = () => {
    const { assessmentYearModal } = this.state;
    this.setState({ assessmentYearModal: { ...assessmentYearModal, visible: false } });
  }
  // 营业部取消
  onSalesDepartmentModalCancel = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: false } });
  }
  // 考核人员(个人绩效考核)取消
  onExaminerCancel = () => {
    const { examinerModal } = this.state;
    this.setState({ examinerModal: { ...examinerModal, visible: false } });
  }
  // 添加指标
  handleIndexAdd = () => {
    const { indexModal } = this.state;
    this.setState({ indexModal: { ...indexModal, visible: true } });
  }
  // 选择考核人员(个人绩效考核)
  handleExaminerSelect=() => {
    const { examinerModal } = this.state;
    this.setState({ examinerModal: { ...examinerModal, visible: true } });
  }
  // 选中考核人员(个人绩效考核)
  handleExaminersSelected=(record = {}) => {
    if (record.EMP_NAME) {
      this.setState({ examinerModal: { visible: false, selectedKeys: record } });
      this.baseInfoRef.changeFieldValue({ empName: record.EMP_NAME });
      // this.fetchqueryInfoAppraisalProgramWeight({ year: YR });
    } else {
      message.error('请选择考核人员');
    }
  }
  // 选择考核年度
  handleAssessmentYearSelect = () => {
    const { assessmentYearModal } = this.state;
    this.setState({ assessmentYearModal: { ...assessmentYearModal, visible: true } });
  }
  // 选择营业部
  handleSalesDepartmentSelect = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: true } });
  }
  // 选中营业部
  handleDeptSelected = ({ key, title }) => {
    const { YEAR_NAME } = this.state;
    if (key) {
      this.setState({ salesDepartmentModal: { visible: false, selectedKeys: [key] } });
      this.baseInfoRef.changeFieldValue({ empName:null, orgName: title, tmplName: `${title}${YEAR_NAME !== '' ? YEAR_NAME : `${new Date().getFullYear()}${new Date().getMonth() <= 7 ? '上半年' : '下半年'}`}绩效考核方案` });
      this.fetchqueryInfoAppraisalProgramWeight({ orgNo: key });
    } else {
      message.error('请选择营业部');
    }
  }
  // 选中考核年度
  handleYearSelected=(record = {}) => {
    const { YR, YEAR_NAME } = record;
    const { deptList } = this.state;
    if (YR) {
      this.setState({ assessmentYearModal: { visible: false, selectedKeys: YR }, YEAR_NAME });
      this.baseInfoRef.changeFieldValue({ examYear: YEAR_NAME, tmplName: `${deptList.yybmc}${YEAR_NAME}绩效考核方案` });
      this.fetchqueryInfoAppraisalProgramWeight({ year: YR });
    } else {
      message.error('请选择考核地区');
    }
  }
  handleAreaSelect = (value) => {
    if (value) {
      this.baseInfoRef.changeFieldValue({ area: value });
      this.fetchqueryInfoAppraisalProgramWeight({ area: value });
    } else {
      message.error('请选择考核年度');
    }
  }
  // 选中考核人员
  handleExaminersCheck=(checkKeyList) => {
    this.setState({ checkKeyList });
  }
  // 添加指标点击确定
  handleIndexSelect=(selectIndex = {}) => {
    if (selectIndex.ID) {
      const { indexModal } = this.state;
      this.alternativeIndexRef.indexTableRef.handleAdd(selectIndex);
      this.setState({ indexModal: { ...indexModal, visible: false } });
    }
  }
  // 选中部门类别
  handleDepClassSelect=(depClass) => {
    this.setState({ depClass });
    this.baseInfoRef.changeFieldValue({ empName:null});
    this.fetchqueryInfoAppraisalProgramWeight({ depClass });
  }
  handleOk = () => {
    const { confirmLoading } = this.state;
    if (!confirmLoading) {
      // 判断必选和可选指标的权重是否加起来为1
      if (this.requireIndexRef) {
        const rdata = lodash.get(this, 'requireIndexRef.indexTableRef.state.dataSource', []);
        if (rdata.length > 0){
          let tmpl = 0;
          rdata.forEach((m) => {
            const { examWeight = '' } = m;
            tmpl += Number.parseFloat(examWeight)*1000;
          });
          if (tmpl/1000 !== 1) {
            message.error('必选指标的权重之和必须为1');
            return;
          }
        }
      }
      if (this.alternativeIndexRef) {
        const adata = lodash.get(this, 'alternativeIndexRef.indexTableRef.state.dataSource', []);
        if (adata.length > 0) {
          let tmpl = 0;
          adata.forEach((m) => {
            const { examWeight = '' } = m;
            tmpl += Number.parseFloat(examWeight);
          });
          if (tmpl !== 1) {
            message.error('可选指标的权重之和必须为1');
            return;
          }
        }
      }
      this.handleSubmit();
    }
  }
  handleCancel = () => {
    const { confirmLoading } = this.state;
    if (confirmLoading) {
      message.warning('正在执行中,请勿关闭窗口!');
    } else {
      const { onCancel } = this.props;
      if (onCancel) {
        onCancel();
      }
    }
  }
  handleSubmit = (e) => {
    if (e) e.preventDefault();
    const baseInfo = this.baseInfoRef.validateForm();
    if (baseInfo) {
      const {
        salesDepartmentModal: { selectedKeys },
        assessmentYearModal: { selectedKeys: year },
        examinerModal: { selectedKeys: khry }, checkKeyList } = this.state;
      const { type, planDetail, handlePlanSubmit, pageType, examType, fetchPlanData } = this.props;
      const indexValues = this.alternativeIndexRef.indexTableRef.handleSubmit();
      const requireIndexValues = this.requireIndexRef.handleSubmit();
      if (indexValues && requireIndexValues) {
        const formdata = {
          ...planDetail,
          ...baseInfo,
          oprType: type,
          // eslint-disable-next-line no-nested-ternary
          orgNo: selectedKeys.length > 0 ? selectedKeys[0] : type === '2' ? planDetail.orgNo : this.props.userBasicInfo.orgid,
          examYear: year,
          examIndi: JSON.stringify([...requireIndexValues, ...indexValues]),
        };
        const unuseProperties = ['orgName', 'id', 'depClassName', 'statusName', 'examYearName', 'auditOpion'];
        if (type === '1') { // 新增
          unuseProperties.push(...['status', 'tmplId']);
          Reflect.set(formdata, 'examType', examType);
        }
        if (pageType === '1') { // 绩效考核
          Reflect.set(formdata, 'empClassLevel', checkKeyList.length > 0 ? JSON.stringify(checkKeyList) : planDetail.empClassLevel);
        } else { // 个人绩效考核
          unuseProperties.push(...['empName', 'tmplName']);
          Reflect.set(formdata, 'empNo', khry.EMP_NO || planDetail.empNo);
        }
        for (const str of unuseProperties) {
          Reflect.deleteProperty(formdata, str);
        }
        // //console.log('indexValues', indexValues);
        // eslint-disable-next-line no-console
        if (typeof handlePlanSubmit === 'function') {
          if (pageType === '1' && checkKeyList.length <= 0) {
            message.error('请勾选考核人员！');
            return;
          }
          this.setState({ confirmLoading: true });
          handlePlanSubmit(
            formdata,
            () => {
              this.setState({
                confirmLoading: false,
              }, () => { this.handleCancel(); if (fetchPlanData) fetchPlanData({}, type === '2'); });
            },
            () => this.setState({ confirmLoading: false })
          );
        }
      }
    }
  }
  // 绩效考核方案权重查询
  fetchqueryInfoAppraisalProgramWeight=(payload) => {
    const { type, planDetail = {} } = this.props;
    if (type === '2') {
      return;
    }
    const { salesDepartmentModal: { selectedKeys }, depClass: deptClass, assessmentYearModal: { selectedKeys: years } } = this.state;
    // eslint-disable-next-line no-nested-ternary
    const org = selectedKeys.length > 0 ? selectedKeys[0] : type === '2' ? planDetail.orgNo : '';
    const params = { depClass: deptClass, orgNo: org, year: years, ...payload };
    const { orgNo, year, depClass } = params;
    if (orgNo && year && depClass) {
      FetchqueryInfoAppraisalProgramWeight({ ...params }).then(() => {
      }).catch((e) => {
        if (e.success) {
          const { records = [] } = e;
          if (records.length > 0) {
            const { coExamWeight, coRequiredWeight, orgExamWeight, coOptionalWeight } = records[0];
            this.baseInfoRef.changeFieldValue({ coExamWeight, coRequiredWeight, orgExamWeight, coOptionalWeight });
          } else {
            this.baseInfoRef.changeFieldValue({ coExamWeight: '', coRequiredWeight: '', orgExamWeight: '', coOptionalWeight: '' });
          }
        }
      });
    }
  }
  //营业部默认展示总部
  handledeptList = (deptList) => {
    this.setState({
      deptList,
    })
  }
  //获取当前年度
  handleCurrentYear = (record) => {
    if (record) {
      this.setState({ assessmentYearModal: { visible: false, selectedKeys: record.YR } });
      this.baseInfoRef.changeFieldValue({ examYear: record.YEAR_NAME });
      this.fetchqueryInfoAppraisalProgramWeight({ year: record.YR });
    }
  }
  render() {
    const { confirmLoading, indexModal, assessmentYearModal, depClass: deptClass, salesDepartmentModal, programWeight = {}, examinerModal, deptList = '',salesDepartmentModal: { selectedKeys } } = this.state;
    const { versionId, orgId,vorgName,vexamClass, visible = false, type = '', depClass, examTypeList, indexDetail = [], planDetail = {}, indexList = [], pageType, area } = this.props;
    const title = type === '1' ? '新增' : '修改';
    const orgNo=selectedKeys.length > 0 ? selectedKeys[0] : type === '2' ? planDetail.orgNo : deptList.orgNo;
    const modalProps = {
      className: 'esa-scrollbar',
      bodyStyle: { height: '55rem', overflow: 'auto' },
      width: pageType === '1'? '120rem': '85%',
      title,
      visible,
      confirmLoading,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    const col = pageType === '1' ? 18 : 24;
    return (
      <Fragment>
        <BasicModal {...modalProps}>
          <Row className="m-row-form">
            <Col sm={col} md={col} lg={col} xl={col} xxl={col} style={{ borderRight: pageType === '1' ? '1px solid #e8e8e8' : '' }}>
              {
                pageType === '1' ? (
                  <BaseInfo
                    vorgName={vorgName}
                    vexamClass={vexamClass}
                    orgId={orgId}
                    planDetail={type === '1' ? {} : planDetail}
                    onRef={this.onBaseInfoRef}
                    type={type}
                    deptList={deptList}
                    handleAssessmentYearSelect={this.handleAssessmentYearSelect}
                    handleSalesDepartmentSelect={this.handleSalesDepartmentSelect}
                    handleDepClassSelect={this.handleDepClassSelect}
                    handleAreaSelect={this.handleAreaSelect}
                    depClass={depClass}
                    area={area}
                    programWeight={programWeight}
                  />
                ) : (
                  <PersonalBaseInfo
                    vorgName={vorgName}
                    vexamClass={vexamClass}
                    orgId={orgId}
                    planDetail={type === '1' ? {} : planDetail}
                    onRef={this.onBaseInfoRef}
                    type={type}
                    handleAssessmentYearSelect={this.handleAssessmentYearSelect}
                    handleSalesDepartmentSelect={this.handleSalesDepartmentSelect}
                    handleDepClassSelect={this.handleDepClassSelect}
                    handleExaminerSelect={this.handleExaminerSelect}
                    depClass={depClass}
                    programWeight={programWeight}
                  />
                )
              }
              <MandatorySelectedIndex
                scoreMode2={scoreMode2}
                scoreMode1={scoreMode1}
                digit={digit}
                onRef={this.onRequireIndexRef}
                indexDetail={type === '1' ? indexList : indexDetail}
              />
              <AlternativeIndex
                scoreMode2={scoreMode2}
                scoreMode1={scoreMode1}
                digit={digit}
                onRef={this.onAlternativeIndexRef}
                handleIndexAdd={this.handleIndexAdd}
                indexDetail={type === '1' ? [] : indexDetail}
              />
            </Col>
            {
              pageType === '1' && (
              <Col sm={6} md={6} lg={6} xl={6} xxl={6}>
                <Examiners
                  vexamClass={vexamClass}
                  handleExaminersCheck={this.handleExaminersCheck}
                  planDetail={planDetail}
                  type={type}
                />
              </Col>
            )}

          </Row>
        </BasicModal>
        <IndexModal
          {...indexModal}
          versionId={versionId}
          examTypeList={examTypeList}
          modalProps={{ bodyStyle: { maxHeight: '55rem', overflow: 'auto' } }}
          depClass={depClass}
          onCancel={this.onIndexModalCancel}
          handleIndexSelect={this.handleIndexSelect}
          alternativeIndexRef={this.alternativeIndexRef}
        />
        <AssessmentYearModal
          {...assessmentYearModal}
          handleCurrentYear={this.handleCurrentYear}
          onCancel={this.onAssessmentYearModalCancel}
          handleOk={this.handleYearSelected}
        />
        <SalesDepartmentModal
          {...salesDepartmentModal}
          handledeptList={this.handledeptList}
          handleOk={this.handleDeptSelected}
          onCancel={this.onSalesDepartmentModalCancel}
          modalProps={{ bodyStyle: { maxHeight: '55rem', overflow: 'auto' } }}
        />
        <ExaminersModal
          {...examinerModal}
          // handleOk={this.handleDeptSelected}
          handleOk={this.handleExaminersSelected}
          onCancel={this.onExaminerCancel}
          modalProps={{ bodyStyle: { maxHeight: '55rem', overflow: 'auto' } }}
          depClass={deptClass}
          orgNo={orgNo}
        />
      </Fragment>
    );
  }
}

export default AddEditPlanModal;
