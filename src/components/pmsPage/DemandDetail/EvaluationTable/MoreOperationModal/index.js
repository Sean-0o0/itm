import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  Input,
  Table,
  Row,
  Col,
  Icon,
  Popconfirm,
  DatePicker,
  Select,
  Button,
} from 'antd';
import { EditableCell, EditableFormRow } from './EditableTable';
import moment from 'moment';
import DataCenter from '../../../../../utils/api/dataCenter';

function MoreOperationModal(props) {
  const { visible, setVisible, form } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [isSaved, setIsSaved] = useState(false);
  const [edited, setEdited] = useState(false); //已编辑
  const [editing, setEditing] = useState(false); //编辑状态
  const [editingIndex, setEditingIndex] = useState(-1); //编辑
  const [editData, setEditData] = useState([]); //编辑数据
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    return () => {};
  }, []);

  //表格保存
  const handleTableSave = row => {
    const newData = [...tableData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row data
      ...row, //new row data
    });
    let newEdit = [...editData];
    let index2 = newEdit.findIndex(item => row.id === item.id);
    if (index2 === -1) {
      newEdit.push(row);
    } else {
      newEdit.splice(index2, 1, {
        ...newEdit[index2], //old row data
        ...row, //new row data
      });
    }
    setEditData(p => [...newEdit]);
    setEdited(true);
    // console.log('TableData', newData);
    setTableData(preState => [...newData]);
  };

  //调接口保存
  const handleSubmit = () => {};

  const tableColumns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      width: '10%',
      // align: 'center',
      key: 'RYDJ',
      ellipsis: true,
      render: (txt, row) => txt + ` | ` + row.GW,
    },
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      width: '20%',
      key: 'GYSMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Tooltip title={text} placement="topLeft">
            <Link
              to={{
                pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                  JSON.stringify({ splId: row.GYSID }),
                )}`,
                state: {
                  routes: [{ name: '需求详情', pathname: location.pathname }],
                },
              }}
              className="table-link-strong"
            >
              {text}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '7%',
      key: 'RYMC',
      ellipsis: true,
      render: (text, row, index) => {
        return (
          <Link
            style={{ color: '#3361ff' }}
            to={{
              pathname: `/pms/manage/staffDetail/${EncryptBase64(
                JSON.stringify({
                  ryid: row.RYID,
                }),
              )}`,
              state: {
                routes: [{ name: '需求详情', pathname: location.pathname }],
              },
            }}
            className="table-link-strong"
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: '评测人员',
      dataIndex: 'MSG',
      width: '12%',
      key: 'MSG',
      ellipsis: true,
      render: (txt, row) => {
        let nameArr = txt?.split(',');
        let idArr = row.MSGID?.split(',');
        if (nameArr?.length === 0) return '';
        return (
          <Tooltip title={nameArr?.join('、')} placement="topLeft">
            {nameArr?.map((x, i) => (
              <span>
                <Link
                  style={{ color: '#3361ff' }}
                  to={{
                    pathname: `/pms/manage/staffDetail/${EncryptBase64(
                      JSON.stringify({
                        ryid: idArr[i],
                      }),
                    )}`,
                    state: {
                      routes: [{ name: '需求详情', pathname: location.pathname }],
                    },
                  }}
                  className="table-link-strong-tagtxt"
                >
                  {x}
                </Link>
                {i === nameArr?.length - 1 ? '' : '、'}
              </span>
            ))}
          </Tooltip>
        );
      },
    },
    {
      title: '综合评测时间',
      dataIndex: 'ZHPCSJ',
      width: '13%',
      key: 'ZHPCSJ',
      ellipsis: true,
      render: (txt, row) => (txt && moment(txt).format('YYYY-MM-DD HH:mm')) || '--',
    },
    {
      title: '综合评测分数',
      dataIndex: 'ZHPCCJ',
      width: '10%',
      align: 'center',
      key: 'ZHPCCJ',
      ellipsis: true,
    },
    {
      title: '打分状态',
      dataIndex: 'DFZT',
      width: '8%',
      key: 'DFZT',
      ellipsis: true,
      render: txt => DFZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用状态',
      dataIndex: 'LYZT',
      width: '7%',
      key: 'LYZT',
      ellipsis: true,
      render: txt => LYZT?.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用说明',
      dataIndex: 'LYSM',
      align: 'center',
      key: 'LYSM',
      ellipsis: true,
      render: text => (
        <Tooltip title={text} placement="topLeft">
          <span style={{ cursor: 'default' }}>{text}</span>
        </Tooltip>
      ),
    },
  ];

  //列配置
  const columns = tableColumns.map(col => {
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
          issaved: isSaved,
          editingindex: editingIndex,
        };
      },
    };
  });

  //表格组件
  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  //修改
  const handleEdit = () => {
    setEditing(true);
    if (tableData.length > 0) setEditingIndex(tableData[0]?.id);
  };

  //取消修改
  const handleEditCancel = () => {
    setEditing(false);
    setEditingIndex(-1);
    setTableData(p => []);
    setEdited(false);
  };

  //确认
  const handleOk = () => {
    setVisible(false);
  };

  //取消
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      wrapClassName="editMessage-modify evaluation-more-operation-modal"
      width={'720px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>综合评测信息列表</strong>
      </div>
      <div className="content-box">
        <div className="top-btn">
          <Button  onClick={() => {}}>
            面试通知
          </Button>
          <Button  onClick={() => {}}>
            提交录用申请
          </Button>
          <Button  onClick={() => {}}>
            确认录用申请
          </Button>
          {editing ? (
            <>
              <Popconfirm
                title="确定要保存吗？"
                onConfirm={handleSubmit}
                disabled={!edited}
              >
                <Button disabled={!edited} style={{ marginRight: '16px' }}>保存</Button>
              </Popconfirm>
              <Button onClick={handleEditCancel}>取消</Button>
              <span style={{ fontSize: '12px', fontFamily: 'PingFangSC-Regular,PingFang SC' }}>
                （点击指定行进行编辑）
              </span>
            </>
          ) : (
            <Button onClick={handleEdit} type="primary">
              修改
            </Button>
          )}
        </div>
        <Table
          onRow={record => {
            return {
              onClick: () => {
                if (editing) {
                  setEditingIndex(record.id);
                }
              },
            };
          }}
          loading={isSpinning}
          columns={columns}
          components={components}
          rowKey={record => record.id}
          rowClassName={() => 'editable-row'}
          dataSource={tableData}
          scroll={
            { y: true }
            // tableData?.length > (document.body.clientHeight - 278) / (editing ? 59 : 40)
            //   ? {
            //       y: document.body.clientHeight - 278,
            //       x: 1900,
            //     }
            //   : { y: false, x: 1900 }
          }
          pagination={false}
          // bordered
        />
      </div>
    </Modal>
  );
}
export default Form.create()(MoreOperationModal);
