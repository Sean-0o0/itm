import {
  Row,
  Col,
  Popconfirm,
  Modal,
  Form,
  Input,
  Table,
  DatePicker,
  message,
  Select,
  Spin,
  Icon,
  Tooltip,
  Button,
} from 'antd';
// import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
const { Option } = Select;
import React from 'react';
import {
  FetchQueryGysInZbxx,
  FetchQueryHTXXByXQTC,
  UpdateHTXX,
  QueryContractFlowInfo,
} from '../../../../services/pmsServices';
import moment from 'moment';
import TableFullScreen from './TableFullScreen';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
};
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  // toggleEdit = () => {
  //     const editing = !this.state.editing;
  //     this.setState({ editing }, () => {
  //         if (editing) {
  //             this.input.focus();
  //         }
  //     });
  // };

  save = e => {
    const { record, handleSave, formdecorate } = this.props;
    formdecorate.validateFields(
      ['fkqs' + record['id'], 'bfb' + record['id'], 'fksj' + record['id'], 'fkje' + record['id']],
      (error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        // this.toggleEdit();
        // console.log("🚀 ~ file: index.js ~ line 52 ~ EditableCell ~ formdecorate.validateFields ~  values", values,record)
        handleSave({ ...record, ...values });
      },
    );
  };

  getTitle = dataIndex => {
    switch (dataIndex) {
      case 'fkqs':
        return '期数';
      case 'bfb':
        return '占比';
      case 'fkje':
        return '付款金额';
      case 'fksj':
        return '付款时间';
      case 'zt':
        return '状态';
      default:
        break;
    }
  };
  handleBfbChange = (form, id) => {
    let obj = {};
    obj['fkje' + id] = String(
      Number(form.getFieldValue('bfb' + id)) * Number(form.getFieldValue('htje')),
    );
    // console.log("🚀 ~ file: index.js ~ line 76 ~ EditableCell ~ Number(form.getFieldValue('bfb' + id)) * Number(this.state.htje)", Number(form.getFieldValue('bfb' + id)), Number(form.getFieldValue('htje')))
    form.setFieldsValue({ ...obj });
    this.save();
  };
  renderItem = (form, dataIndex, record) => {
    switch (dataIndex) {
      case 'fksj':
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              required: true,
              message: `${this.getTitle(dataIndex)}不允许空值`,
            },
          ],
          initialValue: moment(record[dataIndex + record['id']]) || null,
        })(
          <DatePicker
            ref={node => (this.input = node)}
            onChange={(data, dataString) => {
              const { record, handleSave } = this.props;
              form.validateFields(
                [
                  'fkqs' + record['id'],
                  'bfb' + record['id'],
                  'fksj' + record['id'],
                  'fkje' + record['id'],
                ],
                (error, values) => {
                  // console.log('values', values);
                  // if (error && error[e.currentTarget.id]) {
                  //   return;
                  // }
                  let newValues = {};
                  newValues = { ...values };
                  for (let i in newValues) {
                    if (i === 'fksj' + record['id']) {
                      newValues[i] = dataString;
                    }
                  }
                  // this.toggleEdit();
                  handleSave({ ...record, ...newValues });
                },
              );
            }}
          />,
        );
      case 'bfb':
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              pattern: /^[1-9]\d{0,8}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
              message: '最多不超过10位数字且小数点后数字不超过2位',
            },
          ],
          initialValue: String(record[dataIndex + record['id']]),
        })(
          <Input
            style={{ textAlign: 'center' }}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.handleBfbChange.bind(this, form, record['id'])}
          />,
        );
      case 'fkje':
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              required: true,
              message: `${this.getTitle(dataIndex)}不允许空值`,
            },
            {
              pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
              message: '最多不超过13位数字且小数点后数字不超过2位',
            },
          ],
          initialValue: String(record[dataIndex + record['id']]),
        })(
          <Input
            style={{ textAlign: 'center' }}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />,
        );
      default:
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              required: true,
              message: `${this.getTitle(dataIndex)}不允许空值`,
            },
            {
              max: 10,
              message: '数值不能超过10位',
            },
            {
              pattern: /^[0-9]*$/,
              message: '数值只能为整数',
            },
          ],
          initialValue: String(record[dataIndex + record['id']]),
        })(
          <Input
            style={{ textAlign: 'center' }}
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />,
        );
    }
  };
  renderCell = form => {
    // this.form = form;
    const { dataIndex, record, children, formdecorate } = this.props;
    const { editing } = this.state;
    return true ? (
      <Form.Item style={{ margin: 0 }}>
        {this.renderItem(formdecorate, dataIndex, record)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        // onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };
  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

const curLCHTJE = React.createRef(-1); //当前流程合同金额 - 合同金额不能超过流程金额
class ContractInfoUpdate extends React.Component {
  state = {
    isModalFullScreen: false,
    isTableFullScreen: false,
    contractInfo: {
      //合同信息
      htje: '',
      qsrq: null,
    },
    tableData: [], //付款详情表格
    selectedRowIds: [],
    isSelectorOpen: false,
    gysData: [],
    gys: '',
    currentGysId: '',
    addGysModalVisible: false,
    isSpinning: true,
    lxje: 0, //立项金额
    glhtlcData: [],
    flowId: -1,
    // curLCHTJE: -1, //当前流程合同金额 - 合同金额不能超过流程金额
  };

  componentDidMount() {
    this.fetchQueryGysInZbxx();
  }

  // 获取项目信息
  fetchQueryHTXXByXQTC = () => {
    const { currentXmid } = this.props;
    FetchQueryHTXXByXQTC({
      xmmc: currentXmid,
    })
      .then(res => {
        let rec = res.record;
        // this.setState(
        //   {
        //     contractInfo: { htje: Number(rec[0]?.htje), qsrq: rec[0]?.qsrq },
        //     gys: rec[0]?.gys,
        //   },
        //   () => {
        //     this.setState({
        //       currentGysId: rec[0]?.gys,
        //     });
        //   },
        // );
        // console.log('🚀 ~ file: index.js ~ line 233 ~ ContractInfoUpdate ~ rec[0]?.gys', rec[0]?.gys);
        // let arr = [];
        // for (let i = 0; i < rec.length; i++) {
        //   arr.push({
        //     id: rec[i]?.fkxqid,
        //     ['fkqs' + rec[i]?.fkxqid]: Number(rec[i]?.fkqs),
        //     ['bfb' + rec[i]?.fkxqid]: Number(rec[i]?.bfb),
        //     ['fkje' + rec[i]?.fkxqid]: Number(rec[i]?.fkje),
        //     ['fksj' + rec[i]?.fkxqid]: moment(rec[i]?.fksj).format('YYYY-MM-DD'),
        //     zt: rec[i]?.zt,
        //   });
        // }
        const arr = rec.reduce((acc, cur) => {
          if (cur.htxxid === this.props.htxxid)
            return [
              ...acc,
              {
                ...cur,
                id: cur.fkxqid,
                ['fkqs' + cur.fkxqid]: Number(cur.fkqs),
                ['bfb' + cur.fkxqid]: Number(cur.bfb),
                ['fkje' + cur.fkxqid]: Number(cur.fkje),
                ['fksj' + cur.fkxqid]: moment(cur.fksj).format('YYYY-MM-DD'),
                zt: cur.zt,
              },
            ];
          return acc;
        }, []);
        this.setState(
          {
            tableData: [...this.state.tableData, ...arr],
            lxje: Number(res.lxje),
            contractInfo: { htje: Number(arr[0]?.htje), qsrq: arr[0]?.qsrq },
            gys: arr[0]?.gys,
            flowId: arr[0] === undefined || arr[0].htlc === '' ? -1 : Number(arr[0].htlc),
          },
          () => {
            this.setState({
              currentGysId: arr[0]?.gys,
            });
            this.getGlhtlcData();
          },
        );
      })
      .catch(e => {
        message.error('合同信息查询失败', 1);
        this.setState({
          isSpinning: false,
        });
      });
  };

  // 查询供应商下拉列表
  fetchQueryGysInZbxx = (current, pageSize) => {
    FetchQueryGysInZbxx({
      // paging: 1,
      paging: -1,
      sort: '',
      current,
      pageSize,
      total: -1,
    })
      .then(res => {
        if (res.success) {
          let rec = res.record;
          this.setState(
            {
              gysData: [...rec],
            },
            () => {
              this.fetchQueryHTXXByXQTC();
            },
          );
        }
      })
      .catch(e => {
        message.error('供应商信息查询失败', 1);
      });
  };

  //获取合同签署流程
  getGlhtlcData = () => {
    QueryContractFlowInfo({
      projectId: this.props.currentXmid,
      queryType: 'HT',
      flowId: this.state.flowId,
    })
      .then(res => {
        if (res?.success) {
          const rec = JSON.parse(res.result);
          // console.log('🚀 ~ QueryContractFlowInfo ~ res', rec);
          //to do ...
          this.setState({
            glhtlcData: rec,
            isSpinning: false,
            // curLCHTJE: Number(rec.find(x => Number(x.ID) === this.state.flowId)?.LCHTJE || -1),
          });
          curLCHTJE.current = Number(
            rec.find(x => Number(x.ID) === this.state.flowId)?.LCHTJE || -1,
          );
        }
      })
      .catch(e => {
        console.error('🚀合同签署流程', e);
        message.error('合同签署流程数据获取失败', 1);
        this.setState({
          isSpinning: false,
        });
      });
  };

  //合同信息修改付款详情表格单行删除
  handleSingleDelete = id => {
    const dataSource = [...this.state.tableData];
    // console.log(dataSource);
    this.setState({ tableData: dataSource.filter(item => item.id !== id) });
  };
  //合同信息修改付款详情表格多行删除
  handleMultiDelete = ids => {
    const dataSource = [...this.state.tableData];
    for (let j = 0; j < dataSource.length; j++) {
      for (let i = 0; i < ids.length; i++) {
        if (dataSource[j].id === ids[i]) {
          dataSource.splice(j, 1);
        }
      }
    }
    this.setState({ tableData: dataSource });
  };
  handleTableSave = row => {
    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item, //old row
      ...row, //rew row
    });
    this.setState({ tableData: newData }, () => {
      // console.log('tableData', this.state.tableData);
    });
  };
  setTableFullScreen = visible => {
    this.setState({
      isTableFullScreen: visible,
    });
  };
  setTableData = data => {
    this.setState(
      {
        tableData: data,
      },
      () => {
        let table1 = document.querySelectorAll(`.tableBox1 .ant-table-body`)[0];
        table1.scrollTop = table1.scrollHeight;
      },
    );
  };
  setSelectedRowIds = data => {
    this.setState({
      selectedRowIds: data,
    });
  };
  handleGysChange = id => {
    this.setState({
      currentGysId: id,
    });
  };
  OnGysSuccess = () => {
    this.setState({ addGysModalVisible: false });
    this.fetchQueryGysInZbxx();
  };

  handleOk = () => {
    const { tableData = [], currentGysId } = this.state;
    const { currentXmid, closeMessageEditModal, onSuccess } = this.props;
    const { getFieldValue, validateFields } = this.props.form;
    validateFields(err => {
      if (!err) {
        let fkjeSum = 0,
          bfbSum = 0;
        tableData?.forEach(item => {
          fkjeSum += Number(item['fkje' + item.id]);
          bfbSum += Number(item['bfb' + item.id]);
        });
        if (bfbSum > 1) {
          message.error('占比总额不能超过1', 1);
        } else if (fkjeSum > getFieldValue('htje')) {
          message.error('付款总额不能超过合同金额', 1);
        } else {
          this.setState({
            isSpinning: true,
          });
          let arr = [...tableData];
          arr.forEach(item => {
            for (let i in item) {
              if (i === 'fksj' + item.id) {
                item[i] = moment(item[i]).format('YYYYMMDD');
              } else {
                item[i] = String(item[i]);
              }
            }
          });
          let newArr = [];
          arr.map(item => {
            let obj = {
              ID: item.id,
              FKQS: item['fkqs' + item.id],
              BFB: item['bfb' + item.id],
              FKJE: item['fkje' + item.id],
              FKSJ: item['fksj' + item.id],
              ZT: item.zt,
              GYS: String(currentGysId),
            };
            newArr.push(obj);
          });
          newArr.push({});
          const params = {
            xmmc: Number(currentXmid),
            json: JSON.stringify(newArr),
            rowcount: tableData.length,
            htje: Number(getFieldValue('htje')),
            qsrq: Number(getFieldValue('qsrq').format('YYYYMMDD')),
            gysid: Number(currentGysId),
            czlx: 'UPDATE',
            lcid: Number(getFieldValue('glhtlc')),
            htid: Number(this.props.htxxid),
          };
          console.log('🚀 ~ file: index.js:474 ~ ContractInfoUpdate ~ params:', params);
          UpdateHTXX(params)
            .then(res => {
              if (res?.code === 1) {
                onSuccess();
                this.setState({ isSpinning: false, tableData: [] });
                message.success('修改成功', 1);
                closeMessageEditModal();
              }
            })
            .catch(e => {
              message.error('合同信息修改失败', 1);
              this.setState({
                isSpinning: false,
              });
            });
        }
      }
    });
  };

  handleCancel = () => {
    this.setState({ tableData: [] });
    this.props.closeMessageEditModal();
  };

  handleDelete = () => {
    const { currentXmid, closeMessageEditModal, htxxid, onSuccess } = this.props;
    this.setState({ isSpinning: true });
    const params = {
      xmmc: Number(currentXmid),
      json: '[]',
      rowcount: 0,
      htje: 1,
      qsrq: 20000101,
      gysid: 1,
      czlx: 'DELETE',
      lcid: 1,
      htid: Number(htxxid),
    };
    UpdateHTXX(params)
      .then(res => {
        if (res?.code === 1) {
          onSuccess();
          message.success('删除成功', 1);
          this.setState({ isSpinning: false, tableData: [] });
          closeMessageEditModal();
        }
      })
      .catch(e => {
        message.error('合同信息修改失败', 1);
        this.setState({
          isSpinning: false,
        });
      });
  };

  render() {
    const {
      isTableFullScreen,
      isModalFullScreen,
      tableData = [],
      contractInfo,
      gysData = [],
      gys,
      currentGysId,
      isSelectorOpen,
      addGysModalVisible,
      isSpinning,
      selectedRowIds,
      glhtlcData = [],
    } = this.state;
    const {
      currentXmid,
      currentXmmc,
      editMessageVisible,
      closeMessageEditModal,
      onSuccess,
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let newSelectedRowIds = [];
        selectedRows?.forEach(item => {
          newSelectedRowIds.push(item.id);
        });
        this.setState({ selectedRowIds: newSelectedRowIds });
      },
    };
    const tableColumns = [
      {
        title: () => (
          <>
            <span style={{ color: 'red' }}>*</span>期数
          </>
        ),
        dataIndex: 'fkqs',
        width: '13%',
        key: 'fkqs',
        ellipsis: true,
        editable: true,
      },
      {
        title: '占比',
        dataIndex: 'bfb',
        key: 'bfb',
        ellipsis: true,
        editable: true,
      },
      {
        title: (
          <>
            <span style={{ color: 'red' }}>*</span>付款金额（元）
          </>
        ),
        dataIndex: 'fkje',
        width: '22%',
        key: 'fkje',
        ellipsis: true,
        editable: true,
      },
      {
        title: (
          <>
            <span style={{ color: 'red' }}>*</span>付款时间
          </>
        ),
        dataIndex: 'fksj',
        width: '23%',
        key: 'fksj',
        ellipsis: true,
        editable: true,
      },
      // {
      //   title: '状态',
      //   dataIndex: 'zt',
      //   width: '10%',
      //   key: 'zt',
      //   ellipsis: true,
      //   // editable: true,
      //   render: text => {
      //     if (text === '1') {
      //       return this.state.tableData.length >= 1 ? <span>已付款</span> : null;
      //     }
      //     return this.state.tableData.length >= 1 ? <span>未付款</span> : null;
      //   },
      // },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        // width: 200,
        // fixed: 'right',
        ellipsis: true,
        render: (text, record) =>
          this.state.tableData.length >= 1 ? (
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => {
                return this.handleSingleDelete(record.id);
              }}
            >
              <a style={{ color: '#3361ff' }}>删除</a>
            </Popconfirm>
          ) : null,
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
            handleSave: this.handleTableSave,
            key: col.key,
            formdecorate: this.props.form,
          };
        },
      };
    });
    //覆盖默认table元素
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const addGysModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新增供应商',
      width: '720px',
      height: '460px',
      style: { top: '120px' },
      visible: addGysModalVisible,
      footer: null,
    };

    return (
      <>
        {addGysModalVisible && (
          <BridgeModel
            modalProps={addGysModalProps}
            onCancel={() => this.setState({ addGysModalVisible: false })}
            onSucess={this.OnGysSuccess}
            src={
              localStorage.getItem('livebos') +
              '/OperateProcessor?operate=View_GYSXX_ADD&Table=View_GYSXX'
            }
          />
        )}
        <Modal
          wrapClassName="editMessage-modify"
          width="860px"
          maskClosable={false}
          style={{
            top: '60px',
          }}
          zIndex={100}
          cancelText={'关闭'}
          bodyStyle={{
            padding: '0',
          }}
          title={null}
          visible={editMessageVisible}
          onCancel={this.handleCancel}
          footer={
            <div className="modal-footer">
              <Button className="btn-default" onClick={this.handleCancel}>
                取消
              </Button>
              <Button
                loading={isSpinning}
                className="btn-primary"
                type="primary"
                onClick={this.handleOk}
              >
                保存
              </Button>
              <Popconfirm title="确定删除吗？" onConfirm={this.handleDelete}>
                <Button loading={isSpinning} className="btn-primary" type="primary">
                  删除
                </Button>
              </Popconfirm>
            </div>
          }
        >
          <div
            style={{
              height: '42px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3361FF',
              color: 'white',
              marginBottom: '16px',
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '15px',
            }}
          >
            <strong>合同信息修改</strong>
          </div>
          <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="diy-style-spin">
            <Form name="nest-messages" style={{ padding: '0 24px' }}>
              <Row>
                <Col span={12}>
                  <Form.Item label="项目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
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
                      {currentXmmc}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="合同金额（元）"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 17 }}
                  >
                    {getFieldDecorator('htje', {
                      initialValue: String(contractInfo?.htje) || '',
                      rules: [
                        {
                          required: true,
                          message: '合同金额不允许空值',
                        },
                        {
                          pattern: /^[1-9]\d{0,11}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,
                          message: '最多不超过13位数字且小数点后数字不超过2位',
                        },
                        {
                          validator: (rule, value, callback) => {
                            console.log(
                              '🚀 ~ file: index.js:685 ~ ContractInfoUpdate ~ render ~ rule, value, callback:',
                              rule,
                              value,
                              callback,
                            );
                            if (Number(value) > this.state.lxje) {
                              callback('合同金额不能超过本项目立项金额：' + this.state.lxje);
                            } else if (
                              curLCHTJE.current !== -1 &&
                              Number(value) > curLCHTJE.current
                            ) {
                              callback('合同金额不能超过关联合同流程金额：' + curLCHTJE.current);
                            } else {
                              callback();
                            }
                          },
                        },
                      ],
                    })(
                      <Input
                        placeholder="请输入合同金额（元）"
                        onChange={e => {
                          // if (Number(e.target.value) > this.state.lxje) {
                          console.log(
                            '🚀 ~ file: index.js:692 ~ ContractInfoUpdate ~ render ~ e.target.value:',
                            e.target.value,
                          );

                          // }
                        }}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="签署日期" labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
                    {getFieldDecorator('qsrq', {
                      initialValue: contractInfo?.qsrq === null ? null : moment(contractInfo?.qsrq),
                      rules: [
                        {
                          required: true,
                          message: '签署日期不允许空值',
                        },
                      ],
                    })(<DatePicker style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="供应商" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                    {getFieldDecorator('gys', {
                      initialValue: gys,
                      rules: [
                        {
                          required: true,
                          message: '供应商不允许空值',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%', borderRadius: '8px !important' }}
                        placeholder="请选择供应商"
                        showSearch
                        allowClear
                        onChange={this.handleGysChange}
                        open={isSelectorOpen}
                        className="contrast-update-gys-selector"
                        onDropdownVisibleChange={visible =>
                          this.setState({ isSelectorOpen: visible })
                        }
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {gysData?.map((item = {}, ind) => {
                          return (
                            <Option key={ind} value={item.id}>
                              {item.gysmc}
                            </Option>
                          );
                        })}
                      </Select>,
                    )}
                  </Form.Item>
                  <div
                    style={{
                      height: '20px',
                      width: '1px',
                      backgroundColor: '#c7c7c7',
                      marginLeft: '8px',
                      marginTop: '10px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '38px',
                    }}
                  ></div>
                  <i
                    className="iconfont circle-add"
                    onClick={() => this.setState({ addGysModalVisible: true })}
                    style={{
                      marginTop: '6px',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '0',
                      right: '8px',
                      color: '#c7c7c7',
                      fontSize: '20px',
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="关联合同流程" labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
                    {getFieldDecorator('glhtlc', {
                      initialValue: glhtlcData[0]?.XTLCID,
                    })(
                      <Select
                        style={{ width: '100%', borderRadius: '8px !important' }}
                        placeholder="请选择关联合同流程"
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children?.props?.children
                            ?.toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(v, o) => {
                          // this.setState({
                          //   curLCHTJE: Number(o?.props.je || -1),
                          // });
                          curLCHTJE.current = Number(o?.props.je || -1);
                          setTimeout(() => {
                            validateFields(['htje'], () => {});
                          }, 200);
                        }}
                      >
                        {glhtlcData?.map(x => (
                          <Option key={x.XTLCID} value={x.XTLCID} je={x.LCHTJE}>
                            <Tooltip title={x.LCMC} placement="topLeft">
                              {x.LCMC}
                            </Tooltip>
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>付款详情
                      </span>
                    }
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                  >
                    <div className="tableBox2">
                      <Table
                        columns={columns}
                        components={components}
                        rowKey={record => record.id}
                        rowClassName={() => 'editable-row'}
                        dataSource={tableData}
                        // rowSelection={rowSelection}
                        scroll={tableData.length > 3 ? { y: 195 } : {}}
                        pagination={false}
                        bordered
                        size="middle"
                      />
                      <div
                        className="table-add-row"
                        onClick={() => {
                          let arrData = tableData;
                          arrData.push({
                            id: Date.now(),
                            ['fkqs' + Date.now()]: '',
                            ['bfb' + Date.now()]: 0.5,
                            ['fkje' + Date.now()]: 0.5,
                            ['fksj' + Date.now()]: moment().format('YYYY-MM-DD'),
                            zt: '2',
                          });
                          this.setState({ tableData: arrData }, () => {
                            let table2 = document.querySelectorAll(`.tableBox2 .ant-table-body`)[0];
                            table2.scrollTop = table2.scrollHeight;
                          });
                        }}
                      >
                        <span>
                          <Icon type="plus" style={{ fontSize: '12px' }} />
                          <span style={{ paddingLeft: '6px', fontSize: '14px' }}>新增付款详情</span>
                        </span>
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </>
    );
  }
}
export default Form.create()(ContractInfoUpdate);
