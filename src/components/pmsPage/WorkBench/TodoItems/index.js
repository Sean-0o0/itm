import {
  Badge,
  Calendar,
  Col,
  Collapse,
  Card,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
  Empty,
  Pagination,
  message, Popconfirm,
  Icon,
} from 'antd';
import React from 'react';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import {Link} from 'dva/router';
import {
  CreateOperateHyperLink,
  FetchQueryLifecycleStuff, UpdateMessageState
} from "../../../../services/pmsServices";
import moment from 'moment';
import 'moment/locale/zh-cn';
import FastFunction from "../FastFunction";

const {Panel} = Collapse;
const {Group, Button} = Radio;

const Loginname = localStorage.getItem("firstUserID");

class TodoItems extends React.Component {
  state = {
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
    //信息修改url
    editMessageUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
    editMessageTitle: '',
    page: 1,
    date: moment(new Date()).format('YYYYMMDD'),
    flag: true,
  };

  componentDidMount() {
  }

  onPanelChange = (value, mode) => {
    console.log(value, mode);
  }

  handleUrl = (text) => {
    // console.log("texttext",text.sxmc)
    if (text.sxmc.includes("信息录入")) {
      this.handleFillOut(text);
    }
    if (text.sxmc.includes("流程")) {
      this.handleSend(text);
    }
    if (text.sxmc.includes("文档") ||
      text.sxmc.includes("信委会") ||
      text.sxmc.includes("总办会") ||
      text.sxmc.includes("需求调研") ||
      text.sxmc.includes("产品设计") ||
      text.sxmc.includes("系统框架搭建") ||
      text.sxmc.includes("功能开发") ||
      text.sxmc.includes("外部系统对接") ||
      text.sxmc.includes("系统测试") ||
      text.sxmc.includes("需求文档") ||
      text.sxmc.includes("功能清单") ||
      text.sxmc.includes("原型图")) {
      this.handleUpload(text);
    }
    if (text.sxmc.includes("周报")) {
      window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`
    }
    if (text.sxmc.includes("预算年初")) {
      window.location.href = `/#/UIProcessor?Table=V_ZBXYSNCLR&hideTitlebar=true`
    }
    if (text.sxmc.includes("预算年中")) {
      window.location.href = `/#/UIProcessor?Table=V_ZBXYSNZLR&hideTitlebar=true`
    }
    if (text.sxmc.includes("月报")) {
      window.location.href = `/#/UIProcessor?Table=V_YBTX&hideTitlebar=true`
    }
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul style={{margin: '0.1rem', paddingLeft: '1rem'}}>
        {listData.map(item => (
          <li key={item.content}>
            <Tooltip title={item.content}><Badge status={item.type}/></Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  getListData = (value) => {
    //表格数据
    // console.log(value,"value")
    const {allData} = this.props;
    let t = moment(value._d)
      .format('YY-MM-DD')
      .substring(0, 5)
    let curr_t = new Date()
    let listData

    curr_t = moment(curr_t)
      .format('YY-MM-DD')
      .substring(0, 5)
    let content = '';
    if (curr_t) {
      // 过滤掉非本月的数据
      allData &&
      allData.forEach(item => {
        let date = item.jzrq.slice(0, 4).concat("-").concat(item.jzrq.slice(4, 6)).concat("-").concat(item.jzrq.slice(6, 8));
        if (value.month() === new Date(date).getMonth()) {
          if (value.date() === new Date(date).getDate()) {
            content = <span>{content}<p>{item.txnr}</p></span>;
            listData = [
              {type: 'warning', content: content},
            ]
          }
        }
      })
    }

    return listData || [];
  };

  //流程发起
  handleSend = (item) => {
    // console.log("texttext111",item)
    this.getSendUrl(item);
    this.setState({
      sendTitle: item.sxmc + '发起',
      // sendUrl: url,
      sendVisible: true,
    });
  };

  //流程发起url
  getSendUrl = (record) => {
    const params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "TLC_LCFQ",
      "operateName": "TLC_LCFQ_LXSQLCFQ",
      "parameter": [
        {
          "name": "GLXM",
          "value": record.xmid
        }
      ],
      "userId": Loginname,
    }
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
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
          "value": item.xmid
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
      const {code, message, url} = ret;
      if (code === 1) {
        this.setState({
          uploadUrl: url,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  //信息录入
  handleFillOut = (record) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "V_HTXX",
      "operateName": "V_HTXX_ADD",
      "parameter": [
        {
          "name": "XMMC",
          "value": record.xmid
        },
      ],
      "userId": Loginname
    }
    switch (record.sxmc) {
      case "合同信息录入":
        params = {
          "attribute": 0,
          "authFlag": 0,
          "objectName": "V_HTXX",
          "operateName": "V_HTXX_ADD",
          "parameter": [
            {
              "name": "XMMC",
              "value": record.xmid
            },
          ],
          "userId": Loginname
        };
        break;
    }
    this.getFileOutUrl(params)
    this.setState({
      fillOutTitle: record.sxmc,
      fillOutVisible: true,
    });
  };

  //信息录入修改
  handleMessageEdit = (record) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "V_HTXX",
      "operateName": "V_HTXX_INTERFACE_MOD",
      "parameter": [
        {
          "name": "XMMC",
          "value": record.xmid
        },
      ],
      "userId": Loginname
    }
    switch (record.sxmc) {
      case "合同信息录入":
        params = {
          "attribute": 0,
          "authFlag": 0,
          "objectName": "V_HTXX",
          "operateName": "V_HTXX_INTERFACE_MOD",
          "parameter": [
            {
              "name": "XMMC",
              "value": record.xmid
            },
          ],
          "userId": Loginname
        };
        break;
    }
    this.getEditMessageUrl(params);
    this.setState({
      editMessageTitle: record.sxmc + '修改',
      editMessageVisible: true,
    });
  }

  //信息录入url
  getFileOutUrl = (params, callBack) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
      if (code === 1) {
        this.setState({
          fillOutUrl: url,
          // fillOutVisible: true,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
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

  //成功回调
  onSuccess = (name) => {
    message.success(name + "成功");
  }

  updateFlag = () => {
    this.setState({
      flag: false,
    })
  }

  // onconfirm = (e) => {
  //   console.log(e);
  //   message.success('Click on Yes');
  // }

  oncancel = (e) => {
    // console.log(e);
    // message.error('Click on No');
  }

  handPageChange = (e) => {
    this.setState({
      page: e,
    })
    const {fetchQueryOwnerMessage} = this.props;
    fetchQueryOwnerMessage(e, this.state.date)
  }

  updateState = (record, zxlx) => {
    // console.log("recordrecord", record)
    UpdateMessageState({
      zxlx: zxlx,
      xxid: record.xxid,
    }).then((ret = {}) => {
      const {code = 0, note = '', record = []} = ret;
      if (code === 1) {
        const {fetchQueryOwnerMessage} = this.props;
        fetchQueryOwnerMessage(this.state.page, this.state.date)
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  // 表格当前的列
  renderColumns = () => {
    const cloums = [
      {
        width: '4%',
        title: '',
        dataIndex: '',
        render: (text, record) => {
          const {flag} = this.state;
          return (flag ? <Popconfirm
                title={<span style={{fontSize: '2.083rem'}}>确认已完成？</span>}
                onConfirm={() => this.updateState(record, 'EXECUTE')}
                onCancel={this.oncancel}
                okText={<span style={{fontSize: '1.785rem'}}>确认</span>}
                cancelText={<span style={{fontSize: '1.785rem'}}>取消</span>}
              ><a href="#" style={{
                color: 'grey',
              }}>
                <Icon type="check-circle"
                      style={{color: 'rgba(192, 196, 204, 1)', fontSize: '1.9836rem'}}/></a></Popconfirm> :
              <Icon type="check-circle" style={{color: 'rgba(51, 97, 255, 1)', fontSize: '1.9836rem'}}/>
          )
        }
      },
      {
        title: <span style={{textAlign: 'center'}}>待办事项</span>,
        dataIndex: 'sxmc',
        align: 'center',
        // key: 'sxmc',
        render: (text, record) => {
          return <span>
            <Tooltip title={text.length > 8 ? text : ''} style={{fontSize: '2.381rem'}}>
              <span style={{display: 'flex',}}>
                {
                  //onClick={() => this.updateState(record, 'READ')} 已读调用接口
                  record.xxlx === "1" && <span style={{
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <i style={{color: 'red', fontSize: '2.381rem'}} className="iconfont icon-fill-star"/>
                  </span>
                }
                <a style={{fontSize: '2.083rem', color: '#1890ff', paddingLeft: '0.5rem'}}
                   onClick={() => this.handleUrl(record)}>{text.length > 8 ? text.slice(0, 8) + '...' : text}</a>
                {/*必做标识*/}
                {/*<div style={{backgroundColor: 'rgba(252, 236, 237, 1)', borderRadius: '10px'}}>*/}
                {/*  {record.xxlx === "1" && <span style={{padding: '0 1rem', color: 'rgba(204, 62, 69, 1)'}}>必做</span>}*/}
                {/*</div>*/}
              </span>
            </Tooltip>
         </span>
        },
      },
      {
        title: '待办内容',
        dataIndex: 'txnr',
        align: 'center',
        // key: 'sxmc',
        render: (text, record) => {
          return <span>
            <Tooltip title={text.length > 20 ? text : ''} style={{fontSize: '2.381rem'}}>
              <span style={{fontSize: '2.083rem', display: 'flex',}}>
                {text.length > 20 ? text.slice(0, 20) + '...' : text}
              </span>
            </Tooltip>
         </span>
        },
      },
      {
        title: '相关项目',
        dataIndex: 'xmmc',
        align: 'center',
        // key: 'xmmc',
        render: (text, record) => {
          return <span><Tooltip title={text.length > 8 ? text : ''} style={{fontSize: '2.381rem'}}>
            <span style={{display: 'flex',}}><Link style={{color: '#1890ff', fontSize: '2.083rem',}} to={{
              pathname: '/pms/manage/LifeCycleManagement',
              query: {xmid: record.xmid},
            }}>{text.length > 8 ? text.slice(0, 8) + '...' : text}</Link></span></Tooltip></span>
        },
      },
      {
        width: '15%',
        title: '日期',
        align: 'center',
        dataIndex: 'jzrq',
        // key: 'jzrq',
        render: (text, record) => {
          return <span
            style={{fontSize: '2.083rem',}}>{record.txrq?.slice(4, 8) + '-' + record.jzrq?.slice(4, 8)}</span>
        },
      },
    ];
    return cloums;
  };

  handleDateChange = (e) => {
    this.setState({
      date: moment(e).format('YYYYMMDD'),
    })
    const {fetchQueryOwnerMessage} = this.props;
    fetchQueryOwnerMessage(this.state.page, moment(e).format('YYYYMMDD'))
  }

  onclickdb = () => {
    window.open("http://10.52.130.12/ZSZQOA/getURLSyncBPM.do?_BPM_FUNCCODE=C_FormSetFormData&_tf_file_id=1728341&_bpm_task_taskid=63336317");
  }

  render() {
    const {data, total, wzxsl} = this.props;
    const {
      uploadVisible,
      editVisible,
      sendVisible,
      fillOutVisible,
      editMessageVisible,
      uploadUrl,
      editMessageUrl,
      sendUrl,
      fillOutUrl,
      uploadTitle,
      editTitle,
      sendTitle,
      fillOutTitle,
      editMessageTitle,
    } = this.state;
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: uploadTitle,
      style: {top: '10rem'},
      visible: uploadVisible,
      footer: null,
    };
    const editModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '68rem',
      title: editTitle,
      style: {top: '10rem'},
      visible: editVisible,
      footer: null,
    };
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '80rem',
      title: sendTitle,
      style: {top: '10rem'},
      visible: sendVisible,
      footer: null,
    };
    const fillOutModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '80rem',
      title: fillOutTitle,
      style: {top: '10rem'},
      visible: fillOutVisible,
      footer: null,
    };
    const editMessageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '80rem',
      title: editMessageTitle,
      style: {top: '10rem'},
      visible: editMessageVisible,
      footer: null,
    };
    return (
      <Row style={{height: '100%', padding: '3.571rem'}}>
        <div style={{width: '100%', lineHeight: '3.571rem', paddingBottom: '2.381rem'}}>
          <div style={{display: 'flex',}}>
            <i style={{color: 'rgba(51, 97, 255, 1)', fontSize: '3.57rem', marginRight: '1rem'}}
               className="iconfont icon-detail"/>
            <div style={{
              width: '25%',
              fontSize: '2.381rem',
              fontWeight: 700,
              color: '#303133',
              height: '100%'
            }} onClick={this.onclickdb}>待办事项
            </div>
            <div style={{width: '75%', height: '100%', textAlign: 'end'}}>
              {/*<i style={{color: 'red', paddingRight: ".5rem", verticalAlign: 'middle'}}*/}
              {/*   className="iconfont icon-message"/><span*/}
              {/*style={{fontSize: '14px', fontWeight: 400, color: '#303133', verticalAlign: 'middle'}}>未读 <span*/}
              {/*style={{color: 'rgba(215, 14, 25, 1)'}}>{wdsl}</span></span>*/}
              <i style={{color: 'red', fontSize: '2.381rem', padding: "0 .5rem 0 3rem", verticalAlign: 'middle'}}
                 className="iconfont icon-shijian"/><span
              style={{fontSize: '2.083rem', fontWeight: 400, color: '#303133', verticalAlign: 'middle'}}>未完成 <span
              style={{color: 'rgba(215, 14, 25, 1)'}}>{wzxsl}</span></span>
            </div>
          </div>
        </div>
        <Col xs={24} sm={24} lg={24} xl={24} style={{display: 'flex', flexDirection: 'row', height: '95%'}}>
          <div style={{width: '24%'}}>
            <div style={{border: '1px solid #d9d9d9', borderRadius: 4}}>
              <Calendar
                // monthCellRender={this.monthCellRender}
                dateCellRender={this.dateCellRender}
                style={{fontSize: '2.083rem'}}
                onSelect={this.handleDateChange}
                fullscreen={false}
                headerRender={({value, type, onChange, onTypeChange}) => {
                  const start = 0;
                  const end = 12;
                  const monthOptions = [];

                  const current = value.clone();
                  const localeData = value.localeData();
                  const months = [];
                  for (let i = 0; i < 12; i++) {
                    current.month(i);
                    months.push(localeData.monthsShort(current));
                  }

                  for (let index = start; index < end; index++) {
                    monthOptions.push(
                      <Select.Option className="month-item" key={`${index}`}>
                        {months[index]}
                      </Select.Option>,
                    );
                  }
                  const month = value.month();

                  const year = value.year();
                  const options = [];
                  for (let i = year - 10; i < year + 10; i += 1) {
                    options.push(
                      <Select.Option key={i} value={i} className="year-item">
                        {i}
                      </Select.Option>,
                    );
                  }
                  return (
                    <div style={{padding: 10}}>
                      <Row type="flex" justify="space-between">
                        <Col>
                          <Select
                            style={{fonsSize: '2.083rem',}}
                            size="small"
                            dropdownMatchSelectWidth={false}
                            className="my-year-select"
                            onChange={newYear => {
                              const now = value.clone().year(newYear);
                              onChange(now);
                            }}
                            value={String(year)}
                          >
                            {options}
                          </Select>
                          &nbsp;
                          <Select
                            size="small"
                            style={{fonsSize: '2.083rem',}}
                            dropdownMatchSelectWidth={false}
                            value={String(month)}
                            onChange={selectedMonth => {
                              const newValue = value.clone();
                              newValue.month(parseInt(selectedMonth, 10));
                              onChange(newValue);
                            }}
                          >
                            {monthOptions}
                          </Select>
                        </Col>
                      </Row>
                    </div>
                  );
                }}
                onPanelChange={this.onPanelChange}
              />
            </div>
          </div>
          <div style={{marginLeft: '2rem', width: '76%'}}>
            <div style={{height: '100%'}}>
              <Col xs={24} sm={24} lg={24} xl={24} style={{display: 'flex', flexDirection: 'column', height: '97%'}}>
                <div style={{height: '90%'}}>
                  {/*文档上传弹窗*/}
                  {uploadVisible &&
                  <BridgeModel modalProps={uploadModalProps} onSucess={() => this.onSuccess("文档上传")}
                               onCancel={this.closeUploadModal}
                               src={uploadUrl}/>}
                  {/*文档修改弹窗*/}
                  {editVisible &&
                  <BridgeModel modalProps={editModalProps} onSucess={() => this.onSuccess("文档上传修改")}
                               onCancel={this.closeEditModal}
                               src={uploadUrl}/>}
                  {/*立项流程发起弹窗*/}
                  {sendVisible &&
                  <BridgeModel modalProps={sendModalProps} onSucess={() => this.onSuccess("流程发起")}
                               onCancel={this.closeSendModal}
                               src={sendUrl}/>}
                  {/*信息录入弹窗*/}
                  {fillOutVisible &&
                  <BridgeModel modalProps={fillOutModalProps} onSucess={() => this.onSuccess("信息录入")}
                               onCancel={this.closeFillOutModal}
                               src={fillOutUrl}/>}
                  {/*信息修改弹窗*/}
                  {editMessageVisible &&
                  <BridgeModel modalProps={editMessageModalProps} onSucess={() => this.onSuccess("信息修改")}
                               onCancel={this.closeMessageEditModal}
                               src={editMessageUrl}/>}
                  <Table bordered columns={this.renderColumns()} pagination={false} className="tableStyle"
                         locale={{emptyText: <Empty description={"暂无消息"}/>}} dataSource={data}
                         style={{height: '100%'}}/>

                </div>
                <div style={{height: '10%'}}>
                  <Pagination
                    style={{textAlign: 'end', fontSize: '2.083rem'}}
                    size="small"
                    total={total}
                    showTotal={total => `共 ${total} 条`}
                    defaultPageSize={6}
                    onChange={this.handPageChange}
                    // showQuickJumper={true}
                    defaultCurrent={1}
                  />
                </div>
              </Col>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default TodoItems;
