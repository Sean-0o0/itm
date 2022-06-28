/* eslint-disable react/sort-comp */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Radio, Select, Button, Icon } from 'antd';
import CommonSelect from '../../../../../../components/Common/Form/Select';
import IndiSelectModal from './IndiSelectModal';

const { TextArea, Search } = Input;
class AssessmentPlanForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indiSelectModal: {
        visible: false,
        handleOk: this.indiSelectModalOk,
        onCancel: this.indiSelectModalCancel,
        index: null,
      },
    };
  }

  componentDidMount = () => {
  }


  componentWillReceiveProps() {
  }
  // 考核指标弹出框取消
  indiSelectModalCancel = () => {
    const { indiSelectModal } = this.state;
    this.setState({ indiSelectModal: { ...indiSelectModal, visible: false, index: null } });
  }
  // 打开手考核指标弹出框
  openIndiSelectModal = (index) => {
    const { indiSelectModal } = this.state;
    this.setState({ indiSelectModal: { ...indiSelectModal, visible: true, index } });
  }
  // 考核指标弹出框确定
  indiSelectModalOk = (selectItem, index) => {
    this.props.onValschange(selectItem.ID, `indi${index + 1}`, index);
  }
  getIndiName = (ibm) => {
    const { indiData = [] } = this.props;
    let flmc = '';
    let cbm = ibm?ibm:'';
    //console.log(indiData)
    indiData.forEach((item) => {

      if (item.ibm=== cbm ) {
        flmc = item.flmc;
        return false;
      }
    });

    return flmc || undefined;
  }
  render() {
    const { indiSelectModal } = this.state;
    const { data: { examStandard = [] }, data = {}, staffTypesData = [], relaData = [], logiData = [], versionId } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="m-form-default ant-form-horizontal ant-advanced-search-form m-form">
        <Row>
          <Col sm={12} md={12} xxl={12} >
            <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="营业部:" >
              {getFieldDecorator('orgName', {
                initialValue: data.orgName ? data.orgName : '',
                rules: [{ required: true, message: '请输入' }],
              })(<Search onSearch={() => this.props.handleSalesDepartmentSelect()} readOnly />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} xxl={12} >
            <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="人员类别:" >
              {getFieldDecorator('examClass', {
                initialValue: data.examClass ? data.examClass : '',
                rules: [{ required: true, message: '请输入' }],
              })(<CommonSelect className="esa-xcxmgl-select" style={{ width: '100%' }} datas={staffTypesData} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children" onChange={this.onRylbChange} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24} xxl={24} >
            <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="定级类别:" wrapperCol={{ span: 12 }} >
              {getFieldDecorator('rankType', {
                initialValue: data.rankType ? data.rankType : '',
                rules: [{ required: true, message: '请选择计算方式' }],
              })(<Radio.Group options={[{ label: '维持', value: '0', key: '0' }, { label: '升级', value: '1', key: '1' }]} />)}
            </Form.Item>
          </Col>
        </Row>
        {examStandard.map((item, index) => (
          <Row className="variabelRow" key={index}>
            <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label={`考核标准${index + 1}:`}>
              <Col sm={6} md={6} xxl={6}>
                <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="has-success mr12">
                  {/* <Select className="m-select m-select-default" placeholder={`指标${index + 1}`} value={item[`indi${index + 1}`] ? item[`indi${index + 1}`] : undefined} onChange={(e) => { this.props.onValschange(e, `indi${index + 1}`, index); }} >
                    {indiData.map((indiItem) => { return <Select.Option key={indiItem.ibm} value={indiItem.ibm}>{indiItem.flmc}</Select.Option>; })}
                  </Select> */}
                  <Input.Search readOnly placeholder={`指标${index + 1}`} onSearch={() => this.openIndiSelectModal(index)} value={this.getIndiName(item[`indi${index + 1}`])} />
                </Form.Item>
              </Col>
              <Col sm={6} md={6} xxl={6}>
                <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="has-success mr12">
                  <Select className="m-select m-select-default" placeholder={`关系运算${index + 1}`} value={item[`relaTypeid${index + 1}`] ? item[`relaTypeid${index + 1}`] : undefined} onChange={(e) => { this.props.onValschange(e, `relaTypeid${index + 1}`, index); }} >
                    {relaData.map((relaItem) => { return <Select.Option key={relaItem.ibm} value={relaItem.ibm}>{relaItem.note}</Select.Option>; })}
                  </Select>
                </Form.Item>
              </Col>
              {
                index === examStandard.length - 1 ?
                  null
                  :
                  (
                    <Col sm={6} md={6} xxl={6}>
                      <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="has-success mr12">
                        <Select className="m-select m-select-default" placeholder={`逻辑运算${index + 1}`} value={item[`logiTypeid${index + 1}`] ? item[`logiTypeid${index + 1}`] : undefined} onChange={(e) => { this.props.onValschange(e, `logiTypeid${index + 1}`, index); }} >
                          {logiData.map((relaItem) => { return <Select.Option key={relaItem.ibm} value={relaItem.ibm}>{relaItem.note}</Select.Option>; })}
                        </Select>
                      </Form.Item>
                    </Col>
                  )
              }
              <Col sm={6} md={6} xxl={6}>
                <Button shape="circle" size="small" className="m-jianshao-icon m-btn" icon="minus" type="default" onClick={() => this.props.removeStandard(index)} />
              </Col>
            </Form.Item>
          </Row>
        ))}
        <Row>
          <Col sm={12} md={12} xxl={12} >
            <Form.Item labelCol={{ span: 12 }} className="m-form-item" label=" " wrapperCol={{ span: 12 }} >
              <Button type="dashed" onClick={this.props.addStandard} className="esa-btn-dash-bg" >
                <Icon type="plus" />添加考核标准
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24} xxl={24} >
            <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="考核公式" wrapperCol={{ span: 12 }} >
              {getFieldDecorator('examFmla', {
                initialValue: data.examFmla ? data.examFmla : '',
              })(<TextArea disabled placeholder="" style={{ minWidth: '9.5rem' }} ref={(e) => { this._jsgsTextArea = e; }} autosize={{ minRows: 4, maxRows: 6 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24} xxl={24} >
            <Form.Item labelCol={{ span: 12 }} className="m-form-item" label="公式描述:" wrapperCol={{ span: 12 }} >
              {getFieldDecorator('fmlaDesc', {
                initialValue: data.fmlaDesc ? data.fmlaDesc : '',
              })(<TextArea disabled placeholder="" style={{ minWidth: '9.5rem' }} autosize={{ minRows: 4, maxRows: 6 }} />)}
            </Form.Item>
          </Col>
        </Row>
        <IndiSelectModal {...indiSelectModal} versionId={versionId} />
      </Form>
    );
  }
}
export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(AssessmentPlanForm));
