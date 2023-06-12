import React, { useEffect, useState } from 'react';
import { Modal, Form, message, Input, Table, Popconfirm, Button, Tooltip } from 'antd';
import { EditableCell, EditableFormRow } from './EditableTable';
import moment from 'moment';
import {
  CreateOperateHyperLink,
  FinishOutsourceWork,
  OperateEvaluation,
} from '../../../../../services/pmsServices';
import BridgeModel from '../../../../Common/BasicModal/BridgeModel';
import SendMailModal from '../../../SendMailModal';

const { TextArea } = Input;

function MoreOperationModal(props) {
  const { visible, setVisible, form, data = {} } = props;
  const {
    tableData = [],
    DFZT = [],
    LYZT = [],
    xqid,
    swzxid,
    reflush,
    isDock,
    fqrid,
    swzxid_email,
  } = data;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [editing, setEditing] = useState(false); //编辑状态
  const [editData, setEditData] = useState([]); //编辑数据的id
  const [selectedRowIds, setSelectedRowIds] = useState([]); //选中行id
  const [tableArr, setTableArr] = useState([]); //表格数据
  const [editContent, setEditContent] = useState(''); //编辑的内容
  const [lysm, setLysm] = useState({
    visible: false, //显隐
    index: -1, //编辑行的id
    content: '',
  }); //录用说明编辑弹窗数据
  const [modalVisible, setModalVisible] = useState({
    employmentApplication: false,
    msgConfirmation: false,
  }); //弹窗显隐
  const [lbModal, setLbModal] = useState({
    url: '#',
    title: '',
  }); //
  const [status, setStatus] = useState({
    mstz: false,
    qrlysq: false,
  }); //面试通知状态
  const [gysmcArr, setGysmcArr] = useState([]); //邮件弹窗入参

  useEffect(() => {
    let arr = tableData.map(x => {
      return {
        ...x,
        ['LYZT' + x.PCID]: x.LYZT || '',
        ['LYSM' + x.PCID]: x.LYSM || '',
      };
    });
    setTableArr([...JSON.parse(JSON.stringify(arr))]);
    return () => {};
  }, [JSON.stringify(data)]);

  //表格保存
  const handleTableSave = row => {
    const newData = [...tableArr];
    const index = newData.findIndex(item => row.PCID === item.PCID);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row data
      ...row, //new row data
    });
    let newEdit = [...editData];
    let index2 = newEdit.findIndex(item => String(row.PCID) === String(item));
    if (index2 === -1) {
      newEdit.push(row.PCID);
    } else {
      newEdit.splice(index2, 1, row.PCID);
    }
    setEditData(p => [...newEdit]);
    setTableArr(p => [...newData]);
  };

  //调接口保存
  const handleSubmit = () => {
    if (!isSpinning) {
      form.validateFieldsAndScroll(err => {
        if (!err) {
          setIsSpinning(true);
          let submitTable = [];
          tableArr.forEach(x => {
            if (editData.includes(x.PCID)) {
              submitTable.push({
                ZHPCID: x.PCID,
                LYZT: x['LYZT' + x.PCID],
                LYSM: x['LYSM' + x.PCID] || '',
              });
            }
          });
          console.log('🚀 ~ file: index.js:97 ~ submitTable ~ submitTable:', submitTable);
          let submitProps = {
            xqid: Number(xqid),
            swzxid: Number(swzxid),
            pcxx: JSON.stringify(submitTable),
            czlx: 'UPDATE',
            count: submitTable.length,
          };
          OperateEvaluation(submitProps)
            .then(res => {
              if (res?.success) {
                // form.resetFields();
                reflush();
                setIsSpinning(false);
                message.success('操作成功', 1);
                // setVisible(false);
                setEditing(false);
                setEditData([]);
              }
            })
            .catch(e => {
              message.error('信息提交失败');
              setIsSpinning(false);
            });
        }
      });
    }
  };

  const tableColumns = [
    {
      title: '人员需求',
      dataIndex: 'RYDJ',
      width: '10%',
      // align: 'center',
      key: 'RYDJ',
      ellipsis: true,
      render: (txt, row) => {
        return (
          <Tooltip title={txt + ` | ` + row.GW} placement="topLeft">
            <span style={{ cursor: 'default' }}>{txt + ` | ` + row.GW}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '供应商名称',
      dataIndex: 'GYSMC',
      width: isDock ? '18%' : '0',
      key: 'GYSMC',
      ellipsis: true,
      render: txt => {
        return (
          <Tooltip title={txt} placement="topLeft">
            <span style={{ cursor: 'default' }}>{txt}</span>
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
            <span style={{ cursor: 'default' }}>{nameArr.join('、')}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '综合评测时间',
      dataIndex: 'ZHPCSJ',
      width: '15%',
      key: 'ZHPCSJ',
      ellipsis: true,
      render: txt => {
        let date = (txt && moment(txt).format('YYYY-MM-DD HH:mm')) || '--';
        return (
          <Tooltip title={date} placement="topLeft">
            <span style={{ cursor: 'default' }}> {date}</span>
          </Tooltip>
        );
      },
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
      width: '14%',
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
      render: (txt, row) => {
        if (editing)
          return (
            <Input
              onClick={() => {
                setLysm(p => {
                  return {
                    index: row.PCID,
                    visible: true,
                    // content: row['LYSM'] || '',
                  };
                });
                setEditContent(row['LYSM' + row.PCID] || '');
              }}
              value={row['LYSM' + row.PCID]}
            />
          );
        return (
          <Tooltip placement="bottomLeft" title={row['LYSM' + row.PCID]}>
            <span style={{ cursor: 'default' }}>{row['LYSM' + row.PCID]}</span>
          </Tooltip>
        );
      },
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
          editing,
          lyzt: LYZT,
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
  };

  //取消修改
  const handleEditCancel = () => {
    if (!isSpinning) {
      setEditing(false);
      let arr = tableData.map(x => {
        return {
          ...x,
          ['LYZT' + x.PCID]: x.LYZT || '',
          ['LYSM ' + x.PCID]: x.LYSM || '',
        };
      });
      setTableArr([...JSON.parse(JSON.stringify(arr))]);
      setEditData([]);
    }
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
        newSelectedRowIds.push(item.PCID);
      });
      setSelectedRowIds(newSelectedRowIds);
    },
  };

  //获取Livebos弹窗链接
  const getLink = (objName, oprName, data) => {
    //Livebos弹窗参数
    let params = {
      attribute: 0,
      authFlag: 0,
      objectName: objName,
      operateName: oprName,
      parameter: data,
      userId: String(JSON.parse(sessionStorage.getItem('user')).loginName),
    };
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, url } = ret;
        if (code === 1) {
          setLbModal(p => {
            return {
              ...p,
              url,
            };
          });
        }
      })
      .catch(error => {
        message.error('livebos链接创建失败', 1);
        console.error(!error.success ? error.message : error.note);
      });
  };

  const employmentApplicationProps = {
    isAllWindow: 1,
    width: '760px',
    height: '325px',
    title: '提交录用申请',
    style: { top: '60px' },
    visible: modalVisible.employmentApplication,
    footer: null,
  };

  //邮件发送后调的接口 - 完成外包事务
  const handleOutsourceWockFinish = (swzxid, xqid) => {
    FinishOutsourceWork({
      swzxid: Number(swzxid),
      xqid: Number(xqid),
    })
      .then(res => {
        if (res?.success) {
          reflush();
        }
      })
      .catch(e => {
        message.error('外包事务完成失败', 1);
      });
  };

  return (
    <Modal
      wrapClassName="editMessage-modify evaluation-more-operation-modal"
      width={'1200px'}
      maskClosable={false}
      zIndex={100}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
      style={{ top: '10px' }}
      title={null}
      visible={visible}
      // onOk={handleOk}
      footer={null}
      onCancel={handleCancel}
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>综合评测信息列表</strong>
      </div>
      <div className="content-box">
        {/* 发送邮件 */}
        {modalVisible.msgConfirmation && (
          <SendMailModal
            closeModal={() =>
              setModalVisible(p => {
                return {
                  ...p,
                  msgConfirmation: false,
                };
              })
            }
            successCallBack={() => {
              setModalVisible(p => {
                return {
                  ...p,
                  msgConfirmation: false,
                };
              });
              handleOutsourceWockFinish(swzxid_email, xqid);
            }}
            visible={modalVisible.msgConfirmation}
            gysmcArr={[...gysmcArr]}
            xqid={xqid}
          />
        )}
        {/* 提交录用申请 */}
        {modalVisible.employmentApplication && (
          <BridgeModel
            modalProps={employmentApplicationProps}
            onSucess={() => {
              setModalVisible(p => {
                return {
                  ...p,
                  employmentApplication: false,
                };
              });
              reflush();
            }}
            onCancel={() =>
              setModalVisible(p => {
                return {
                  ...p,
                  employmentApplication: false,
                };
              })
            }
            src={lbModal.url}
          />
        )}
        {lysm.visible && (
          <Modal
            wrapClassName="editMessage-modify lysm-edit-modal"
            width={'700px'}
            maskClosable={false}
            zIndex={101}
            maskStyle={{ backgroundColor: 'rgb(0 0 0 / 30%)' }}
            style={{ top: '60px' }}
            title={null}
            visible={lysm.visible}
            onOk={() => {
              setLysm(p => {
                return {
                  ...p,
                  visible: false,
                };
              });
              let arr = [...tableArr];
              arr.forEach(x => {
                if (x.PCID === lysm.index) {
                  x['LYSM' + x.PCID] = editContent || '';
                }
              });
              setTableArr(p => [...arr]);
              let newEdit = [...editData];
              let index2 = newEdit.findIndex(item => String(lysm.index) === String(item));
              if (index2 === -1) {
                newEdit.push(lysm.index);
              } else {
                newEdit.splice(index2, 1, lysm.index);
              }
              setEditData(p => [...newEdit]);
              setEditContent('');
            }}
            onCancel={() => {
              setLysm(p => {
                return {
                  ...p,
                  visible: false,
                };
              });
              setEditContent('');
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
                // defaultValue={tableArr[lysm.index]?.LYSM||'JJJ'}
                defaultValue={editContent}
                allowClear
                autoFocus
                onChange={e => {
                  e.persist();
                  setEditContent(e.target.value);
                }}
              ></TextArea>
            </div>
          </Modal>
        )}
        <div className="top-btn">
          {status.mstz || status.qrlysq ? (
            <>
              {/* <Popconfirm title="确定要通知吗？" onConfirm={handleSubmit}> */}
              <Button
                type="primary"
                style={{ marginRight: '16px' }}
                onClick={() => {
                  setModalVisible(p => ({
                    msgConfirmation: true,
                  }));
                  let arr = tableArr
                    .filter(x => selectedRowIds.includes(x.PCID))
                    ?.map(y => y.GYSMC);
                  // console.log('🚀 ~ file: index.js:491 ~ MoreOperationModal ~ arr:', arr);
                  setGysmcArr(arr);
                  if (status.mstz) {
                    setStatus(p => ({
                      ...p,
                      mstz: false,
                    }));
                  } else {
                    setStatus(p => ({
                      ...p,
                      qrlysq: false,
                    }));
                  }
                }}
              >
                确认
              </Button>
              {/* </Popconfirm> */}
              <Button
                type="primary"
                onClick={() => {
                  if (status.mstz) {
                    setStatus(p => ({
                      ...p,
                      mstz: false,
                    }));
                  } else {
                    setStatus(p => ({
                      ...p,
                      qrlysq: false,
                    }));
                  }
                }}
              >
                取消
              </Button>
            </>
          ) : (
            <>
              {editing ? (
                <>
                  <Popconfirm title="确定要保存吗？" onConfirm={handleSubmit}>
                    <Button type="primary" style={{ marginRight: '16px' }}>
                      保存
                    </Button>
                  </Popconfirm>
                  <Button onClick={handleEditCancel}>取消</Button>
                </>
              ) : (
                <>
                  {/* {isDock && (
                    <>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (!isSpinning) {
                            setStatus(p => ({
                              ...p,
                              mstz: true,
                            }));
                          }
                        }}
                      >
                        面试通知
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (!isSpinning) {
                            setStatus(p => ({
                              ...p,
                              qrlysq: true,
                            }));
                          }
                        }}
                      >
                        确认录用申请
                      </Button>
                    </>
                  )} */}
                  {String(fqrid) === String(JSON.parse(sessionStorage.getItem('user'))?.id) && (
                    <Button
                      type="primary"
                      onClick={() => {
                        if (!isSpinning) {
                          getLink('V_LYXX', 'V_LYXX_M', [
                            {
                              name: 'GLXQ',
                              value: xqid,
                            },
                            {
                              name: 'SWZXID',
                              value: swzxid,
                            },
                          ]);
                          setLbModal(p => {
                            return {
                              ...p,
                              title: '提交录用申请',
                            };
                          });
                          setModalVisible(p => {
                            return {
                              ...p,
                              employmentApplication: true,
                            };
                          });
                        }
                      }}
                    >
                      提交录用申请
                    </Button>
                  )}
                  <Button onClick={handleEdit} type="primary">
                    修改
                  </Button>
                </>
              )}
            </>
          )}
        </div>
        <Table
          rowSelection={status.mstz || status.qrlysq ? rowSelection : false}
          loading={isSpinning}
          columns={columns}
          components={components}
          rowKey={'PCID'}
          rowClassName={() => 'editable-row'}
          dataSource={tableArr}
          pagination={{
            pageSize: 10,
            defaultCurrent: 1,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: t => `共 ${tableArr.length} 条数据`,
            total: tableArr.length,
          }}
          // bordered
        />
      </div>
    </Modal>
  );
}
export default Form.create()(MoreOperationModal);
