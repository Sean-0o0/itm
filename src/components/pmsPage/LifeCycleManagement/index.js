import { Collapse, Row, Col, Menu, Dropdown, Tooltip, Empty, Divider, Modal, Form, Input, Table, DatePicker, Select } from 'antd';
import React from 'react';
import OperationList from './OperationList';
import ProjectRisk from './ProjectRisk';
import Tooltips from './Tooltips';
import Points from './Points';
import Imgs from './Imgs';
import ProjectProgress from './ProjectProgress';
import BridgeModel from "../../Common/BasicModal/BridgeModel";
import { FetchLivebosLink } from '../../../services/amslb/user';
import { message } from 'antd';
import {
  CreateOperateHyperLink,
  FetchQueryLifecycleStuff,
  FetchQueryLiftcycleMilestone, FetchQueryOwnerProjectList
} from "../../../services/pmsServices";
import moment from 'moment';

const { Panel } = Collapse;
const PASE_SIZE = 10;
const Loginname = localStorage.getItem("firstUserID");

class LifeCycleManagementTabs extends React.Component {
  state = {
    //项目生命周期基本信息
    basicData: [],
    detailData: [],
    //上传弹窗
    uploadVisible: false,
    //上传url
    uploadUrl: '/OperateProcessor?operate=TWD_XM_INTERFACE_UPLODC&Table=TWD_XM',
    uploadTitle: '',
    //修改弹窗
    editVisible: false,
    //修改url
    editUrl: '/OperateProcessor?operate=TWD_XM_XWHJY&Table=TWD_XM',
    editTitle: '',
    //立项流程发起弹窗
    sendVisible: false,
    //立项流程发起url
    sendUrl: '/OperateProcessor?operate=TLC_LCFQ_LXSQLCFQ&Table=TLC_LCFQ',
    sendTitle: '',
    //信息录入
    fillOutVisible: false,
    //信息录入url
    fillOutUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
    fillOutTitle: '',
    //信息修改
    editMessageVisible: false,
    isModalFullScreen: false,
    isTableFullScreen: false,
    tableData: [],
    //信息修改url
    editMessageUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
    editMessageTitle: '',
    editModelUrl: '/OperateProcessor?operate=TXMXX_XMXX_INTERFACE_MODOTHERINFO&Table=TXMXX_XMXX&XMID=5&LCBID=18',
    editModelTitle: '',
    editModelVisible: false,
    operationListData: [],
    xmid: 0,
    defaultValue: 0,
  };

  componentDidMount() {
    this.fetchQueryOwnerProjectList(1, PASE_SIZE);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.params !== this.props.params) {
      this.setState({
        defaultValue: nextProps.params.xmid,
      });
      this.fetchQueryLiftcycleMilestone(nextProps.params.xmid)
      this.fetchQueryLifecycleStuff(nextProps.params.xmid);
    }
  }

  fetchQueryOwnerProjectList = (current, pageSize) => {
    const { params } = this.props;
    FetchQueryOwnerProjectList(
      {
        paging: 1,
        current,
        pageSize,
        total: -1,
        sort: ''
      }
    ).then((ret = {}) => {
      const { record, code } = ret;
      if (code === 1) {
        this.setState({
          defaultValue: params.xmid,
          xmid: record[0].xmid,
          operationListData: record,
        });
      }
      // console.log("xmidxmid",this.state.xmid)
      this.fetchQueryLiftcycleMilestone(params.xmid);
      this.fetchQueryLifecycleStuff(params.xmid);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //流程发起url
  getSendUrl = (name) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "TLC_LCFQ",
      "operateName": "TLC_LCFQ_LXSQLCFQ",
      "parameter": [
        {
          "name": "GLXM",
          "value": this.state.xmid
        }
      ],
      "userId": Loginname,
    }
    if (name.includes("合同签署")) {
      params = {
        "attribute": 0,
        "authFlag": 0,
        "objectName": "TLC_LCFQ",
        "operateName": "TLC_LCFQ_HTLYY",
        "parameter": [
          {
            "name": "",
            "value": '',
          }
        ],
        "userId": Loginname,
      }
    }
    if (name.includes("付款")) {
      params = {
        "attribute": 0,
        "authFlag": 0,
        "objectName": "TLC_LCFQ",
        "operateName": "TLC_LCFQ_XMFKLCFQ",
        "parameter": [
          {
            "name": "",
            "value": '',
          }
        ],
        "userId": Loginname,
      }
    }
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          // sendTitle: e + '发起',
          sendUrl: url,
          // sendVisible: true,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //文档上传/修改url
  getUploadUrl = (item) => {
    const params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "TWD_XM",
      "operateName": "TWD_XM_INTERFACE_UPLOD",
      "parameter": [
        {
          "name": "XMMC",
          "value": this.state.xmid
        },
        {
          "name": "LCBMC",
          "value": item.lcbid
        },
        {
          "name": "SXID",
          "value": item.sxid
        }
      ],
      "userId": Loginname
    }
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          uploadUrl: url,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //信息录入url
  getFileOutUrl = (params, callBack) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          fillOutUrl: url,
          fillOutVisible: true,
        });
        // window.location.href = url;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //信息录入修改url
  getEditMessageUrl = (params) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          editMessageUrl: url,
          // editMessageVisible: true,
        });
        // window.location.href = url;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //阶段信息修改url
  getEditModelUrl = (params) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          editModelUrl: url,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  fetchQueryLiftcycleMilestone = (e) => {
    FetchQueryLiftcycleMilestone({
      cxlx: 'ALL',
      xmmc: e ? e : this.state.xmid,
    }).then((ret = {}) => {
      const { record = [], code = 0 } = ret;
      // console.log("basicData",record);
      if (code === 1) {
        //zxxh排序
        record.map((item = {}, index) => {
          item.extend = item.zt === "2";
        })
        // console.log("basicData",record)
        record.sort(this.compare('zxxh'))
        this.setState({
          basicData: record,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  compare = (property) => {
    return function (a, b) {
      var value1 = Number(a[property]);
      var value2 = Number(b[property]);
      return value1 - value2;
    }
  }

  fetchQueryLifecycleStuff = (e) => {
    FetchQueryLifecycleStuff({
      cxlx: 'ALL',
      xmmc: e ? e : this.state.xmid,
    }).then((ret = {}) => {
      const { code = 0, record = [] } = ret;
      // console.log("detailData",record);
      if (code === 1) {
        this.setState({
          detailData: record,
        });
      }
      if (e) {
        this.setState({
          xmid: e,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  onChange = (key) => {
    console.log(key);
  };

  extend = (number) => {
    const { basicData } = this.state;
    basicData.map((item = {}, index) => {
      if (index === number) {
        item.extend = !item.extend;
      }
    })
    this.setState({
      basicData,
    })
  }

  //文档上传
  handleUpload = (item) => {
    this.getUploadUrl(item);
    this.setState({
      uploadVisible: true,
      uploadTitle: item.sxmc + '上传',
    });
  };

  //文档上传的修改
  handleEdit = (item) => {
    this.getUploadUrl(item);
    this.setState({
      editVisible: true,
      editTitle: item.sxmc + '修改',
    });
  };

  //流程发起
  handleSend = (item) => {
    this.getSendUrl(item.sxmc);
    this.setState({
      sendTitle: item.sxmc + '发起',
      // sendUrl: url,
      sendVisible: true,
    });
  };

  //信息录入
  handleFillOut = (item) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "V_HTXX",
      "operateName": "V_HTXX_ADD",
      "parameter": [
        {
          "name": "XMMC",
          "value": this.state.xmid
        },
      ],
      "userId": Loginname
    }
    switch (item.sxmc) {
      case "合同信息录入":
        params = {
          "attribute": 0,
          "authFlag": 0,
          "objectName": "V_HTXX",
          "operateName": "V_HTXX_ADD",
          "parameter": [
            {
              "name": "XMMC",
              "value": this.state.xmid
            },
          ],
          "userId": Loginname
        };
        break;
      case "招标信息录入":
        params = {
          "attribute": 0,
          "authFlag": 0,
          "objectName": "View_TBXX",
          "operateName": "View_TBXX_ADD",
          "parameter": [
            {
              "name": "XMMC",
              "value": this.state.xmid
            },
            {
              "name": "LCBMC",
              "value": item.lcbid
            },
          ],
          "userId": Loginname
        };
        break;
    }
    this.getFileOutUrl(params)
    this.setState({
      fillOutTitle: item.sxmc,
      fillOutVisible: true,
    });
  };


  //信息录入修改
  handleMessageEdit = (item) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "V_HTXX",
      "operateName": "V_HTXX_INTERFACE_MOD",
      "parameter": [
        {
          "name": "XMMC",
          "value": this.state.xmid
        },
      ],
      "userId": Loginname
    }
    switch (item.sxmc) {
      case "合同信息录入":
        params = {
          "attribute": 0,
          "authFlag": 0,
          "objectName": "V_HTXX",
          "operateName": "V_HTXX_INTERFACE_MOD",
          "parameter": [
            {
              "name": "XMMC",
              "value": this.state.xmid
            },
          ],
          "userId": Loginname
        };
        break;
    }
    switch (item.sxmc) {
      case "招标信息录入":
        params = {
          "attribute": 0,
          "authFlag": 0,
          "objectName": "View_TBXX",
          "operateName": "View_TBXX_INTERFACE_MOD",
          "parameter": [
            {
              "name": "XMMC2",
              "value": this.state.xmid
            },
          ],
          "userId": Loginname
        };
        break;
    }
    this.getEditMessageUrl(params);
    this.setState({
      editMessageTitle: item.sxmc + '修改',
      editMessageVisible: true,
    });
  }

  handleEditModel = (item) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "TXMXX_XMXX",
      "operateName": "TXMXX_XMXX_INTERFACE_MODOTHERINFO",
      "parameter": [
        {
          "name": "XMID",
          "value": this.state.xmid,
        },
        {
          "name": "LCBID",
          "value": item.lcbid,
        },
      ],
      "userId": Loginname
    }
    this.getEditModelUrl(params);
    this.setState({
      editModelTitle: '信息修改',
      editModelVisible: true,
    });
  }

  closeUploadModal = () => {
    this.setState({
      uploadVisible: false,
    });
  };

  closeEditModal = () => {
    this.setState({
      editVisible: false,
    });
  };

  closeSendModal = () => {
    this.setState({
      sendVisible: false,
    });
  };

  closeFillOutModal = () => {
    this.setState({
      fillOutVisible: false,
    });
  };

  closeMessageEditModal = () => {
    this.setState({
      editMessageVisible: false,
    });
  };

  closeModelEditModal = () => {
    this.setState({
      editModelVisible: false,
    });
  };


  groupBy = (arr) => {
    let dataArr = [];
    arr.map(mapItem => {
      if (dataArr.length === 0) {
        dataArr.push({ swlx: mapItem.swlx, List: [mapItem] })
      } else {
        let res = dataArr.some(item => {//判断相同swlx，有就添加到当前项
          if (item.swlx === mapItem.swlx) {
            item.List.push(mapItem)
            return true
          }
        })
        if (!res) {//如果没找相同swlx添加一个新对象
          dataArr.push({ swlx: mapItem.swlx, List: [mapItem] })
        }
      }
    })
    return dataArr;
  }


  //成功回调
  onSuccess = (name) => {
    message.success(name + "成功");
    this.reflush();
  }

  reflush = () => {
    this.fetchQueryLiftcycleMilestone(this.state.xmid);
    this.fetchQueryLifecycleStuff(this.state.xmid);
  }

  render() {
    const {
      uploadVisible,
      editVisible,
      sendVisible,
      fillOutVisible,
      editMessageVisible,
      editModelVisible,
      uploadUrl,
      editMessageUrl,
      sendUrl,
      fillOutUrl,
      editModelUrl,
      uploadTitle,
      editTitle,
      sendTitle,
      fillOutTitle,
      editMessageTitle,
      editModelTitle,
      basicData,
      detailData,
      operationListData,
      defaultValue,
    } = this.state;
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '68rem',
      title: uploadTitle,
      style: { top: '10rem' },
      visible: uploadVisible,
      footer: null,
    };
    const editModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '68rem',
      title: editTitle,
      style: { top: '10rem' },
      visible: editVisible,
      footer: null,
    };
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '100rem',
      title: sendTitle,
      style: { top: '10rem' },
      visible: sendVisible,
      footer: null,
    };
    const fillOutModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '120rem',
      height: '80rem',
      title: fillOutTitle,
      style: { top: '10rem' },
      visible: fillOutVisible,
      footer: null,
    };
    const editMessageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '80rem',
      title: editMessageTitle,
      style: { top: '10rem' },
      visible: editMessageVisible,
      footer: null,
    };
    const editModelModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '80rem',
      title: editModelTitle,
      style: { top: '10rem' },
      visible: editModelVisible,
      footer: null,
    };
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.baidu.com/">
            下载文件
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.baidu.com/">
            历史记录
          </a>
        </Menu.Item>
      </Menu>
    );
    let sortedInfo = sortedInfo || {};
    let filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: '付款期数',
        dataIndex: 'fkqs',
        key: 'fkqs',
        // filters: [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }],
        // filteredValue: filteredInfo.name || null,
        // onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.fkqs.length - b.fkqs.length,
        sortOrder: sortedInfo.columnKey === 'fkqs' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '占总金额百分比',
        dataIndex: 'zzjebfb',
        key: 'zzjebfb',
        sorter: (a, b) => a.zzjebfb - b.zzjebfb,
        sortOrder: sortedInfo.columnKey === 'zzjebfbe' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '付款金额（元）',
        dataIndex: 'fkje',
        key: 'fkje',
        // filters: [{ text: 'London', value: 'London' }, { text: 'New York', value: 'New York' }],
        // filteredValue: filteredInfo.address || null,
        // onFilter: (value, record) => record.address.includes(value),
        sorter: (a, b) => a.fkje.length - b.fkje.length,
        sortOrder: sortedInfo.columnKey === 'fkje' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '付款时间',
        dataIndex: 'fksj',
        key: 'fksj',
        // filters: [{ text: 'London', value: 'London' }, { text: 'New York', value: 'New York' }],
        // filteredValue: filteredInfo.address || null,
        // onFilter: (value, record) => record.address.includes(value),
        sorter: (a, b) => a.fksj.length - b.fksj.length,
        sortOrder: sortedInfo.columnKey === 'fksj' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'operator',
        key: 'operator',
        ellipsis: true,
      }
    ];
    //信息修改弹窗
    let { isModalFullScreen, isTableFullScreen, tableData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };
    return (
      <Row style={{ height: 'calc(100% - 4.5rem)' }}>
        {/*文档上传弹窗*/}
        {uploadVisible &&
          <BridgeModel modalProps={uploadModalProps} onSucess={() => this.onSuccess("文档上传")}
            onCancel={this.closeUploadModal}
            src={uploadUrl} />}
        {/*文档修改弹窗*/}
        {editVisible &&
          <BridgeModel modalProps={editModalProps} onSucess={() => this.onSuccess("文档上传修改")}
            onCancel={this.closeEditModal}
            src={uploadUrl} />}
        {/*流程发起弹窗*/}
        {sendVisible &&
          <BridgeModel modalProps={sendModalProps} onSucess={() => this.onSuccess("流程发起")} onCancel={this.closeSendModal}
            src={sendUrl} />}
        {/*信息录入弹窗*/}
        {fillOutVisible &&
          <BridgeModel modalProps={fillOutModalProps} onSucess={() => this.onSuccess("信息录入")}
            onCancel={this.closeFillOutModal}
            src={fillOutUrl} />}

        {/*信息修改弹窗*/}
        {isTableFullScreen &&
          <Modal title={null} footer={null} width={'100vw'} visible={isTableFullScreen} onCancel={() => { this.setState({ isTableFullScreen: false }) }} style={{
            maxWidth: "100vw",
            top: 0,
            paddingBottom: 0,
            marginBottom: 0,
          }}
            bodyStyle={{
              height: "100vh",
              overflowY: "auto",
              padding: '0 0 24px 0',
            }}>
            <div style={{ height: '55px', width: '100%', display: 'flex', alignItems: 'center', color: 'white', marginBottom: '16px', padding: '0 57px' }}>
              <img src={isTableFullScreen ? require('../../../image/pms/LifeCycleManagement/full-screen-cancel-gray.png') : require('../../../image/pms/LifeCycleManagement/full-screen-gray.png')}
                alt='' style={{ height: '20px', marginLeft: 'auto' }}
                onClick={() => { this.setState({ isTableFullScreen: !isTableFullScreen }) }} />
            </div>
          </Modal>}
        {editMessageVisible && <Modal wrapClassName='editMessage-modify' width={isModalFullScreen ? '100vw' : '1100px'} style={isModalFullScreen ? {
          maxWidth: "100vw",
          top: 0,
          paddingBottom: 0,
          marginBottom: 0
        } : {}}
          bodyStyle={isModalFullScreen ? {
            height: "calc(100vh - 53px)",
            overflowY: "auto",
            padding: '0 0 24px 0'
          } : { padding: '0 0 24px 0' }}
          title={null} visible={editMessageVisible} onOk={() => { }} onCancel={() => { this.setState({ editMessageVisible: false }) }}>
          <div style={{ height: '55px', width: '100%', display: 'flex', alignItems: 'center', backgroundColor: '#3361FF', color: 'white', marginBottom: '16px', padding: '0 24px' }}>
            <strong>修改</strong>
            <img src={isModalFullScreen ? require('../../../image/pms/LifeCycleManagement/full-screen-cancel.png') : require('../../../image/pms/LifeCycleManagement/full-screen.png')} alt='' style={{ height: '20px', marginLeft: 'auto', marginRight: '35px' }} onClick={() => { this.setState({ isModalFullScreen: !isModalFullScreen }) }} />
          </div>
          <Form name="nest-messages" onFinish={() => { }} validateMessages={''} style={{ padding: '0 24px' }}>
            <Row>
              <Col span={12}> <Form.Item name={['user', 'name']} label="项目名称" help="ZX123456 / 外采项目" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <div style={{width: '100%', height: '32px', backgroundColor: '#F5F5F5', border: '1px solid #d9d9d9', borderRadius: '4px', marginTop: '5px', lineHeight: '32px', paddingLeft: '10px' }}><a style={{color: '#0073aa'}} href='javascript:;'>测试项目4</a></div>
              </Form.Item></Col>
              <Col span={12}><Form.Item name={['user', 'name']} label="合同金额（元）" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('htje', {
                  rules: [
                    {
                      required: true,
                      message: '合同金额（元）不允许空值',
                    },
                  ],
                })(<Input placeholder="请输入合同金额（元）" />)}
              </Form.Item> </Col>
            </Row>
            <Row>
              <Col span={12}> <Form.Item name={['user', 'name']} label="签署日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('qsrq', {
                  rules: [
                    {
                      required: true,
                      message: '签署日期不允许空值',
                    },
                  ],
                })(<DatePicker onChange={() => { }} style={{ width: '100%' }} />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item name={['user', 'name']} label="付款方式" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Select placeholder="请选择付款方式" style={{ width: '100%' }} onChange={() => { }}>
                  <Select.Option value="1">无</Select.Option>
                  <Select.Option value="2">首次付款</Select.Option>
                  <Select.Option value="3">尾款付款</Select.Option>
                </Select>
              </Form.Item> </Col>
            </Row>
            <Row>
              <Col span={12}> <Form.Item name={['user', 'name']} label="是否分期付款" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('sffqfk', {
                  rules: [
                    {
                      required: true,
                      message: '是否分期付款不允许空值',
                    },
                  ],
                })(<Select placeholder="请选择是否分期付款" style={{ width: '100%' }} onChange={() => { }}>
                  <Select.Option value="1">是</Select.Option>
                  <Select.Option value="2">否</Select.Option>
                </Select>)}
              </Form.Item></Col>
              <Col span={12}><Form.Item name={['user', 'name']} label="需付款次数" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('xfkcs', {
                  rules: [
                    {
                      required: true,
                      message: '需付款次数不允许空值',
                    },
                  ],
                })(<Input placeholder='请输入需付款次数'/>)}
              </Form.Item> </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name={['user', 'name']} label="付款详情" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px', padding: '10px 0' }}>
                    <div style={{ display: 'flex', height: '30px', padding: '0 15px' }}>
                      <div style={{ width: '80px', backgroundColor: 'tomato' }} onClick={()=>{
                        let arrData = tableData;
                        arrData.push({fkqs: '', zzjebfb: '', fkje: '', fksj: '', operator: '删除'});
                        this.setState({tableData: arrData})}}>新增</div>
                      <div style={{ width: '80px', backgroundColor: 'skyblue' }} onClick={()=>{}}>删除</div>
                      <img src={isTableFullScreen ? require('../../../image/pms/LifeCycleManagement/full-screen-cancel-gray.png') : require('../../../image/pms/LifeCycleManagement/full-screen-gray.png')} alt='' style={{ height: '20px', marginLeft: 'auto' }} 
                      onClick={() => { this.setState({ isTableFullScreen: !isTableFullScreen }) }} />
                    </div>
                    <Table columns={columns} dataSource={tableData} rowSelection={rowSelection}></Table>
                  </div>
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Modal>}



        {/* {editMessageVisible &&
          <BridgeModel modalProps={editMessageModalProps} onSucess={() => this.onSuccess("信息修改")}
            onCancel={this.closeMessageEditModal}
            src={editMessageUrl} />} */}

        {/*阶段信息修改弹窗*/}
        {editModelVisible &&
          <div style={{ backgroundColor: 'tomato' }}>
            <BridgeModel modalProps={editModelModalProps} onSucess={() => this.onSuccess("信息修改")}
              onCancel={this.closeModelEditModal}
              src={editModelUrl} /></div>}
        <div style={{ height: '8%', margin: '3.571rem 1.571rem 2.381rem 1.571rem' }}>
          <OperationList fetchQueryLiftcycleMilestone={this.fetchQueryLiftcycleMilestone}
            fetchQueryLifecycleStuff={this.fetchQueryLifecycleStuff}
            fetchQueryOwnerProjectList={this.fetchQueryOwnerProjectList}
            data={operationListData}
            defaultValue={defaultValue} />
        </div>
        {/*position: 'relative',*/}
        <div style={{ height: '92%', margin: '0 1.571rem 3.571rem 1.571rem', }}>
          {
            basicData.map((item = {}, index) => {
              let detail = [];
              detailData.map((childItem = {}, index) => {
                if (childItem.lcbid === item.lcbid) {
                  detail.push(childItem);
                }
              })
              // console.log("detail",detail)
              let sort = this.groupBy(detail);
              // console.log("sort.length", sort.length);
              // console.log("sort",sort)
              return <div className='LifeCycleManage' style={{
                borderTopLeftRadius: (index === 0 ? '8px' : ''),
                borderTopRightRadius: (index === 0 ? '8px' : ''),
                borderBottomLeftRadius: (index === basicData.length - 1 ? '8px' : ''),
                borderBottomRightRadius: (index === basicData.length - 1 ? '8px' : '')
              }}>
                <div className='head'>
                  <Imgs status={item.zt} />
                  <i
                    className={item.extend ? 'iconfont icon-fill-down head-icon' : 'iconfont icon-fill-right head-icon'}
                    onClick={() => this.extend(index)} />&nbsp;
                  <div className='head1'>
                    {item.lcbmc}
                  </div>
                  <div className='head6'>
                    进度：<span style={{ color: 'black' }}>{item.jd}</span>
                  </div>
                  <div className='head3'>
                    时间范围：
                    <div
                      style={{ color: 'rgba(48, 49, 51, 1)' }}>{item.kssj.slice(0, 4) + '.' + item.kssj.slice(4, 6) + '.' + item.kssj.slice(6, 8)} ~ {item.jssj.slice(0, 4) + '.' + item.jssj.slice(4, 6) + '.' + item.jssj.slice(6, 8)} </div>
                  </div>
                  <div className='head4'>
                    项目风险：<ProjectRisk item={item} xmid={this.state.xmid} />
                  </div>
                  <div className='head2'>
                    状态：<ProjectProgress state={item.zt} />
                  </div>
                  <div className='head5'>
                    <div className='head5-title'>
                      <div className='head5-cont'>
                        <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)' }}
                          className="iconfont icon-edit" onClick={
                            () => this.handleEditModel(item)
                          } />
                      </div>
                    </div>
                  </div>
                </div>
                {/*<Divider type='vertical' dashed={true} style={{*/}
                {/*  position: 'absolute',*/}
                {/*  height: '40rem',*/}
                {/*  backgroundColor: 'red',*/}
                {/*  marginLeft: '5.952rem',*/}
                {/*  marginTop: '9.52rem'*/}
                {/*}}/>*/}
                {
                  item.extend ?
                    <Row style={{
                      height: '80%',
                      width: '100%',
                      padding: (index === basicData.length - 1 ? '0 6.571rem 3.571rem 10.571rem' : '0px 6.571rem 0 10.571rem')
                    }} className='card'>
                      {
                        <Col span={24} style={{ width: '100%', padding: '3rem 3rem calc(3rem - 16px) 3rem', borderRadius: '8px', maxHeight: '50rem' }}
                          className='cont'>
                          {
                            sort.map((item = {}, index) => {
                              console.log("index", index)
                              console.log("sort.length", sort.length)
                              console.log("sort.length11", (sort.length - 3 <= index) && (index <= sort.length))
                              let num = 0
                              sort[index].List.map((item = {}, ind) => {
                                if (item.zxqk !== " ") {
                                  num = num + 1;
                                }
                              })
                              return <Col span={8} className='cont-col-self' style={{ marginBottom: '16px' }}>
                                <div className='cont-col'>
                                  <div className='cont-col1'>
                                    <div className='right'>
                                      {item.swlx}({num}/{sort[index].List.length})
                                    </div>
                                  </div>
                                  <div>
                                    {sort[index].List.map((item = {}, ind) => {
                                      return <Row className='cont-row' style={{
                                        // height: ((ind === sort[index].List.length - 1 && (sort.length - 3 <= index) && (index <= sort.length)) ? '2rem' : '5rem'),
                                        // margin: ((ind === sort[index].List.length - 1 && (sort.length - 3 <= index) && (index <= sort.length)) ? '0' : '0 0 1rem 0')
                                        marginTop: ind === 0 ? '18px' : '16px'
                                      }}>
                                        <Col span={17} >
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Points status={item.zxqk} />
                                            <span>{item.sxmc}</span>
                                          </div>
                                          <div className='cont-row-zxqk'>{item.zxqk}</div>
                                        </Col>
                                        <Col span={6} style={{ textAlign: 'right' }}>
                                          <Tooltips type={item.swlx}
                                            item={item}
                                            status={item.zxqk}
                                            handleUpload={() => this.handleUpload(item)}
                                            handleSend={this.handleSend}
                                            handleFillOut={() => this.handleFillOut(item)}
                                            handleEdit={() => this.handleEdit(item)}
                                            handleMessageEdit={this.handleMessageEdit}
                                          />
                                        </Col>
                                        {/* <Col span={3}> */}
                                        {/*<Dropdown overlay={menu}>*/}
                                        {/*  <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}*/}
                                        {/*     className="iconfont icon-more">*/}
                                        {/*  </i>*/}
                                        {/*</Dropdown>*/}
                                        {/* </Col> */}
                                        {/* <div className='cont-row1'>
                                          <div className='left'>
                                            //2022.06.17上传
                                          </div>
                                        </div> */}
                                      </Row>
                                    })}
                                  </div>
                                </div>
                              </Col>
                            })
                          }
                        </Col>
                      }
                    </Row>
                    : ''
                }
              </div>
            })
          }
        </div>
      </Row>
    );
  }
}

export default Form.create()(LifeCycleManagementTabs);
