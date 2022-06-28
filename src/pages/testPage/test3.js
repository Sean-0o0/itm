/* eslint-disable react/self-closing-comp */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, TreeSelect } from 'antd';
// import Test from '../test1/Test';

class Test3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { columns = [], dataSource = [], dispatch } = this.props;
    debugger;
    return (
      <div style={{ height: '100%' }}>
        <Row type="flex" justify="space-around" align="middle" className="m-row-pay-cont" style={{ margin: '0 0 .75rem 0' }}>
          <Col sm={12}>
            <div className="m-top-pay-title">薪酬方案设置</div>
          </Col>
          <Col sm={12}>
            <Form className="m-top-pay-extra">
              <Form.Item style={{ margin: '0 1.5rem' }}>
                {
                  (<TreeSelect
                    showSearch
                    style={{ minWidth: '26rem' }}
                    dropdownMatchSelectWidth
                    placeholder="请选择营业部"
                    searchPlaceholder="搜索..."
                    multiple={false}
                    filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={this.handleYYBChange}
                  />)
                }
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row className="m-row-pay-cont">
          {/* <Test columns={columns} dataSource={dataSource} dispatch={dispatch} /> */}
        </Row>
      </div>
    );
  }
}

export default connect(({ test3modal }) => ({
  columns: test3modal.columns,
  dataSource: test3modal.dataSource,
}))(Test3);
