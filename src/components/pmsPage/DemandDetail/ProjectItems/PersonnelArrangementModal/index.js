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
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
import moment from 'moment';

const { Option } = Select;

function PersonnelArrangementModal(props) {
  const { visible, setVisible, form, RYXQ = [] } = props;
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
        // ['YWSX' + x.ID]: x['YWSX' + x.ID].trim(),
        // ['LXR' + x.ID]: x['LXR' + x.ID].trim(),
        // ['ZW' + x.ID]: x['ZW' + x.ID].trim(),
        // SJ: x.SJ.trim(),
        // ['DH' + x.ID]: x['DH' + x.ID].trim(),
        // ['QTLXFS' + x.ID]: x['QTLXFS' + x.ID].trim(),
        // ['BZ' + x.ID]: x['BZ' + x.ID].trim(),
      };
    });
    setTableData(p => newData);
  };

  //列配置
  const tableColumns = [
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      align: 'center',
      key: 'GYSMC',
      ellipsis: true,
      editable: true,
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '20%',
      align: 'center',
      key: 'RYMC',
      ellipsis: true,
      editable: true,
    },
    {
      title: '面试时间',
      dataIndex: 'ZHPCSJ',
      width: '25%',
      align: 'center',
      key: 'ZHPCSJ',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'OPRT',
      align: 'center',
      width: '10%',
      key: 'OPRT',
      ellipsis: true,
      render: (text, record) => (
        <Popconfirm
          title="确定要删除吗?"
          onConfirm={() => {
            const dataSource = [...tableData];
            setTableData(p => dataSource.filter(item => item.ID !== record.ID));
          }}
        >
          <a style={{ color: '#3361ff' }}>删除</a>
        </Popconfirm>
      ),
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

  //输入框 - 灰
  const getInputDisabled = (label, value, labelCol, wrapperCol) => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: labelCol }} wrapperCol={{ span: wrapperCol }}>
          <div
            style={{
              width: '100%',
              height: '32px',
              backgroundColor: '#F5F5F5',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginTop: '5px',
              lineHeight: '32px',
              paddingLeft: '10px',
              fontSize: '14px',
            }}
          >
            {value}
          </div>
        </Form.Item>
      </Col>
    );
  };

  //获取日期选择器
  const getDP = ({ label = '--', dataIndex, span = [8, 14] }) => {
    return (
      <Col span={12}>
        <Form.Item label={label} labelCol={{ span: span[0] }} wrapperCol={{ span: span[1] }}>
          {getFieldDecorator(dataIndex, {
            initialValue: null,
            rules: [
              {
                required: true,
                message: label + '不允许空值',
              },
            ],
          })(<DatePicker allowClear placeholder={'请选择' + label} style={{ width: '100%' }} />)}
        </Form.Item>
      </Col>
    );
  };

  return (
    <Modal
      wrapClassName="editMessage-modify personnel-arrangement-modal"
      width={'900px'}
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
        <strong>综合评测安排</strong>
      </div>
      <Form className="content-box">
        <Row>
          <Col span={12}>
            <Form.Item label="人员需求" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('ryxq', {
                // initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '人员需求不允许空值',
                  },
                ],
              })(
                <Select
                  className="item-selector"
                  placeholder="请选择"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {RYXQ.map(x => {
                    return (
                      <Option key={x} value={x}>
                        {x}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="面试官" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('msg', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '面试官不允许空值',
                  },
                ],
              })(
                <Select
                  className="item-selector"
                  placeholder="请选择"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {RYXQ.map(x => {
                    return (
                      <Option key={x} value={x}>
                        {x}
                      </Option>
                    );
                  })}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>{getInputDisabled('预计综合评测日期', '2023-04-07', 8, 14)}</Row>
        <Form.Item
          label="人员需求"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
          required
          style={{ marginBottom: 16, marginTop: 6 }}
        >
          <div className="ryxq-table-box">
            <Table
              columns={columns}
              components={components}
              rowKey={'ID'}
              rowClassName={() => 'editable-row'}
              dataSource={tableData}
              scroll={tableData.length > 3 ? { y: 171 } : {}}
              pagination={false}
              bordered
              size="middle"
            />
            <div
              className="table-add-row"
              onClick={() => {
                let arrData = [...tableData];
                const UUID = Date.now();
                arrData.push({
                  ID: UUID,
                  ['GYSMC' + UUID]: '',
                  ['RYMC' + UUID]: '',
                  ['ZHPCSJ' + UUID]: '',
                });
                setTableData(p => [...arrData]);
                setTimeout(() => {
                  const table = document.querySelectorAll(`.ryxq-table-box .ant-table-body`)[0];
                  table.scrollTop = table.scrollHeight;
                }, 200);
              }}
            >
              <span>
                <Icon type="plus" style={{ fontSize: '12px' }} />
                <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增人员安排</span>
              </span>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default Form.create()(PersonnelArrangementModal);
