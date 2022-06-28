/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Card, DatePicker, Input, Form, Row, Col, Select, Tag, message, Button } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SalesDepartmentModal from '../../../../Common/SalesDepartmentModal';
import { getDictKey } from '../../../../../../../utils/dictUtils';
import { fetchObject } from '../../../../../../../services/sysCommon';
import ExaminersModal from '../../../PerformanceAppraisal/Common/AddEditAppraisalPlan/ExaminersModal';

const { MonthPicker } = DatePicker;
const { Search } = Input;
const { CheckableTag } = Tag;
/**
 * 核对薪酬搜索组件
 */

class CheckSalarySearch extends React.Component {
  constructor(props) {
    super(props);
    const { params } = props;
    this.state = {
      mon: params.mon,
      orgNo: params.orgNo,
      salesDepartmentModal: {// 营业部计算modal
        visible: false,
        handleOk: this.handleOk,
        onCancel: this.onCancel,
      },

      selectedTags: {
        value: '',
        note: '全部',
      },
      staffClassData: [], // 人员类别数据
      staffLevelData: [], // 人员级别数据
      examinerModal: {
        visible: false,
        selectedKeys: {},
        handleOk: this.handleExaminersSelected,
        onCancel: this.onExaminerCancel,
      },
    };
  }
  componentDidMount() {
    this.fetchStaffClassData();
  }

  onCancel = () => {
    const { salesDepartmentModal, examinerModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: false }, examinerModal: { ...examinerModal, visible: false } });
  }
  // 人员类别数据
  fetchStaffClassData = async () => {
    fetchObject('RYLBDY').then((res) => {
      const { note, code, records } = res;
      if (code > 0) {
        this.setState({ staffClassData: records });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 人员级别数据
  fetchStaffLevelData = async (classId) => {
    fetchObject('RYJBDY', {
      condition: { class_id: classId },
    }).then((res) => {
      const { note, code, records = [] } = res;
      if (code > 0) {
        this.setState({ staffLevelData: records ? records : [] });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 营业部选择
  handleOk = (selectItem) => {
    const { examinerModal } = this.state;
    this.setState({ orgNo: Number(selectItem.key) });
    this.props.form.setFieldsValue({
      orgName: selectItem.title,
      examinerModal: {
        ...examinerModal,
        selectedKeys: {},
      }
    });
    this.onExaminerCancel();
    this.onCancel();
  }
  // 月份选择
  chooseMonth = (date) => {
    this.setState({ mon: Number(date.format('YYYYMM')) });
  }
  // 禁选后面日期
  disabledDate = (current) => {
    return current && current > moment().subtract(1, 'months').endOf('month');
  }
  //  打开营业部弹出框
  openSalesDepartmentModal = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: true } });
  }

  // 数据状态改变
  changeStatus = (tag) => {
    this.setState({
      selectedTags: { value: tag.value, note: tag.note },
    });
  }
  // // 选择人员
  handleExaminerSelect = () => {
    const { examinerModal } = this.state;
    this.setState({ examinerModal: { ...examinerModal, visible: true } });
  }
  // // 考核人员取消
  onExaminerCancel = () => {
    const { examinerModal } = this.state;
    const { form: { resetFields } } = this.props;
    examinerModal.selectedKeys = {};
    resetFields('empName');
    this.setState({ examinerModal: { ...examinerModal, visible: false } });
  }
  // 选中考核人员
  handleExaminersSelected = (record = {}) => {
    this.setState({ examinerModal: { visible: false, selectedKeys: record } });
    this.props.form.setFieldsValue({ empName: record.EMP_NAME });
  }

  // 查询
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err || err.length === 0) { // 校验通过
        const { mon, orgNo, selectedTags, examinerModal } = this.state;
        const { querySubmit } = this.props;
        if (typeof querySubmit === 'function') {
          const queryParams = {
            mon,
            orgNo,
            depClass: values.depClass || '',
            classId: values.classId || '',
            levelId: values.levelId || '',
            empNo: examinerModal.selectedKeys.EMP_NO || '',
            status: selectedTags.value || '',
          };
          querySubmit(queryParams);
        }
      }
    });
  }
  // 人员类别改变  人员级别也改变
  onRylbChange = (value) => {
    const { form: { resetFields } } = this.props;
    if (value) {
      // 改变人员级别下拉列表
      this.fetchStaffLevelData(value);
    } else {
      this.setState({ staffLevelData: [] });
    }
    // 重置人员级别当前值
    resetFields('levelId');
    this.onExaminerCancel();
  }
  // 重置搜索条件
  resetFields = () => {
    const { examinerModal } = this.state;
    const { userBasicInfo: { orgid = '' } } = this.props;
    this.props.form.resetFields();
    this.setState({
      selectedTags: {
        value: '',
        note: '全部',
      },
      staffLevelData: [],
      examinerModal: {
        ...examinerModal,
        selectedKeys: {},
      },
      orgNo: Number(orgid),
      mon: Number(moment().subtract(1, 'months').format('YYYYMM')),
    });
  }
  render() {
    const { dictionary: { [getDictKey('DEP_CLASS')]: depClassData = [] }, userBasicInfo, params } = this.props;
    const { orgNo, salesDepartmentModal, selectedTags, staffClassData, staffLevelData, examinerModal } = this.state;
    const { getFieldDecorator } = this.props.form;
    const monthFormat = 'YYYY-MM';
    const depClass = this.props.form.getFieldValue('depClass');
    const classId = this.props.form.getFieldValue('classId');
    const levelId = this.props.form.getFieldValue('levelId');
    const dataStatus = [
      { value: '', note: '全部' },
      { value: '1', note: '正确' },
      { value: '2', note: '错误' },
    ];
    return (
      <Fragment>
        <Card style={{ height: '100%' }} className="m-card">
          <Form className="m-form" style={{ paddingRight: '3%' }}>
            <Row>
              <Col sm={8} md={8} xxl={8} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="薪酬月份" colon={false}>
                  {getFieldDecorator('mon', {
                    initialValue: moment(params.mon, 'YYYYMM') || moment().subtract(1, 'months'),
                  })(<MonthPicker
                    format={monthFormat}
                    style={{ width: '100%' }}
                    onChange={this.chooseMonth}
                    allowClear={false}
                    disabledDate={this.disabledDate}
                  />)}
                </Form.Item>
              </Col>
              <Col sm={8} md={8} xxl={8} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="营业部" colon={false}>
                  {getFieldDecorator('orgName', {
                    initialValue: params.orgName || userBasicInfo.orgname,
                  })(<Search
                    readOnly
                    onSearch={this.openSalesDepartmentModal}
                    onChange={this.onExaminerCancel}
                  />)
                  }
                </Form.Item>
              </Col>
              <Col sm={8} md={8} xxl={8} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="部门类别" colon={false}>
                  {getFieldDecorator('depClass', {
                    initialValue: `${params.depClass}` || undefined,
                  })(<Select
                    className="esa-select m-select m-select-default"
                    placeholder="请选择"
                    allowClear
                    showSearch
                    onChange={this.onExaminerCancel}
                  >
                    {
                      depClassData.map(item => (
                        <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>
                      ))
                    }
                  </Select>)
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={8} md={8} xxl={8} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="人员类别" colon={false}>
                  {getFieldDecorator('classId', {
                  })(<Select
                    className="esa-select m-select m-select-default"
                    placeholder="请选择"
                    onChange={this.onRylbChange}
                    allowClear
                    showSearch
                  >
                    {
                      staffClassData.map(item => (
                        <Select.Option key={item.ID} value={item.ID}>{item.CLASS_NAME}</Select.Option>
                      ))
                    }
                  </Select>)
                  }
                </Form.Item>
              </Col>
              <Col sm={8} md={8} xxl={8} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="人员级别" colon={false}>
                  {getFieldDecorator('levelId', {
                  })(<Select
                    className="esa-select m-select m-select-default"
                    placeholder="请先选择人员类别"
                    allowClear
                    showSearch
                    onChange={this.onExaminerCancel}
                  >
                    {
                      staffLevelData.map(item => (
                        <Select.Option key={item.ID} value={item.ID}>{item.LEVEL_NAME}</Select.Option>
                      ))
                    }
                  </Select>)
                  }
                </Form.Item>
              </Col>
              <Col sm={8} md={8} xxl={8} >
                <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="人员" colon={false}>
                  {getFieldDecorator('empName', {
                  })(<Input.Search
                    onSearch={() => this.handleExaminerSelect()}
                    readOnly
                    placeholder="请选择"
                    allowClear
                  />)
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={8} md={8} xxl={8} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="数据状态" colon={false}>
                  {dataStatus.map(tag => (
                    <CheckableTag
                      key={tag.value}
                      checked={selectedTags.note.indexOf(tag.note) > -1}
                      onChange={() => this.changeStatus(tag)}
                      style={{ cursor: 'pointer' }}
                      className="m-tag m-tag-marginB"
                    >
                      {tag.note}
                    </CheckableTag>
                  ))}
                </Form.Item>
              </Col>
              <Col sm={24} md={24} xxl={24} className="tc mb10">
                <Button style={{ marginLeft: '0.6rem' }} className="m-btn-radius m-btn-headColor" onClick={this.handleSubmit}> 查询 </Button>
                <Button className="m-btn-radius" onClick={this.resetFields}> 重置 </Button>
              </Col>
            </Row>
            <SalesDepartmentModal {...salesDepartmentModal} modalProps={{ bodyStyle: { height: '30rem', overflow: 'auto' } }} />
            <ExaminersModal
              {...examinerModal}
              handleOk={this.handleExaminersSelected}
              onCancel={this.onExaminerCancel}
              depClass={depClass}
              classId={classId}
              levelId={levelId}
              orgNo={orgNo}
              modalProps={{ bodyStyle: { maxHeight: '55rem', overflow: 'auto' } }}
            />
          </Form>
        </Card>
      </Fragment >
    );
  }
}
export default Form.create()(CheckSalarySearch);
