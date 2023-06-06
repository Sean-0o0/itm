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
    rydata,
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
        // console.log('🚀 ~ file: index.js:44 ~ save ~ values:', values);
        handleSave({ ...record, ...values });
      },
    );
  };

  const getDecotator = () => {
    const recIndex = dataIndex + record['ID'];
    switch (dataIndex) {
      case 'RYID':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: record[recIndex],
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
                onChange={v => {
                  formdecorate.validateFields(
                    [
                      dataIndex, //只校验当前编辑项
                    ],
                    (error, values) => {
                      handleSave({ ...record, [recIndex]: v });
                    },
                  );
                }}
                onBlur={() => {
                  formdecorate.validateFields([
                    dataIndex, //只校验当前编辑项
                  ]);
                }}
              >
                {rydata.map(x => {
                  return (
                    <Option key={x.RYID} value={x.RYID}>
                      {x.RYMC}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        );
      case 'RQ':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: record[recIndex],
              rules: [
                {
                  required: true,
                  message: `${title}不能为空`,
                },
              ],
            })(
              <DatePicker.RangePicker
                style={{ minWidth: '100%' }}
                mode={['month', 'month']}
                placeholder="请选择"
                format="YYYY-MM"
                onBlur={() => {
                  formdecorate.validateFields([
                    'RQ', //只校验当前编辑项
                  ]);
                }}
                onPanelChange={v => {
                  formdecorate.validateFields(
                    [
                      'RQ', //只校验当前编辑项
                    ],
                    (error, values) => {
                      handleSave({ ...record, [recIndex]: v });
                    },
                  );
                }}
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
