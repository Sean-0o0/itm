import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Tooltip, Select, DatePicker } from 'antd';

const { Option } = Select;
const EditableContext = React.createContext();

const EditableRow = Form.create()(({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
});
const EditableCell = props => {
  const [editing, setEditing] = useState(false); //正在编辑
  const inputRef = useRef(null);
  const {
    editable,
    dataIndex,
    title,
    record,
    index,
    handleSave,
    formdecorate,
    children,
    ...restProps
  } = props;

  useEffect(() => {
    return () => {};
  }, []);

  const save = e => {
    formdecorate.validateFields(
      [
        e.currentTarget.id, //只校验当前编辑项
      ],
      (error, values) => {
        console.log('🚀 ~ file: index.js:55 ~ save ~ values:', values);
        handleSave({ ...record, ...values });
      },
    );
  };

  const getDecotator = () => {
    const recIndex = dataIndex + record['ID'];
    switch (dataIndex) {
      case 'GYSMC':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              // initialValue: '',
              rules: [
                {
                  required: true,
                  message: `${title}不能为空`,
                },
              ],
            })(
              <Select
                placeholder="请选择"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {[].map(x => {
                  return (
                    <Option key={x} value={x}>
                      {x}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        );
      case 'RYMC':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              rules: [
                {
                  required: true,
                  message: `${title}不能为空`,
                },
              ],
              // initialValue: String(record[recIndex] || ''),
            })(<Input ref={inputRef} maxLength={30} onPressEnter={save} onBlur={save} />)}
          </Form.Item>
        );
      case 'ZHPCSJ':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              // initialValue: '',
              rules: [
                {
                  required: true,
                  message: `${title}不能为空`,
                },
              ],
            })(
              <DatePicker
                style={{ minWidth: '100%' }}
                onChange={() => {}}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder="请选择"
              />,
            )}
          </Form.Item>
        );
      default:
        return '';
    }
  };

  const renderCell = () => {
    return getDecotator();
  };
  return (
    <td {...restProps}>
      {editable ? <EditableContext.Consumer>{renderCell}</EditableContext.Consumer> : children}
    </td>
  );
};

export { EditableRow, EditableCell };
