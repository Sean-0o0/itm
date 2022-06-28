/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
import React, { Fragment } from 'react';
import { Row, Col, message, Button } from 'antd';
import LeftContent from './LeftContent';
import RightContent from './RightContent';


class CalculationRuleDefinition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bl: [], // 变量数组
      jsgsData: {}, // 计算公式
      selectIndex: 0, // 右侧内容点击的次数，作为更新编辑框的依据，避免死循环
    };
  }


  componentDidMount() {

  }

  componentWillReceiveProps() {

  }

  // 变量改变
  onBlChange=(bl) => {
    // //console.log('bl ', bl);
    this.setState({
      bl,
    });
  }


  // 获取点击的操作符和树形数据
  getOperatorData=(item) => {
    this.setState({
      jsgsData: item,
      selectIndex: ++this.state.selectIndex,
    });
  }

  handleDefineOk=() => {
    // const { getFieldsValue } = this.myFormto.form;
    const { bl } = this.state;
    const blArr = [];

    // const { validateFieldsAndScroll } = this.myFormto;
    const { getFieldValue } = this.myFormto.props.form;
    bl.forEach((value, index) => {
      const obj = {};
      const csm = getFieldValue(`参数名称${index + 1}`);
      const csz = getFieldValue(`参数值${index + 1}`);
      const dw = getFieldValue(`单位${index + 1}`);
      const ms = getFieldValue(`描述${index + 1}`);
      obj.csm = csm;
      obj.csz = csz;
      obj.dw = dw;
      obj.ms = ms;
      blArr.push(obj);
    });

    this.myFormto.props.form.validateFields((err) => {
      if (err) {
        return '';
      }
      message.info('计算规则定义提交');
      this.myFormto.props.form.resetFields();
      const { handleDefineCancel } = this.props;
      // eslint-disable-next-line no-unused-expressions
      handleDefineCancel && handleDefineCancel();
    });
  }

  // // 获取点击的树形数据
  // getTreeClickData=(item) => {
  //   this.setState({
  //     jsgsData: item,
  //     selectIndex: ++this.state.selectIndex,
  //   });
  // }


  render() {
    const { handleDefineCancel, selectRowData } = this.props;
    const { jsgsData, selectIndex } = this.state;
    return (
      <Fragment>
        <Row style={{ background: '#fff' }}>
          <Row style={{ minHeight: '46rem', width: '100%', overflowY: 'auto' }}>
            <Col xs={24} sm={12} lg={16}>
              <LeftContent wrappedComponentRef={(node) => { this.myFormto = node; }} selectRowData={selectRowData} onBlChange={this.onBlChange} jsgsData={jsgsData} selectIndex={selectIndex} />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <RightContent getOperatorData={this.getOperatorData} />
            </Col>
          </Row>
          <Row style={{ height: '5rem', width: '100%' }}>
            <Col xs={24} sm={24} lg={24} style={{ textAlign: 'center', paddingTop: '.75rem' }}>
              <Button className="m-btn-radius m-btn-headColor" onClick={this.handleDefineOk}> 确定 </Button>
              <Button className="m-btn-radius" onClick={handleDefineCancel}> 取消 </Button>
            </Col>
          </Row>
        </Row>

      </Fragment>
    );
  }
}

export default CalculationRuleDefinition;
// export default Form.create({})(CalculationRuleDefinition);

