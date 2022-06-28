import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, message, Button, Divider } from 'antd';
import SalesDepartmentModal from '../../../../../components/WorkPlatForm/EsaPage/Common/SalesDepartmentModal';
import { fetchObject } from '../../../../../services/sysCommon';
import AssessmentPlanForm from './AssessmentPlanForm';
import { FetchOperateClassAssessmentPlan, FetchQueryListClassProgram, FetchQueryInfoClassProgramFmla } from '../../../../../services/EsaServices/gradeAssessment';
import { getDictKey } from '../../../../../utils/dictUtils';

class GradeAssessmentPlanDefinition extends React.Component {
  state = {
    salesDepartmentModal: { // 营业部
      visible: false,
      selectedKeys: [], // 默认选中项
    },
    staffTypesData: [], // 人员类别
    indiData: [], // 指标数据
    assessmentPlanData: {
      orgNo: '',
      orgName: '',
      examClass: '',
      rankType: '',
      examStandard: [],
      examFmla: '',
      fmlaDesc: '',
    },
    versionId: ''
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.queryStaffClassList();
    this.queryIndiData();
    const { match = {} } = this.props;
    const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx, id } = paramJson;
    if (czlx === 2 && id) {
      this.FetchQueryListClassProgram(id);
    }
  }


  componentWillReceiveProps() {
  }

  // 变量数值变化
  onValschange = (e, objKey, index) => {
    const { assessmentPlanData: { examStandard = [] }, assessmentPlanData = {} } = this.state;
    const value = (e && e.target) ? e.target.value : e;
    const tmplVal = JSON.parse(JSON.stringify(examStandard));
    if (tmplVal[index]) {
      tmplVal[index][objKey] = value;
    } else if (objKey) {
      const obj = {};
      obj[`indi${tmplVal.length}`] = '';
      obj[`relaTypeid${tmplVal.length}`] = '';
      obj[`logiTypeid${tmplVal.length}`] = '';
      tmplVal.push({ ...obj, [objKey]: value });
    }
    let param = {};
    tmplVal.forEach((item) => {
      param = { ...param, ...item };
    });
    delete param[`logiTypeid${examStandard.length}`]; // 删除最后一个逻辑运算

    FetchQueryInfoClassProgramFmla(param).then((response) => {
      const { code = '', records = [] } = response;
      if (code === 1) {
        this.setState({
          assessmentPlanData: {
            ...assessmentPlanData,
            examFmla: records[0].examFmla,
            fmlaDesc: records[0].fmlaDesc,
            examStandard: tmplVal,
          },
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 营业部取消
  onSalesDepartmentModalCancel = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: false } });
  }

  // 选择营业部
  handleSalesDepartmentSelect = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: true } });
  }

  // 选中营业部
  handleDeptSelected = ({ key, title }) => {
    if (key) {
      this.setState({ salesDepartmentModal: { visible: false, selectedKeys: key } });
      const { assessmentPlanData } = this.state;
      this.setState({ assessmentPlanData: { ...assessmentPlanData, orgName: title, orgNo: key } });
      const { setFieldsValue } = this.assessmentPlanForm;
      setFieldsValue({ orgName: title });
    } else {
      message.error('请选择营业部');
    }
  }

  // 添加考核标准
  addStandard = () => {
    const { assessmentPlanData: { examStandard = [] }, assessmentPlanData } = this.state;
    const tmplVal = JSON.parse(JSON.stringify(examStandard));
    if (tmplVal.length < 12) {
      const obj = {};
      obj[`indi${tmplVal.length + 1}`] = '';
      obj[`relaTypeid${tmplVal.length + 1}`] = '';
      obj[`logiTypeid${tmplVal.length + 1}`] = '';
      tmplVal.push(obj);
    } else {
      message.error('最多可以添加12个考核标准！');
    }
    this.setState({ assessmentPlanData: { ...assessmentPlanData, examStandard: tmplVal } });
  }

  // 删除考核标准
  removeStandard = (k) => {
    const { assessmentPlanData: { examStandard = [] }, assessmentPlanData } = this.state;
    const tmplVal = JSON.parse(JSON.stringify(examStandard));
    tmplVal.splice(k, 1);
    tmplVal.forEach((item) => {
      const itemKeys = Object.keys(item);
      const itemValues = Object.values(item);
      const index = itemKeys[0].replace(/[^0-9]/ig, '');
      if (index > k) {
        Reflect.deleteProperty(item, itemKeys[0]);
        Reflect.deleteProperty(item, itemKeys[1]);
        Reflect.deleteProperty(item, itemKeys[2]);
        Reflect.set(item, `indi${index - 1}`, itemValues[0]);
        Reflect.set(item, `relaTypeid${index - 1}`, itemValues[1]);
        Reflect.set(item, `logiTypeid${index - 1}`, itemValues[2]);
      }
    });
    this.setState({ assessmentPlanData: { ...assessmentPlanData, examStandard: tmplVal } }, () => this.onValschange());
  }

  // 查询指标
  queryIndiData = () => {
    this.queryLivebosObject('XTZB', { cancel_flag: 0});
  }
  // 查询人员类别
  queryStaffClassList = () => {
    this.queryLivebosObject('RYLBDY', '');
  }

  // 查询 livebos对象
  queryLivebosObject = (val, std) => {
    const condition = std;
    fetchObject(val, { condition}).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        if (val === 'RYLBDY') {
          const tmpl = [];
          records.forEach((item) => {
            tmpl.push({
              value: item.ID,
              label: item.CLASS_NAME,
              ...item,
            });
          });
          this.setState({
            staffTypesData: tmpl,
          });
        }
        if (val === 'XTZB') {
          const tmpl = [];
          records.forEach((item) => {
            tmpl.push({
              ibm: item.ID,
              flmc: item.INDI_NAME,
              ...item,
            });
          });
          this.setState({
            indiData: tmpl,
          });
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleConfirm = () => {
    // 确定按钮的操作
    if (this.assessmentPlanForm) {
      const { validateFieldsAndScroll } = this.assessmentPlanForm;
      validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.sendForm(values);
        } else {
          (Object.values(err) || []).map((item = {}) => {
            const { errors = [] } = item;
            message.error((errors[0] || {}).message);
            return false;
          });
        }
      });
    }
  }

  // 提交表单
  sendForm = async (values) => {
    const { match = {} } = this.props;
    const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx, id } = paramJson;
    const { assessmentPlanData: { examStandard = [] }, assessmentPlanData = {} } = this.state;
    let oprType = '';
    let planId = '';
    let version = '';
    if (czlx === 2 && id) { // 有传id为修改，没有为新增
      oprType = 2;
      planId = id;
    } else {
      oprType = 1;
      version = id;
    }
    let param = {};
    examStandard.forEach((item) => {
      param = { ...param, ...item };
    });
    delete param[`logiTypeid${examStandard.length}`]; // 删除最后一个逻辑运算
    await FetchOperateClassAssessmentPlan({
      examClass: values.examClass,
      id: planId,
      oprType,
      version,
      orgNo: assessmentPlanData.orgNo,
      rankType: values.rankType,
      ...param,
    }).then((response) => {
      const { note = '操作成功!' } = response;
      message.info(note);
      const { onSubmitOperate } = this.props;
      if (onSubmitOperate) {
        onSubmitOperate();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询类别考核方案详情
  FetchQueryListClassProgram = async (id) => {
    await FetchQueryListClassProgram({
      current: 1,
      examClass: 0,
      id,
      orgNo: 0,
      pageSize: 10,
      paging: 1,
      rankType: 0,
      sort: '',
      total: -1,
    }).then((response) => {
      const { code = '', records = [] } = response;
      if (code === 1) {
        const examStandard = [];
        for (let i = 1; i < 7; i++) {
          const stdObj = {};
          if (records[0][`indi${i}`] !== '') {
            stdObj[`indi${i}`] = records[0][`indi${i}`] ? records[0][`indi${i}`] : '';
            stdObj[`relaTypeid${i}`] = records[0][`relaTypeid${i}`] ? records[0][`relaTypeid${i}`] : '';
            stdObj[`logiTypeid${i}`] = records[0][`logiTypeid${i}`] ? records[0][`logiTypeid${i}`] : '';
            examStandard.push(stdObj);
          }
        }
        this.setState({
          assessmentPlanData: {
            orgNo: records[0].orgId,
            orgName: records[0].orgName,
            examClass: records[0].examClass,
            rankType: records[0].rankType,
            examStandard,
            examFmla: records[0].examFmla,
            fmlaDesc: records[0].fmlaDesc,
          },
          versionId: records[0].version,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询公式和描述
  // FetchQueryInfoClassProgramFmla = async (param) => {
  //   const { assessmentPlanData = {} } = this.state;
  //   await FetchQueryInfoClassProgramFmla(param).then((response) => {
  //     const { code = '', records = [] } = response;
  //     if (code === 1) {
  //       this.setState({
  //         assessmentPlanData: {
  //           ...assessmentPlanData,
  //           examFmla: records[0].examFmla,
  //           fmlaDesc: records[0].fmlaDesc,
  //         },
  //       });
  //     }
  //   }).catch((error) => {
  //     message.error(!error.success ? error.message : error.note);
  //   });
  // }

  render() {
    const { dictionary = {}, match = {} } = this.props;
    const { params } = match.params;
    const paramJson = JSON.parse(decodeURIComponent(params));
    const { czlx, id } = paramJson;
    const relaData = dictionary[getDictKey('RELA_TYPEID')] || [];
    const logiData = dictionary[getDictKey('LOGI_TYPEID')] || [];
    const { assessmentPlanData = {}, salesDepartmentModal, staffTypesData = [], indiData = [], versionId } = this.state;
    return (
      <div style={{ padding: '1.833rem 1rem 0 0', backgroundColor: '#fff' }}>
        <AssessmentPlanForm
          versionId={czlx === 1 ? id : versionId}
          ref={(node) => { this.assessmentPlanForm = node; }}
          data={assessmentPlanData}
          handleSalesDepartmentSelect={this.handleSalesDepartmentSelect}
          addStandard={this.addStandard}
          removeStandard={this.removeStandard}
          staffTypesData={staffTypesData}
          onValschange={this.onValschange}
          indiData={indiData}
          relaData={relaData}
          logiData={logiData}
        />
        <Divider />
        <Row>
          <Col span={23} style={{ marginBottom: 15, textAlign: 'right' }}>
            <Button style={{ marginRight: '0.666rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleConfirm}> 确定 </Button>
            <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={this.props.onCancelOperate}> 取消 </Button>
          </Col>
        </Row>
        <SalesDepartmentModal
          {...salesDepartmentModal}
          handleOk={this.handleDeptSelected}
          onCancel={this.onSalesDepartmentModalCancel}
          modalProps={{ bodyStyle: { maxHeight: '55rem', overflow: 'auto' } }}
        />
      </div>
    );
  }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(GradeAssessmentPlanDefinition));
