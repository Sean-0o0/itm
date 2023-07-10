import React, { useEffect, useState, useRef, Fragment } from 'react';
import {
  Button,
  message,
  Form,
  Checkbox,
  Tooltip,
  Popconfirm,
  Table,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import moment from 'moment';
import { EditableCell, EditableRow } from './EditableTable';

export default function ApportionDetail(props) {
  const { dataProps = {}, funcProps = {} } = props;
  const { formData = {} } = dataProps;
  const { isApportion = false, apportionmentData = [] } = formData;
  console.log('🚀 ~ file: index.js:21 ~ ApportionDetail ~ isApportion:', isApportion);
  const { getFieldDecorator, setFormData } = funcProps;
  useEffect(() => {
    return () => {};
  }, []);
  //表格数据保存
  const handleTableSave = row => {
    // console.log('🚀 ~ file: index.js:137 ~ handleTableSave ~ row:', row);
    let newData = [...contrastTable];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    newData = newData.map(x => {
      return {
        ...x,
        ['YWSX' + x.ID]: x['YWSX' + x.ID].trim(),
        ['LXR' + x.ID]: x['LXR' + x.ID].trim(),
        ['ZW' + x.ID]: x['ZW' + x.ID].trim(),
        SJ: x.SJ.trim(),
        ['DH' + x.ID]: x['DH' + x.ID].trim(),
        ['QTLXFS' + x.ID]: x['QTLXFS' + x.ID].trim(),
        ['BZ' + x.ID]: x['BZ' + x.ID].trim(),
      };
    });
    // console.log('🚀 ~ file: index.js:96 ~ handleTableSave ~ newData:', newData);
    // setEditData({
    //   ...editData,
    //   contrastTable: newData,
    // });
    setcontrastTable(p => newData);
  };

  //列配置
  const getSpan = txt => <span style={{ marginLeft: 12 }}>{txt}</span>;
  const tableColumns = [
    {
      title: '报销部门',
      dataIndex: 'BXBM',
      width: '40%',
      key: 'BXBM',
      ellipsis: true,
      editable: true,
    },
    {
      title: (
        <div className="table-header-diy">
          分摊比例
          <div className="update-tag">
            <Icon type="sync" />
            更新
          </div>
        </div>
      ),
      dataIndex: 'FTBL',
      width: '25%',
      key: 'FTBL',
      ellipsis: true,
      editable: true,
    },
    {
      title: (
        <div className="table-header-diy">
          分摊金额
          <div className="update-tag">
            <Icon type="sync" />
            更新
          </div>
        </div>
      ),
      dataIndex: 'FTJE',
      width: '25%',
      key: 'FTJE',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: '10%',
      key: 'OPRT',
      ellipsis: true,
      render: (text, record) => (
        // contactInfo.length >= 1 ? (
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            const dataSource = [...contrastTable];
            // console.log(dataSource);
            // setEditData({
            //   ...editData,
            //   contrastTable: dataSource.filter(item => item.ID !== record.ID),
            // });
            setcontrastTable(p => dataSource.filter(item => item.ID !== record.ID));
          }}
        >
          <a style={{ color: '#3361ff' }}>删除</a>
        </Popconfirm>
      ),
      // ) : null,
    },
  ];
  const columns = tableColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => {
        return {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          key: col.key,
          formdecorate: form,
          title: col?.title?.props?.children || '',
        };
      },
    };
  });

  //覆盖默认table元素
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const menu = (
    <Menu>
      <Menu.Item>报销部门</Menu.Item>
      <Menu.Item>分摊比例</Menu.Item>
      <Menu.Item>分摊金额</Menu.Item>
    </Menu>
  );
  return (
    <div className="apportion-detail-box">
      <div className="top-check-row">
        <Checkbox
          value={isApportion}
          onChange={e => setFormData(p => ({ ...p, isApportion: e.target.checked }))}
        >
          分摊明细
        </Checkbox>
        <div className="check-tip">若本明细的费用由多部门共同承担，请勾选</div>
      </div>
      {isApportion && (
        <div className="detail-box">
          <div className="apportion-ways">分摊方式：报销部门分摊</div>
          <div className="amount-display-box">
            <div className="info-item">
              <div className="label">费用金额：</div>
              <div className="value">¥&nbsp;{66}</div>
            </div>
            <div className="info-item">
              <div className="label">总分摊金额：</div>
              <div className="value">¥&nbsp;{66}</div>
            </div>
            <div className="info-item">
              <div className="label">总金额比例：</div>
              <div className="value">{66}%</div>
            </div>
            <div className="info-item">
              <div className="label">总计：</div>
              <div className="value">{66}条</div>
            </div>
          </div>
          <Form.Item className="apportion-table-box">
            {getFieldDecorator('apportionment', {
              initialValue: apportionmentData,
              rules: [
                {
                  required: true,
                  message: '分摊明细不允许空值',
                },
              ],
            })(
              <Table
                columns={columns}
                components={components}
                rowKey={'ID'}
                rowClassName={() => 'editable-row'}
                dataSource={apportionmentData}
                scroll={apportionmentData.length > 4 ? { y: 191 } : {}}
                pagination={false}
                size="middle"
              />,
            )}
            <div className="oprt-row">
              <div className="row-left">
                <Tooltip title="根据费用金额，自动平均分摊比例、分摊金额">
                  <span>平均分摊</span>
                </Tooltip>
                <span>批量添加分摊</span>
              </div>
              <div className="row-right row-right-disable">
                <Dropdown overlay={menu} overlayClassName="tc-btn-more-content-dropdown">
                  <span>批量修改</span>
                </Dropdown>
                <Popconfirm title="确定删除选中的分摊？" onConfirm={() => {}}>
                  <span>批量删除</span>
                </Popconfirm>
              </div>
            </div>
            <div
              className="table-add-row"
              onClick={() => {
                // let arrData = [...contrastTable];
                // const UUID = Date.now();
                // arrData.push({
                //   ID: UUID,
                //   GYSID: splInfo.ID,
                //   ['YWSX' + UUID]: '',
                //   ['LXR' + UUID]: '',
                //   ['ZW' + UUID]: '',
                //   SJ: '',
                //   ['DH' + UUID]: '',
                //   ['QTLXFS' + UUID]: '',
                //   ['BZ' + UUID]: '',
                // });
                // setcontrastTable(p => [...arrData]);
                setTimeout(() => {
                  const table = document.querySelectorAll(
                    `.apportion-table-box .ant-table-body`,
                  )[0];
                  table.scrollTop = table.scrollHeight;
                }, 200);
              }}
            >
              <span>
                <Icon type="plus" style={{ fontSize: '12px' }} />
                <span style={{ paddingLeft: '6px', fontSize: '14px' }}>添加分摊</span>
              </span>
            </div>
          </Form.Item>
        </div>
      )}
    </div>
  );
}
