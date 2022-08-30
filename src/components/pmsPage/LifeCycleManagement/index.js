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
  getSendUrl = (e) => {
    const params = {
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
          item.extend = item.zxxh === "1";
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
  handleSend = (name) => {
    this.getSendUrl(name);
    this.setState({
      sendTitle: name + '发起',
      // sendUrl: url,
      sendVisible: true,
    });
  };

  //信息录入
  handleFillOut = (name) => {
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
    switch (name) {
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
    }
    this.getFileOutUrl(params)
    this.setState({
      fillOutTitle: name,
      fillOutVisible: true,
    });
  };


  //信息录入修改
  handleMessageEdit = (name) => {
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
    switch (name) {
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
    this.getEditMessageUrl(params);
    this.setState({
      editMessageTitle: name + '修改',
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
        {/*立项流程发起弹窗*/}
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
        <Col span={24} style={{height: '8%', margin: '2rem 0'}}>
          <OperationList fetchQueryLiftcycleMilestone={this.fetchQueryLiftcycleMilestone}
                         fetchQueryLifecycleStuff={this.fetchQueryLifecycleStuff}
                         data={operationListData}
                         defaultValue={defaultValue}/>
        </Col>
        <Col span={24} style={{height: '92%'}}>
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
              // console.log("sort",sort)
              return <div className='LifeCycleManage'>
                <div className='head'>
                  <Imgs status={item.zt}/>
                  <i
                    className={item.extend ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                    onClick={() => this.extend(index)}/>&nbsp;
                  <div className='head1'>
                    {item.lcbmc}
                  </div>
                  <div className='head6'>
                    项目进度：{item.jd}
                  </div>
                  <div className='head3'>
                    时间范围：
                    <div style={{color: 'rgba(48, 49, 51, 1)'}}>{item.kssj} ~ {item.jssj}</div>
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
                        <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                           className="iconfont icon-edit" onClick={
                          () => this.handleEditModel(item)
                        }/>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  item.extend ?
                    <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                      <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                        {
                          sort.length > 3 && sort.length < 7 ? (sort?.slice(0, 2).map((item = {}, index) => {
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
                                  <div style={{padding: '1.5rem 0'}}>
                                    {sort[index].List.map((item = {}, ind) => {
                                      return <Row className='cont-row'>
                                        <Col span={17} style={{display: 'flex'}}>
                                          <Points status={item.zxqk}/>
                                          {item.sxmc}
                                        </Col>
                                        <Col span={3}>
                                          <Tooltips type={item.swlx}
                                                    sxmc={item.sxmc}
                                                    status={item.zxqk}
                                                    handleUpload={() => this.handleUpload(item)}
                                                    handleSend={this.handleSend}
                                                    handleFillOut={this.handleFillOut}
                                                    handleEdit={() => this.handleEdit(item)}
                                                    handleMessageEdit={this.handleMessageEdit}/>
                                        </Col>
                                        <Col span={3}>
                                          <Dropdown overlay={menu}>
                                            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                               className="iconfont icon-more">
                                            </i>
                                          </Dropdown>
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
                            }) && sort?.slice(2, sort.length).map((item = {}, index) => {
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
                                  <div style={{padding: '1.5rem 0'}}>
                                    {sort[index].List.map((item = {}, ind) => {
                                      return <Row className='cont-row'>
                                        <Col span={17} style={{display: 'flex'}}>
                                          <Points status={item.zxqk}/>
                                          {item.sxmc}
                                        </Col>
                                        <Col span={3}>
                                          <Tooltips type={item.swlx}
                                                    sxmc={item.sxmc}
                                                    status={item.zxqk}
                                                    handleUpload={() => this.handleUpload(item)}
                                                    handleSend={this.handleSend}
                                                    handleFillOut={this.handleFillOut}
                                                    handleEdit={() => this.handleEdit(item)}
                                                    handleMessageEdit={this.handleMessageEdit}/>
                                        </Col>
                                        <Col span={3}>
                                          <Dropdown overlay={menu}>
                                            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                               className="iconfont icon-more">
                                            </i>
                                          </Dropdown>
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
                            }))
                            : sort.map((item = {}, index) => {
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
                                  <div style={{padding: '1.5rem 0'}}>
                                    {sort[index].List.map((item = {}, ind) => {
                                      return <Row className='cont-row'>
                                        <Col span={17} style={{display: 'flex'}}>
                                          <Points status={item.zxqk}/>
                                          {item.sxmc}
                                        </Col>
                                        <Col span={3}>
                                          <Tooltips type={item.swlx}
                                                    sxmc={item.sxmc}
                                                    status={item.zxqk}
                                                    handleUpload={() => this.handleUpload(item)}
                                                    handleSend={this.handleSend}
                                                    handleFillOut={this.handleFillOut}
                                                    handleEdit={() => this.handleEdit(item)}
                                                    handleMessageEdit={this.handleMessageEdit}/>
                                        </Col>
                                        <Col span={3}>
                                          <Dropdown overlay={menu}>
                                            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                               className="iconfont icon-more">
                                            </i>
                                          </Dropdown>
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
                    : ''
                }
              </div>
            })
          }
        </Col>
      </Row>
    );
  }
}

export default LifeCycleManagementTabs;
