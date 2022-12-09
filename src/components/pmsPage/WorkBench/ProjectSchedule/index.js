import { Row, Col, Tooltip, Dropdown, Menu, Pagination, Divider, message, } from 'antd';
import React from 'react';
import icon_wrong from "../../../../image/pms/icon_milepost_wrong.png";
import ProjectProgress from "../../LifeCycleManagement/ProjectProgress";
import ProjectRisk from "./ProjectRisk";
import icon_normal from "../../../../image/pms/icon_milepost_normal.png";
import icon_waiting from "../../../../image/pms/icon_milepost_waiting.png";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";
import { Link } from "dva/router";
import Tooltips from "../../LifeCycleManagement/Tooltips";
import { FetchLivebosLink } from "../../../../services/amslb/user";
import { CreateOperateHyperLink } from "../../../../services/pmsServices";
import Points from "../../LifeCycleManagement/Points";

const Loginname = localStorage.getItem("firstUserID");

class ProjectSchedule extends React.Component {
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
    editModelUrl: '/OperateProcessor?operate=TXMXX_XMXX_INTERFACE_MODOTHERINFO&Table=TXMXX_XMXX&XMID=5&LCBID=18',
    editModelTitle: '',
    editModelVisible: false,
    color: '',
  };

  componentDidMount() {
  }

  //文档上传
  handleUpload = (item) => {
    console.log("11111")
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
    this.getSendUrl(item);
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
          "value": item.xmid
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
              "value": item.xmid
            },
          ],
          "userId": Loginname
        };
        break;
      case "中标信息录入":
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
          "value": item.xmid
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
              "value": item.xmid
            },
          ],
          "userId": Loginname
        };
        break;
    }
    switch (item.sxmc) {
      case "中标信息录入":
        params = {
          "attribute": 0,
          "authFlag": 0,
          "objectName": "View_TBXX",
          "operateName": "View_TBXX_INTERFACE_MOD",
          "parameter": [
            {
              "name": "XMMC2",
              "value": item.xmid
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

  //流程发起url
  getSendUrl = (item) => {
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "TLC_LCFQ",
      "operateName": "TLC_LCFQ_LXSQLCFQ",
      "parameter": [
        {
          "name": "GLXM",
          "value": item.xmid
        }
      ],
      "userId": Loginname,
    }
    if (item.sxmc.includes("合同签署")) {
      params = {
        "attribute": 0,
        "authFlag": 0,
        "objectName": "TLC_LCFQ",
        "operateName": "TLC_LCFQ_HTLYY",
        "parameter": [
          {
            "name": "XMMC",
            "value": item.xmid
          },
        ],
        "userId": Loginname,
      }
    }
    if (item.sxmc.includes("付款")) {
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
    console.log("itemitemitem", item)
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
        window.location.href = url;
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
      const { data = '' } = ret;
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
    message.success(name + "成功");
    // this.reflush();
  }


  groupBy = (arr) => {
    console.log("arrarr", arr);
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
    console.log("dataArrdataArr", dataArr);
    return dataArr;
  }

  extend = (number) => {
    const { extend } = this.props;
    extend(number);
  }

  handPageChange = (e) => {
    this.setState({
      page: e,
    })
    const { fetchQueryOwnerProjectList } = this.props;
    fetchQueryOwnerProjectList(e)
  }

  handleColorChange = (e) => {
    this.setState({
      color: e,
    })
  }

  render() {
    const { data, total, ProjectScheduleDetailData } = this.props;
    // console.log("data", data);
    // console.log("DetailData", ProjectScheduleDetailData);
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
      color,
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
      title: uploadTitle,
      style: { top: '20rem' },
      visible: uploadVisible,
      footer: null,
    };
    const editModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '68rem',
      title: editTitle,
      style: { top: '20rem' },
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
      width: '120rem',
      height: '80rem',
      title: fillOutTitle,
      style: { top: '10rem' },
      visible: fillOutVisible,
      footer: null,
    };
    return (
      <Row className='workBench' style={{ height: '70rem', padding: '3.571rem' }}>
        <div style={{ width: '100%', lineHeight: '3.571rem', paddingBottom: '2.381rem' }}>
          <div style={{ display: 'flex', }}>
            <i style={{ color: 'rgba(51, 97, 255, 1)', fontSize: '3.57rem', marginRight: '1rem' }}
              className="iconfont icon-piechart" />
            <div style={{ height: '10%', fontSize: '2.381rem', fontWeight: 700, color: '#303133', }}>项目进度
            </div>
          </div>
        </div>
        {/*上传弹窗*/}
        {uploadVisible &&
          <BridgeModel modalProps={uploadModalProps} onSucess={() => this.onSuccess("文档上传")}
            onCancel={this.closeUploadModal}
            src={uploadUrl} />}
        {/*修改弹窗*/}
        {editVisible &&
          <BridgeModel modalProps={editModalProps} onSucess={() => this.onSuccess("文档上传修改")}
            onCancel={this.closeEditModal}
            src={uploadUrl} />}
        {/*立项流程发起弹窗*/}
        {sendVisible &&
          <BridgeModel modalProps={sendModalProps} onSucess={() => this.onSuccess("流程发起")} onCancel={this.closeSendModal}
            src={sendUrl} />}
        {/*信息录入弹窗*/}
        {fillOutVisible &&
          <BridgeModel modalProps={fillOutModalProps} onSucess={() => this.onSuccess("信息录入")}
            onCancel={this.closeFillOutModal}
            src={fillOutUrl} />}
        <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'row', }}>
          <Col xs={24} sm={24} lg={24} xl={24} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: '100%' }}>
              <div style={{ height: '70rem', overflowY: 'auto' }}>
                {
                  data.map((items = {}, index) => {
                    return <div className='workBench-LifeCycleManage'>
                      <div className='head'>
                        <i
                          className={items.extend ? 'iconfont icon-fill-down head-icon' : 'iconfont icon-fill-right head-icon'}
                          onClick={() => this.extend(index)} />&nbsp;
                        {/* <div className='head1' onMouseOver={() => this.handleColorChange("#3361FF")}
                             onMouseLeave={() => this.handleColorChange('')}>
                          <Link style={{color: color}} to={{
                            pathname: '/pms/manage/LifeCycleManagement',
                            query: {xmid: items.xmid},
                          }}>{items.xmmc}</Link>&nbsp;
                          <i
                            className={'iconfont icon-right'}
                            style={{fontSize: '2.381rem', color: color}}
                          />
                        </div> */}
                        <div className='head1'>
                          <Link className='head1-link' to={{
                            pathname: '/pms/manage/LifeCycleManagement',
                            query: { xmid: items.xmid },
                          }}>{items.xmmc}</Link>&nbsp;
                          <i
                            className={'iconfont icon-right'}
                            style={{ fontSize: '2.381rem' }}
                          />
                        </div>
                        <div className='head3'>
                          {/*时间范围：*/}
                          {/*<div style={{color: 'rgba(48, 49, 51, 1)'}}>2022.05.10 ~ 2022.06.15</div>*/}
                        </div>
                        <div className='head2'>
                          项目进度：
                          <div className='head2-title' style={{
                            background: 'rgba(51, 97, 255, 0.1)',
                            color: 'rgba(51, 97, 255, 1)',
                            // width: '12rem'
                          }}>
                            <div className='head2-cont' style={{ background: 'rgba(51, 97, 255, 1)' }} />
                            <div style={{ margin: '0rem 2rem 0rem 1rem' }}>{items.jd}%</div>
                          </div>
                          {/*<ProjectProgress state={items.zt}/>*/}
                        </div>
                        <div className='head4'>
                          项目风险：<ProjectRisk state={items.fxnr} item={items}
                            lcbid={ProjectScheduleDetailData[0]?.List[0]?.lcbid} />
                        </div>
                      </div>
                      {items.extend ?
                        ProjectScheduleDetailData.map((item = {}, ind) => {
                          let sort = this.groupBy(item?.List);
                          return items?.xmid === item?.xmid &&
                            <Row style={{ height: '80%', width: '100%', padding: '2rem 0px 0px 4.6rem' }}
                              className='card'>
                              <Col span={24} className='cont1'>
                                <div className='head' style={{ borderRadius: '8px 8px 0px 0px' }}>
                                  {/*<img src={icon_wrong} alt="" className='head-img'/>*/}
                                  <div className='head1'>
                                    <i style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)' }}
                                      className="iconfont icon-fill-flag" />&nbsp;
                                    里程碑阶段：
                                    <span style={{ color: 'rgba(48, 49, 51, 1)' }}>{item?.List[0]?.lcb}</span>
                                  </div>
                                  <div className='head2'>
                                    <i style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)' }}
                                      className="iconfont icon-time" />&nbsp;
                                    里程碑时间：
                                    <div
                                      style={{ color: 'rgba(48, 49, 51, 1)' }}>{items.kssj.slice(0, 4) + '.' + items.kssj.slice(4, 6) + '.' + items.kssj.slice(6, 8)} ~ {items.jssj.slice(0, 4) + '.' + items.jssj.slice(4, 6) + '.' + items.jssj.slice(6, 8)} </div>
                                  </div>
                                </div>
                              </Col>
                              <Col span={24}
                                style={{
                                  width: '100%',
                                  padding: '3rem 3rem calc(3rem - 16px) 3rem',
                                  borderRadius: '0 0 8px 8px',
                                  maxHeight: '50rem'
                                }}
                                className='cont2'>
                                {
                                  sort.map((item = {}, index) => {
                                    console.log('item', item);
                                    // console.log("index", index)
                                    // console.log("sort.length", sort.length)
                                    // console.log("sort.length11", (sort.length - 3 <= index) && (index <= sort.length))
                                    let num = 0
                                    sort[index].List.map((item = {}, ind) => {
                                      if (item.zxqk !== " ") {
                                        num = num + 1;
                                      }
                                    })
                                    return <Col span={8} style={{ marginBottom: '16px' }}>
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
                                              <Col span={17}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                  <Points status={item.zxqk} />
                                                  <span>{item.sxmc}</span>
                                                </div>
                                                <div className='cont-row-zxqk'>{item.zxqk}</div>
                                              </Col>
                                              <Col span={3}>
                                                <Tooltips type={item.swlx}
                                                  item={item}
                                                  status={item.zxqk}
                                                  handleUpload={() => this.handleUpload(item)}
                                                  handleSend={this.handleSend}
                                                  handleFillOut={() => this.handleFillOut(item)}
                                                  handleEdit={() => this.handleEdit(item)}
                                                  handleMessageEdit={this.handleMessageEdit} />
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
                            </Row>
                        })
                        : ''
                      }
                      <Divider style={{ margin: '2.381rem 0' }} />
                    </div>
                  })
                }
              </div>
              <div style={{ height: '10%', marginBottom: '1rem' }}>
                <Pagination
                  style={{ textAlign: 'end', fontSize: '2.083rem' }}
                  total={total}
                  size="small"
                  showTotal={total => `共 ${total} 条`}
                  defaultPageSize={5}
                  onChange={this.handPageChange}
                  // showQuickJumper={true}
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
