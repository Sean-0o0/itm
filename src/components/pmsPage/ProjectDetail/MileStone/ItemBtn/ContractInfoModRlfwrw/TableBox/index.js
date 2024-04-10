import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Button, Icon, Row, Table, message, Col, Form, Popconfirm, Input, Tooltip } from 'antd';
import { EditableRow, EditableCell } from '../EditableTable';
import moment from 'moment';
import UploadModal from '../UploadModal';
import FileDownload from '../FileDownload';
import { get } from 'lodash';
import SelectModal from '../SelectModal';
import { getUUID } from '../../../../../../../utils/pmsPublicUtils';

export default function TableBox(props) {
  const {
    labelProps = {},
    setTableData,
    setEditData,
    setDelData,
    tableData = [],
    editData = [],
    delData = [],
    form = {},
    tableScroll = false,
    sltData = {},
    setAddGysModalVisible,
  } = props;
  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;
  const [modalData, setModalData] = useState({
    skzh: false,
    ht: false,
    data: {},
  }); //弹窗显隐
  const [editingId, setEditingId] = useState(-1); //编辑行id

  //表格数据保存
  const handleTableSave = row => {
    const tableDataArr = [...tableData];
    const index = tableDataArr.findIndex(item => row.ID === item.ID);
    if (index !== -1) {
      tableDataArr.splice(index, 1, {
        ...tableDataArr[index], //old row
        ...row, //new row
      });
    }
    const editDataArr = [...editData];
    const index2 = editDataArr.findIndex(item => row.ID === item.ID);
    if (index2 !== -1) {
      editDataArr.splice(index2, 1, {
        ...editDataArr[index2], //old row
        ...row, //new row
      });
    } else {
      editDataArr.push(row);
    }
    setTableData(tableDataArr);
    setEditData(editDataArr);
  };

  //新增一行
  const handleAddRow = () => {
    const UUID = getUUID();
    setEditingId(UUID);
    setTableData([
      ...tableData,
      {
        ID: UUID,
        ['GYS' + UUID]: undefined,
        ['QSZT' + UUID]: '1',
        ['QSSM' + UUID]: undefined,
        ['GYSZH' + UUID]: undefined,
        accountObj: undefined,
        fileList: [],
        isNew: true,
      },
    ]);
    setEditData([
      ...editData,
      {
        ID: UUID,
        ['GYS' + UUID]: undefined,
        ['QSZT' + UUID]: '1',
        ['QSSM' + UUID]: undefined,
        accountObj: undefined,
        fileList: [],
        isNew: true,
      },
    ]);
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
      label: '供应商名称',
      dataIndex: 'GYS',
      width: 200,
      key: 'GYS',
      editable: true,
      ellipsis: true,
      render: (_, record) => {
        const txt =
          sltData.gys?.find(x => String(x.id) === String(record['GYS' + record.ID]))?.gysmc || '';
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
          签署状态
        </span>
      ),
      label: '签署状态',
      dataIndex: 'QSZT',
      width: 160,
      key: 'QSZT',
      editable: true,
      ellipsis: true,
      render: (_, record) => {
        const txt =
          sltData.qszt?.find(x => String(x.ibm) === String(record['QSZT' + record.ID]))?.note || '';
        return (
          <Tooltip title={txt} placement="topLeft">
            {txt}
          </Tooltip>
        );
      },
    },
    {
      title: '签署说明',
      label: '签署说明',
      dataIndex: 'QSSM',
      key: 'QSSM',
      editable: true,
      ellipsis: true,
      render: (_, record) => {
        const txt = record['QSSM' + record.ID] || '';
        return (
          <Tooltip title={txt} placement="topLeft" overlayClassName="pre-wrap-tooltip">
            {txt}
          </Tooltip>
        );
      },
    },
    {
      title: '供应商账户',
      dataIndex: 'SKZHMC',
      width: 200,
      key: 'SKZHMC',
      ellipsis: true,
      render: (_, record) => {
        let txt =
          record.accountObj?.khmc !== undefined
            ? `${record.accountObj.khmc ?? ''} - ${record.accountObj.yhkh ?? ''} - ${record
                .accountObj.wdmc ?? ''}`
            : undefined;
        return (
          <Tooltip title={txt} placement="topLeft">
            <div
              className="table-link-normal"
              onClick={() => setModalData(p => ({ ...p, skzh: true, data: record }))}
            >
              {txt ? txt : '选择账户'}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '合同',
      dataIndex: 'HT',
      width: 80,
      key: 'HT',
      ellipsis: true,
      render: (_, record) => (
        <FileDownload
          // fileStr={record.file}
          newFileArr={record.fileList || []}
          params={{
            objectName: 'TRLFWXM_HTXX_RWGYS',
            columnName: 'FJ',
            id: record.ID,
          }}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      width: 140,
      key: 'OPRT',
      align: 'center',
      ellipsis: true,
      render: (_, record) => (
        <div className="oprt-column">
          <span
            className="table-link-normal"
            onClick={() => setModalData(p => ({ ...p, ht: true, data: record }))}
          >
            合同上传
          </span>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => {
              setTableData(tableData.filter(x => x.ID !== record.ID));
              setEditData(editData.filter(x => x.ID !== record.ID));
              if (delData.findIndex(x => x.ID === record.ID) === -1 && !record.isNew) {
                //新加的不记录
                setDelData(delData.concat(record));
              }
              if (tableData.filter(x => x.ID !== record.ID).length === 0) {
                message.error(labelProps.label + '不允许空值', 1);
              }
            }}
          >
            <span className="table-link-normal">删除</span>
          </Popconfirm>
        </div>
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
              // gys: sltData.gys,
              gys: sltData.gys?.filter(
                x =>
                  !(
                    tableData?.filter(y => y.ID !== record.ID).map(y => y['GYS' + y.ID]) || []
                  ).includes(x.id),
              ),
            },
            label: col.label,
            validatefieldarr: ['GYS' + record.ID, 'QSZT' + record.ID, 'QSSM' + record.ID],
            setaddgysmodalvisible: setAddGysModalVisible,
          };
        return {
          record,
          ...col,
          editable: false,
          dataIndex: col.dataIndex,
          key: col.key,
          label: col.label,
          onClick: () => {
            setEditingId(record.ID);
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
              // scroll={tableScroll ? { y: 260 } : undefined}
              pagination={false}
              size="middle"
            />
            <div
              className="table-add-row"
              onClick={() => {
                handleAddRow();
                if (tableScroll) {
                  setTimeout(() => {
                    const table = document.querySelectorAll(
                      `.contract-info-mod-modal .content-box`,
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
          </div>
        </Form.Item>
      </Col>
      <UploadModal
        visible={modalData.ht}
        setVisible={v => setModalData(p => ({ ...p, ht: v }))}
        tableData={tableData}
        setTableData={setTableData}
        editData={editData}
        setEditData={setEditData}
        data={modalData.data}
      />
      <SelectModal
        visible={modalData.skzh}
        setVisible={v => setModalData(p => ({ ...p, skzh: v }))}
        tableData={tableData}
        setTableData={setTableData}
        editData={editData}
        setEditData={setEditData}
        data={modalData.data}
        skzhSlt={sltData.skzh}
      />
    </Row>
  );
}
