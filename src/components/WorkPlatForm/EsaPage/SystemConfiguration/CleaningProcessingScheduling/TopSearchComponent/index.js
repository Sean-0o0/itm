import React, { Fragment } from 'react';
import { Row, Col, Input, Select, Button, Radio, Divider, DatePicker, Form } from 'antd';

/**
 * 查询搜索组件
 */
const { Item: FormItem } = Form;
class TopSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleReset = () => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      time: '',
      user: '',
      table: '',
      isforce: '1',
    });
  }

  render() {
    const yh = [{ ibm: 1, note: '测试' }];
    const dateFormat = 'YYYY-MM-DD';
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <Form className="m-form-default ant-form-horizontal ant-advanced-search-form m-form">
          <Row style={{ marginTop: '1rem' }}>
            <Col span={8} >
              <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="调度时间" >
                {getFieldDecorator('time', {
                  initialValue: '' })(<DatePicker style={{ width: '90%' }} format={dateFormat} />)}
              </FormItem>
            </Col>
            <Col span={8} >
              <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="调度用户" >
                {getFieldDecorator('user', {
                })(<Select className="m-select m-select-default" showSearch placeholder="请选择">{yh.map((tempitem) => { return <Select.Option key={tempitem.ibm} value={tempitem.ibm}>{tempitem.note}</Select.Option>; })}</Select>)
                }
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="目标表" >
                {getFieldDecorator('table', {
                  initialValue: '' })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="强制执行" >
                {getFieldDecorator('isforce', {
                  initialValue: '1',
                })(<Radio.Group defaultValue="1" className="m-radio-btn"><Radio.Button value="1">是</Radio.Button><Radio.Button value="0">否</Radio.Button></Radio.Group>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <Button style={{ marginRight: '0.666rem', marginLeft: '3.7rem' }} className="m-btn-radius m-btn-headColor " onClick={this.handleSettingFamcOk}> 查询 </Button>
              <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={this.handleReset}> 重置 </Button>
            </Col>
            <Divider style={{ marginTop: '2rem' }} />
          </Row>
        </Form>
      </Fragment>
    );
  }
}
export default Form.create()(TopSearchComponent);
