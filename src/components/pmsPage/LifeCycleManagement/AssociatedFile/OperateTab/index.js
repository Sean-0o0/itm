/**
 * 合同签署流程发起弹窗页面
 */
import { Row, Col, Select, Form, Input, DatePicker, Button } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import React from 'react';
import { connect } from 'dva';

class OperateTab extends React.Component {
  state = {
    inputSearch: '',
    dateSearch: [],
  };

  componentDidMount() {}
  onInputChange(e) {
    // console.log("🚀 ~ file: index.js ~ line 27 ~ OperateTab ~ onInputChange ~ e.target.value", e.target.value)
    this.setState({
      inputSearch: e.target.value,
    });
  }

  onRangePickerChange(date, dateString) {
    console.log(
      '🚀 ~ file: index.js ~ line 34 ~ OperateTab ~ onRangePickerChange ~ date, dateString',
      date,
      dateString,
    );
    this.setState({
      dateSearch: dateString[0] === '' && dateString[1] === '' ? [] : [...dateString],
    });
  }

  render() {
    const { inputSearch, dateSearch } = this.state;
    const { handleTableFilter } = this.props;
    return (
      <div style={{ margin: '13.4px 0 0 0' }}>
        <Row>
          <Col span={10}>
            <Form.Item label="标题/文件类别" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Input placeholder="请输入标题/文件类别" onChange={e => this.onInputChange(e)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="拟稿日期" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
              <RangePicker onChange={(d, ds) => this.onRangePickerChange(d, ds)} />
            </Form.Item>
          </Col>
          <Col span={2} style={{ paddingTop: '1.68px' }}>
            <Form.Item>
              <Button
                type="primary"
                onClick={() =>
                  handleTableFilter({
                    fileType: inputSearch,
                    draftDate: dateSearch,
                  })
                }
              >
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(OperateTab);
