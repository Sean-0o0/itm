import {Collapse, Row, Col, Menu, Dropdown, Tooltip, Empty} from 'antd';
import React from 'react';
import OperationList from './OperationList';
import ProjectRisk from './ProjectRisk';
import Tooltips from './Tooltips';
import Points from './Points';
import Imgs from './Imgs';
import ProjectProgress from './ProjectProgress';
import BridgeModel from "../../Common/BasicModal/BridgeModel";
import {FetchLivebosLink} from '../../../services/amslb/user';
import {message} from 'antd';
import {
  CreateOperateHyperLink,
  FetchQueryLifecycleStuff,
  FetchQueryLiftcycleMilestone, FetchQueryOwnerProjectList
} from "../../../services/pmsServices";

const {Panel} = Collapse;
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
    this.fetchQueryOwnerProjectList();
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

  fetchQueryOwnerProjectList = () => {
    const {params} = this.props;
    FetchQueryOwnerProjectList(
      {
        paging: 1,
        current: 1,
        pageSize: 5,
        total: -1,
        sort: ''
      }
    ).then((ret = {}) => {
      const {record, code} = ret;
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

  //信息录入url
  getFileOutUrl = (params, callBack) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
      if (code === 1) {
        this.setState({
          fillOutUrl: url,
          // fillOutVisible: true,
        });
        window.location.href = url;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //信息录入修改url
  getEditMessageUrl = (params) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
      if (code === 1) {
        this.setState({
          editMessageUrl: url,
          // editMessageVisible: true,
        });
        window.location.href = url;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //阶段信息修改url
  getEditModelUrl = (params) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
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
      const {record = [], code = 0} = ret;
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
      const {code = 0, record = []} = ret;
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
    const {basicData} = this.state;
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
    // this.setState({
    //   fillOutTitle: item.sxmc,
    //   fillOutVisible: true,
    // });
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
    // this.setState({
    //   editMessageTitle: item.sxmc + '修改',
    //   editMessageVisible: true,
    // });
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
        dataArr.push({swlx: mapItem.swlx, List: [mapItem]})
      } else {
        let res = dataArr.some(item => {//判断相同swlx，有就添加到当前项
          if (item.swlx === mapItem.swlx) {
            item.List.push(mapItem)
            return true
          }
        })
        if (!res) {//如果没找相同swlx添加一个新对象
          dataArr.push({swlx: mapItem.swlx, List: [mapItem]})
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
      style: {top: '10rem'},
      visible: uploadVisible,
      footer: null,
    };
    const editModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
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
      height: '100rem',
      title: sendTitle,
      style: {top: '10rem'},
      visible: sendVisible,
      footer: null,
    };
    const fillOutModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '100rem',
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
    const editModelModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '80rem',
      title: editModelTitle,
      style: {top: '10rem'},
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
    return (
      <Row style={{height: 'calc(100% - 4.5rem)'}}>
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
        {/*流程发起弹窗*/}
        {sendVisible &&
        <BridgeModel modalProps={sendModalProps} onSucess={() => this.onSuccess("流程发起")} onCancel={this.closeSendModal}
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
        {/*阶段信息修改弹窗*/}
        {editModelVisible &&
        <BridgeModel modalProps={editModelModalProps} onSucess={() => this.onSuccess("信息修改")}
                     onCancel={this.closeModelEditModal}
                     src={editModelUrl}/>}
        <div style={{height: '8%', margin: '3.571rem 1.571rem 2.381rem 1.571rem'}}>
          <OperationList fetchQueryLiftcycleMilestone={this.fetchQueryLiftcycleMilestone}
                         fetchQueryLifecycleStuff={this.fetchQueryLifecycleStuff}
                         data={operationListData}
                         defaultValue={defaultValue}/>
        </div>
        <div style={{height: '92%', margin: '0 1.571rem 3.571rem 1.571rem'}}>
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
              console.log("sort.length", sort.length);
              // console.log("sort",sort)
              return <div className='LifeCycleManage' style={{
                borderTopLeftRadius: (index === 0 ? '8px' : ''),
                borderTopRightRadius: (index === 0 ? '8px' : ''),
                borderBottomLeftRadius: (index === basicData.length - 1 ? '8px' : ''),
                borderBottomRightRadius: (index === basicData.length - 1 ? '8px' : '')
              }}>
                <div className='head'>
                  <Imgs status={item.zt}/>
                  <i
                    className={item.extend ? 'iconfont icon-fill-down head-icon' : 'iconfont icon-fill-right head-icon'}
                    onClick={() => this.extend(index)}/>&nbsp;
                  <div className='head1'>
                    {item.lcbmc}
                  </div>
                  <div className='head6'>
                    进度：<span style={{color: 'black'}}>{item.jd}</span>
                  </div>
                  <div className='head3'>
                    时间范围：
                    <div
                      style={{color: 'rgba(48, 49, 51, 1)'}}>{item.kssj.slice(0, 4) + '.' + item.kssj.slice(4, 6) + '.' + item.kssj.slice(6, 8)} ~ {item.jssj.slice(0, 4) + '.' + item.jssj.slice(4, 6) + '.' + item.jssj.slice(6, 8)} </div>
                  </div>
                  <div className='head4'>
                    项目风险：<ProjectRisk item={item} xmid={this.state.xmid}/>
                  </div>
                  <div className='head2'>
                    状态：<ProjectProgress state={item.zt}/>
                  </div>
                  <div className='head5'>
                    <div className='head5-title'>
                      <div className='head5-cont'>
                        <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                           className="iconfont icon-edit" onClick={
                          () => this.handleEditModel(item)
                        }/>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  item.extend ?
                    <Row style={{
                      height: '80%',
                      width: '100%',
                      padding: (index === basicData.length - 1 ? '0 3.571rem 3.571rem 3.571rem' : '0 3.571rem')
                    }} className='card'>
                      {
                        <Col span={24} style={{width: '100%', padding: '3rem', borderRadius: '8px', maxHeight: '50rem'}}
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
                              return <Col span={8}>
                                <div className='cont-col'>
                                  <div className='cont-col1'>
                                    <div className='right'>
                                      {item.swlx}({num}/{sort[index].List.length})
                                    </div>
                                  </div>
                                  <div style={{padding: '1.5rem 0 0 0'}}>
                                    {sort[index].List.map((item = {}, ind) => {
                                      return <Row className='cont-row' style={{
                                        height: ((ind === sort[index].List.length - 1 && (sort.length - 3 <= index) && (index <= sort.length)) ? '2rem' : '5rem'),
                                        margin: ((ind === sort[index].List.length - 1 && (sort.length - 3 <= index) && (index <= sort.length)) ? '0' : '0 0 1rem 0')
                                      }}>
                                        <Col span={17} style={{display: 'flex', alignItems: 'center'}}>
                                          <Points status={item.zxqk}/>
                                          {item.sxmc}
                                        </Col>
                                        <Col span={3}>
                                          <Tooltips type={item.swlx}
                                                    item={item}
                                                    status={item.zxqk}
                                                    handleUpload={() => this.handleUpload(item)}
                                                    handleSend={this.handleSend}
                                                    handleFillOut={() => this.handleFillOut(item)}
                                                    handleEdit={() => this.handleEdit(item)}
                                                    handleMessageEdit={this.handleMessageEdit}/>
                                        </Col>
                                        <Col span={3}>
                                          {/*<Dropdown overlay={menu}>*/}
                                          {/*  <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}*/}
                                          {/*     className="iconfont icon-more">*/}
                                          {/*  </i>*/}
                                          {/*</Dropdown>*/}
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

export default LifeCycleManagementTabs;
