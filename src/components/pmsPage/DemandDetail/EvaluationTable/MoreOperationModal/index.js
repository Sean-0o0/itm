import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Drawer,
} from 'antd';
import { EditableCell, EditableFormRow } from './EditableTable';
import moment from 'moment';

const { TextArea } = Input;

function MoreOperationModal(props) {
  const { visible, setVisible, form, data = {} } = props;
  const { tableData = [], DFZT = [], LYZT = [] } = data;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [isSaved, setIsSaved] = useState(false);
  const [edited, setEdited] = useState(false); //已编辑
  const [editing, setEditing] = useState(false); //编辑状态
  const [editingIndex, setEditingIndex] = useState(-1); //编辑
  const [editData, setEditData] = useState([]); //编辑数据
  const [selectedRowIds, setSelectedRowIds] = useState([]); //选中行id
  const [lysm, setLysm] = useState({
    visible: false, //显隐
    index: -1, //编辑行的id
  }); //录用说明编辑弹窗数据

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
      width: '18%',
      key: 'GYSMC',
      ellipsis: true,
      render: txt => {
        return (
          <Tooltip title={txt} placement="topLeft">
            {txt}
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
    },
    {
      title: '评测人员',
      dataIndex: 'MSG',
      width: '10%',
      key: 'MSG',
      ellipsis: true,
      render: txt => {
        let nameArr = txt?.split(',');
        if (nameArr?.length === 0) return '';
        return (
          <Tooltip title={nameArr?.join('、')} placement="topLeft">
            {nameArr.join('、')}
          </Tooltip>
        );
      },
    },
    {
      title: '综合评测时间',
      dataIndex: 'ZHPCSJ',
      width: '12%',
      key: 'ZHPCSJ',
      ellipsis: true,
      render: txt => (txt && moment(txt).format('YYYY-MM-DD HH:mm')) || '--',
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
      width: '9%',
      key: 'DFZT',
      ellipsis: true,
      render: txt => DFZT.filter(x => x.ibm === txt)[0]?.note,
    },
    {
      title: '录用状态',
      dataIndex: 'LYZT',
      key: 'LYZT',
      ellipsis: true,
      editable: true,
    },
    {
      title: '录用说明',
      dataIndex: 'LYSM',
      key: 'LYSM',
      width: '7%',
      ellipsis: true,
      render: (txt, row) => (
        <a
          style={{ color: '#3361ff' }}
          onClick={() => {
            setLysm(p => {
              return {
                index: row.ZHPCID,
                visible: true,
              };
            });
          }}
        >
          查看详情
        </a>
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
          title: col.title,
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
    // if (tableData.length > 0) setEditingIndex(tableData[0]?.id);
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

  //行选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let newSelectedRowIds = [];
      selectedRows?.forEach(item => {
        newSelectedRowIds.push(item.id);
      });
      setSelectedRowIds(newSelectedRowIds);
    },
  };

  return (
    <Modal
      wrapClassName="editMessage-modify evaluation-more-operation-modal"
      width={'1200px'}
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
        {lysm.visible && (
          <Modal
            wrapClassName="editMessage-modify evaluation-more-operation-modal"
            width={'700px'}
            maskClosable={false}
            zIndex={101}
            maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
            style={{ top: '140px' }}
            title={null}
            visible={lysm.visible}
            onOk={() => {
              setLysm(p => {
                return {
                  ...p,
                  visible: false,
                };
              });
            }}
            onCancel={() => {
              setLysm(p => {
                return {
                  ...p,
                  visible: false,
                };
              });
            }}
          >
            <div className="body-title-box">
              <strong>录用说明编辑</strong>
            </div>
            <div className="content-box">
              <div className="lysm-label">录用说明：</div>
              <TextArea
                placeholder="请输入录用说明"
                maxLength={1000}
                autoSize={{ maxRows: 6, minRows: 3 }}
              ></TextArea>
            </div>
          </Modal>
        )}
        <div className="top-btn">
          <Button onClick={() => {}}>面试通知</Button>
          <Button onClick={() => {}}>提交录用申请</Button>
          <Button onClick={() => {}}>确认录用申请</Button>
          {/* {editing ? (
            <>
              <Popconfirm title="确定要保存吗？" onConfirm={handleSubmit} disabled={!edited}>
                <Button disabled={!edited} style={{ marginRight: '16px' }}>
                  保存
                </Button>
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
          )} */}
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
          rowSelection={rowSelection}
          loading={isSpinning}
          columns={columns}
          components={components}
          rowKey={'ZHPCID'}
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
