import React, { useState, useEffect } from 'react';
import { Form, Select, Tooltip } from 'antd';

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
    gysdata = [],
    gyssltfilterarr = [],
    setaddgysmodalvisible,
    ...restProps
  } = props;
  const [gysSltData, setGysSltData] = useState([]); //供应商数据

  useEffect(() => {
    setGysSltData(gysdata.slice());
    return () => {};
  }, [JSON.stringify(gysdata)]);

  const save = e => {
    formdecorate.validateFields([dataIndex + record.ID], (error, values) => {
      if (error && error[e?.currentTarget?.id]) {
        console.log('有错误，不予保存');
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  //供应商下拉框
  const getGysSlt = ({ dataIndex, initialValue }) => {
    return (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          initialValue,
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
              console.log('🚀 ~ getGysSlt ~ v:', v, obj);
              handleSave({ ...record, ...obj });
            }}
            onBlur={save}
            onFocus={() => {
              let data = gysdata.filter(
                x =>
                  !(
                    gyssltfilterarr?.filter(y => y.ID !== record.ID).map(y => y['GYS' + y.ID]) || []
                  ).includes(x.id),
              );
              setGysSltData(data);
            }}
            showSearch
            optionLabelProp="title"
            optionFilterProp="title"
          >
            {gysSltData?.map((item = {}, ind) => {
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

  const renderCell = () => {
    return getGysSlt({
      dataIndex,
      initialValue: record[dataIndex + record['ID']] ?? undefined,
    });
  };

  return (
    <td {...restProps} title="">
      {editable ? <EditableContext.Consumer>{renderCell}</EditableContext.Consumer> : children}
    </td>
  );
};

export { EditableRow, EditableCell };
