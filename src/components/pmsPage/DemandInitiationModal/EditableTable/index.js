import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Tooltip } from 'antd';

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
    let maxLength = 100;
    if (dataIndex === 'DH' || dataIndex === 'SJ') maxLength = 33;
    if (dataIndex === 'BZ') maxLength = 166;
    switch (dataIndex) {
      case 'LXR':
      case 'ZW':
      case 'DH':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              rules: [
                {
                  required: true,
                  message: `${title}不能为空`,
                },
              ],
              initialValue: String(record[recIndex] || ''),
            })(<Input ref={inputRef} maxLength={maxLength} onPressEnter={save} onBlur={save} />)}
          </Form.Item>
        );
      default:
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: String(record[recIndex] || ''),
            })(
              <Input
                ref={inputRef}
                maxLength={maxLength}
                onPressEnter={save}
                onBlur={save}
                style={dataIndex === 'YWSX' ? { color: '#3361ff' } : {}}
              />,
            )}
          </Form.Item>
        );
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
