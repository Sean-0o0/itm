import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Button, Icon, Row, Table, message, Col, Form, Popconfirm, Tooltip } from 'antd';
import { EditableRow, EditableCell } from '../EditableTable';
import moment from 'moment';
import { getUUID } from '../../../../../../../utils/pmsPublicUtils';

export default function TableBoxRldj(props) {
  const {
    labelProps = {},
    setTableData,
    tableData = [],
    form = {},
    tableScroll = false,
    sltData = {},
    editingId, setEditingId
  } = props;
  
  const rydjSltData = useCallback(
    (record = {}, sltData = {}, tableData = []) =>
      sltData.rydj?.filter(
        x =>
          !(tableData?.filter(y => y.ID !== record.ID).map(y => y['DJ' + y.ID]) || []).includes(
            x.RYDJID,
          ),
      ),
    [],
  );

  const showAddRow = tableData.length < sltData.rydj?.length;

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

  //新增一行
  const handleAddRow = () => {
    const UUID = getUUID();
    form.validateFieldsAndScroll(['DJ' + editingId, 'RLDJ' + editingId], err => {
      if (!err) {
        setEditingId(UUID);
        setTableData([
          ...tableData,
          { ID: UUID, ['DJ' + UUID]: undefined, ['RLDJ' + UUID]: undefined },
        ]);
      }
    });
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
          等级
        </span>
      ),
      label: '等级',
      dataIndex: 'DJ',
      width: 150,
      key: 'DJ',
      editable: true,
      ellipsis: true,
      render: (_, record) => {
        const txt =
          sltData.rydj?.find(x => String(x.RYDJID) === String(record['DJ' + record.ID]))?.RYDJ ||
          '';
        return (
          <Tooltip title={txt} placement="topLeft">
            {txt}
          </Tooltip>
        );
      },
    },
    {
      title: (
        <span>
          <span className="table-column-required">*</span>
          人力单价（人月/元）
        </span>
      ),
      label: '人力单价（人月/元）',
      dataIndex: 'RLDJ',
      key: 'RLDJ',
      editable: true,
      render: (_, record) => record['RLDJ' + record.ID],
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
            if (tableData.filter(x => x.ID !== record.ID).length === 0) {
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
        if (col.editable && editingId === record.ID)
          return {
            record,
            ...col,
            editable: true,
            dataIndex: col.dataIndex,
            handleSave: handleTableSave,
            key: col.key,
            formdecorate: form,
            sltdata: {
              ...sltData,
              rydj: rydjSltData(record, sltData, tableData),
            },
            label: col.label,
            validatefieldarr: ['DJ' + record.ID, 'RLDJ' + record.ID],
          };
        return {
          record,
          ...col,
          editable: false,
          dataIndex: col.dataIndex,
          key: col.key,
          label: col.label,
          onClick: () => {
            form.validateFieldsAndScroll(['DJ' + editingId, 'RLDJ' + editingId], err => {
              if (col.dataIndex !== 'OPRT' && !err) setEditingId(record.ID);
            });
          },
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

  return (
    <Row>
      <Col span={24}>
        <Form.Item {...labelProps}>
          <div className="contract-info-table-box">
            <Table
              columns={columns}
              components={components}
              rowKey={'ID'}
              dataSource={tableData}
              scroll={tableScroll ? { y: 260 } : undefined}
              pagination={false}
              size="middle"
            />
            {showAddRow && (
              <div
                className="table-add-row"
                onClick={() => {
                  handleAddRow();
                  if (tableScroll) {
                    setTimeout(() => {
                      const table = document.querySelectorAll(
                        `.contract-info-mod-modal .contract-info-table-box .ant-table-body`,
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
