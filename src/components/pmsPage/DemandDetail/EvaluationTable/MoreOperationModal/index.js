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
import { CreateOperateHyperLink, OperateEvaluation } from '../../../../../services/pmsServices';
import BridgeModel from '../../../../Common/BasicModal/BridgeModel';

const { TextArea } = Input;

function MoreOperationModal(props) {
  const { visible, setVisible, form, data = {} } = props;
  const { tableData = [], DFZT = [], LYZT = [], xqid, swzxid, reflush } = data;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [edited, setEdited] = useState(false); //已编辑
  const [editing, setEditing] = useState(false); //编辑状态
  const [editingIndex, setEditingIndex] = useState(-1); //编辑行id
  const [editData, setEditData] = useState([]); //编辑数据
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
  }); //弹窗显隐
  const [lbModal, setLbModal] = useState({
    url: '#',
    title: '',
  }); //

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
    setTableArr(preState => [...newData]);
  };

  //调接口保存
  const handleSubmit = () => {
    form.validateFieldsAndScroll(err => {
      if (!err) {
        let submitTable = tableArr.map(x => {
          return {
            ZHPCID: x.PCID,
            LYZT: x['LYZT' + x.PCID],
            LYSM: x['LYSM' + x.PCID] || '',
          };
        });
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
              setVisible(false);
              message.success('操作成功', 1);
              // form.resetFields();
              reflush();
            }
          })
          .catch(e => {
            message.error('信息提交失败');
          });
      }
    });
  };

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
      width: '12%',
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
    setEditing(false);
    let arr = tableData.map(x => {
      return {
        ...x,
        ['LYZT' + x.PCID]: x.LYZT || '',
        ['LYSM ' + x.PCID]: x.LYSM || '',
      };
    });
    setTableArr([...JSON.parse(JSON.stringify(arr))]);
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
      // onOk={handleOk}
      footer={null}
      onCancel={handleCancel}
      confirmLoading={isSpinning}
    >
      <div className="body-title-box">
        <strong>综合评测信息列表</strong>
      </div>
      <div className="content-box">
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
              let arr = [...tableArr];
              arr.forEach(x => {
                if (x.PCID === lysm.index) {
                  x['LYSM' + x.PCID] = editContent || '';
                }
              });
              setTableArr(p => [...arr]);
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
              // let arr = [...tableArr];
              // arr.forEach(x => {
              //   if (x.PCID === lysm.index) {
              //     x['LYSM' + x.PCID] = x.LYSM || '';
              //   }
              // });
              // setTableArr(p => [...arr]);
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
                onChange={e => {
                  e.persist();
                  setEditContent(e.target.value);
                  // let arr = [...tableArr];
                  // arr.forEach(x => {
                  //   if (x.PCID === lysm.index) {
                  //     x['LYSM' + x.PCID] = e.target.value || '';
                  //   }
                  // });
                  // setTableArr(p => [...arr]);
                }}
              ></TextArea>
            </div>
          </Modal>
        )}
        <div className="top-btn">
          <Button type="primary" onClick={() => {}}>
            面试通知
          </Button>
          <Button
            type="primary"
            onClick={() => {
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
            }}
          >
            提交录用申请
          </Button>
          <Button type="primary" onClick={() => {}}>
            确认录用申请
          </Button>
          {editing ? (
            <>
              <Popconfirm title="确定要保存吗？" onConfirm={handleSubmit}>
                <Button type="primary" style={{ marginRight: '16px' }}>
                  保存
                </Button>
              </Popconfirm>
              <Button type="primary" onClick={handleEditCancel}>
                取消
              </Button>
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
          rowSelection={rowSelection}
          loading={isSpinning}
          columns={columns}
          components={components}
          rowKey={'PCID'}
          rowClassName={() => 'editable-row'}
          dataSource={tableArr}
          scroll={{
            y: (editing && tableArr.length > 4) || (!editing && tableArr.length > 6) ? 272 : false,
          }}
          pagination={false}
          // bordered
        />
      </div>
    </Modal>
  );
}
export default Form.create()(MoreOperationModal);
