/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent */
import React from 'react';
import { InputNumber, Form } from 'antd';

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
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
      handleSave({ ...record, ...values });
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
    });
  }

  render() {
    const { editable, dataIndex, title, record, index, handleSave, form, minVal, maxVal, ...restProps } = this.props;
    const { editing } = this.state;
    return (
      <td {...restProps}>
        {editable ? (
          editing ? (
            <Form.Item style={{ margin: 0 }}  help={`最小值:${minVal|| '无'} 最大值:${maxVal ||'无'}`}>
              {form.getFieldDecorator(dataIndex, {
                rules: [{ required: true, message: '请输入值' }],
                initialValue: record[dataIndex],
              })(<InputNumber
                max={maxVal ? Number(maxVal) : Infinity}
                min={minVal ? Number(minVal) : -Infinity}
                ref={(node) => { this.input = node; }}
                // onPressEnter={this.save}
                onBlur={this.save}
                step={0.5}
                style={{ width: '14rem' }}
                className="esa-input-number"
              />)}
            </Form.Item>
          ) : (
              <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24, minHeight: '1.666rem', minWidth: '5.666rem' }}
                onClick={this.toggleEdit}
              >
                {restProps.children}
              </div>
            )
        ) : restProps.children
        }
      </td>
    );
  }
}

export default Form.create()(EditableCell);
