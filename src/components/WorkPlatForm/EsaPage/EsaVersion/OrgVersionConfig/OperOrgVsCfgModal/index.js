/* eslint-disable react/jsx-indent */
import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Select, Input, DatePicker, TreeSelect, message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import BasicModal from '../../../../../Common/BasicModal';
import SalesDepartmentModal from '../../../Common/SalesDepartmentModal';
import { fetchObject } from '../../../../../../services/sysCommon';
import { FetchoperateOrgSalaryVersion } from '../../../../../../services/EsaServices/esaVersion';

const { MonthPicker } = DatePicker;
const { Search } = Input;
class OperOrgVsCfgModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffClassData: [], // 人员类别数据
      esaVersionData: [],//薪酬版本数据
      orgNo: props.selectData.orgid || '',
      salesDepartmentModal: {
        visible: false,
        handleOk: this.handleOrg,
        onCancel: this.onCancel,
      },
      startMonth: null,
    };
  }
  componentDidMount() {
    const { selectData = {} } = this.props;
    this.setState({
      startMonth: selectData.begMon ? moment(selectData.begMon, 'YYYYMM') : moment(),
    });
    this.fetchStaffClassData();
    this.fetchEsaVersionData();
  }
  // 人员类别数据
  fetchStaffClassData = async () => {
    fetchObject('RYLBDY').then((res) => {
      const { note, code, records = [] } = res;
      if (code > 0) {
        const staffClassData = [];
        records.forEach((item) => {
          staffClassData.push({
            title: item.CLASS_NAME,
            key: item.ID,
            value: item.ID,
          });
        });
        this.setState({ staffClassData });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  // 薪酬版本数据
  fetchEsaVersionData = async () => {
    fetchObject('XCBBXX').then((res) => {
      const { note, code, records } = res;
      if (code > 0) {
        this.setState({ esaVersionData: records });
      } else {
        message.error(note);
      }
    }).catch((e) => {
      message.error(!e.success ? e.message : e.note);
    });
  }
  openSalesDepartmentModal = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: true } });
  }
  handleOrg = (selectItem) => {
    this.setState({ orgNo: Number(selectItem.key) });
    this.props.form.setFieldsValue({
      orgName: selectItem.title,
    });
    this.onCancel();
  }
  onCancel = () => {
    const { salesDepartmentModal } = this.state;
    this.setState({ salesDepartmentModal: { ...salesDepartmentModal, visible: false } });
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  handleOk = (e) => {
    if (e) e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err || err.length === 0) { // 校验通过
        const { begMon, endMon, versionNo, examClass = [] } = values;
        const { orgNo } = this.state;
        const { operateType, doRefreshTable, selectData } = this.props;
        const params = {
          begMon: begMon.format('YYYYMM'),
          endMon: endMon.format('YYYYMM'),
          versionNo,
          orgNo: orgNo || selectData.orgid,
          examClass: examClass.join(";"),
          oprType: operateType,
          orgVersionId: selectData.id || '',
        };
        FetchoperateOrgSalaryVersion(params).then((res) => {
          const { note, code } = res;
          if (code > 0) {
            message.success(note);
            if (doRefreshTable) {
              doRefreshTable();
            }
          } else {
            message.error(note);
          }
          this.handleCancel();
        }).catch((e) => {
          message.error(!e.success ? e.message : e.note);
        });
      }
    });
  }
  chooseStartMonth = (value) => {
    this.setState({
      startMonth: value,
    })
  }
  disabledEndDate = endValue => {
    const { startMonth } = this.state;
    if (!endValue || !startMonth) {
      return false;
    }
    return endValue.valueOf() <= startMonth.valueOf();
  };
  render() {
    const { visible = false, operateType = '', form = {}, selectData = {} } = this.props;
    const { salesDepartmentModal, staffClassData, esaVersionData } = this.state;
    const { getFieldDecorator } = form;
    const titleSuf = '-营业部薪酬版本配置表';
    const modalProps = {
      title: operateType === 1 ? '新增' + titleSuf : '修改' + titleSuf,
      width: '70rem',
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      destroyOnClose: true,
    };
    return (
      <Fragment>
        <BasicModal
          {...modalProps}
        >
          <Form className="m-form">
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="营业部" >
                  {getFieldDecorator('orgName', {
                    initialValue: selectData.orgName,
                    rules: [{ required: true, message: '请选择营业部!' }],
                  })(<Search
                    readOnly
                    onSearch={this.openSalesDepartmentModal}
                    onClick={this.openSalesDepartmentModal}
                  />)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  label="薪酬版本"
                >{getFieldDecorator('versionNo', {
                  initialValue: selectData.version && String(selectData.version),
                  rules: [{ required: true, message: '请选择薪酬版本!' }],
                })(<Select
                  className="esa-select"
                  placeholder="请选择"
                  showSearch
                  optionFilterProp="children"
                >
                  {
                    esaVersionData.map(item => (
                      <Select.Option key={item.ID} value={item.ID}>{item.VERSION}</Select.Option>
                    ))
                  }
                </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="人员类别" >
                  {getFieldDecorator('examClass', {
                    initialValue: selectData.examClass && selectData.examClass.split(";"),
                    rules: [{ required: false, message: '请选择人员类别!' }],
                  })(<TreeSelect
                    treeCheckable
                    searchPlaceholder="请选择人员类别"
                    style={{ width: '100%' }}
                    treeData={staffClassData}
                    allowClear
                    treeNodeFilterProp="title"
                    dropdownStyle={{ maxHeight: 270, overflow: 'auto' }}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="开始月份" >
                  {getFieldDecorator('begMon', {
                    initialValue: selectData.begMon ? moment(selectData.begMon, 'YYYYMM') : moment(),
                    rules: [{ required: true }],
                  })(<MonthPicker
                    format="YYYY-MM"
                    style={{ width: '100%' }}
                    onChange={this.chooseStartMonth}
                    allowClear={false}
                  />)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="结束月份">
                  {getFieldDecorator('endMon', {
                    initialValue: selectData.endMon ? moment(selectData.endMon, 'YYYYMM') : moment(),
                    rules: [{ required: true }],
                  })(<MonthPicker
                    format="YYYY-MM"
                    style={{ width: '100%' }}
                    disabledDate={this.disabledEndDate}
                    allowClear={false}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设置人" >
                  {getFieldDecorator('calDate', {
                    initialValue: JSON.parse(sessionStorage.getItem('user')).name,
                    rules: [{ required: true }],
                  })(<span className="m-color">{JSON.parse(sessionStorage.getItem('user')).name}</span>)}
                </Form.Item>
              </Col>
              <Col sm={12} md={12} xxl={12} >
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} label="设置日期">
                  {getFieldDecorator('setMon', {
                    initialValue: moment(),
                    rules: [{ required: true }],
                  })(<MonthPicker
                    format="YYYY-MM"
                    style={{ width: '100%' }}
                    allowClear={false}
                    disabled
                  />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </BasicModal>
        <SalesDepartmentModal {...salesDepartmentModal} modalProps={{ bodyStyle: { height: '30rem', overflow: 'auto' } }} />
      </Fragment >
    );
  }
}

export default Form.create()(OperOrgVsCfgModal);
