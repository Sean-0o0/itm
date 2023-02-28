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
  Button,
} from 'antd';
import React from 'react';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import { Link } from 'dva/router';
import { EncryptBase64 } from '../../../../components/Common/Encrypt';
import {
  CreateOperateHyperLink,
  FetchQueryLifecycleStuff, UpdateMessageState
} from "../../../../services/pmsServices";
import moment from 'moment';
import 'moment/locale/zh-cn';
import FastFunction from "../FastFunction";

const { Panel } = Collapse;

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
    //人员新增提醒
    ryxztxVisible: false,
    ryxztxUrl: '',
    page: 1,
    date: moment(new Date()).format('YYYYMMDD'),
    flag: true,
    cxlx: "UNDO",
    currentState: 0,//默认为0，查全部，为1时查具体日期
    //员工评价开启
    ygpjVisible: false,
    ygpjUrl: '#',
    //阶段信息修改
    editModelVisible: false,
    editModelUrl: '#',
    //付款流程发起弹窗
    paymentModalVisible: false,
    currentXmid: 0,
    currentXmmc: '',
    //合同信息修改弹窗
    contractModalVisible: false,
    //中标信息修改弹窗
    bidInfoModalVisible: false,
    //是否选中日期，控制未完成显示
    isDateSelected: false,
  };


  componentDidMount() {
    // 日历today对象
    // let node = document.querySelector('.calendar-style .ant-fullcalendar-selected-day .ant-fullcalendar-value, .calendar-style .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value');
    // if (node) {
    //   node.style.background = '#fff';//为防止hover失效，在pmsPage.less里的原样式加了!important
    //   node.style.color = 'rgba(0, 0, 0, 0.65)';
    //   node.style.boxShadow = '0 0 0 0 #3361ff inset';
    // }
  }

  onPanelChange = (value, mode) => {
  }

  handleUrl = (item) => {
    switch (item?.sxmc) {
      case '信委会议案流程':
        return this.handleSend(item);
      case '总办会会议纪要':
        return this.handleUpload(item);
      case '总办会提案':
        return this.handleUpload(item);
      case '软件费用审批流程':
        return this.handleSend(item);
      case '项目立项申请':
        return this.handleSend(item);
      case '中标信息录入':
        return this.handleFillOut(item);
      case '中标公告':
        return this.handleUpload(item);
      case '招标方式变更流程':
        return this.handleSend(item);
      case '评标报告':
        return this.handleUpload(item);
      case '合同信息录入':
        return this.handleFillOut(item);
      case '合同签署流程':
        return this.handleSend(item);
      case '可行性方案':
        return this.handleUpload(item);
      case '调研报告':
        return this.handleUpload(item);
      case '申请VPN':
        return this.handleSend(item);
      case '申请权限':
        return this.handleSend(item);
      case '申请餐券':
        return this.handleSend(item);
      case 'UI设计图':
        return this.handleUpload(item);
      case '功能清单':
        return this.handleUpload(item);
      case '原型图':
        return this.handleUpload(item);
      case '需求文档':
        return this.handleUpload(item);
      case '开发文档':
        return this.handleUpload(item);
      case '系统拓扑图':
        return this.handleUpload(item);
      case '系统框架图':
        return this.handleUpload(item);
      case '测试文档':
        return this.handleUpload(item);
      case '员工评价开启':
        return this.handleYgpj(item);
      case '原型设计说明书':
        return this.handleUpload(item);
      case '开发测试报告':
        return this.handleUpload(item);
      case '系统部署图、逻辑图':
        return this.handleUpload(item);
      case '评估报告':
        return this.handleUpload(item);
      case '软件系统验收测试报告':
        return this.handleUpload(item);
      case '生产安装部署手册':
        return this.handleUpload(item);
      case '生产操作及运维手册':
        return this.handleUpload(item);
      case '用户手册':
        return this.handleUpload(item);
      case '付款流程':
        return this.handleSend(item);
      case '人员新增提醒':
        return this.handleRyxztx(item);
      default: console.error('未配置弹窗');
    }
    if (item.sxmc === "周报填写") {
      window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`
    }
    if (item.sxmc === "资本性预算年初录入被退回") {
      window.location.href = `/#/UIProcessor?Table=V_ZBXYSNCLR&hideTitlebar=true`
    }
    if (item.sxmc === "资本性预算年中录入被退回") {
      window.location.href = `/#/UIProcessor?Table=V_ZBXYSNZLR&hideTitlebar=true`
    }
    if (item.sxmc === "非资本性预算年初录入被退回") {
      window.location.href = `/#/UIProcessor?Table=V_FZBXYSNCLR&hideTitlebar=true`
    }
    if (item.sxmc === "非资本性预算年中录入被退回") {
      window.location.href = `/#/UIProcessor?Table=V_FZBXYSNZLR&hideTitlebar=true`
    }
    if (item.sxmc === "月报填写") {
      window.location.href = `/#/UIProcessor?Table=ZBYBTX&hideTitlebar=true`
    }
    if (item.sxmc === "资本性年初预算录入") {
      window.location.href = `/#/UIProcessor?Table=V_ZBXYSNCLR&hideTitlebar=true`
    }
    if (item.sxmc === "资本性年中预算录入") {
      window.location.href = `/#/UIProcessor?Table=V_ZBXYSNZLR&hideTitlebar=true`
    }
    if (item.sxmc === "非资本性年初预算录入") {
      window.location.href = `/#/UIProcessor?Table=V_FZBXYSNCLR&hideTitlebar=true`
    }
    if (item.sxmc === "非资本性年中预算录入") {
      window.location.href = `/#/UIProcessor?Table=V_FZBXYSNZLR&hideTitlebar=true`
    }
    if (item.sxmc === "信委会议案被退回") {
      window.location.href = `/#/UIProcessor?Table=WORKFLOW_TOTASKS&hideTitlebar=true`
    }
  }

  handleRyxztx = (record) => {
    const params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "V_RYXXGL",
      "operateName": "TRY_XMRY_COMFIRM",
      "parameter": [
        {
          "name": "SSXM",
          "value": record.xmid
        },
        {
          "name": "RYMC",
          "value": String(JSON.parse(sessionStorage.getItem("user")).id)
        }
      ],
      "userId": String(JSON.parse(sessionStorage.getItem("user")).loginName),
    }
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          ryxztxUrl: url,
          ryxztxVisible: true,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul style={{ margin: '0.1rem', paddingLeft: '1rem' }}>
        {listData.map(item => (
          <li key={item.content}>
            {/* <Tooltip title={item.content}> */}
            <Badge status={item.type} />
            {/* </Tooltip> */}
          </li>
        ))}
      </ul>
    );
  };

  getListData = (value) => {
    //表格数据
    // console.log(value,"value")
    const { allData } = this.props;
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
                { type: 'warning', content: content },
              ]
            }
          }
        })
    }

    return listData || [];
  };

  //流程发起
  handleSend = (item) => {
    if (item.sxmc === '付款流程') {
      // this.setState({
      //   paymentModalVisible: true,
      //   currentXmid: item.xmid,
      // });
      message.info('功能开发中，暂时无法使用', 1);
      return;
    }
    //合同签署流程弹窗个性化,不走livebos弹窗了
    // if (item.sxmc.includes("合同签署")) {
    //   let index = this.state.operationListData?.findIndex(x => {
    //     return Number(x.xmid) === Number(item.xmid)
    //   })
    //   this.setState({
    //     currentXmmc: this.state.operationListData[index].xmmc,
    //     contractSigningVisible: true,
    //     xmbh: xmbh,
    //   }, () => {
    //     console.log('合同签署 - 项目编号：', this.state.xmbh);
    //   })
    //   return;
    // }
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
      const { code, message, url } = ret;
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
    message.success(name + "完成");
    const { fetchQueryOwnerMessage } = this.props;
    fetchQueryOwnerMessage(this.state.page, this.state.date, this.state.cxlx);
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
    const { fetchQueryOwnerMessage } = this.props;
    fetchQueryOwnerMessage(e, this.state.date, this.state.cxlx)
  }

  updateState = (record, zxlx) => {
    UpdateMessageState({
      zxlx: zxlx,
      xxid: record.xxid,
    }).then((ret = {}) => {
      const { code = 0, note = '', record = [] } = ret;
      if (code === 1) {
        const { fetchQueryOwnerMessage } = this.props;
        fetchQueryOwnerMessage(this.state.page, this.state.date, this.state.cxlx)
        message.success('执行成功', 1);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  // 表格当前的列
  renderColumns = () => {
    const textOverflow = {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }
    const cloums = [
      {
        width: '4%',
        title: '',
        dataIndex: '',
        render: (text, record) => {
          const { flag } = this.state;
          return (flag ? <Popconfirm
            title={<span style={{ fontSize: '2.083rem' }}>确认已完成？</span>}
            onConfirm={() => this.updateState(record, 'EXECUTE')}
            onCancel={this.oncancel}
            okText={<span style={{ fontSize: '1.785rem' }}>确认</span>}
            cancelText={<span style={{ fontSize: '1.785rem' }}>取消</span>}
          ><a href="#" style={{
            color: 'grey',
          }}>
              <Icon type="check-circle"
                style={{ color: 'rgba(192, 196, 204, 1)', fontSize: '1.9836rem' }} /></a></Popconfirm> :
            <Icon type="check-circle" style={{ color: 'rgba(51, 97, 255, 1)', fontSize: '1.9836rem' }} />
          )
        }
      },
      {
        width: '25%',
        title: <span style={{ textAlign: 'center' }}>待办事项</span>,
        dataIndex: 'sxmc',
        align: 'center',
        ellipsis: true,
        // key: 'sxmc',
        render: (text, record) => {
          return <span>
            <Tooltip title={text} style={{ fontSize: '2.381rem' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {
                  record.xxlx === "1" && <span style={{
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <i style={{ color: 'red', fontSize: '2.381rem' }} className="iconfont icon-fill-star" />
                  </span>
                }
                <a style={{ fontSize: '2.083rem', color: '#3361ff', paddingLeft: '0.5rem', ...textOverflow }}
                  onClick={() => this.handleUrl(record)}>
                  {text}
                </a>
              </span>
            </Tooltip>
          </span>
        },
      },
      {
        width: '31%',
        title: '待办内容',
        dataIndex: 'txnr',
        align: 'center',
        ellipsis: true,
        // key: 'sxmc',
        render: (text, record) => {
          return <span>
            <Tooltip title={text} style={{ fontSize: '2.381rem' }}>
              <span style={{ fontSize: '2.083rem', display: 'block', ...textOverflow }}>
                {text}
              </span>
            </Tooltip>
          </span>
        },
      },
      {
        width: '25%',
        title: '相关项目',
        dataIndex: 'xmmc',
        align: 'center',
        ellipsis: true,
        // key: 'xmmc',
        render: (text, record) => {
          return <span><Tooltip title={text} style={{ fontSize: '2.381rem' }}>
            <a style={{ color: '#3361ff', fontSize: '2.083rem', display: 'block', ...textOverflow }}
              onClick={
                () => window.location.href = `/#/pms/manage/LifeCycleManagement/${EncryptBase64(JSON.stringify({ projectId: record.xmid }))}`
              }
            >
              {text}
            </a></Tooltip></span>
        },
      },
      {
        width: '15%',
        title: '日期',
        align: 'center',
        dataIndex: 'jzrq',
        ellipsis: true,
        // key: 'jzrq',
        render: (text, record) => {
          return record.wdsl < 0 ? <span
            style={{ fontSize: '2.083rem', color: 'red', ...textOverflow }}>逾期{record.wdsl * -1}天</span>
            : <span style={{ fontSize: '2.083rem', ...textOverflow }}>
              {record.txrq?.slice(4, 6) + '月' + record.txrq?.slice(6, 8) + '日-' + record.jzrq?.slice(4, 6) + '月' + record.jzrq?.slice(6, 8) + '日'}
            </span>
        },
      },
    ];
    return cloums;
  };

  handleDateChange = (e) => {
    // if (moment(e).format('YYYYMMDD') === new moment().format('YYYYMMDD')) {
    //   let node = document.querySelector('.calendar-style .ant-fullcalendar-selected-day .ant-fullcalendar-value, .calendar-style .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value');
    //   node.style.backgroundColor = '';
    //   node.style.color = '';
    //   node.style.boxShadow = '';
    // }
    // let nodeToday = document.querySelector('.ant-fullcalendar-today .ant-fullcalendar-value,.ant-fullcalendar-month-panel-current-cell .ant-fullcalendar-value');
    // if (nodeToday) {
    //   nodeToday.style.boxShadow = '0 0 0 0 #3361ff inset';
    // }
    this.setState({
      date: moment(e).format('YYYYMMDD'),
      cxlx: "ALL",
      isDateSelected: true,
    })
    const { fetchQueryOwnerMessage } = this.props;
    fetchQueryOwnerMessage(this.state.page, moment(e).format('YYYYMMDD'), "ALL")
  }

  getUndoItems = () => {
    this.setState({
      date: moment(new Date()).format('YYYYMMDD'),
      cxlx: "UNDO",
    }, () => {
      const { fetchQueryOwnerMessage } = this.props;
      fetchQueryOwnerMessage(this.state.page, moment(new Date()).format('YYYYMMDD'), this.state.cxlx)
    })

    // 日历today对象
    // let node = document.querySelector('.ant-fullcalendar-selected-day .ant-fullcalendar-value');
    // if (node) {
    //   node.style.background = '#fff';//为防止hover失效，在pmsPage.less里的原样式加了!important
    //   node.style.color = 'rgba(0, 0, 0, 0.65)';
    //   node.style.boxShadow = '0 0 0 0 #3361ff inset';
    // }
    // let nodeToday = document.querySelector('.ant-fullcalendar-today .ant-fullcalendar-value,.ant-fullcalendar-month-panel-current-cell .ant-fullcalendar-value');
    // if (nodeToday) {
    //   nodeToday.style.background = '#fff';//为防止hover失效，在pmsPage.less里的原样式加了!important
    //   nodeToday.style.color = 'rgba(0, 0, 0, 0.65)';
    //   nodeToday.style.boxShadow = '0 0 0 0 #3361ff inset';
    // }
  }

  onclickdb = () => {
    window.open("http://10.52.130.12/ZSZQOA/getURLSyncBPM.do?_BPM_FUNCCODE=C_FormSetFormData&_tf_file_id=1728341&_bpm_task_taskid=63336317");
  }

  render() {
    const { data, total, wzxsl = 0 } = this.props;
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
      ryxztxVisible,
      ryxztxUrl,
      ygpjVisible,
      ygpjUrl,
      //阶段信息修改
      editModelVisible,
      editModelUrl,
      //付款流程发起弹窗
      paymentModalVisible,
      currentXmid,
      currentXmmc,
      //合同信息修改弹窗
      contractModalVisible,
      //中标信息修改弹窗
      bidInfoModalVisible,
      isDateSelected,
    } = this.state;
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '50%',
      height: '68rem',
      title: uploadTitle,
      style: { top: '10rem' },
      visible: uploadVisible,
      footer: null,
    };
    const editModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '60%',
      height: '68rem',
      title: editTitle,
      style: { top: '10rem' },
      visible: editVisible,
      footer: null,
    };
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: sendTitle,
      width: '60%',
      height: '100rem',
      style: { top: '10rem' },
      visible: sendVisible,
      footer: null,
    };
    const fillOutModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '60%',
      height: '80rem',
      title: fillOutTitle,
      style: { top: '10rem' },
      visible: fillOutVisible,
      footer: null,
    };
    const editMessageModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '60%',
      height: '80rem',
      title: editMessageTitle,
      style: { top: '10rem' },
      visible: editMessageVisible,
      footer: null,
    };
    const editModelModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '60%',
      height: '80rem',
      title: '信息修改',
      style: { top: '10rem' },
      visible: editModelVisible,
      footer: null,
    };
    //员工评价开启弹窗
    const ygpjModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '30%',
      height: '38rem',
      title: '操作',
      style: { top: '10rem' },
      visible: ygpjVisible,
      footer: null,
    };
    const ryxztxModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '60%',
      height: '45rem',
      title: '人员新增提醒',
      style: { top: '10rem' },
      visible: ryxztxVisible,
      footer: null,
    };

    return (
      <Row style={{ height: '100%', padding: '3.571rem' }}>
        <div style={{ width: '100%', lineHeight: '3.571rem', paddingBottom: '2.381rem' }}>
          <div style={{ display: 'flex', }}>
            <i style={{ color: 'rgba(51, 97, 255, 1)', fontSize: '3.57rem', marginRight: '1rem' }}
              className="iconfont icon-detail" />
            <div style={{
              width: '25%',
              fontSize: '2.381rem',
              fontWeight: 700,
              color: '#303133',
              height: '100%'
            }} onClick={this.onclickdb}>待办事项
            </div>
            <div style={{ width: '75%', height: '100%', textAlign: 'end' }}>
              {wzxsl !== 0 && isDateSelected &&
                <>
                  <i style={{ color: 'red', fontSize: '2.381rem', padding: "0 .5rem 0 3rem", verticalAlign: 'middle' }}
                    className="iconfont icon-shijian" />
                  <span
                    style={{ fontSize: '2.083rem', fontWeight: 400, color: '#303133', verticalAlign: 'middle' }}>未完成
                    <span
                      style={{ color: 'rgba(215, 14, 25, 1)' }}>{wzxsl}
                      <a style={{ color: '#3361ff' }} onClick={this.getUndoItems}>&nbsp;&nbsp;查看</a>
                    </span>
                  </span>
                </>
              }

            </div>
          </div>
        </div>
        <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'row', height: '95%' }}>
          <div style={{ width: '24%', height: 'calc(100% - 3.571rem)' }}>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, height: '100%' }} className="calendar-style">
              <Calendar
                // monthCellRender={this.monthCellRender}
                dateCellRender={this.dateCellRender}
                style={{ fontSize: '2.083rem' }}
                onSelect={this.handleDateChange}
                fullscreen={false}
                headerRender={({ value, type, onChange, onTypeChange }) => {
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
                    <div style={{ padding: '1.488rem' }}>
                      <Row type="flex" justify="space-between">
                        <Col>
                          <Select
                            style={{ fonsSize: '2.083rem', }}
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
                            style={{ fonsSize: '2.083rem', }}
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
          <div style={{ marginLeft: '2rem', width: '76%' }}>
            <div style={{ height: '100%' }}>
              <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'column', height: '97%' }}>
                <div style={{ height: '90%' }}>
                  {/*文档上传弹窗*/}
                  {uploadVisible &&
                    <BridgeModel modalProps={uploadModalProps} onSucess={() => this.onSuccess("文档上传待办")}
                      onCancel={this.closeUploadModal}
                      src={uploadUrl} />}
                  {/*文档修改弹窗*/}
                  {editVisible &&
                    <BridgeModel modalProps={editModalProps} onSucess={() => this.onSuccess("文档上传修改待办")}
                      onCancel={this.closeEditModal}
                      src={uploadUrl} />}
                  {/*立项流程发起弹窗*/}
                  {sendVisible &&
                    <BridgeModel modalProps={sendModalProps} onSucess={() => this.onSuccess("流程发起待办")}
                      onCancel={this.closeSendModal}
                      src={sendUrl} />}
                  {/*信息录入弹窗*/}
                  {fillOutVisible &&
                    <BridgeModel modalProps={fillOutModalProps} onSucess={() => this.onSuccess("信息录入待办")}
                      onCancel={this.closeFillOutModal}
                      src={fillOutUrl} />}
                  {/*信息修改弹窗*/}
                  {editMessageVisible &&
                    <BridgeModel modalProps={editMessageModalProps} onSucess={() => this.onSuccess("信息修改待办")}
                      onCancel={this.closeMessageEditModal}
                      src={editMessageUrl} />}
                  {/*人员新增提醒弹窗*/}
                  {ryxztxVisible &&
                    <BridgeModel modalProps={ryxztxModalProps} onSucess={() => this.onSuccess("人员新增待办")}
                      onCancel={() => this.setState({ ryxztxVisible: false })}
                      src={ryxztxUrl} />}

                  {/*员工评价开启弹窗*/}
                  {ygpjVisible &&
                    <BridgeModel modalProps={ygpjModalProps} onSucess={() => this.onSuccess("操作")}
                      onCancel={() => this.setState({ ygpjVisible: false })}
                      src={ygpjUrl} />}

                  {/*阶段信息修改弹窗*/}
                  {editModelVisible &&
                    <BridgeModel modalProps={editModelModalProps} onSucess={() => this.onSuccess("信息修改")}
                      onCancel={() => this.setState({ editModelVisible: false })}
                      src={editModelUrl} />}

                  {/* 付款流程发起弹窗 */}
                  {paymentModalVisible && <PaymentProcess
                    paymentModalVisible={paymentModalVisible}
                    fetchQueryLifecycleStuff={this.fetchQueryLifecycleStuff}
                    currentXmid={Number(currentXmid)}
                    closePaymentProcessModal={() => this.setState({ paymentModalVisible: false })}
                    onSuccess={() => this.onSuccess("流程发起")}
                  />}

                  {/*合同信息修改弹窗*/}
                  {contractModalVisible && <ContractInfoUpdate
                    currentXmid={Number(currentXmid)}
                    currentXmmc={currentXmmc}
                    editMessageVisible={contractModalVisible}
                    closeMessageEditModal={() => this.setState({ contractModalVisible: false })}
                    onSuccess={() => this.onSuccess("信息修改")}
                  ></ContractInfoUpdate>}

                  {/*中标信息修改弹窗*/}
                  {bidInfoModalVisible && <BidInfoUpdate
                    currentXmid={Number(currentXmid)}
                    currentXmmc={currentXmmc}
                    bidInfoModalVisible={bidInfoModalVisible}
                    closeBidInfoModal={() => this.setState({ bidInfoModalVisible: false })}
                    loginUserId={JSON.parse(sessionStorage.getItem("user")).id}
                    onSuccess={() => this.onSuccess("信息修改")}
                  ></BidInfoUpdate>}

                  <Table bordered columns={this.renderColumns()} pagination={false} className="tableStyle"
                    locale={{ emptyText: <Empty description={"暂无待办事项"} /> }} dataSource={data}
                    style={{ height: '100%' }} />

                </div>
                <div style={{ height: '10%' }}>
                  <Pagination
                    style={{ textAlign: 'end', fontSize: '2.083rem' }}
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
