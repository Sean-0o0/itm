import React from 'react';
import { Form } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import FirstBlock from './FirstBlock';
import SecondBlock from './SecondBlock';
import ThirdBlock from './ThirdBlock';

/**
 * 右侧配置主要内容
 */

class DetailContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  setType = (value) => {
    this.props.setType(value);
  }
  render() {
    const { elaAnalysis = [], maxElaAnalysis = [], lastUserAnalysis = [], showProcess = false} = this.props;

    return (
      <Form className="factor-form" style={{height: '100%'}}>
        <Scrollbars autoHide style={{ width: '100%', height: '100%' }} >
          <FirstBlock elaAnalysis = {elaAnalysis} showProcess = {showProcess}/>
          <SecondBlock maxElaAnalysis = {maxElaAnalysis} showProcess = {showProcess}/>
          <ThirdBlock lastUserAnalysis = {lastUserAnalysis} showProcess = {showProcess}/>
        </Scrollbars>
      </Form>
    );
  }
}

export default Form.create()(DetailContent);
