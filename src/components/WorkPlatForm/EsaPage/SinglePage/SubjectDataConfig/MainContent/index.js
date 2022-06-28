import React, { Component, Fragment } from 'react';
import CalculateBasicData from './CalculateBasicData';
import SelectBasicData from './SelectBasicData';

/**
 * 主题数据配置主内容
 */
class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBasicDataFormData: {}, // 第一步：选择基础数据表单数据
      calculateBasicDataFormData: {}, // 第二步：计算基期数据表单数据
    };
  }

  // 调用当前表单校验-保存当前表单数据-返回校验结果
  validateFields = async () => {
    const { current = 0 } = this.props;
    switch (current) {
      case 0:
        return new Promise(async (resolve) => {
          const flag = await this.selectBasicData.validateForm();
          if (flag) {
            const formData = this.selectBasicData.getFormData();
            this.setState({
              selectBasicDataFormData: formData,
            });
          }
          resolve(flag);
        });
      case 1: {
        const formData = this.calculateBasicData.handleFormData();
        if (Object.keys(formData).length !== 0) {
          this.setState({
            calculateBasicDataFormData: formData,
          });
          return true;
        } return false;
      }
      default:
        break;
    }
  }
  render() {
    const { current = 0, toPreStep, toNextStep, sbjDataId = '', sbjDataIdChange, indicators } = this.props;
    const { selectBasicDataFormData = {}, calculateBasicDataFormData = {} } = this.state;
    let html = '';
    switch (current) {
      case 0:
        // 选择基础数据
        html = (
          <SelectBasicData
            wrappedComponentRef={(c) => { this.selectBasicData = c; }}
            selectBasicDataFormData={selectBasicDataFormData}
            toNextStep={toNextStep}
            sbjDataId={sbjDataId}
            sbjDataIdChange={sbjDataIdChange}
          />
        );
        break;
      case 1:
        // 计算基期数据
        html = (
          <CalculateBasicData
            wrappedComponentRef={(c) => { this.calculateBasicData = c; }}
            indicators={indicators}
            selectBasicDataFormData={selectBasicDataFormData}
            calculateBasicDataFormData={calculateBasicDataFormData}
            toPreStep={toPreStep}
            sbjDataId={sbjDataId}
          />
        );
        break;
      default:
        break;
    }
    return (
      <Fragment>
        {html}
      </Fragment>
    );
  }
}
export default MainContent;
