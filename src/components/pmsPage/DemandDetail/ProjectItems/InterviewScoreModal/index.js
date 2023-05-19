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
  Tooltip,
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
import moment from 'moment';

const { Option } = Select;

function InterviewScoreModal(props) {
  const { visible, setVisible, form, ZHPC = [] } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [tableData, setTableData] = useState([]); //表格数据

  useEffect(() => {
    return () => {};
  }, []);

  const handleOk = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        setVisible(false);
      }
    });
  };
  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  //表格数据保存
  const handleTableSave = row => {
    // console.log('🚀 ~ file: index.js:137 ~ handleTableSave ~ row:', row);
    let newData = [...tableData];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    newData = newData.map(x => {
      return {
        ...x,
      };
    });
    setTableData(p => newData);
  };

  //列配置
  const tableColumns = [
    {
      title: '人员需求',
      dataIndex: 'RYXQ',
      width: '20%',
      key: 'RYXQ',
      ellipsis: true,
    },
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      key: 'GYSMC',
      ellipsis: true,
      render: txt => (
        <Tooltip title={txt} placement="topLeft">
          <span style={{ cursor: 'default' }}>{txt}</span>
        </Tooltip>
      ),
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '15%',
      key: 'RYMC',
      ellipsis: true,
    },
    {
      title: '评分',
      dataIndex: 'PF',
      width: '20%',
      align: 'center',
      key: 'PF',
      ellipsis: true,
      editable: true,
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

  return (
    <Modal
      wrapClassName="editMessage-modify interview-score-modal"
      width={'720px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '60px' }}
      title={null}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="body-title-box">
        <strong>面试评分</strong>
      </div>
      <div className="content-box">
        <Table
          columns={columns}
          components={components}
          rowKey={'ZHPCID'}
          rowClassName={() => 'editable-row'}
          dataSource={ZHPC}
          scroll={ZHPC.length > 4 ? { y: 227 } : {}}
          pagination={false}
          // bordered
          size="middle"
        />
      </div>
    </Modal>
  );
}
export default Form.create()(InterviewScoreModal);
