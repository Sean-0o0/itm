import React from 'react';
import { Row, Form, Input, DatePicker, Button, Select, TreeSelect } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;

class TestForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="m-form" layout="inline">
        <Row>
          <FormItem label="资料名称" className="m-form-item" >
            {getFieldDecorator('zlmc', {})(<Input autoComplete="off" style={{ minWidth: '15rem' }} />)}
          </FormItem>
          <FormItem label="培训时间" className="m-form-item" >
            {
              getFieldDecorator('pxsj')(<RangePicker allowClear={false} />)
            }
          </FormItem>
        </Row>
        <Row style={{ marginTop: '1.5rem' }}>
          <FormItem label="资料分类" className="m-form-item">
            {getFieldDecorator('zlfl')(// eslint-disable-line
              <Select className="m-select" labelName="" placeholder="请选择资料分类" allowClear showSearch optionFilterProp="children" style={{ minWidth: '15rem' }}>
                <Option className="m-select-selection" value="1" key="1">1</Option>
                <Option className="m-select-selection" value="2" key="2">2</Option>
                <Option className="m-select-selection" value="3" key="3">3</Option>
              </Select>)}
          </FormItem>
          <FormItem label="资料分类" className="m-form-item">
            {getFieldDecorator('zlfl')(// eslint-disable-line
              <TreeSelect
                showSearch
                style={{ width: 300 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                allowClear
                treeDefaultExpandAll
                className="m-select"
              >
                <TreeNode value="parent 1" title="parent 1" key="0-1">
                  <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                    <TreeNode value="leaf1" title="my leaf" key="random" />
                    <TreeNode value="leaf2" title="your leaf" key="random1" />
                  </TreeNode>
                  <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                    <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
                  </TreeNode>
                </TreeNode>
              </TreeSelect>)}
          </FormItem>
          <Button className="m-btn-radius m-btn-headColor" onClick={this.handleSubmit}> 查询 </Button>
          <Button className="m-btn-radius m-btn-gray" onClick={this.handleReset} > 重置 </Button>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(TestForm);
