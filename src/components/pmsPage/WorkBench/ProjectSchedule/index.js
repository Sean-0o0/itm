import { Row, Col, Menu, Divider, message, Empty, Popconfirm, Pagination, Popover, Spin } from 'antd';
import React from 'react';
import icon_wrong from "../../../../image/pms/icon_milepost_wrong.png";
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProjectRisk from "./ProjectRisk";
import icon_normal from "../../../../image/pms/icon_milepost_normal.png";
import icon_waiting from "../../../../image/pms/icon_milepost_waiting.png";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import { EncryptBase64 } from '../../../../components/Common/Encrypt';
import { Link } from "dva/router";
import Tooltips from "../../LifeCycleManagement/Tooltips";
import { FetchLivebosLink } from "../../../../services/amslb/user";
import { OperateCreatProject } from "../../../../services/projectManage";
import {
  CreateOperateHyperLink,
  FetchQueryLifecycleStuff,
  FetchQueryLiftcycleMilestone,
  FetchQueryProjectInfoInCycle,
  FetchQueryWpsWDXX,
} from "../../../../services/pmsServices";
import Points from "../../LifeCycleManagement/Points";
import moment from 'moment';
import { WpsInvoke, WpsClientOpen } from '../../../../js/wpsjsrpcsdk';
import { PluginsUrl } from "../../../../utils/config";
import ContractInfoUpdate from '../../LifeCycleManagement/ContractInfoUpdate';
import BidInfoUpdate from '../../LifeCycleManagement/BidInfoUpdate';
import PaymentProcess from '../../LifeCycleManagement/PaymentProcess';

const PASE_SIZE = 10;
const Loginname = String(JSON.parse(sessionStorage.getItem("user")).loginName);

class ProjectSchedule extends React.Component {
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
    //员工评价开启
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
    //周报填写Url
    weelyReportUrl: '/#/UIProcessor?Table=V_XSZHZBTX&hideTitlebar=true',
    //顶部项目信息
    projectInfo: {},
    //多文档文件列表
    fileList: [],
    fileListVisible: false,
    //付款流程发起弹窗显示
    paymentModalVisible: false,
    color: '',
    fileAddVisible: false,
    fileAddUrl: '/OperateProcessor?operate=TXMXX_XMXX_NEWPROGRAM&Table=TXMXX_XMXX',
    src_fileAdd: `/#/single/pms/SaveProject/${EncryptBase64(JSON.stringify({ xmid: -1, type: true }))}`,
    page: 1,//当前分页
    //合同签署流程发起
    contractSigningVisible: false,
    // //
    // associatedFileVisible: false,
    //项目编码 -合同签署流程发起
    xmbh: '',
  };

  componentDidMount() {
    window.addEventListener('message', this.handleIframePostMessage)
  }

  //获取项目展示信息
  // fetchQueryProjectInfoInCycle = (xmid) => {
  //   FetchQueryProjectInfoInCycle({
  //     xmmc: xmid,
  //   }).then(res => {
  //     this.setState({
  //       projectInfo: res?.record,
  //     });
  //   });
  // };

  //流程发起url
  getSendUrl = (item) => {
    const getParams = (objName, oprName, data, userName) => {
      return {
        "attribute": 0,
        "authFlag": 0,
        "objectName": objName,
        "operateName": oprName,
        "parameter": data,
        "userId": userName,
      }
    }
    let params = getParams("TLC_LCFQ", "TLC_LCFQ_LXSQLCFQ",
      [
        {
          "name": "GLXM",
          "value": item.xmid
        }
      ],
      Loginname
    )
    // if (item.sxmc.includes("合同签署")) {
    //   params = getParams("TLC_LCFQ", "TLC_LCFQ_HTLYY",
    //     [
    //       {
    //         "name": "XMMC",
    //         "value": item.xmid
    //       }
    //     ],
    //     Loginname
    //   )
    // }
    if (item.sxmc.includes("付款")) {
      params = getParams("LC_XMFKLC", "LC_XMFKLC_XMFKLCFQ",
        [
          {
            "name": "XMMC",
            "value": item.xmid
          }
        ],
        Loginname
      )
    }
    if (item.sxmc.includes("软件费用审批流程-有合同")) {
      params = getParams("TLC_LCFQ", "TLC_LCFQ_SUBMIT_RJGMHT",
        [
          {
            "name": "GLXM",
            "value": Number(item.xmid)
          }
        ],
        Loginname
      )
    }
    if (item.sxmc.includes("软件费用审批流程-无合同")) {
      params = getParams("TLC_LCFQ", "TLC_LCFQ_RJGMWHT",
        [
          {
            "name": "GLXM",
            "value": Number(item.xmid)
          }
        ],
        Loginname
      )
    }
    if (item.sxmc.includes("申请餐券")) {
      params = getParams("TLC_LCFQ", "TLC_LCFQ_CQSQLC",
        [
          {
            "name": "GLXM",
            "value": item.xmid
          }
        ],
        Loginname
      )
    }
    if (item.sxmc.includes("申请权限") || item.sxmc.includes("VPN申请流程")) {
      params = getParams("TLC_LCFQ", "TLC_LCFQ_VPNSQ",
        [
          {
            "name": "GLXM",
            "value": item.xmid
          }
        ],
        Loginname
      )
    }
    if (item.sxmc.includes("信委会议案流程")) {
      params = getParams("LC_XWHYALC", "LC_XWHYALC_TAFQ",
        [
          {
            "name": "XMMC",
            "value": item.xmid
          }
        ],
        Loginname
      )
    }
    if (item.sxmc === '会议议案提交') {
      params = getParams("TLC_LCFQ", "TLC_LCFQ_HYYA",
        [
          {
            "name": "GLXM",
            "value": item.xmid
          }
        ],
        Loginname
      )
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
      console.error(!error.success ? error.message : error.note);
    });
  }

  //文档上传/修改url
  getUploadUrl = (item, txt='') => {
    let params = {
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
    if (txt === 'modify') {
      if (item.sxmc === '中标公告') {
        params = {
          attribute: 0,
          authFlag: 0,
          objectName: 'TXMXX_ZBGG',
          operateName: 'TXMXX_ZBGG_Add',
          parameter: [
            {
              name: 'XMMC2',
              value: item.xmid,
            }
          ],
          userId: Loginname,
        };
      }
    } else {
      if (item.sxmc === '中标公告') {
        params = {
          attribute: 0,
          authFlag: 0,
          objectName: 'TXMXX_ZBGG',
          operateName: 'TXMXX_ZBGG_MOD',
          parameter: [
            {
              name: 'XMMC2',
              value: item.xmid,
            }
          ],
          userId: Loginname,
        };
      }
    }
    CreateOperateHyperLink(params).then((ret = {}) => {
      const { code, message, url } = ret;
      if (code === 1) {
        this.setState({
          uploadUrl: url,
        });
      }
    }).catch((error) => {
      console.error(!error.success ? error.message : error.note);
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
      console.error(!error.success ? error.message : error.note);
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
      console.error(!error.success ? error.message : error.note);
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
      console.error(!error.success ? error.message : error.note);
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
      console.error(!error.success ? error.message : error.note);
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
      xmmc: item.xmid
    }).then((ret = {}) => {
      const { code = 0, record = [] } = ret;
      // console.log("WpsWDXXData", record);
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
      console.error(!error.success ? error.message : error.note);
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
      console.error(!error.success ? error.message : error.note);
    });
  }

  onChange = (key) => {
    console.log(key);
  };

  //文档上传
  handleUpload = (item) => {
    this.getUploadUrl(item);
    this.setState({
      uploadVisible: true,
      uploadTitle: item.sxmc + '上传',
      currentXmid: item.xmid,
    });
  };

  //文档上传的修改
  handleEdit = (item) => {
    this.getUploadUrl(item, 'modify');
    this.setState({
      editVisible: true,
      editTitle: item.sxmc + '修改',
      currentXmid: item.xmid,
    });
  };

  //流程发起
  handleSend = (item, xmbh = '') => {
    if (item.sxmc.includes('付款流程')) {
      // this.setState({
      //   paymentModalVisible: true,
      //   currentXmid: item.xmid,
      // });
      message.info('功能开发中，暂时无法使用', 1);
      return;
    }
    //合同签署流程弹窗个性化,不走livebos弹窗了
    if (item.sxmc.includes("合同签署")) {
      let index = this.state.operationListData?.findIndex(x => {
        return Number(x.xmid) === Number(item.xmid)
      })
      this.setState({
        currentXmmc: this.state.operationListData[index].xmmc,
        contractSigningVisible: true,
        xmbh: xmbh,
      }, () => {
        console.log('合同签署 - 项目编号：', this.state.xmbh);
      })
      return;
    }
    this.getSendUrl(item);
    this.setState({
      sendTitle: item.sxmc + '发起',
      sendVisible: true,
      currentXmid: item.xmid,
    });
  };

  //livebos弹窗配置，默认入参值为员工评价开启弹窗的
  handleModalConfig = ({ objName = "View_XMRYPF",
    oprName = "View_XMRYPF_OPENCOMMENT",
    data = [
      {
        "name": "XMMC",
        "value": 0
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
      if (code === 1) {
        this.setState({
          [urlName]: url,
          [visibleName]: true
        });
        // window.location.href = url;
      }
    }).catch((error) => {
      console.error(!error.success ? error.message : error.note);
    });
  }
  //其他
  // handleOther = (item) => {
  //   if (item.sxmc.includes("员工评价开启开启")) {
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
      this.handleModalConfig({
        data: [
          {
            "name": "XMMC",
            "value": item.xmid
          },
        ]
      });
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
            "value": item.xmid
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
            "value": item.xmid
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
            "value": item.xmid
          }
        ],
        "userId": Loginname
      };
    }
    this.getFileOutUrl(params);
    this.setState({
      fillOutTitle: item.sxmc,
      fillOutVisible: true,
      currentXmid: item.xmid,
    });
  };

  //信息修改
  handleMessageEdit = (item) => {
    //获取当前项目名称，打开弹窗
    let index = this.props.data?.findIndex(x => {
      return (Number(x.xmid) === Number(item.xmid));
    })
    this.setState({
      currentXmid: item.xmid,
      currentXmmc: this.props.data[index].xmmc
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
        currentXmmc: this.props.data[index].xmmc
      });
    }
    if (item.sxmc.includes("员工评价开启")) {
      this.handleModalConfig({
        data: [
          {
            "name": "XMMC",
            "value": item.xmid
          },
        ]
      });
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
            "value": item.xmid
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
          "value": item.xmid,
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
      currentXmid: item.xmid,
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
    console.log('刷新数据');
    const { fetchQueryOwnerProjectList, setIsSpinning } = this.props;
    setIsSpinning(true);
    fetchQueryOwnerProjectList(this.state.page);
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
    let name = "WpsOAAssist";
    if (param.filepath.includes(".docx") || param.filepath.includes(".doc") || param.filepath.includes(".DOCX") || param.filepath.includes(".DOC")) {
      clientType = WpsInvoke.ClientType.wps;
      name = "WpsOAAssist";
    }
    if (param.filepath.includes(".xlsx") || param.filepath.includes(".xls")) {
      clientType = WpsInvoke.ClientType.et;
      name = "EtOAAssist";
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
  getUrl = (method, object, params) => {
    FetchLivebosLink({
      method: method,
      object: object,
      params: params
    }).then((ret = {}) => {
      const { data = '' } = ret;
      if (data) {
        return data;
      }
    }).catch((error) => {
      console.error(!error.success ? error.message : error.note);
    });
    return null;
  }
  extend = (number) => {
    const { extend } = this.props;
    extend(number);
  }
  handPageChange = (e) => {
    this.setState({
      page: e,
    })
    const { fetchQueryOwnerProjectList, setIsSpinning } = this.props;
    setIsSpinning(true);
    fetchQueryOwnerProjectList(e)
  }
  handleColorChange = (e) => {
    this.setState({
      color: e,
    })
  }

  handleDraftModify = (xmid) => {
    this.setState({
      fileAddVisible: true,
      src_fileAdd: `/#/single/pms/SaveProject/${EncryptBase64(JSON.stringify({ xmid, type: true, projectStatus: 'SAVE' }))}`,
    })
  }
  handleDraftDelete = (xmid = 0) => {
    OperateCreatProject({
      czr: 0,
      projectName: '',
      projectType: 0,
      projectLabel: '',
      org: '',
      software: 0,
      biddingMethod: 0,
      year: 0,
      budgetProject: 0,
      projectBudget: 0,
      mileposts: [{
        "lcb": "0",
        "kssj": "0",
        "jssj": "0",
      }],
      matters: [{
        "lcb": "0",
        "sxmc": "0",
      }],
      projectManager: 0,
      members: [{
        "rymc": "无",
        "gw": "0",
      }],
      projectId: Number(xmid),
      type: 'DELETE',
      budgetType: "budgetType",
    }).then(res => {
      if (res.code === 1) {
        const { fetchQueryOwnerProjectList, setIsSpinning } = this.props;
        setIsSpinning(true);
        fetchQueryOwnerProjectList(this.state.page);
      }
    }).catch((error) => {
      console.error(!error.success ? error.message : error.note);
    });
  }
  closeFileAddModal = () => {
    this.setState({
      fileAddVisible: false,
    });
  };
  handleIframePostMessage = (event) => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      this.closeFileAddModal();
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      this.closeFileAddModal();
      message.success('保存成功', 1);
      const { fetchQueryOwnerProjectList, setIsSpinning } = this.props;
      setIsSpinning(true);
      fetchQueryOwnerProjectList(this.state.page);
    }
  };

  render() {
    const { data, total, ProjectScheduleDetailData, isSpinning, setIsSpinning } = this.props;
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
      color,
      currentXmid,
      fileAddVisible,
      src_fileAdd,
      page,
      contractSigningVisible,
      xmbh,
    } = this.state;
    //data里是所有的项目名称和id 再调用接口去取项目当前所处阶段信息。
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '50%',
      height: uploadTitle==='中标公告上传'?'50rem':'78rem',
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
      visible: defMsgModifyModalVisible,
      footer: null,
    };
    const editModelModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '60%',
      height: '80rem',
      title: editModelTitle,
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
    const fileAddModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新建项目',
      width: '70%',
      height: '120rem',
      style: { top: '2rem' },
      visible: fileAddVisible,
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
    const getMileStoneName = (xmid) => {
      let temp = ProjectScheduleDetailData?.filter(x => x?.xmid === xmid);
      let arr = (temp && temp[0])?.List;
      return arr && (arr[0])?.lcb;
    }
    const getTagData = (tag) => {
      let arr = [];
      if (tag !== '' && tag !== null && tag !== undefined) {
        if (tag.includes(';')) {
          arr = tag.split(';');
        }
        else {
          arr.push(tag);
        }
      }
      return arr;
    }
    return (
      <Row className='workBench' style={{height: '100%', padding: '24px'}}>
        <div style={{width: '100%', paddingBottom: '16px'}}>
          <div style={{display: 'flex',}}>
            <i style={{color: 'rgba(51, 97, 255, 1)', fontSize: '3.57rem', marginRight: '6.5px'}}
               className="iconfont icon-piechart"/>
            <div style={{height: '10%', fontSize: '2.381rem', fontWeight: 700, color: '#303133',}}>项目进度
            </div>
          </div>
        </div>
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
          currentXmid={Number(currentXmid)}
          closePaymentProcessModal={this.closePaymentProcessModal} />}

        {/*合同信息修改弹窗*/}
        {editMessageVisible && <ContractInfoUpdate
          currentXmid={Number(currentXmid)}
          currentXmmc={currentXmmc}
          editMessageVisible={editMessageVisible}
          closeMessageEditModal={this.closeMessageEditModal}
        ></ContractInfoUpdate>}

        {/*中标信息修改弹窗*/}
        {bidInfoModalVisible && <BidInfoUpdate
          currentXmid={Number(currentXmid)}
          currentXmmc={currentXmmc}
          bidInfoModalVisible={bidInfoModalVisible}
          closeBidInfoModal={this.closeBidInfoModal}
          loginUserId={JSON.parse(sessionStorage.getItem("user")).id}
        ></BidInfoUpdate>}


        {/*合同签署流程弹窗*/}
        {contractSigningVisible && <ContractSigning
          currentXmid={Number(currentXmid)}
          currentXmmc={currentXmmc}
          contractSigningVisible={contractSigningVisible}
          closeContractModal={() => this.setState({ contractSigningVisible: false })}
          onSuccess={() => this.onSuccess("合同签署")}
          xmbh={xmbh}
        ></ContractSigning>}

        {/*阶段信息修改弹窗*/}
        {editModelVisible &&
          <div>
            <BridgeModel modalProps={editModelModalProps} onSucess={() => this.onSuccess("信息修改")}
              onCancel={this.closeModelEditModal}
              src={editModelUrl} /></div>}
        {/* 修改项目弹窗 */}
        {fileAddVisible &&
          <BridgeModel isSpining="customize" modalProps={fileAddModalProps} onCancel={this.closeFileAddModal}
            src={src_fileAdd} />}

        <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'row' }}>
          <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: '100%' }}>
              <Spin tip="加载中" spinning={isSpinning}>
                <div style={{
                  height: '100%',
                  overflowY: 'auto',
                  minHeight: 'calc(100vh - 97.7rem)'
                }}>
                  {
                    data?.map((items = {}, index) => {
                      return <>
                        {items?.zt === '2' ? <>
                            <div className='workBench-draft'>
                              <span className='prj-name'>{items.xmmc}</span>
                              <div className='prj-status'><span>项目状态：</span>草稿</div>
                              <div className='update-delete'>
                                <a onClick={() => this.handleDraftModify(items.xmid)}>编辑</a>
                                <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDraftDelete(items.xmid)}>
                                  <a>删除</a>
                                </Popconfirm>
                              </div>
                            </div>
                            <Divider style={{margin: '16px 0'}}/></> :
                          <div className='workBench-LifeCycleManage'>
                            <div className='head'>
                              <div style={{width: items.extend ? 'calc(20% + 168px)' : '20%', display: 'flex'}}>
                                <i
                                  className={items.extend ? 'iconfont icon-fill-down head-icon' : 'iconfont icon-fill-right head-icon'}
                                  onClick={() => this.extend(index)}/>&nbsp;
                                <div className='head1'>
                                  <a className='head1-link'
                                     style={{color: '#3361FF'}}
                                     onClick={
                                       () => window.location.href = `/#/pms/manage/LifeCycleManagement/${EncryptBase64(JSON.stringify({projectId: items?.xmid}))}`
                                     }
                                  >{items?.xmmc}</a>&nbsp;
                                  {!items.extend ? "" : <span className='head1-span'>（点击名称查看更多）</span>}
                                </div>
                              </div>
                              {items.extend ? <div style={{width: items.extend ? 'calc(20% - 168px)' : '20%'}}></div>
                                : <div className='current-milestone'>
                                  {getMileStoneName(items.xmid) === '项目付款' ? '当前' : moment().isBetween(moment(items?.kssj), moment(items?.jssj)) ? '当前' : '待开始'}里程碑：
                                  <div className='milestone-item'>{getMileStoneName(items.xmid)}</div>
                                </div>}

                              <div className='prj-tags'>
                                {getTagData(items?.bq).length !== 0 && <>项目标签：
                                  {getTagData(items?.bq)?.slice(0, 3).map((x, i) => <div key={i} className='tag-item'>{x}</div>)}
                                  {getTagData(items?.bq)?.length > 3 && <Popover overlayClassName='tag-more-popover' content={(
                                    <div className='tag-more'>
                                      {getTagData(items?.bq)?.slice(3).map((x, i) => <div key={i} className='tag-item'>{x}</div>)}
                                    </div>
                                  )} title={null}>
                                    <div className='tag-item'>...</div>
                                  </Popover>}
                                </>}
                              </div>
                              <div className='head2'>
                                项目进度：
                                <div className='head2-title' style={{
                                  background: 'rgba(51, 97, 255, 0.1)',
                                  color: 'rgba(51, 97, 255, 1)',
                                  // width: '12rem'
                                }}>
                                  <div className='head2-cont' style={{background: 'rgba(51, 97, 255, 1)'}}/>
                                  <div style={{margin: '0 13.5px 0 6.5px'}}>{items.jd}%</div>
                                </div>
                                {/*<ProjectProgress state={items.zt}/>*/}
                              </div>
                              <div className='head4'>
                                项目风险：<ProjectRisk userId={items?.userid}
                                  xmid={items?.xmid}
                                  page={page}
                                  fetchQueryOwnerProjectList={this.props.fetchQueryOwnerProjectList}
                                  setIsSpinning={setIsSpinning}
                                  loginUserId={JSON.parse(sessionStorage.getItem("user")).id}
                                  state={items.fxnr} item={items}
                                  lcbid={((ProjectScheduleDetailData.filter(x => x?.xmid === items.xmid)[0])?.List[0])?.lcbid} />
                              </div>
                            </div>
                            {items.extend ?
                              ProjectScheduleDetailData.map((item = {}, ind) => {
                                let sort = this.groupBy(item?.List);
                                return items?.xmid === item?.xmid &&
                                  <Row style={{height: '80%', width: '100%', padding: '13.5px 0px 0px 31px'}}
                                       className='card'>
                                    <Col span={24} className='cont1'>
                                      <div className='head' style={{borderRadius: '8px 8px 0px 0px'}}>
                                        {/*<img src={icon_wrong} alt="" className='head-img'/>*/}
                                        <div className='head1'>
                                          <i style={{marginLeft: '4px', color: 'rgba(51, 97, 255, 1)'}}
                                             className="iconfont icon-fill-flag"/>&nbsp;
                                          里程碑阶段：
                                          <span style={{color: 'rgba(48, 49, 51, 1)'}}>{item?.List[0]?.lcb}</span>
                                        </div>
                                        <div className='head2'>
                                          <i style={{marginLeft: '4px', color: 'rgba(51, 97, 255, 1)'}}
                                             className="iconfont icon-time"/>&nbsp;
                                          里程碑时间：
                                          <div
                                            style={{ color: 'rgba(48, 49, 51, 1)' }}>{items.kssj.slice(0, 4) + '.' + items.kssj.slice(4, 6) + '.' + items.kssj.slice(6, 8)} ~ {items.jssj.slice(0, 4) + '.' + items.jssj.slice(4, 6) + '.' + items.jssj.slice(6, 8)} </div>
                                        </div>
                                      </div>
                                    </Col>
                                    <Col span={24}
                                      style={{
                                        width: '100%',
                                        padding: '20px 20px 4px 20px',
                                        borderRadius: '0 0 8px 8px',
                                        maxHeight: '336px'
                                      }}
                                      className='cont2'>
                                      {
                                        sort.map((item = {}, index) => {
                                          let num = 0
                                          sort[index].List.map((item = {}, ind) => {
                                            if (item.zxqk !== " ") {
                                              num = num + 1;
                                            }
                                          })
                                          return <Col span={8} style={{marginBottom: '16px'}}>
                                            <div className='cont-col'>
                                              <div className='cont-col1'>
                                                <div className='right'>
                                                  {item.swlx}({num}/{sort[index].List.length})
                                                </div>
                                              </div>
                                              <div>
                                                {sort[index].List.map((item = {}, ind) => {
                                                  return <Row className='cont-row' style={{
                                                    marginTop: ind === 0 ? '18px' : '16px',
                                                    height: '31px'
                                                  }}>
                                                    <Col span={18}>
                                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Points status={item.zxqk} />
                                                        <span>{item.sxmc}</span>
                                                      </div>
                                                      <div className='cont-row-zxqk'>{item.zxqk}</div>
                                                    </Col>
                                                    <Col span={6}>
                                                      <Tooltips type={item.swlx}
                                                        xmid={item.xmid}
                                                        item={item}
                                                        userId={items.userid}
                                                        status={item.zxqk}
                                                        xmbh={items.xmbh}
                                                        xwhid={items.xwhid}
                                                        handleUpload={() => this.handleUpload(item)}
                                                        handleSend={this.handleSend}
                                                        handleFillOut={() => this.handleFillOut(item)}
                                                        handleEdit={() => this.handleEdit(item)}
                                                        handleMessageEdit={this.handleMessageEdit} />
                                                    </Col>
                                                    <div className='cont-row1'>
                                                      <div className='left'>
                                                        {/*//2022.06.17上传*/}
                                                      </div>
                                                    </div>
                                                  </Row>
                                                })}
                                              </div>
                                            </div>
                                          </Col>
                                        })
                                      }
                                    </Col>
                                  </Row>
                              })
                              : ''
                            }
                            <Divider style={{margin: '16px 0'}}/>
                          </div>}
                      </>
                    })
                  }
                  {!isSpinning && data?.length === 0 && <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 97.7rem)'
                  }}><Empty description='暂无项目'/></div>}
                </div>
              </Spin>
              <div style={{height: '10%', marginBottom: '6.5px'}}>
                <Pagination
                  style={{textAlign: 'end', fontSize: '2.083rem'}}
                  total={total}
                  size="small"
                  showTotal={total => `共 ${total} 条`}
                  defaultPageSize={5}
                  onChange={this.handPageChange}
                  defaultCurrent={1}
                />
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    );
  }
}

export default ProjectSchedule;
