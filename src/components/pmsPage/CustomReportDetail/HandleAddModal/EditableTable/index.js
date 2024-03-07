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

  const renderCell = () => {
    return (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          rules: [
            { required: true, message: title + '不能为空' },
            { max: 500, message: `${title}长度不能超过500` },
          ],
          initialValue: record[dataIndex + record['ID']]?.replace(/<br>/g, '\n'),
        })(
          <Input.TextArea
            onPressEnter={save}
            onBlur={save}
            maxLength={500}
            autoSize={{
              minRows: 1,
              maxRows: 8,
            }}
          />,
        )}
      </Form.Item>
    );
  };

  return (
    <td {...restProps}>
      {editable ? <EditableContext.Consumer>{renderCell}</EditableContext.Consumer> : children}
    </td>
  );
};

export { EditableRow, EditableCell };
