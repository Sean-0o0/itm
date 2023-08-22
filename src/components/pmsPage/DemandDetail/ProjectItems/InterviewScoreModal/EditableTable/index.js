import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Tooltip, Select, DatePicker, InputNumber } from 'antd';

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
        handleSave({ ...record, ...values });
      },
    );
  };

  const getDecotator = () => {
    const recIndex = dataIndex + record['DFID'];
    switch (dataIndex) {
      case 'FS':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              rules: [
                {
                  required: true,
                  message: `${title}不能为空`,
                },
              ],
              initialValue: Number(record[recIndex] || ''),
            })(
              <InputNumber
                style={{ width: '100%' }}
                max={100}
                min={0}
                step={0.1}
                precision={1}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onPressEnter={save}
                onBlur={save}
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
