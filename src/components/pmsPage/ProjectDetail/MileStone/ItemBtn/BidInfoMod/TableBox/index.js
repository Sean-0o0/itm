import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Button, Icon, Row, Table, message, Col, Form, Popconfirm } from 'antd';
import { EditableRow, EditableCell } from '../EditableTable';
import moment from 'moment';
import { getUUID } from '../../../../../../../utils/pmsPublicUtils';

export default function TableBox(props) {
  const {
    labelProps = {},
    gysSlt,
    setTableData,
    tableData = [],
    form = {},
    tableScroll = false,
    setAddGysModalVisible,
    gysSltFilterArr = [],
  } = props;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;

  const showAddRow = true;

  //表格数据保存
  const handleTableSave = row => {
    const tableDataArr = JSON.parse(JSON.stringify(tableData));
    const index = tableDataArr.findIndex(item => row.ID === item.ID);
    if (index !== -1) {
      tableDataArr.splice(index, 1, {
        ...tableDataArr[index], //old row
        ...row, //new row
      });
    }
    setTableData(tableDataArr);
  };

  //列配置
  const columns = [
    {
      title: '序号',
      dataIndex: 'XH',
      width: 80,
      key: 'XH',
      align: 'center',
      render: (txt, _, index) => index + 1,
    },
    {
      title: (
        <span>
          <span className="table-column-required">*</span>
          供应商名称
        </span>
      ),
      dataIndex: 'GYS',
      // width: 80,
      key: 'GYS',
      align: 'center',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: 80,
      key: 'OPRT',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            setTableData(tableData.filter(x => x.ID !== record.ID));
            if (tableData.filter(x => x.ID !== record.ID).length === 0 && labelProps.required) {
              message.error(labelProps.label + '不允许空值', 1);
            }
          }}
        >
          <a style={{ color: '#3361ff' }}>删除</a>
        </Popconfirm>
      ),
    },
  ].map(col => {
    return {
      ...col,
      onCell: record => {
        return {
          record,
          ...col,
          editable: col.editable,
          dataIndex: col.dataIndex,
          handleSave: handleTableSave,
          key: col.key,
          formdecorate: form,
          gysdata: gysSlt,
          gyssltfilterarr: gysSltFilterArr,
          setaddgysmodalvisible: setAddGysModalVisible,
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

  //表格渲染
  const renderTable = useMemo(
    () => (
      <Table
        columns={columns}
        components={components}
        rowKey={'ID'}
        dataSource={tableData}
        // scroll={tableScroll ? { y: 260 } : undefined}
        pagination={false}
        size="middle"
      />
    ),
    [JSON.stringify(tableData), JSON.stringify(gysSlt), JSON.stringify(gysSltFilterArr), form],
  );

  return (
    <Row>
      <Col span={24}>
        <Form.Item {...labelProps}>
          <div className="bid-info-table-box">
            {renderTable}
            {showAddRow && (
              <div
                className="table-add-row"
                onClick={() => {
                  const UUID = getUUID();
                  setTableData([...tableData, { ID: UUID, ['GYS' + UUID]: undefined }]);
                  if (tableScroll) {
                    setTimeout(() => {
                      const table = document.querySelectorAll(
                        `.bid-info-mod-modal .content-box`,
                      )[0];
                      if (table) {
                        table.scrollTop = table.scrollHeight;
                      }
                    }, 200);
                  }
                }}
              >
                <span>
                  <Icon type="plus" style={{ fontSize: '12px' }} />
                  <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增</span>
                </span>
              </div>
            )}
          </div>
        </Form.Item>
      </Col>
    </Row>
  );
}
