/* eslint-disable react/sort-comp */
import React from 'react';
import { InputNumber, Form } from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  save = (e) => {
    const { record, handleSave } = this.props;
    this.props.form.validateFields((error, values) => {
      // 特殊处理，这里就算验证不通过也需要更新数据，在提交的时候做处理
      // //console.log('record', record);
      // //console.log('values', values);

      handleSave({ ...record, ...values });
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
    });
  }

  // 当数字输入框改变时

  onInputChange=(value, dataIndex, rowIndex) => {
    const { templateArr = [] } = this.props;
    // //console.log('templateArr', templateArr);
    const tempArr = templateArr;
    tempArr[rowIndex][dataIndex] = `${value}`;
    // //console.log('数字输入框参数', dataIndex);
    // //console.log('数字输入框改变', tempArr);
    this.props.onTemplateArrChange(tempArr);
  }

  render() {
    const {  minVal, maxVal,editable, dataIndex, title, record, rowIndex, handleSave, ...restProps } = this.props;
    const { editing } = this.state;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {
              () => {
                return (
                  editing ? (
                    <FormItem style={{ margin: 0 }} help={`最小值:${minVal|| '无'} 最大值:${maxVal ||'无'}`}>
                      {this.props.form.getFieldDecorator(dataIndex, {
                        rules: [{ required: true, message: '请输入值' }],
                        initialValue: record[dataIndex] || '',
                      })(<InputNumber
                      ref={(node) => { this.input = node; }}
                      onChange={(value) => { this.onInputChange(value, dataIndex, rowIndex); }}
                      max={maxVal ? Number(maxVal) : Infinity}
                      min={minVal ? Number(minVal) : -Infinity}
                      //  onPressEnter={this.save}
                       onBlur={this.save} />)}
                    </FormItem>
                  ) : (
                    <div
                      className="editable-cell-value-wrap"
                      style={{ paddingRight: 24, minHeight: '1.666rem', minWidth: '5.666rem' }}
                      onClick={this.toggleEdit}
                    >
                      {restProps.children}
                    </div>
                  )
                );
              }}
          </EditableContext.Consumer>
          ) : restProps.children
        }
      </td>
    );
  }
}

export default Form.create()(EditableCell);
