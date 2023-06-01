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
import {
  FetchQueryGysInZbxx,
  OperateEvaluation,
  QueryUserInfo,
} from '../../../../../services/pmsServices';

const { Option } = Select;

function PersonnelArrangementModal(props) {
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
  } = props;
  const { validateFields, getFieldValue, resetFields, getFieldDecorator } = form;
  const [tableData, setTableData] = useState([]); //表格数据
  const [pcryData, setPcryData] = useState([]); //评测人员
  const [gysData, setGysData] = useState([]); //供应商
  const [updateData, setUpdateData] = useState({}); //更新回显
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    getPcryData();
    return () => {};
  }, []);

  useEffect(() => {
    if (update) {
      const zhpc = Object.values(
        ZHPC.reduce((acc, curr) => {
          let { XQNRID, RYMC, GYSID, ZHPCSJ, MSGID, PCID } = curr;
          ZHPCSJ = moment(ZHPCSJ);
          if (!acc[XQNRID]) {
            acc[XQNRID] = {
              XQNRID,
              MSGID: MSGID?.split(','),
              TABLE: [
                { PCID, ['RYMC' + PCID]: RYMC, ['GYSID' + PCID]: GYSID, ['MSSJ' + PCID]: ZHPCSJ },
              ],
            };
          } else {
            acc[XQNRID].TABLE.push({
              PCID,
              ['RYMC' + PCID]: RYMC,
              ['GYSID' + PCID]: GYSID,
              ['MSSJ' + PCID]: ZHPCSJ,
            });
          }
          return acc;
        }, {}),
      );
      // console.log('🚀 ~ file: index.js:73 ~ useEffect ~  zhpc:', zhpc);
      if (zhpc.length > 0) {
        const UUID = Date.now();
        if (zhpc[0].TABLE?.length === 0) {
          setTableData([
            {
              PCID: UUID,
              ['GYSID' + UUID]: '',
              ['RYMC' + UUID]: '',
              ['MSSJ' + UUID]: null,
              NEW: true,
            },
          ]);
        } else {
          setTableData([...zhpc[0].TABLE]);
        }
        setUpdateData({
          MSGID: zhpc[0].MSGID,
          XQNRID: zhpc[0].XQNRID,
        });
        // console.log('🚀 ~ file: index.js:80 ~ useEffect ~ [...zhpc[0].TABLE]:', [...zhpc[0].TABLE]);
      }
    }
    return () => {};
  }, [update, ZHPC]);

  //人员需求变化
  const handleRyxqXhange = v => {
    if (update) {
      const zhpc = Object.values(
        ZHPC.reduce((acc, curr) => {
          let { XQNRID, RYMC, GYSID, ZHPCSJ, MSGID, PCID } = curr;
          ZHPCSJ = moment(ZHPCSJ);
          if (!acc[XQNRID]) {
            acc[XQNRID] = {
              XQNRID,
              MSGID: MSGID?.split(','),
              TABLE: [
                { PCID, ['RYMC' + PCID]: RYMC, ['GYSID' + PCID]: GYSID, ['MSSJ' + PCID]: ZHPCSJ },
              ],
            };
          } else {
            acc[XQNRID].TABLE.push({
              PCID,
              ['RYMC' + PCID]: RYMC,
              ['GYSID' + PCID]: GYSID,
              ['MSSJ' + PCID]: ZHPCSJ,
            });
          }
          return acc;
        }, {}),
      );
      const arr = zhpc.filter(x => x.XQNRID === v);
      let item = arr.length > 0 ? arr[0] : { TABLE: [] };
      if (zhpc.length > 0) {
        const UUID = Date.now();
        if (item.TABLE?.length === 0) {
          setTableData([
            {
              PCID: UUID,
              ['GYSID' + UUID]: '',
              ['RYMC' + UUID]: '',
              ['MSSJ' + UUID]: null,
              NEW: true,
            },
          ]);
        } else {
          setTableData([...item.TABLE]);
        }
        setUpdateData({
          MSGID: item.MSGID,
          XQNRID: item.XQNRID,
        });
      }
    }
    console.log('🚀 ~ file: index.js:90 ~ handleRyxqXhange ~ v:', v, updateData);
  };

  //评测人员下拉框数据
  const getPcryData = () => {
    QueryUserInfo({
      type: '信息技术事业部',
    })
      .then(res => {
        if (res.success) {
          setPcryData([...res.record]);
          fetchQueryGysInZbxx();
        }
      })
      .catch(e => {
        message.error('评测人员信息查询失败', 1);
      });
  };

  // 查询供应商下拉列表
  const fetchQueryGysInZbxx = () => {
    FetchQueryGysInZbxx({
      paging: -1,
      sort: '',
      current: 1,
      pageSize: 10,
      total: -1,
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          setGysData([...rec]);
        }
      })
      .catch(e => {
        message.error('供应商信息查询失败', 1);
      });
  };

  const handleOk = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        setIsSpinning(true);
        let submitTable = tableData.map(x => {
          return {
            PCID: x.NEW === true ? '-1' : x.PCID,
            GYSID: x['GYSID' + x.PCID],
            RYMC: x['RYMC' + x.PCID],
            MSSJ: x['MSSJ' + x.PCID]?.format('YYYYMMDDHHmmss'),
          };
        });
        // console.log('🚀 ~ file: index.js:134 ~ submitTable ~ tableData:', tableData);
        // console.log('🚀 ~ file: index.js:87 ~ submitTable ~ submitTable:', submitTable);
        let submitProps = {
          xqid: Number(xqid),
          swzxid: Number(swzxid),
          ryap: JSON.stringify(submitTable),
          ryxqid: Number(getFieldValue('ryxq')),
          msg: getFieldValue('pcry')?.join(';'),
          czlx: update ? 'UPDATEAP' : 'AP',
          count: submitTable.length,
        };
        // console.log('🚀 ~ file: index.js:88 ~ handleOk ~ submitProps:', submitProps);
        OperateEvaluation(submitProps)
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
            message.error('信息提交失败');
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
    // console.log('🚀 ~ file: index.js:137 ~ handleTableSave ~ row:', row);
    let newData = [...tableData];
    const index = newData.findIndex(item => row.PCID === item.PCID);
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
      title: '供应商名称',
      dataIndex: 'GYSID',
      align: 'center',
      key: 'GYSID',
      ellipsis: true,
      editable: true,
    },
    {
      title: '人员名称',
      dataIndex: 'RYMC',
      width: '17%',
      align: 'center',
      key: 'RYMC',
      ellipsis: true,
      editable: true,
    },
    {
      title: '综合评测时间',
      dataIndex: 'MSSJ',
      width: '30%',
      align: 'center',
      key: 'MSSJ',
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
            setTableData(p => dataSource.filter(item => item.PCID !== record.PCID));
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
          gysdata: gysData,
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

  return (
    <Modal
      wrapClassName="editMessage-modify personnel-arrangement-modal"
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
        <strong>综合评测安排</strong>
      </div>
      <Spin spinning={isSpinning}>
        <Form className="content-box">
          <Row>
            <Col span={12}>
              <Form.Item label="人员需求" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('ryxq', {
                  initialValue: updateData.XQNRID,
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
                    optionLabelProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleRyxqXhange}
                  >
                    {XQNR.map(x => {
                      return (
                        <Option key={x.XQNRID} value={x.XQNRID}>
                          {x.RYDJ} | {x.GW}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="评测人员" labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('pcry', {
                  initialValue: updateData.MSGID,
                  rules: [
                    {
                      required: true,
                      message: '评测人员不允许空值',
                    },
                  ],
                })(
                  <Select
                    className="item-selector"
                    placeholder="请选择"
                    mode="multiple"
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {pcryData.map(x => {
                      return (
                        <Option key={x.id} value={x.id}>
                          {x.name}
                        </Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {getInputDisabled(
              '预计综合评测日期',
              XQNR.length > 0 ? moment(XQNR[0].YJZHPCRQ).format('YYYY-MM-DD') : '',
              8,
              14,
            )}
          </Row>
          <Form.Item
            label="评测时间安排"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
            required
            style={{ marginBottom: 16, marginTop: 6 }}
          >
            <div className="ryxq-table-box">
              <Table
                columns={columns}
                components={components}
                rowKey={'PCID'}
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
                    PCID: UUID,
                    ['GYSID' + UUID]: '',
                    ['RYMC' + UUID]: '',
                    ['MSSJ' + UUID]: null,
                    NEW: true,
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
      </Spin>
    </Modal>
  );
}
export default Form.create()(PersonnelArrangementModal);
