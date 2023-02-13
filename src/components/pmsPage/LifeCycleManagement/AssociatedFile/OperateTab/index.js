/**
 * 合同签署流程发起弹窗页面
 */
import {
  Row,
  Col,
  Select,
  Form,
  Input,
  DatePicker,
  Button,
} from 'antd';

const {Option} = Select;
const {RangePicker} = DatePicker;
import React from 'react';
import {connect} from "dva";

class OperateTab extends React.Component {
  state = {}

  componentDidMount() {

  }

  onChange(date, dateString) {
    console.log(date, dateString);
  }


  render() {
    const {} = this.state;
    return (
      <div style={{margin: '2rem 0 0 0'}}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="文件类别" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <Input placeholder="请输入标题"/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="标题" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <Input placeholder="请输入标题"/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="文号" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <Input placeholder="请输入文号"/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="流程状态" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <Input placeholder="请输入流程状态"/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="拟稿日期" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <RangePicker onChange={this.onChange}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button>查询</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(OperateTab));
