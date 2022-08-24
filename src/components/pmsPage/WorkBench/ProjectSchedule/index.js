import {Row, Col, Tooltip, Dropdown, Menu, Pagination, Divider, message,} from 'antd';
import React from 'react';
import icon_wrong from "../../../../image/pms/icon_milepost_wrong.png";
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProjectRisk from "../../LifeCycleManagement/ProjectRisk";
import icon_normal from "../../../../image/pms/icon_milepost_normal.png";
import icon_waiting from "../../../../image/pms/icon_milepost_waiting.png";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import {Link} from "dva/router";
import Tooltips from "../../LifeCycleManagement/Tooltips";
import {FetchLivebosLink} from "../../../../services/amslb/user";
import {CreateOperateHyperLink} from "../../../../services/pmsServices";

class ProjectSchedule extends React.Component {
  state = {
    //上传弹窗
    uploadVisible: false,
    //上传url
    uploadUrl: '/OperateProcessor?operate=TWD_XM_INTERFACE_UPLODC&Table=TWD_XM',
    //修改弹窗
    editVisible: false,
    //修改url
    editUrl: '/OperateProcessor?operate=TWD_XM_XWHJY&Table=TWD_XM',
    //立项流程发起弹窗
    sendVisible: false,
    //立项流程发起url
    sendUrl: '/OperateProcessor?operate=TLC_LCFQ_LXSQLCFQ&Table=TLC_LCFQ',
    //信息录入
    fillOutVisible: false,
    //信息录入url
    fillOutUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
    //信息修改
    editMessageVisible: false,
    //信息修改url
    editMessageUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
  };

  componentDidMount() {
  }

  //文档上传
  handleUpload = (item) => {
    this.getUploadUrl(item);
    this.setState({
      uploadVisible: true,
    });
  };

  //文档上传的修改
  handleEdit = (item) => {
    this.getUploadUrl(item);
    this.setState({
      editVisible: true,
    });
  };

  //流程发起
  handleSend = () => {
    this.getSendUrl();
    this.setState({
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
      "userId": ""
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
          "userId": ""
        };
        break;
    }
    this.getFileOutUrl(params)
    this.setState({
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
      "userId": ""
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
          "userId": ""
        };
        break;
    }
    this.getEditMessageUrl(params)
    this.setState({
      editMessageVisible: true,
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
      "userId": ""
    }
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
      if (code === 1) {
        this.setState({
          sendUrl: url,
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
      "userId": ""
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
  getFileOutUrl = (params) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
      if (code === 1) {
        this.setState({
          fillOutUrl: url,
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

  getUrl = (method, object, params) => {
    FetchLivebosLink({
      method: method,
      object: object,
      params: params
    }).then((ret = {}) => {
      const {data = ''} = ret;
      if (data) {
        return data;
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    return null;
  }

  //成功回调
  onSuccess = () => {

  }


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

  extend = (number) => {
    const {extend} = this.props;
    extend(number);
  }

  render() {
    const {data, total, ProjectScheduleDetailData} = this.props;
    const {
      uploadVisible,
      editVisible,
      sendVisible,
      uploadUrl,
      editUrl,
      sendUrl,
      extend1,
      extend2,
      extend3,
      extend4,
      extend5,
    } = this.state;
    //data里是所有的项目名称和id 再调用接口去取项目当前所处阶段信息。
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
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '上传',
      style: {top: '20rem'},
      visible: uploadVisible,
      footer: null,
    };
    const editModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '68rem',
      title: '修改',
      style: {top: '20rem'},
      visible: editVisible,
      footer: null,
    };
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '150rem',
      height: '100rem',
      title: '发起流程',
      style: {top: '10rem'},
      visible: sendVisible,
      footer: null,
    };
    const src_upload = localStorage.getItem('livebos') + uploadUrl;
    const src_edit = localStorage.getItem('livebos') + editUrl;
    const src_send = localStorage.getItem('livebos') + sendUrl;
    return (
      <Row className='workBench' style={{height: '100%', margin: '3rem'}}>
        {/*上传弹窗*/}
        {uploadVisible &&
        <BridgeModel modalProps={uploadModalProps} onSucess={this.onSuccess} onCancel={this.closeUploadModal}
                     src={src_upload}/>}
        {/*修改弹窗*/}
        {editVisible &&
        <BridgeModel modalProps={editModalProps} onSucess={this.onSuccess} onCancel={this.closeEditModal}
                     src={src_edit}/>}
        {/*立项流程发起弹窗*/}
        {sendVisible &&
        <BridgeModel modalProps={sendModalProps} onSucess={this.onSuccess} onCancel={this.closeSendModal}
                     src={src_send}/>}
        <Col span={24} style={{height: '74%', overflowY: 'auto'}}>
          {
            data.map((items = {}, index) => {
              return <div className='LifeCycleManage'>
                <div className='head'>
                  <i
                    className={items.extend ? 'iconfont icon-down-solid-arrow head-icon' : 'iconfont icon-right head-icon'}
                    onClick={() => this.extend(index)}/>&nbsp;
                  <div className='head1'>
                    <Link style={{color: '#1890ff'}} to={{
                      pathname: '/pms/manage/LifeCycleManagement',
                      query: {xmid: items.xmid},
                    }}>{items.xmmc}</Link>
                  </div>
                  <div className='head3'>
                    {/*时间范围：*/}
                    {/*<div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>*/}
                  </div>
                  <div className='head2'>
                    项目进度：<ProjectProgress state={items.zt}/>
                  </div>
                  <div className='head4'>
                    项目风险：<ProjectRisk state={items.fxnr}/>
                  </div>
                </div>
                {items.extend ?
                  ProjectScheduleDetailData.map((item = {}, ind) => {
                    let sort = this.groupBy(item);
                    return items?.xmid === item[0]?.xmid &&
                      <Row style={{height: '80%', width: '100%', padding: '0 8rem 2rem 8rem'}} className='card'>
                        <Col span={24} style={{width: '100%', padding: '3rem'}} className='cont'>
                          <div className='head'>
                            {/*<img src={icon_wrong} alt="" className='head-img'/>*/}
                            <div className='head1'>
                              里程碑阶段：
                              <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                 className="iconfont icon-fill-flag"/>&nbsp;
                              <span style={{color: 'rgba(48, 49, 51, 1)'}}>{item[0].lcb}</span>
                            </div>
                            <div className='head2'>
                              里程碑时间：
                              <div style={{color: 'rgba(48, 49, 51, 1)'}}>{items.kssj} ~ {items.jssj}5</div>
                            </div>
                          </div>
                          {
                            sort.length > 3 && sort.length < 7 ? (sort?.slice(0, 2).map((item = {}, number) => {
                              let num = 0
                              sort[number].List.map((item = {}, ind) => {
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
                                    {sort[number].List.map((item = {}, ind) => {
                                      return <Row className='cont-row'>
                                        <Col span={17} style={{display: 'flex'}}>
                                          <div className='cont-row-point'
                                               style={{background: 'rgba(192, 196, 204, 1)'}}/>
                                          {item.sxmc}
                                        </Col>
                                        <Col span={3}>
                                          <Tooltips type={item.swlx}
                                                    swmc={item.swmc}
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
                                        {/*<div className='cont-row1'>*/}
                                        {/*  <div className='left'>*/}
                                        {/*    2022.06.17上传*/}
                                        {/*  </div>*/}
                                        {/*</div>*/}
                                      </Row>
                                    })
                                    }
                                  </div>
                                </div>
                              </Col>
                            })) && sort?.slice(2, sort.length).map((item = {}, number) => {
                              let num = 0
                              sort[number].List.map((item = {}, ind) => {
                                if (item.zxqk !== " ") {
                                  num = num + 1;
                                }
                              })
                              return <Col span={8}>
                                <div className='cont-col'>
                                  <div className='cont-col1'>
                                    <div className='right'>
                                      {item.swlx}({num}/{sort[number].List.length})
                                    </div>
                                  </div>
                                  <div style={{padding: '1.5rem 0'}}>
                                    {sort[number].List.map((item = {}, ind) => {
                                      return <Row className='cont-row'>
                                        <Col span={17} style={{display: 'flex'}}>
                                          <div className='cont-row-point'
                                               style={{background: 'rgba(192, 196, 204, 1)'}}/>
                                          {item.sxmc}
                                        </Col>
                                        <Col span={3}>
                                          <Tooltip title="上传">
                                            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                               className="iconfont icon-upload"
                                               onClick={() => this.handleUpload("标前会议纪要扫描件")}/>
                                          </Tooltip>
                                        </Col>
                                        <Col span={3}>
                                          <Dropdown overlay={menu}>
                                            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                               className="iconfont icon-more">
                                            </i>
                                          </Dropdown>
                                        </Col>
                                        {/*<div className='cont-row1'>*/}
                                        {/*  <div className='left'>*/}
                                        {/*    2022.06.17上传*/}
                                        {/*  </div>*/}
                                        {/*</div>*/}
                                      </Row>
                                    })
                                    }
                                  </div>
                                </div>
                              </Col>
                            }) : sort.map((item = {}, number) => {
                              let num = 0
                              sort[number].List.map((item = {}, ind) => {
                                if (item.zxqk !== " ") {
                                  num = num + 1;
                                }
                              })
                              return <Col span={8}>
                                <div className='cont-col'>
                                  <div className='cont-col1'>
                                    <div className='right'>
                                      {item.swlx}({num}/{sort[number].List.length})
                                    </div>
                                  </div>
                                  <div style={{padding: '1.5rem 0'}}>
                                    {sort[number].List.map((item = {}, ind) => {
                                      return <Row className='cont-row'>
                                        <Col span={17} style={{display: 'flex'}}>
                                          <div className='cont-row-point'
                                               style={{background: 'rgba(192, 196, 204, 1)'}}/>
                                          {item.sxmc}
                                        </Col>
                                        <Col span={3}>
                                          <Tooltip title="上传">
                                            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                               className="iconfont icon-upload"
                                               onClick={() => this.handleUpload("标前会议纪要扫描件")}/>
                                          </Tooltip>
                                        </Col>
                                        <Col span={3}>
                                          <Dropdown overlay={menu}>
                                            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                                               className="iconfont icon-more">
                                            </i>
                                          </Dropdown>
                                        </Col>
                                      </Row>
                                    })
                                    }
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
                <Divider/>
              </div>
            })
          }
        </Col>
        <Pagination
          style={{textAlign: 'end'}}
          total={5}
          showTotal={total => `共 ${total} 条`}
          defaultPageSize={5}
          showQuickJumper={true}
          defaultCurrent={1}
        />
      </Row>
    );
  }
}

export default ProjectSchedule;
