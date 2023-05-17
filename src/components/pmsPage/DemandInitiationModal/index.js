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
  TreeSelect,
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
import dataCenter from '../../../utils/api/dataCenter';
const { TextArea } = Input;
function DemandInitiationModal(props) {
  const {visible, closeModal, form} = props;
  const {validateFields, getFieldValue, resetFields, getFieldDecorator} = form;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    return () => {};
  }, []);

  //转为树结构-关联项目
  const toItemTree = (list, parId) => {
    let a = list.reduce((pre, current, index) => {
      pre[current.YSLXID] = pre[current.YSLXID] || [];
      pre[current.YSLXID].push({
        key: current.YSLXID,
        title: current.YSLX,
        value: current.YSLXID,
        ID: current.ID,
        KGLYS: Number(current.KGLYS),
        YSLB: current.YSLB,
        YSXM: current.YSXM,
        ZYS: Number(current.ZYS),
        ZDBM: current.ZDBM,
        YSLX: current.YSLX,
        YSLXID: current.YSLXID,
        KZXYS: Number(current.KZXYS),
      });
      return pre;
    }, []);

    const treeData = [];
    for (const key in a) {
      const indexData = [];
      const childrenData = [];
      const childrenDatamini = [];
      if (a.hasOwnProperty(key)) {
        if (a[key] !== null) {
          // console.log("item",a[key]);
          let b = a[key].reduce((pre, current, index) => {
            pre[current.ZDBM] = pre[current.ZDBM] || [];
            pre[current.ZDBM].push({
              key: current.ID + current.YSLXID,
              title: current.YSXM,
              value: current.ID + current.YSLXID,
              ID: current.ID,
              KGLYS: Number(current.KGLYS),
              YSLB: current.YSLB,
              YSXM: current.YSXM,
              ZYS: Number(current.ZYS),
              ZDBM: current.ZDBM,
              YSLX: current.YSLX,
              YSLXID: current.YSLXID,
              KZXYS: Number(current.KZXYS),
            });
            return pre;
          }, []);
          a[key].map(item => {
            if (indexData.indexOf(item.ZDBM) === -1) {
              indexData.push(item.ZDBM);
              if (b[item.ZDBM]) {
                let treeDatamini = { children: [] };
                if (item.ZDBM === '6') {
                  // console.log("b[item.ZDBM]",b["6"])
                  b[item.ZDBM].map(i => {
                    treeDatamini.key = i.ID + i.ZDBM;
                    treeDatamini.value = i.ID + i.ZDBM;
                    treeDatamini.title = i.YSXM;
                    treeDatamini.ID = i.ID;
                    treeDatamini.KGLYS = Number(i.KGLYS);
                    treeDatamini.YSLB = i.YSLB;
                    treeDatamini.YSXM = i.YSXM;
                    treeDatamini.ZYS = Number(i.ZYS);
                    treeDatamini.KZXYS = Number(i.KZXYS);
                    treeDatamini.ZDBM = i.ZDBM;
                  });
                  // treeDatamini.dropdownStyle = { color: '#666' }
                  // treeDatamini.selectable=false;
                  // treeDatamini.children = b[item.ZDBM]
                } else {
                  treeDatamini.key = item.ZDBM + item.YSLXID;
                  treeDatamini.value = item.ZDBM + item.YSLXID;
                  treeDatamini.title = item.YSLB;
                  treeDatamini.ID = item.ID;
                  treeDatamini.KGLYS = Number(item.KGLYS);
                  treeDatamini.YSLB = item.YSLB;
                  treeDatamini.YSXM = item.YSXM;
                  treeDatamini.YSLX = item.YSLX;
                  treeDatamini.YSLXID = item.YSLXID;
                  treeDatamini.ZYS = Number(item.ZYS);
                  treeDatamini.KZXYS = Number(item.KZXYS);
                  treeDatamini.ZDBM = item.ZDBM;
                  treeDatamini.dropdownStyle = { color: '#666' };
                  treeDatamini.selectable = false;
                  treeDatamini.children = b[item.ZDBM];
                }
                childrenDatamini.push(treeDatamini);
              }
              childrenData.key = key;
              childrenData.value = key;
              childrenData.title = item.YSLX;
              childrenData.dropdownStyle = { color: '#666' };
              childrenData.selectable = false;
              childrenData.children = childrenDatamini;
            }
          });
          treeData.push(childrenData);
        }
      }
    }
    return treeData;
  };

  //保存
  const handleOK = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
      }
    });
  };

  //取消
  // const handleCancel = () => {
  //   resetFields();
  //   setVisible(false);
  // };

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
  const getSpan = txt => <span style={{ marginLeft: 12 }}>{txt}</span>;
  const tableColumns = [
    {
      title: '人员等级',
      dataIndex: 'RYDJ',
      width: '15%',
      align: 'center',
      key: 'RYDJ',
      ellipsis: true,
      editable: true,
    },
    {
      title: '岗位',
      dataIndex: 'GW',
      width: '12%',
      align: 'center',
      key: 'GW',
      ellipsis: true,
      editable: true,
    },
    {
      title: '人员数量',
      dataIndex: 'RYSL',
      width: '15%',
      align: 'center',
      key: 'RYSL',
      ellipsis: true,
      editable: true,
    },
    {
      title: '时长(人/月)',
      dataIndex: 'SC',
      width: '15%',
      align: 'center',
      key: 'SC',
      ellipsis: true,
      editable: true,
    },
    {
      title: getSpan('要求'),
      dataIndex: 'YQ',
      key: 'YQ',
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
      wrapClassName="editMessage-modify supplier-edit-box-modal"
      width={'880px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      cancelText={'关闭'}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      okText="保存"
      onOk={handleOK}
      onCancel={closeModal}
    >
      <div className="body-title-box">
        <strong>需求发起</strong>
      </div>
      <Form className="content-box" style={{ marginTop: 16, paddingRight: 8 }}>
        <Row>
          <Col span={12}>
            <Form.Item label="关联项目" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('glxm', {
                // initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '关联项目不允许空值',
                  },
                ],
              })(
                <TreeSelect
                  allowClear
                  className="item-selector"
                  showSearch
                  treeNodeFilterProp="title"
                  dropdownClassName="newproject-treeselect"
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                  // treeData={budgetData}
                  placeholder="请选择"
                  // onChange={handleBudgetChange}
                  // value={budgetValue}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="需求名称" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
              {getFieldDecorator('xqmc', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '需求名称不允许空值',
                  },
                ],
              })(<Input maxLength={50} allowClear placeholder={`请输入需求名称`} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          {getDP({
            label: '开发商反馈期限',
            dataIndex: 'kfsfkqx',
          })}
          {getDP({
            label: '初筛结果日期',
            dataIndex: 'csjgrq',
          })}
        </Row>
        <Row>
          {getDP({
            label: '意向试用日期',
            dataIndex: 'msjgrq',
          })}
          {getDP({
            label: '试用日期',
            dataIndex: 'syrq',
          })}
        </Row>
        <Form.Item
          label="人员需求"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 19 }}
          required
          style={{ marginBottom: 16, marginTop: 6 }}
        >
          <div className="lxr-table-box">
            <Table
              columns={columns}
              components={components}
              rowKey={'ID'}
              rowClassName={() => 'editable-row'}
              dataSource={tableData}
              scroll={tableData.length > 4 ? { y: 191 } : {}}
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
                  ['RYDJ' + UUID]: '',
                  ['GW' + UUID]: '',
                  ['RYSL' + UUID]: '',
                  ['SC' + UUID]: '',
                  ['YQ' + UUID]: '',
                });
                setTableData(p => [...arrData]);
                setTimeout(() => {
                  const table = document.querySelectorAll(`.lxr-table-box .ant-table-body`)[0];
                  table.scrollTop = table.scrollHeight;
                }, 200);
              }}
            >
              <span>
                <Icon type="plus" style={{ fontSize: '12px' }} />
                <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增人员需求</span>
              </span>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default Form.create()(DemandInitiationModal);
