import React from 'react';
import { Form, Input, InputNumber, Select, Tooltip } from 'antd';

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
    record,
    index,
    handleSave,
    formdecorate,
    children,
    sltdata = {},
    label = '',
    validatefieldarr = [],
    setaddgysmodalvisible,
    ...restProps
  } = props;

  const save = e => {
    formdecorate.validateFields(validatefieldarr, (error, values) => {
      if (error && error[e?.currentTarget?.id]) {
        console.log('有错误，不予保存');
        return;
      }
      handleSave({ ...record, ...values });
      console.log("🚀 ~ formdecorate.validateFields ~ values:", values)
    });
  };

  //供应商下拉框
  const getGysSlt = () => {
    return (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          initialValue: record[dataIndex + record['ID']] ?? undefined,
          rules: [
            {
              required: true,
              message: '供应商不允许空值',
            },
          ],
        })(
          <Select
            style={{ width: '100%', borderRadius: '8px !important' }}
            placeholder="请选择供应商"
            className="gys-selector"
            onChange={v => {
              let obj = {
                [dataIndex + record['ID']]: v,
              };
              handleSave({ ...record, ...obj });
            }}
            onBlur={save}
            onFocus={save}
            showSearch
            optionLabelProp="title"
            optionFilterProp="title"
          >
            {sltdata.gys?.map((item = {}, ind) => {
              return (
                <Select.Option key={ind} value={item.id} title={item.gysmc}>
                  <Tooltip title={item.gysmc} placement="topLeft">
                    {item.gysmc}
                  </Tooltip>
                </Select.Option>
              );
            })}
          </Select>,
        )}
        <div className="gys-selector-devide"></div>
        <i
          className="iconfont circle-add gys-selector-circle-add"
          onClick={() => setaddgysmodalvisible(true)}
        />
      </Form.Item>
    );
  };

  //简单常用表单组件
  const COMPONENT = {
    //输入框 - 数值型
    getInputNumber: () => {
      return (
        <Form.Item style={{ margin: 0 }}>
          {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
            initialValue: record[dataIndex + record['ID']] ?? undefined,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(
            <InputNumber
              placeholder={'请输入' + label}
              style={{ width: '100%' }}
              max={999999999}
              min={0}
              step={0}
              onBlur={e => {
                e.persist();
                save(e);
              }}
              onFocus={e => {
                e.persist();
                save(e);
              }}
              precision={2}
            />,
          )}
        </Form.Item>
      );
    },
    //下拉单选
    getSelect: ({ sltData = [], titleFeild = 'note', valueField = 'ibm', componentProps = {} }) => (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          initialValue: record[dataIndex + record['ID']] ?? undefined,
          rules: [
            {
              required: true,
              message: label + '不允许空值',
            },
          ],
        })(
          <Select
            style={{ width: '100%', borderRadius: '8px !important' }}
            placeholder={'请选择' + label}
            onChange={v => {
              let obj = {
                [dataIndex + record['ID']]: v,
              };
              handleSave({ ...record, ...obj });
            }}
            onBlur={save}
            onFocus={save}
            showSearch
            optionLabelProp="title"
            optionFilterProp="title"
            {...componentProps}
          >
            {sltData.map((item = {}, ind) => {
              return (
                <Select.Option key={ind} value={item[valueField]} title={item[titleFeild]}>
                  <Tooltip title={item[titleFeild]} placement="topLeft">
                    {item[titleFeild]}
                  </Tooltip>
                </Select.Option>
              );
            })}
          </Select>,
        )}
      </Form.Item>
    ),
    //文本域
    getTextArea: () => (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          rules: [
            {
              required: false,
              message: label + '不能为空',
            },
          ],
          initialValue: record[dataIndex + record['ID']],
        })(
          <Input.TextArea
            onPressEnter={save}
            onBlur={save}
            maxLength={500}
            placeholder={'请输入' + label}
            autoSize={{
              minRows: 1,
              maxRows: 8,
            }}
          />,
        )}
      </Form.Item>
    ),
  };
  const { getInputNumber, getSelect, getTextArea } = COMPONENT;

  const renderCell = () => {
    return dataIndex === 'DJ'
      ? getSelect({
          sltData: sltdata.rydj,
          titleFeild: 'RYDJ',
          valueField: 'RYDJID',
        })
      : dataIndex === 'RLDJ'
      ? getInputNumber()
      : dataIndex === 'GYS'
      ? getGysSlt()
      : dataIndex === 'QSSM'
      ? getTextArea()
      : getSelect({
          sltData: sltdata.qszt,
        });
  };

  return (
    <td {...restProps} title="">
      {editable ? <EditableContext.Consumer>{renderCell}</EditableContext.Consumer> : children}
    </td>
  );
};

export { EditableRow, EditableCell };
