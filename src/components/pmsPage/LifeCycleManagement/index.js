import { Collapse, Row, Col, Menu, Form, message, Modal, Dropdown, Popover } from 'antd';
import React from 'react';
import OperationList from './OperationList';
import ProjectRisk from './ProjectRisk';
import Tooltips from './Tooltips';
import Points from './Points';
import Imgs from './Imgs';
import ProjectProgress from './ProjectProgress';
import BridgeModel from "../../Common/BasicModal/BridgeModel";
import { FetchLivebosLink } from '../../../services/amslb/user';
import {
  CreateOperateHyperLink,
  FetchQueryLifecycleStuff,
  FetchQueryLiftcycleMilestone,
  FetchQueryOwnerProjectList,
  FetchQueryProjectInfoInCycle,
  FetchQueryWpsWDXX,
} from "../../../services/pmsServices";
import ContractInfoUpdate from './ContractInfoUpdate';
import BidInfoUpdate from './BidInfoUpdate';

import WPSFrame from '../../../js/wps_general'
import { WpsInvoke, WpsClientOpen } from '../../../js/wpsjsrpcsdk';
import { PluginsUrl } from "../../../utils/config";
import PaymentProcess from './PaymentProcess';
import moment from 'moment';

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
    //员工评价
    ygpjVisible: false,
    ygpjUrl: '#',
    //信息修改
    editMessageVisible: false,//合同
    bidInfoModalVisible: false,//中标
    defMsgModifyModalVisible: false,//默认
    currentXmid: 0,
    currentXmmc: '',
    //信息修改url
    editMessageUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
    editMessageTitle: '',
    editModelUrl: '/OperateProcessor?operate=TXMXX_XMXX_INTERFACE_MODOTHERINFO&Table=TXMXX_XMXX&XMID=5&LCBID=18',
    editModelTitle: '',
    editModelVisible: false,
    operationListData: [],
    operationListTotalRows: 0,
    xmid: 0,
    defaultValue: 0,
    //周报填写Url
    weelyReportUrl: '/#/UIProcessor?Table=V_XSZHZBTX&hideTitlebar=true',
    //顶部项目信息
    projectInfo: {},
    //多文档文件列表
    fileList: [],
    fileListVisible: false,
    //付款流程发起弹窗显示
    paymentModalVisible: false
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
        // paging: 1,
        paging: -1,
        current,
        pageSize,
        total: -1,
        sort: '',
        cxlx: 'ALL',
      }
    ).then((ret = {}) => {
      const { record, code, totalrows } = ret;
      if (code === 1) {
        this.setState({
          defaultValue: params.xmid,
          xmid: record[0].xmid,
          operationListData: record,
          operationListTotalRows: totalrows
        }, () => {
          this.fetchQueryProjectInfoInCycle(this.props.params?.xmid || Number(this.state.operationListData[0]?.xmid));
        });
      }
      this.fetchQueryLiftcycleMilestone(params.xmid);
      this.fetchQueryLifecycleStuff(params.xmid);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //获取项目展示信息
  fetchQueryProjectInfoInCycle = (xmid) => {
    FetchQueryProjectInfoInCycle({
      xmmc: xmid,
    }).then(res => {
      this.setState({
        projectInfo: res?.record,
      });
    });
  };

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
            "name": "XMMC",
            "value": this.state.xmid
          },
        ],
        "userId": Loginname,
      }
    }
    if (name.includes("付款")) {
      params = {
        "attribute": 0,
        "authFlag": 0,
        "objectName": "LC_XMFKLC",
        "operateName": "LC_XMFKLC_XMFKLCFQ",
        "parameter": [
          {
            "name": "XMMC",
            "value": this.state.xmid
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
      console.log("🚀 ~ file: index.js ~ line 233 ~ LifeCycleManagementTabs ~ CreateOperateHyperLink ~ url", url)
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

  //默认信息修改url
  getEditMessageUrl = (params, msg = '修改') => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          editMessageUrl: url,
          defMsgModifyModalVisible: true,
          editMessageTitle: msg,
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

  fetchQueryWpsWDXX = (item) => {
    FetchQueryWpsWDXX({
      lcb: item.lcbid,
      sxid: item.sxid,
      xmmc: this.state.xmid
    }).then((ret = {}) => {
      const { code = 0, record = [] } = ret;
      console.log("WpsWDXXData", record);
      if (code === 1) {
        if (record.url.includes("[")) {
          let obj = JSON.parse(record.url);
          obj.push([item.sxmc])
          this.setState({
            fileList: obj,
            fileListVisible: true,
          })
        } else {
          this._WpsInvoke({
            Index: 'OpenFile',
            // AppType:'wps',
            filepath: record.url,
          })
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
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
      // if(item.extend){
      //   console.log("index",index)
      //   console.log("112222",document.getElementById(index.toString())?.clientHeight);
      //   item.height = (((Number(document.getElementById(index.toString())?.clientHeight))/6.72)+Number(9.55)+ 'rem').toString();
      //   console.log("number",item.height)
      // }else{
      //   item.height = '9.55rem'.toString();
      // }
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
    if (item.sxmc.includes('付款流程')) {
      // this.setState({
      //   paymentModalVisible: true,
      // });
      message.info('功能开发中，暂时无法使用', 1);
      return;
    }
    this.getSendUrl(item.sxmc);
    this.setState({
      sendTitle: item.sxmc + '发起',
      // sendUrl: url,
      sendVisible: true,
    });
  };

  //livebos弹窗配置，默认入参值为员工评价弹窗的
  handleModalConfig = ({ objName = "View_XMRYPF",
    oprName = "View_XMRYPF_OPENCOMMENT",
    data = [
      {
        "name": "XMMC",
        "value": this.state.xmid
      },
    ], userName = Loginname,
    urlName = 'ygpjUrl',
    visibleName = 'ygpjVisible'
  }) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": objName,
      "operateName": oprName,
      "parameter": data,
      "userId": userName
    };
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      console.log("🚀 ~ file: index.js ~ line 233 ~ LifeCycleManagementTabs ~ CreateOperateHyperLink ~ url", url)
      if (code === 1) {
        this.setState({
          [urlName]: url,
          [visibleName]: true
        });
        // window.location.href = url;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //其他
  // handleOther = (item) => {
  //   if (item.sxmc.includes("员工评价开启")) {
  //     this.handleModalConfig();
  //     return;
  //   }
  // };

  //信息录入
  handleFillOut = (item) => {
    let params = {};
    if (item.sxmc.includes("周报填写")) { window.location.href = this.state.weelyReportUrl; return; }
    //暂时放信息录入，以后多了放-其他
    if (item.sxmc.includes("员工评价开启")) {
      this.handleModalConfig();
      return;
    }
    if (item.sxmc.includes("合同信息录入")) {
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

    }
    if (item.sxmc.includes("中标信息录入")) {
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
            "name": "LCB",
            "value": item.lcbid
          },
        ],
        "userId": Loginname
      };
    }
    if (item.sxmc.includes("中标公告")) {
      params = {
        "attribute": 0,
        "authFlag": 0,
        "objectName": "TXMXX_ZBGG",
        "operateName": "TXMXX_ZBGG_Add",
        "parameter": [
          {
            "name": "XMMC2",
            "value": this.state.xmid
          }
        ],
        "userId": Loginname
      };
    }
    this.getFileOutUrl(params);
    this.setState({
      fillOutTitle: item.sxmc,
      fillOutVisible: true,
    });
  };

  //信息修改
  handleMessageEdit = (item) => {
    //获取当前项目名称，打开弹窗
    let index = this.state.operationListData?.findIndex(item => {
      return Number(item.xmid) === (Number(this.state.currentXmid) !== 0 ? Number(this.state.currentXmid) : Number(this.props.params.xmid || Number(this.state.operationListData[0].xmid)))
    })
    this.setState({
      currentXmmc: this.state.operationListData[index].xmmc
    });
    if (item.sxmc.includes("合同信息录入")) {
      this.setState({
        // editMessageTitle: item.sxmc + '修改',
        editMessageVisible: true,
      });
    }
    if (item.sxmc.includes("中标信息录入")) {
      this.setState({
        bidInfoModalVisible: true,
        currentXmmc: this.state.operationListData[index].xmmc
      });
    }
    if (item.sxmc.includes("员工评价开启")) {
      this.handleModalConfig({});
      return;
    }
    if (item.sxmc.includes("中标公告")) {
      let params = {
        "attribute": 0,
        "authFlag": 0,
        "objectName": "TXMXX_ZBGG",
        "operateName": "TXMXX_ZBGG_MOD",
        "parameter": [
          {
            "name": "XMMC2",
            "value": this.state.xmid
          }
        ],
        "userId": Loginname
      }
      this.getEditMessageUrl(params, "中标公告修改");//livebos
    }
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

  closePaymentProcessModal = () => {
    this.setState({
      paymentModalVisible: false,
    });
  };

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
  closeDefMsgModifyModal = () => {
    this.setState({
      defMsgModifyModalVisible: false,
    });
  };
  closeBidInfoModal = () => {
    this.setState({
      bidInfoModalVisible: false,
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

  //文件wps预览-勿删
  handleClick = (item) => {
    console.log(item);
    this.fetchQueryWpsWDXX(item);
  }

  //文件wps预览-勿删
  _WpsInvoke(funcs, front, jsPluginsXml, isSilent) {
    if (isSilent) {//隐藏启动时，front必须为false
      front = false;
    }
    /**
     * 下面函数为调起WPS，并且执行加载项WpsOAAssist中的函数dispatcher,该函数的参数为业务系统传递过去的info
     */
    console.log("funcs", funcs)
    this.singleInvoke(funcs, front, jsPluginsXml, isSilent)
  }

  singleInvoke(param, showToFront, jsPluginsXml, silentMode) {
    let clientType = WpsInvoke.ClientType.wps;
    let name = "HelloWps";
    if (param.filepath.includes(".docx") || param.filepath.includes(".doc")) {
      clientType = WpsInvoke.ClientType.wps;
      name = "HelloWps";
    }
    if (param.filepath.includes(".xlsx") || param.filepath.includes(".xls")) {
      clientType = WpsInvoke.ClientType.et;
      name = "HelloWp s-et";
    }
    if (param.filepath.includes(".pdf")) {
      // clientType = WpsInvoke.ClientType.wpp;
      // name = "HelloWps-wpp";
      window.open(param.filepath)
      return;
    }
    const WpsClient = new WpsClientOpen.WpsClient(clientType);
    //打包时修改config.js文件里的插件地址PluginsUrl。
    WpsClient.jsPluginsXml = PluginsUrl;
    WpsClient.InvokeAsHttp(
      name, // 组件类型
      // "HelloWps", // 插件名，与wps客户端加载的加载的插件名对应
      "InvokeFromSystemDemo", // 插件方法入口，与wps客户端加载的加载的插件代码对应，详细见插件代码
      JSON.stringify(param), // 传递给插件的数据
      function (result) { // 调用回调，status为0为成功，其他是错误
        if (result.status) {
          if (result.status === 100) {
            message.info('请在稍后打开的网页中，点击"高级" => "继续前往"，完成授权。')
            return;
          }
          message.info(result.message)
        } else {
          message.info(result.response)
        }
      },
      true)
  }

  handleVisibleChange = visible => {
    this.setState({ fileListVisible: visible });
  };

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
      currentXmmc,
      projectInfo,
      xmid,
      bidInfoModalVisible,
      operationListTotalRows,
      fileList,
      fileListVisible,
      paymentModalVisible,
      defMsgModifyModalVisible,
      ygpjVisible,
      ygpjUrl,
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
      title: sendTitle,
      width: '180rem',
      height: '134.2rem',
      style: { top: '2rem' },
      visible: sendVisible,
      footer: null,
    };
    const fillOutModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
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
      visible: defMsgModifyModalVisible,
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
    //员工评价弹窗
    const ygpjModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '75rem',
      height: '38rem',
      title: '操作',
      style: { top: '10rem' },
      visible: ygpjVisible,
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
    const content = (
      <>
        {
          fileList.map(item => item.length === 3 &&
            <div key={item.index} className="file-item">
              <a onClick={() => this._WpsInvoke({
                Index: 'OpenFile',
                // AppType:'wps',
                filepath: item[2],
              })}>{item[1]}</a>
            </div>
          )}
      </>
    );
    return (
      <Row style={{ height: '100%' }}>
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

        {ygpjVisible &&
          <BridgeModel modalProps={ygpjModalProps} onSucess={() => this.onSuccess("操作")}
            onCancel={() => this.setState({ ygpjVisible: false })}
            src={ygpjUrl} />}

        {/*默认信息修改弹窗*/}
        {defMsgModifyModalVisible &&
          <BridgeModel modalProps={editMessageModalProps} onSucess={() => this.onSuccess("信息修改")}
            onCancel={this.closeDefMsgModifyModal}
            src={editMessageUrl} />}

        {/* 付款流程发起弹窗 */}
        {paymentModalVisible && <PaymentProcess paymentModalVisible={paymentModalVisible}
          fetchQueryLifecycleStuff={this.fetchQueryLifecycleStuff}
          currentXmid={Number(this.state.currentXmid) !== 0 ? Number(this.state.currentXmid) : Number(this.props.params.xmid) || Number(this.state.operationListData[0].xmid)}
          closePaymentProcessModal={this.closePaymentProcessModal} />}

        {/*合同信息修改弹窗*/}
        {editMessageVisible && <ContractInfoUpdate
          currentXmid={Number(this.state.currentXmid) !== 0 ? Number(this.state.currentXmid) : Number(this.props.params.xmid) || Number(this.state.operationListData[0].xmid)}
          currentXmmc={currentXmmc}
          editMessageVisible={editMessageVisible}
          closeMessageEditModal={this.closeMessageEditModal}
        ></ContractInfoUpdate>}

        {/*中标信息修改弹窗*/}
        {bidInfoModalVisible && <BidInfoUpdate
          currentXmid={Number(this.state.currentXmid) !== 0 ? Number(this.state.currentXmid) : Number(this.props.params.xmid) || Number(this.state.operationListData[0].xmid)}
          currentXmmc={currentXmmc}
          bidInfoModalVisible={bidInfoModalVisible}
          closeBidInfoModal={this.closeBidInfoModal}
          loginUserId={JSON.parse(sessionStorage.getItem("user")).id}
        ></BidInfoUpdate>}

        {/*阶段信息修改弹窗*/}
        {editModelVisible &&
          <div>
            <BridgeModel modalProps={editModelModalProps} onSucess={() => this.onSuccess("信息修改")}
              onCancel={this.closeModelEditModal}
              src={editModelUrl} /></div>}
        <div style={{ height: '8%', margin: '3.571rem 3.571rem 2.381rem 3.571rem' }}>
          <OperationList fetchQueryLiftcycleMilestone={this.fetchQueryLiftcycleMilestone}
            fetchQueryLifecycleStuff={this.fetchQueryLifecycleStuff}
            fetchQueryOwnerProjectList={this.fetchQueryOwnerProjectList}
            fetchQueryProjectInfoInCycle={this.fetchQueryProjectInfoInCycle}
            data={operationListData}
            totalRows={operationListTotalRows}
            defaultValue={defaultValue}
            projectInfo={projectInfo}
            getCurrentXmid={(xmid) => {
              this.setState({
                currentXmid: xmid
              });
            }} />
        </div>

        <div className='lifecyclemanage-box'>
          {
            basicData.map((item = {}, index) => {
              let detail = [];
              detailData.map((childItem = {}, index) => {
                if (childItem.lcbid === item.lcbid) {
                  detail.push(childItem);
                }
              })
              let sort = this.groupBy(detail);
              return <div className='LifeCycleManage' style={{
                borderTopLeftRadius: (index === 0 ? '1.1904rem' : ''),
                borderTopRightRadius: (index === 0 ? '1.1904rem' : ''),
                borderBottomLeftRadius: (index === basicData.length - 1 ? '1.1904rem' : ''),
                borderBottomRightRadius: (index === basicData.length - 1 ? '1.1904rem' : '')
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
                  <div style={{
                    lineHeight: '2.976rem',
                    width: '33%',
                    minWidth: '59.52rem',
                    fontSize: '2.232rem',
                    fontWeight: 400,
                    color: '#606266',
                    paddingTop: '3.2736rem'
                  }}>
                    <span style={{ color: 'rgba(48, 49, 51, 1)' }}>现计划：{moment(item.yckssj === '0' && item.ycjssj === '0' ? item.kssj : item.yckssj).format('YYYY.MM.DD')} ~ {moment(item.yckssj === '0' && item.ycjssj === '0' ? item.jssj : item.ycjssj).format('YYYY.MM.DD')} </span>
                    {item.yckssj !== '0' && item.ycjssj !== '0' &&
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        // paddingRight: '8.464rem', 
                        fontSize: '2.0832rem',
                        color: '#909399'
                      }}>
                        <span>
                          原计划：{moment(item.kssj).format('YYYY.MM.DD')} ~ {moment(item.jssj).format('YYYY.MM.DD')}
                          （延迟{moment(item.ycjssj).diff(moment(item.yckssj), 'day')}天，修改{item.xgcs}次）
                        </span>
                      </div>
                    }
                  </div>
                  <div className='head4'>
                    项目风险：<ProjectRisk userId={projectInfo?.userid} loginUserId={JSON.parse(sessionStorage.getItem("user")).id} item={item} xmid={this.state.xmid} />
                  </div>
                  <div className='head2'>
                    状态：<ProjectProgress state={item.zt} />
                  </div>
                  <div className='head5'>
                    <div className='head5-title'>
                      <div className='head5-cont'>
                        <a style={{ color: 'rgba(51, 97, 255, 1)', fontSize: '3rem' }}
                          className="iconfont icon-edit" onClick={() => {
                            // const { userId, loginUserId } = this.props;
                            if (Number(projectInfo?.userid) === Number(JSON.parse(sessionStorage.getItem("user")).id)) {
                              this.handleEditModel(item);
                            } else {
                              message.error(`抱歉，只有当前项目经理可以进行该操作`);
                            }
                          }
                          } />
                      </div>
                    </div>
                  </div>
                </div>
                {/*<div>*/}
                {/*  {*/}
                {/*    index !== basicData.length - 1*/}
                {/*    &&*/}
                {/*    <Divider type='vertical' dashed={true} style={{*/}
                {/*      position: 'absolute',*/}
                {/*      height: item?.height?item?.height:'9.55rem',*/}
                {/*      backgroundColor: 'red',*/}
                {/*      marginLeft: '5.952rem',*/}
                {/*      marginTop: '9.52rem',*/}
                {/*      zIndex:999,*/}
                {/*    }}/>*/}
                {/*  }*/}

                {/*</div>*/}
                {
                  item.extend ?
                    <Row style={{
                      height: '80%',
                      width: '100%',
                      padding: (index === basicData.length - 1 ? '0 6.571rem 3.571rem 10.571rem' : '0 6.571rem 0 10.571rem')
                    }} className='card' id={index}>
                      {
                        <Col span={24} style={{
                          width: '100%',
                          padding: '3rem 3rem calc(3rem - 2.3808rem) 3rem',
                          borderRadius: '1.1904rem',
                          maxHeight: '50rem'
                        }}
                          className='cont'>
                          {
                            sort.map((item = {}, index) => {
                              // console.log("index", index)
                              // console.log("item", item)
                              // console.log("sort.length11", (sort.length - 3 <= index) && (index <= sort.length))
                              let num = 0
                              sort[index].List.map((item = {}, ind) => {
                                if (item.zxqk !== " ") {
                                  num = num + 1;
                                }
                              })
                              return <Col span={8} className='cont-col-self' style={{ marginBottom: '2.3808rem' }} key={index}>
                                <div className='cont-col'>
                                  <div className='cont-col1'>
                                    <div className='right'>
                                      {item.swlx}({num}/{sort[index].List.length})
                                    </div>
                                  </div>
                                  <div>
                                    {sort[index].List.map((item = {}, ind) => {
                                      return <Row key={ind} className='cont-row' style={{
                                        // height: ((ind === sort[index].List.length - 1 && (sort.length - 3 <= index) && (index <= sort.length)) ? '2rem' : '5rem'),
                                        // margin: ((ind === sort[index].List.length - 1 && (sort.length - 3 <= index) && (index <= sort.length)) ? '0' : '0 0 1rem 0')
                                        marginTop: ind === 0 ? '2.6784rem' : '2.3808rem'
                                      }}>
                                        <Col span={17}>
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Points status={item.zxqk} />
                                            {/*根据事项类型判断是否是文档*/}
                                            {
                                              item.swlx.includes("文档") ||
                                                item.swlx.includes("信委会") ||
                                                item.swlx.includes("总办会") ||
                                                item.swlx.includes("需求调研") ||
                                                item.swlx.includes("产品设计") ||
                                                item.swlx.includes("系统框架搭建") ||
                                                item.swlx.includes("功能开发") ||
                                                item.swlx.includes("外部系统对接") ||
                                                item.swlx.includes("系统测试") ? (
                                                fileList.length > 0 && fileList[fileList.length - 1][0] === item.sxmc ?
                                                  <Popover
                                                    content={content}
                                                    title="文件列表"
                                                    trigger="hover"
                                                    overlayClassName="popover-filelist"
                                                    visible={this.state.fileListVisible && fileList.length > 0 && fileList[fileList.length - 1][0] === item.sxmc}
                                                    onVisibleChange={this.handleVisibleChange}
                                                  >
                                                    <a className='lifecycle-text-overflow' style={item.zxqk === " " ? { color: '#333' } : { color: 'rgb(51, 97, 255)' }}>{item.sxmc}</a>
                                                  </Popover> :
                                                  <a className='lifecycle-text-overflow' style={item.zxqk === " " ? { color: '#333' } : { color: 'rgb(51, 97, 255)' }} onClick={() => this.handleClick(item)}>{item.sxmc}</a>
                                              )
                                                :
                                                <span className='lifecycle-text-overflow'>{item.sxmc}</span>
                                            }
                                          </div>
                                          <div className='cont-row-zxqk'>{item.zxqk}</div>
                                        </Col>
                                        <Col span={6} style={{ textAlign: 'right' }}>
                                          <Tooltips type={item.swlx}
                                            item={item}
                                            status={item.zxqk}
                                            xmid={xmid}
                                            userId={projectInfo?.userid}
                                            loginUserId={JSON.parse(sessionStorage.getItem("user")).id}
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
