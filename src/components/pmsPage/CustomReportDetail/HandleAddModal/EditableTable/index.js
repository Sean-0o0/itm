import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Form, Input, Select, Spin, Tooltip, TreeSelect } from 'antd';

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
    setsltdata,
    sltdata = {},
    label, //title会异常，可能内部有用
    getPrjData,
    getStaffData,
    tableColumns,
    isBGHZR,
    ...restProps
  } = props;

  const save = e => {
    formdecorate.validateFields(
      tableColumns.map(x => x.dataIndex + record.ID),
      (error, values) => {
        if (error && error[e?.currentTarget?.id]) {
          console.log('有错误，不予保存');
          return;
        }
        handleSave({ ...record, ...values });
      },
    );
  };

  //关联项目
  const getPrjSelector = useCallback(
    ({ label, dataIndex, initialValue }) => {
      const handleSearch = value => {
        if (value) {
          getPrjData(value);
        } else {
          setsltdata(p => ({ ...p, glxm: [] }));
        }
      };
      return (
        <Form.Item style={{ margin: 0 }}>
          {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
            initialValue,
            rules: [
              {
                required: false,
                message: label + '不允许空值',
              },
            ],
          })(
            <Select
              showSearch
              placeholder={'可按名称和项目经理搜索'}
              style={{ width: '100%' }}
              // defaultActiveFirstOption={false}
              // filterOption={false}
              // onSearch={handleSearch}
              onBlur={save}
              onFocus={save}
              // notFoundContent={sltdata.loading ? <Spin size="small" tip="加载中" /> : '暂无数据'}
              optionLabelProp="xmmc"
              optionFilterProp="title"
              allowClear
              onChange={
                isBGHZR
                  ? (v, node) => {
                      //二级部门领导可选部门下的所有员工。当关联项目的项目经理在数据范围权限下时，自动填充填写人，不在数据范围内时为空
                      if (
                        sltdata.txr?.findIndex(x => String(x.id) === String(node?.props?.xmjl)) !==
                        -1
                      ) {
                        console.log('@@@在范围内');
                        formdecorate.setFieldsValue({
                          ['TXR' + record.ID]: String(node?.props?.xmjl),
                        });
                      } else {
                        console.log('@@@不在范围内');
                        formdecorate.setFieldsValue({
                          ['TXR' + record.ID]: undefined,
                        });
                      }
                    }
                  : () => {}
              }
            >
              {sltdata.glxm.map(x => (
                <Select.Option
                  title={x.XMMC + x.projectManager}
                  xmmc={x.XMMC}
                  key={x.XMID}
                  value={x.XMID}
                  xmjl={x.projectManagerID}
                >
                  <Tooltip title={x.XMMC} placement="topLeft">
                    {x.XMMC}
                    <div style={{ fontSize: '12px', color: '#bfbfbf' }}>
                      年份：{x.year}&nbsp;&nbsp;&nbsp;&nbsp;项目经理：{x.projectManager}
                    </div>
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      );
    },
    [JSON.stringify(sltdata)],
  );

  //树型下拉框
  const getStaffSlt = ({ label, dataIndex, initialValue }) => {
    const handleSearch = value => {
      if (value) {
        getStaffData(value);
      } else {
        setsltdata(p => ({ ...p, txr: [] }));
      }
    };
    return (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          initialValue,
          rules: [
            {
              required: true,
              message: label + '不允许空值',
            },
          ],
        })(
          <Select
            showSearch
            placeholder={'输入搜索'}
            style={{ width: '100%' }}
            // defaultActiveFirstOption={false}
            // filterOption={false}
            // onSearch={handleSearch}
            // notFoundContent={sltdata.loading ? <Spin size="small" tip="加载中" /> : '暂无数据'}
            optionFilterProp="children"
            onBlur={save}
            onFocus={save}
          >
            {sltdata.txr?.map((item = {}) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>,
        )}
      </Form.Item>
    );
  };

  const renderCell = () => {
    if (dataIndex === 'GLXM')
      return getPrjSelector({
        label,
        dataIndex,
        initialValue: record[dataIndex + record['ID']] || undefined,
      });
    else if (dataIndex === 'TXR')
      return getStaffSlt({
        label,
        dataIndex,
        initialValue: record[dataIndex + record['ID']] || undefined,
      });
    return (
      <Form.Item style={{ margin: 0 }}>
        {formdecorate.getFieldDecorator(dataIndex + record['ID'], {
          rules: [
            {
              required: !label.includes('月工作') && !label.includes('季度工作'),
              message: label + '不能为空',
            },
            { max: 500, message: label + `长度不能超过500` },
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
    );
  };

  return (
    <td {...restProps}>
      {editable ? <EditableContext.Consumer>{renderCell}</EditableContext.Consumer> : children}
    </td>
  );
};

export { EditableRow, EditableCell };
