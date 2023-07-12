import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, InputNumber, Select, Tooltip, TreeSelect } from 'antd';

const EditableContext = React.createContext();

const EditableRow = Form.create()(({ form, index, ...props }) => {
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
    title = '',
    record,
    index,
    handleSave,
    formdecorate,
    bxbmdata = [],
    children,
    ...restProps
  } = props;

  const save = e => {
    formdecorate.validateFields(
      [
        e.currentTarget.id, //只校验当前编辑项
      ],
      (error, values) => {
        // console.log('🚀 ~ save ~ values:', values);
        handleSave({ ...record, ...values });
      },
    );
  };

  const getDecotator = () => {
    const recIndex = dataIndex + record['ID'];
    switch (dataIndex) {
      case 'BXBM':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: record[recIndex],
              rules: [{ required: true, message: title + '不允许空值' }],
            })(
              <TreeSelect
                allowClear
                showArrow
                className="item-selector"
                showSearch
                showCheckedStrategy={TreeSelect.SHOW_PARENT}
                treeNodeFilterProp="title"
                placeholder="请选择"
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                style={{ width: '100%', borderRadius: '8px !important' }}
                onChange={(v, txt, node) => {
                  // console.log('🚀 ~ BXBM:', node?.triggerNode?.props?.YKBID);
                  formdecorate.validateFields(
                    [
                      recIndex, //只校验当前编辑项
                    ],
                    (error, values) => {
                      handleSave({
                        ...record,
                        [recIndex]: v,
                        ['BXBMYKBID' + record.ID]: node?.triggerNode?.props?.YKBID,
                      });
                    },
                  );
                }}
                treeData={bxbmdata}
              />,
            )}
          </Form.Item>
        );
      case 'FTBL':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: record[recIndex],
              rules: [{ required: true, message: '分摊比例不允许空值' }],
            })(
              <InputNumber
                style={{ width: '100%' }}
                ref={inputRef}
                max={100}
                precision={2}
                step={0.01}
                min={0}
                onPressEnter={save}
                onBlur={save}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />,
            )}
          </Form.Item>
        );
      case 'FTJE':
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: record[recIndex],
              rules: [{ required: true, message: '分摊金额不允许空值' }],
            })(
              <InputNumber
                style={{ width: '100%' }}
                ref={inputRef}
                max={1000000000}
                precision={2}
                step={0.01}
                min={0}
                onPressEnter={save}
                onBlur={save}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />,
            )}
          </Form.Item>
        );
      default:
        return (
          <Form.Item style={{ margin: 0 }}>
            {formdecorate.getFieldDecorator(recIndex, {
              initialValue: record[recIndex],
              rules: [{ required: true, message: title + '不允许空值' }],
            })(
              <InputNumber
                style={{ width: '100%' }}
                ref={inputRef}
                max={1000000000.0}
                precision={2}
                step={0.01}
                min={0}
                onPressEnter={save}
                onBlur={save}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />,
            )}
          </Form.Item>
        );
    }
  };
  return (
    <td {...restProps}>
      {editable ? <EditableContext.Consumer>{getDecotator}</EditableContext.Consumer> : children}
    </td>
  );
};

export { EditableRow, EditableCell };
