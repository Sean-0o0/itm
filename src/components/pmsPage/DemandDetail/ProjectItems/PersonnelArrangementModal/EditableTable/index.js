import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, TimePicker, Select, DatePicker } from 'antd';
import moment from 'moment';
const { Option } = Select;
const EditableContext = React.createContext();
const { RangePicker } = DatePicker;

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
    gysdata,
    isdock = false,
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
    const recIndex = dataIndex + record['PCID'];
    switch (dataIndex) {
      case 'GYSID':
        if (!isdock) return '';
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: record[recIndex] === -1 ? '' : record[recIndex],
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
                      'GYSID', //只校验当前编辑项
                    ],
                    (error, values) => {
                      handleSave({ ...record, [recIndex]: v });
                    },
                  );
                }}
                onBlur={() => {
                  formdecorate.validateFields([
                    'GYSID', //只校验当前编辑项
                  ]);
                }}
              >
                {gysdata.map(x => {
                  return (
                    <Option key={x.id} value={x.id}>
                      {x.gysmc}
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
              initialValue: record[recIndex],
              rules: [
                {
                  required: true,
                  message: `${title}不能为空`,
                },
              ],
            })(<Input maxLength={30} onPressEnter={save} onBlur={save} />)}
          </Form.Item>
        );
      case 'MSSJ':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              // initialValue: record[recIndex],
              // rules: [
              //   {
              //     required: true,
              //     message: `${title}不能为空`,
              //   },
              // ],
            })(
              <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <DatePicker allowClear={false} style={{width: '40%'}}  format="YYYY-MM-DD" value={record[recIndex] ? record[recIndex][0] : moment()} onChange={e => {
                  let date = record[recIndex];
                  date[0] = moment(e.format("YYYY-MM-DD") + ' ' + date[0].format('HH:mm'), 'YYYY-MM-DD HH:mm');
                  date[1] = moment(e.format("YYYY-MM-DD") + ' ' + date[1].format('HH:mm'), 'YYYY-MM-DD HH:mm');
                  handleSave({ ...record, [recIndex]: date });
                }} />
                <TimePicker
                  allowClear={false}
                  style={{ width: '25%' }}
                  // showTime={{ format: 'HH:mm' }}
                  format="HH:mm"
                  value={record[recIndex] ? record[recIndex][0] : moment("10:00", "HH:mm")}
                  placeholder="请选择"
                  onChange={v => {
                    let date = record[recIndex];
                    date[0] = v;
                    date[1] = moment(v.format("HH:mm"), 'HH:mm').add(1, 'hours');
                    handleSave({ ...record, [recIndex]: date });
                  }}
                />
                <div>~</div>
                <TimePicker
                  allowClear={false}
                  style={{ width: '25%' }}
                  // showTime={{ format: 'HH:mm' }}
                  format="HH:mm"
                  value={record[recIndex] ? record[recIndex][1] : moment('10:00', 'HH:mm').add(1, 'hours')}
                  placeholder="请选择"
                  onChange={v => {
                    let date = record[recIndex];
                    date[1] = v;
                    handleSave({ ...record, [recIndex]: date });
                  }}
                />
              </div>
             ,
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
