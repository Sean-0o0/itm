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
  Breadcrumb,
} from 'antd';
import { EditableCell, EditableRow } from './EditableTable';
import moment from 'moment';
import {
  FetchQueryGysInZbxx,
  OperateEvaluation,
  OutsourceCostCalculation,
  QueryOutsourceMemberList,
  QueryRequirementListPara,
  QueryUserInfo,
  QueryUserRole,
} from '../../../../../services/pmsServices';

const { Option } = Select;

function ExpenseCalucationModal(props) {
  const {
    visible,
    setVisible,
    form,
    XQNR = [],
    xqid,
    swzxid,
    reflush,
    update = false,
    ZHPC = [],
    quarterData = [],
  } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [tableData, setTableData] = useState([]); //表格数据
  const [xmmcData, setXmmcData] = useState([]); //项目名称
  const [ryData, setRyData] = useState([]); //人员
  const [ryOriginData, setRyOriginData] = useState([]); //人员
  const [updateData, setUpdateData] = useState({}); //更新回显
  const [isSpinning, setIsSpinning] = useState(false);
  const [dateRange, setDateRange] = useState(quarterData[0]?.range); //开始结束月份
  const [showAdd, setShowAdd] = useState(false); //是否允许新增

  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    getSelectorData();
    return () => {};
  }, []);

  useEffect(() => {
    const tableRyArr = tableData.map(x => x['RYID' + x.ID]);
    setRyData(ryOriginData.filter(x => !tableRyArr.includes(x.RYID)));
    setShowAdd(ryData.length > 0 && tableData.length < ryOriginData.length);
    return () => {};
  }, [JSON.stringify(tableData)]);

  //季度变化
  const handleQuarterChange = (v, node) => {
    setDateRange([...(node?.props?.range ?? [])]);
  };

  //下拉框数据
  const getSelectorData = () => {
    LOGIN_USER_INFO.id !== undefined && setIsSpinning(true);
    LOGIN_USER_INFO.id !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole = '' } = res;
            QueryRequirementListPara({
              current: 1,
              pageSize: 10,
              paging: -1,
              sort: '',
              total: -1,
              cxlx: 'XQLB',
              js: role,
            })
              .then(res => {
                if (res?.success) {
                  setXmmcData([...JSON.parse(res.xmxx)]);
                  setIsSpinning(false);
                }
              })
              .catch(e => {
                message.error('项目名称信息查询失败', 1);
              });
          }
        })
        .catch(e => {
          message.error('用户角色信息查询失败', 1);
        });
  };

  const handleOk = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        setIsSpinning(true);
        let submitTable = tableData.map(x => {
          if (x['RQ' + x.ID].length > 1)
            return {
              RYID: String(x['RYID' + x.ID]),
              KSSJ: x['RQ' + x.ID][0]?.format('YYYYMM'),
              JSSJ: x['RQ' + x.ID][1]?.format('YYYYMM'),
            };
        });
        let submitProps = {
          xmid: Number(getFieldValue('xmmc')),
          ryxx: JSON.stringify(submitTable),
          count: submitTable.length,
          czlx: 'MULTIPLE',
        };
        OutsourceCostCalculation(submitProps)
          .then(res => {
            if (res?.success) {
              resetFields();
              reflush();
              setIsSpinning(false);
              message.success('操作成功', 1);
              setVisible(false);
            }
          })
          .catch(e => {
            message.error('操作失败');
            setIsSpinning(false);
          });
      }
    });
  };

  const handleCancel = () => {
    resetFields();
    setVisible(false);
  };

  //表格数据保存
  const handleTableSave = row => {
    let newData = [...tableData];
    const index = newData.findIndex(item => row.ID === item.ID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    setTableData(p => newData);
  };

  //列配置
  const tableColumns = [
    {
      title: '人员名称',
      dataIndex: 'RYID',
      width: '17%',
      align: 'center',
      key: 'RYID',
      ellipsis: true,
      editable: true,
    },
    {
      title: '日期',
      dataIndex: 'RQ',
      width: '30%',
      align: 'center',
      key: 'RQ',
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
          title: col?.title?.props?.children || col?.title,
          rydata: ryData,
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

  //项目名称变化是清空人员列表
  const handleXmmcChange = v => {
    setTableData([]);
    setIsSpinning(true);
    LOGIN_USER_INFO.id !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole = '' } = res;
            QueryOutsourceMemberList({
              current: 1,
              pageSize: 10,
              paging: -1,
              sort: '',
              total: -1,
              cxlx: 'ALL',
              js: zyrole === '暂无' ? role : zyrole,
              zzjg: String(LOGIN_USER_INFO.org),
              xmmc: Number(v),
            })
              .then(res => {
                const { code, result } = res;
                if (code > 0) {
                  let arr = JSON.parse(result).map(x => ({
                    RYID: x.RYID,
                    RYMC: x.RYMC,
                  }));
                  const UUID = Date.now();
                  let tableArr = JSON.parse(result).map((x, i) => ({
                    ID: String(UUID) + i,
                    ['RYID' + String(UUID) + i]: x.RYID,
                    ['RQ' + String(UUID) + i]: dateRange,
                  }));
                  setRyData(p => [...arr]);
                  setRyOriginData([...arr]);
                  setShowAdd(arr.length > 0);
                  setTableData([...tableArr]);
                  setIsSpinning(false);
                }
              })
              .catch(e => {
                message.error('人员信息查询失败', 1);
              });
          }
        })
        .catch(e => {
          message.error('用户角色信息查询失败', 1);
        });
  };

  return (
    <Modal
      wrapClassName="editMessage-modify expense-calculation-modal"
      width={'900px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>费用计算</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Row>
            <Col span={12}>
              <Form.Item label="季度" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('jd', {
                  initialValue: quarterData[0]?.title || '',
                  rules: [
                    {
                      required: true,
                      message: '季度不允许空值',
                    },
                  ],
                })(
                  <Select
                    className="item-selector"
                    placeholder="请选择"
                    showSearch
                    allowClear
                    optionLabelProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleQuarterChange}
                  >
                    {quarterData.map((x, i) => (
                      <Option key={i} value={x.title} range={x.range}>
                        {x.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="项目名称" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('xmmc', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '项目名称不允许空值',
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
                    onChange={handleXmmcChange}
                  >
                    {xmmcData.map(x => {
                      return (
                        <Option key={x.ID} value={x.ID}>
                          {x.XMMC}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="人员列表"
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
              {showAdd && (
                <div
                  className="table-add-row"
                  onClick={() => {
                    let arrData = [...tableData];
                    const UUID = Date.now();
                    arrData.push({
                      ID: UUID,
                      ['RYID' + UUID]: '',
                      ['RQ' + UUID]: dateRange,
                    });
                    setTableData(p => [...arrData]);
                    // setShowAdd(ryData.length > 0 && tableData.length < ryOriginData.length - 1);
                    setTimeout(() => {
                      const table = document.querySelectorAll(`.ryxq-table-box .ant-table-body`)[0];
                      table && (table.scrollTop = table.scrollHeight);
                    }, 200);
                  }}
                >
                  <span>
                    <Icon type="plus" style={{ fontSize: '12px' }} />
                    <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增人员列表</span>
                  </span>
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
export default Form.create()(ExpenseCalucationModal);
