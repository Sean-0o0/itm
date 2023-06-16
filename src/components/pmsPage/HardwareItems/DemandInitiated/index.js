/**
 * 需求发起弹窗页面
 */
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
  Radio,
  TreeSelect,
  InputNumber,
  Upload,
  Button,
  Icon, Tooltip, Popover,
} from 'antd';

const {Option} = Select;
const {TextArea} = Input;
import React from 'react';
import {connect} from 'dva';
import {
  FetchQueryGysInZbxx, FetchqueryOutsourceRequirement,
  IndividuationGetOAResult,
  OperateOutsourceRequirements, QueryOutsourceRankInfo, QueryWeekday
} from '../../../../services/pmsServices';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';
import moment from 'moment';
import {FetchQueryOrganizationInfo} from '../../../../services/projectManage';
import PersonnelNeeds from "./PersonnelNeeds";

class DemandInitiated extends React.Component {
  state = {
    isSpinning: false,
    xqid: -1,
    tableData: [],
    tableDataInit: [],
    kfsrqinit: '',
    pcrqinit: '',
    syrqinit: '',
    rydjData: [],
    current: 1,
    total: 0,
  };

  componentDidMount() {
    this.fetchqueryWeekday();
    this.getRydjData();
    console.log("xqidxqid", this.props.xqid)
    if (this.props.xqid && this.props.xqid !== 'undefined') {
      this.setState({
        xqid: this.props.xqid,
      })
      console.log("xqidxqid", this.props.xqid)
      this.fetchqueryOutsourceRequirement(this.props.xqid, this.props.operateType, this.props.xmmc);
    }
  }

  getRydjData = () => {
    const {current} = this.state;
    console.log("1111", current)
    QueryOutsourceRankInfo({
      "current": current,
      "cxlx": "ALL",
      "pageSize": 8,
      "paging": 1,
      "sort": "",
      "total": -1
    }).then(res => {
      if (res?.code === 1) {
        const {result, totalrows} = res;
        this.setState({
          rydjData: [...JSON.parse(result)],
          total: totalrows,
        })
      }
    }).catch(e => {
      message.error('人员等级信息查询失败', 1);
    });
  }

  fetchqueryWeekday = () => {
    QueryWeekday({begin: moment(new Date()).format("YYYYMMDD"), days: '15', queryType: 'ALL'}).then((rec) => {
      const {code = -1, result} = rec;
      if (code > 0) {
        const records = JSON.parse(result)
        this.setState({
          kfsrqinit: moment(moment(String(records[4].GZR)).format("YYYY-MM-DD"), 'YYYY-MM-DD'),
          pcrqinit: moment(moment(String(records[7].GZR)).format("YYYY-MM-DD"), 'YYYY-MM-DD'),
          syrqinit: moment(moment(String(records[14].GZR)).format("YYYY-MM-DD"), 'YYYY-MM-DD'),
        })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询其他项目信息
  fetchqueryOutsourceRequirement = (xqid, operateType, xmmc) => {
    FetchqueryOutsourceRequirement({xqid, cxlx: 'UPDATE'}).then((result) => {
      const {code = -1, rydjxx, ryxqxx, wbxqxx} = result;
      const rydjxxJson = JSON.parse(rydjxx);
      const ryxqxxJson = JSON.parse(ryxqxx);
      const wbxqxxJson = JSON.parse(wbxqxx);
      if (code > 0) {
        console.log(" moment(wbxqxxJson[0].KFSFKQX).format(\"YYYY-MM-DD\")", moment(wbxqxxJson[0].KFSFKQX).format("YYYY-MM-DD"))
        this.props.form.setFieldsValue({
          glxm: wbxqxxJson[0].XMMC,
          xqmc: operateType === "relaunch" ? "关于" + xmmc + "的人力外包需求" : wbxqxxJson[0].XQMC,
          kfsrq: moment(moment(wbxqxxJson[0].KFSFKQX).format("YYYY-MM-DD"), 'YYYY-MM-DD'),
          pcrq: moment(moment(wbxqxxJson[0].YJZHPCRQ).format("YYYY-MM-DD"), 'YYYY-MM-DD'),
          syrq: moment(moment(wbxqxxJson[0].YJSYRQ).format("YYYY-MM-DD"), 'YYYY-MM-DD'),
          xmjj: wbxqxxJson[0].XMJJ,
        });
        let tableDataInit = [];
        let tableData = [];
        ryxqxxJson.map(item => {
          let data = {
            ID: item.RYXQID,
            ['PCZT' + item.RYXQID]: item.PCZT,
            ['RYDJ' + item.RYXQID]: item.RYDJID,
            ['GW' + item.RYXQID]: item.GW,
            ['RYSL' + item.RYXQID]: item.RYSL,
            ['SC' + item.RYXQID]: item.SC,
            ['YQ' + item.RYXQID]: item.YQ,
          }
          let data2 = {
            XQID: item.RYXQID,
            PCZT: item.PCZT,
            RYDJ: item.RYDJID,
            GW: item.GW,
            RYSL: item.RYSL,
            SC: item.SC,
            YQ: item.YQ,
          }
          tableDataInit.push(data)
          tableData.push(data2)
        })
        console.log("tableData1111", tableDataInit)
        this.setState({
          tableDataInit,
          tableData,
        })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 保存数据操作
  handleFormValidate = e => {
    e.preventDefault();
    const {currentXmid, currentXmmc, xmjbxxRecord} = this.props;
    console.log('currentXmid', currentXmid);
    console.log('currentXmmc', currentXmmc);
    const _this = this;
    _this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('glxm')) {
          message.warn('请选择关联项目！');
          return;
        }
        if (errs.includes('xqmc')) {
          message.warn('请输入需求名称！');
          return;
        }
        if (errs.includes('kfsrq')) {
          message.warn('请选择开发商反馈期限！');
          return;
        }
        if (errs.includes('pcrq')) {
          message.warn('请选择综合评测完成日期！');
          return;
        }
        if (errs.includes('syrq')) {
          message.warn('请选择意向试用日期！');
          return;
        }
        if (errs.includes('xmjj')) {
          message.warn('请输入项目简介！');
          return;
        }
      } else {
        console.log("this.state.tableData", _this.state.tableData)
        if (_this.state.tableData.length <= 0) {
          message.warn('请完善人员需求！');
        } else if (_this.state.tableData.length > 0) {
          let tableDataFlag = 0;
          _this.state.tableData.map(item => {
            if (item.XQID === null || item.XQID === ''
              || item.RYDJ === null || item.RYDJ === ''
              || item.GW === null || item.GW === ''
              || item.RJSL === null || item.RJSL === ''
              || item.SC === null || item.SC === ''
              || item.YQ === null || item.YQ === '') {
              tableDataFlag++;
            }
          })
          if (tableDataFlag > 0) {
            message.warn('请完善人员需求！');
          } else {
            _this.setState({
              isSpinning: true
            })
            _this.operateOutsourceRequirements(values);
          }
        }
      }
    });
  };

  operateOutsourceRequirements = values => {
    const {xqid} = this.state;
    // console.log("params", this.handleParams(values))
    return OperateOutsourceRequirements(this.handleParams(values))
      .then(result => {
        const {code = -1, record = []} = result;
        if (code > 0) {
          this.setState({
            isSpinning: false
          });
          this.props.successCallBack();
          message.success(xqid === -1 ? "需求发起新增完成!" : "需求发起编辑完成!");
        }
      })
      .catch(error => {
        this.setState({
          isSpinning: false
        })
        message.error(!error.success ? error.message : error.note);
      });
  };

  handleParams = values => {
    const {tableData, xqid} = this.state;
    const {xmid, operateType} = this.props;
    const params = {
      xqmc: String(values.xqmc),
      //新增传-1 重新发起也传-1
      xqid: operateType === "relaunch" ? -1 : xqid,
      kfsrq: Number(moment(values.kfsrq).format('YYYYMMDD')),
      pcrq: Number(moment(values.pcrq).format('YYYYMMDD')),
      syrq: Number(moment(values.syrq).format('YYYYMMDD')),
      xmjj: String(values.xmjj),
      ryxq: JSON.stringify(tableData),
      count: tableData.length,
      czlx: operateType === "relaunch" ? "CREATE" : (xqid === -1 ? "CREATE" : "UPDATE")
    };
    //glxm新增时需要传
    if (xqid === -1 || operateType === "relaunch") {
      params.glxm = Number(xmid);
    }
    console.log("paramsparams", params)
    return params;
  };

  recordCallback = (record) => {
    console.log("recordrecordrecord", record)
    this.setState({
      tableData: record,
    })
  }

  tablePopover = (data, columns) => {
    const {current, total} = this.state;
    return (
      <div className='rysm-table-box'>
        <Table columns={columns} onChange={this.handleTableChange} rowKey={'id'}
               getPopupContainer={triggerNode => triggerNode.parentNode} dataSource={data} size="middle" pagination={{
          current,
          pageSize: 8,
          // pageSizeOptions: ['20', '40', '50', '100'],
          // showSizeChanger: true,
          hideOnSinglePage: false,
          showQuickJumper: true,
          showTotal: t => `共 ${total} 条数据`,
          total: total,
        }}/>
      </div>
    );
  };

  //表格跨行合并
  getRowSpanCount = (data, key, target, bool = false) => {
    //当合并项为可编辑时，最后传true
    if (!Array.isArray(data)) return 1;
    data = data.map(_ => _[key + (bool ? _.id : '')]); // 只取出筛选项
    let preValue = data[0];
    const res = [[preValue]]; // 放进二维数组里
    let index = 0; // 二维数组下标
    for (let i = 1; i < data.length; i++) {
      if (data[i] === preValue) {
        // 相同放进二维数组
        res[index].push(data[i]);
      } else {
        // 不相同二维数组下标后移
        index += 1;
        res[index] = [];
        res[index].push(data[i]);
        preValue = data[i];
      }
    }
    const arr = [];
    res.forEach(_ => {
      const len = _.length;
      for (let i = 0; i < len; i++) {
        arr.push(i === 0 ? len : 0);
      }
    });
    return arr[target];
  };

  //表格操作后更新数据
  handleTableChange = (pagination) => {
    // console.log('handleTableChange', pagination, filters, sorter, extra);
    const {current = 1,} = pagination;
    this.setState({
      current,
    }, () => this.getRydjData())
    // getTableData({ current, pageSize });

  };


  render() {
    const {
      isSpinning = false,
      kfsrqinit = '',
      pcrqinit = '',
      syrqinit = '',
      rydjData = [],
    } = this.state;
    const {
      visible,
      closeModal,
      xmmc,
      operateType,
    } = this.props;
    const {getFieldDecorator, getFieldValue, setFieldsValue} = this.props.form;
    const basicFormItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (
      <>
        <Modal
          wrapClassName="editMessage-modify xqfq-modal"
          style={{top: '10px'}}
          width={'1000px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={closeModal}
          maskClosable={false}
          footer={<div className="modal-footer">
            <Button className="btn-default" onClick={closeModal}>
              取消
            </Button>
            {/* <Button className="btn-primary" type="primary" onClick={() => handleSubmit('save')}>
        暂存草稿
      </Button> */}
            <Button disabled={isSpinning} className="btn-primary" type="primary"
                    onClick={e => this.handleFormValidate(e)}>
              确定
            </Button>
          </div>}
          visible={visible}
        >
          <div
            style={{
              height: '42px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3361FF',
              color: 'white',
              // marginBottom: '16px',
              padding: '0 24px',
              borderRadius: '8px 8px 0 0',
              fontSize: '15px',
            }}
          >
            <strong>{this.state.xqid === -1 || this.state.xqid === 'undefined' ? "需求发起" : "需求修改"}</strong>
          </div>
          <Spin spinning={isSpinning} style={{position: 'fixed'}} tip="加载中" size="large"
                wrapperClassName="contrast-signing-modal-spin">
            <div style={{padding: '0 3.5712rem'}}>
              <div className="steps-content">
                <React.Fragment>
                  <Form
                    {...basicFormItemLayout}
                    ref={e => (this.basicForm = e)}
                    style={{width: '98%'}}
                  >
                    <div style={{margin: '12px 0 0 0'}}>
                      <Row gutter={24}>
                        {/*<Col span={12}>*/}
                        {/*  <Form.Item label="关联项目">*/}
                        {/*    {getFieldDecorator('glxm', {*/}
                        {/*      rules: [*/}
                        {/*        {*/}
                        {/*          required: true,*/}
                        {/*          message: '请选择关联项目',*/}
                        {/*        },*/}
                        {/*      ],*/}

                        {/*      initialValue: xmmc*/}
                        {/*    })(<Input disabled={true} placeholder="请选择关联项目"/>)}*/}
                        {/*  </Form.Item>*/}
                        {/*</Col>*/}
                        <Col span={24}>
                          <Form.Item
                            label="需求名称"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                          >
                            {getFieldDecorator('xqmc', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入需求名称',
                                },
                              ],
                              initialValue: "关于" + xmmc + "的人力外包需求"
                            })(<Tooltip overlayStyle={{width: 'auto'}} placement="bottomLeft"
                                        title={"关于" + xmmc + "的人力外包需求"}><Input disabled={true}
                                                                               placeholder={"关于" + xmmc + "的人力外包需求"}/></Tooltip>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item label="开发商反馈期限">
                            {getFieldDecorator('kfsrq', {
                              initialValue: kfsrqinit,
                              rules: [
                                {
                                  required: true,
                                  message: '请选择开发商反馈期限',
                                },
                              ],
                            })(<DatePicker style={{width: '100%'}}/>)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="预计综合评测完成日期"
                                     labelCol={{span: 10}}
                                     wrapperCol={{span: 14}}>
                            {getFieldDecorator('pcrq', {
                              initialValue: pcrqinit,
                              rules: [
                                {
                                  required: true,
                                  message: '请选择预计综合评测完成日期',
                                },
                              ],
                            })(<DatePicker style={{width: '100%'}}/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item label="意向试用日期">
                            {getFieldDecorator('syrq', {
                              initialValue: syrqinit,
                              rules: [
                                {
                                  required: true,
                                  message: '请选择意向试用日期',
                                },
                              ],
                            })(<DatePicker style={{width: '100%'}}/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label="项目简介"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                          >
                            {getFieldDecorator('xmjj', {
                              rules: [
                                {
                                  required: true,
                                  message: '请输入项目简介',
                                },
                              ],
                              // initialValue: "外采项目"
                            })(<TextArea autoSize={{minRows: 4, maxRows: 6}} placeholder="请输入项目简介"/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label="人员等级岗位说明"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                          >
                            {getFieldDecorator('YT', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: '请输入项目简介',
                              //   },
                              // ],
                              // initialValue: "外采项目"
                            })(<div className="info-item">
                              {rydjData.length === 0 ? (
                                '暂无数据'
                              ) : (
                                <Popover
                                  placement="right"
                                  title={null}
                                  content={this.tablePopover(rydjData, [
                                    {
                                      title: '人员等级',
                                      dataIndex: 'DJ',
                                      width: 78,
                                      key: 'DJ',
                                      ellipsis: true,
                                      render: (value, row, index) => {
                                        const obj = {
                                          children: <Tooltip title={value} placement="topLeft">
                                            <span style={{cursor: 'default'}}>{value}</span>
                                          </Tooltip>,
                                          props: {},
                                        };
                                        obj.props.rowSpan = this.getRowSpanCount(rydjData, 'DJ', index);
                                        return obj;
                                      },
                                    },
                                    {
                                      title: '岗位类型',
                                      dataIndex: 'GWLX',
                                      width: 60,
                                      key: 'GWLX',
                                      ellipsis: true,
                                      render: txt => (
                                        <Tooltip title={txt} placement="topLeft">
                                          <span style={{cursor: 'default'}}>{txt}</span>
                                        </Tooltip>
                                      )
                                    },
                                    {
                                      title: '岗位要求',
                                      dataIndex: 'GWYQ',
                                      width: 150,
                                      key: 'GWYQ',
                                      ellipsis: true,
                                      render: txt => (
                                        <Tooltip title={txt} placement="topLeft">
                                          <span style={{cursor: 'default'}}>{txt}</span>
                                        </Tooltip>
                                      )
                                    },
                                  ])}
                                  overlayClassName="project-topic-content-popover"
                                >
                                  <a style={{color: '#3361ff'}}>查看详情</a>
                                </Popover>
                              )}
                            </div>)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={24}>
                          <Form.Item
                            label={
                              <span>
                                <span
                                  style={{
                                    fontFamily: 'SimSun, sans-serif',
                                    color: '#f5222d',
                                    marginRight: '4px',
                                    lineHeight: 1,
                                  }}
                                >
                                  *
                                </span>
                                人员需求
                              </span>
                            }
                            // label="人员需求"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                          >
                            {getFieldDecorator('ryxq', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: '请完善人员需求',
                              //   },
                              // ],
                              // initialValue: "外采项目"
                            })(<PersonnelNeeds operateType={operateType}
                                               tableDataInit={this.state.tableDataInit}
                                               recordCallback={this.recordCallback}/>)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>

                  </Form>
                  {/*</Form>*/}
                </React.Fragment>
              </div>
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(DemandInitiated));
