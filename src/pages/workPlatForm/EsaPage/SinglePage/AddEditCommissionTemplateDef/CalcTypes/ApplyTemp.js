import React from 'react';
import { Form, InputNumber } from 'antd';
import EditableTable from './EditableTable';

// 模板-变量操作组件
class ApplyTemp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { form, royaltyFormulaParamData, valMode, templateParamData, updateTemplateParamData } = this.props;
    return (
      <React.Fragment>
        {
          royaltyFormulaParamData && royaltyFormulaParamData.length > 0 &&
            valMode === '3' ? royaltyFormulaParamData.map((item) => {
              return (
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 18 }}
                  label={item.name ? item.name : '--'}
                  key={item.seq}
                  help={`最小值:${item.minVal} 最大值:${item.maxVal}`}
                >
                  {form.getFieldDecorator(`FLD${item.seq}`, {
                    initialValue: item.initialValue || '',
                  })(<InputNumber
                    step={0.5}
                    max={Number(item.maxVal)}
                    min={Number(item.minVal)}
                    style={{ width: '14rem' }}
                    className="esa-input-number"
                  />)}
                </Form.Item>
              );
            }) : (
              <div style={{ paddingLeft: '4rem' }}>
                <EditableTable
                  royaltyFormulaParamData={royaltyFormulaParamData}
                  templateParamData={templateParamData}
                  updateTemplateParamData={updateTemplateParamData}
                  form={form}
                />
              </div>
            )}

      </React.Fragment>
    );
  }
}
export default ApplyTemp;
