import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Tooltip, Select, DatePicker } from 'antd';

const { Option } = Select;
const EditableContext = React.createContext();

const EditableFormRow = Form.create()(({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
});
const EditableCell = props => {
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
    editing,
    lyzt = [],
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
        // console.log('🚀 ~ file: index.js:55 ~ save ~ values:', values);
        handleSave({ ...record, ...values });
      },
    );
  };

  const getDecotator = () => {
    const recIndex = dataIndex + record['PCID'];
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
            style={{ width: '100%' }}
            onChange={v => {
              formdecorate.validateFields(
                [
                  recIndex //只校验当前编辑项
                ],
                (error, values) => {
                  handleSave({ ...record, [recIndex]: v });
                },
              );
            }}
            onBlur={() => {
              formdecorate.validateFields([
                recIndex, //只校验当前编辑项
              ]);
            }}
          >
            {lyzt.map(x => {
              return (
                <Option key={x.ibm} value={x.ibm}>
                  {x.note}
                </Option>
              );
            })}
          </Select>,
        )}
      </Form.Item>
    );
  };

  const renderCell = () => {
    return getDecotator();
  };
  return (
    <td {...restProps}>
      {editable && editing ? (
        <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>
      ) : (
        children
      )}
    </td>
  );
};

export { EditableFormRow, EditableCell };
