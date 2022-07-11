import React from 'react';
import { Row, Col } from 'antd';
import InputTagPicker from '../../components/Common/InputTagPicker';

class TestPage extends React.Component {
  state = {
    inputTagPickerValue: {
      keys: ['1', '2', '3', '4', '5', '6'],
      titles: ['第一项', '第二项', '第三项', '第四项', '第五项', '第六项'],
    },
  }
  hanleInputTagPickerChange = (value) => {
    this.setState({ inputTagPickerValue: value });
  }
  render() {
    const { inputTagPickerValue } = this.state;
    const inputTagPickerProps = {
      lable: '客户标签',
      value: inputTagPickerValue,
      onChange: this.hanleInputTagPickerChange,
      // hasDropBox: true,
      // dropBox: <div style={{ width: '20rem', height: '20rem', backgroundColor: 'red' }}>22</div>,
    };
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <Row>
          <Col span={8}>
            InputTagPicker控件:
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <InputTagPicker
              {...inputTagPickerProps}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            管辖人员选择控件
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            此处占位
          </Col>
        </Row>
      </div>
    );
  }
}

export default TestPage;
