/* eslint-disable react/jsx-closing-tag-location */
import React, { Fragment } from 'react';
import { Row, Col, Input, Button, Form, Select } from 'antd';

/**
 * 查询搜索组件
 */

const { Option } = Select;
class TopSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 查询
  handleSearchOk = () => {
    //   const { type } = this.props;

    this.props.form.validateFields((err, values) => {
      // message.info('查询');
      this.props.getSearchData(values);
    });
  }

  // 重置
  handleSearchClear=() => {
    this.props.form.resetFields();
    this.props.getSearchData('');
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Fragment>
        <Row>
          <Form>
            <Row style={{ padding: '1rem 0  0 2rem' }}>
              <Col span={5}>
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="指标代码" colon={false}>
                  {
                    getFieldDecorator('zbdm', {
                      initialValue: '',
                      // rules: [{ required: type !== 'delete', message: '请选择计算方式' }],
                    })(<Input></Input>) // eslint-disable-line
                  }

                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="指标名称" colon={false}>
                  {
                    getFieldDecorator('zbmc', {
                      initialValue: '',
                      // rules: [{ required: type !== 'delete', message: '请选择计算方式' }],
                    })(<Input></Input>) // eslint-disable-line
                  }

                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="适用对象" colon={false}>
                  {
                    getFieldDecorator('sydx', {
                      initialValue: '',
                      // rules: [{ required: type !== 'delete', message: '请选择计算方式' }],
                    })(<Select >
                      <Option value="1">客户</Option>
                      <Option value="2">个人</Option>
                      <Option value="3">团队</Option>
                      <Option value="4">部门</Option>
                      <Option value="5">营业部</Option>
                      <Option value="6">公司</Option>

                    </Select>) // eslint-disable-line
                  }

                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 14 }} label="" colon={false}>
                  <Button className="m-btn m-btn-headColor" onClick={this.handleSearchOk}>查询</Button>
                  <Button onClick={this.handleSearchClear} className="m-btn" style={{ margin: ' 0 0 0 2rem' }}>重置</Button>

                </Form.Item>
              </Col>

            </Row>

          </Form>
        </Row>

      </Fragment>
    );
  }
}
// export default TopSearchComponent;
export default Form.create({})(TopSearchComponent);

