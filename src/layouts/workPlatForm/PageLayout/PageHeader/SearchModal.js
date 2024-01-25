import { Modal, Form, Input, message, Select, Spin, Icon, Divider, Tooltip } from 'antd';

const { Option } = Select;
import React from 'react';
import { connect } from 'dva';
import searchModalIcon from '../../../../image/pms/searchModal/searchModalIcon@2x.png';
import xmxxIcon from '../../../../image/pms/searchModal/xmxx@2x.png';
import ysxxIcon from '../../../../image/pms/searchModal/ysxx@2x.png';
import gysxxIcon from '../../../../image/pms/searchModal/gysxx@2x.png';
import ryxxIcon from '../../../../image/pms/searchModal/ryxx@2x.png';
import wdxxIcon from '../../../../image/pms/searchModal/wdxx@2x.png';
import { GlobalSearch, QueryUserRole } from '../../../../services/pmsServices';
import { EncryptBase64 } from '../../../../components/Common/Encrypt';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../../../utils/config';
import { throttle, debounce } from 'lodash';

const { api } = config;
const {
  pmsServices: { queryFileStream },
} = api;

class searchModal extends React.Component {
  state = {
    isSpinning: false,
    //标题
    titleDataList: [],
    //项目信息
    xmxxData: [],
    totalrowsXm: 0,
    xmxxDataMoreFlag: false,
    //预算信息
    ysxxData: [],
    totalrowsYs: 0,
    ysxxDataMoreFlag: false,
    //文档信息
    wdxxData: [],
    totalrowsWd: 0,
    wdxxDataMoreFlag: false,
    //供应商信息
    gysxxData: [],
    totalrowsGys: 0,
    gysxxDataMoreFlag: false,
    //人员信息
    ryxxData: [],
    totalrowsRy: 0,
    ryxxDataMoreFlag: false,
    suffixVisable: false,
    //是否搜索过
    isSearch: false,
  };

  timer = null;

  componentDidMount() {
    // this.globalSearch();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  //防抖
  debounce = (fn, waits = 500) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      fn();
    }, waits);
  };

  globalSearch = e => {
    // console.log("String(e.target.value)", String(e.target.value))
    // console.log("String(e.target.value)", e)
    // console.log("String(e.target.value)", String(e.target.value) === "")
    // console.log("111111")
    const key = String(e.target.value);
    e.persist();
    const fn = () => {
      const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
      this.setState({
        keyWord: String(e.target.value),
        isSpinning: true,
      });
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole = '' } = res;
            GlobalSearch({
              content: key,
              current: 1,
              pageSize: 5,
              paging: 1,
              queryType: 'ALL',
              sort: '',
              totalGys: -1,
              totalRy: -1,
              totalWd: -1,
              totalXm: -1,
              totalYs: -1,
              js: zyrole === '暂无' || role.includes('领导') ? role : zyrole,
            })
              .then(res => {
                if (res?.code === 1) {
                  this.setState({
                    isSearch: true,
                  });
                  if (key === '') {
                    // console.log('22222');
                    this.setState({
                      titleDataList: [],
                      //项目信息
                      xmxxData: [],
                      totalrowsXm: 0,
                      xmxxDataMoreFlag: false,
                      //预算信息
                      ysxxData: [],
                      totalrowsYs: 0,
                      ysxxDataMoreFlag: false,
                      //文档信息
                      wdxxData: [],
                      totalrowsWd: 0,
                      wdxxDataMoreFlag: false,
                      //供应商信息
                      gysxxData: [],
                      totalrowsGys: 0,
                      gysxxDataMoreFlag: false,
                      //人员信息
                      ryxxData: [],
                      totalrowsRy: 0,
                      ryxxDataMoreFlag: false,
                    });
                    setTimeout(() => {
                      this.setState({
                        isSpinning: false,
                      });
                    }, 100);
                  } else {
                    const {
                      xmxx,
                      ysxx,
                      wdxx,
                      gysxx,
                      ryxx,
                      totalrowsGys,
                      totalrowsRy,
                      totalrowsWd,
                      totalrowsXm,
                      totalrowsYs,
                    } = res;
                    let titleDataList = [];
                    // let reg = new RegExp("(" + key + ")", "g");
                    let xmxxData = JSON.parse(xmxx);
                    xmxxData.map(item => {
                      return (item.XMMC = item.XMMC.split(key)
                        .flatMap(str => [<span style={{ color: '#3361ff' }}>{key}</span>, str])
                        .slice(1));
                    });
                    let ysxxData = JSON.parse(ysxx);
                    ysxxData.map(item => {
                      return (item.YSXM = item.YSXM.split(key)
                        .flatMap(str => [<span style={{ color: '#3361ff' }}>{key}</span>, str])
                        .slice(1));
                    });
                    let wdxxDataInit = JSON.parse(wdxx);
                    let wdxxData = [];
                    wdxxDataInit.map(item => {
                      const { DFJ = {} } = item;
                      // console.log('DFJ.items', JSON.parse(DFJ));
                      JSON.parse(DFJ).items.length &&
                        JSON.parse(DFJ)?.items.map((i, index) => {
                          // console.log('i', i);
                          const [id, title] = i;
                          if (title.includes(key)) {
                            let wdxxobj = {};
                            wdxxobj.wdid = item.ID;
                            wdxxobj.xmmc = item.XMMC;
                            // wdxxobj.bb =  item.BB
                            wdxxobj.id = id;
                            wdxxobj.titleinit = title;
                            wdxxobj.title = title
                              .split(key)
                              .flatMap(str => [
                                <span style={{ color: '#3361ff' }}>{key}</span>,
                                str,
                              ])
                              .slice(1);
                            wdxxData.push(wdxxobj);
                          }
                        });
                    });
                    // console.log('wdxxDatawdxxData', wdxxData);
                    let gysxxData = JSON.parse(gysxx);
                    gysxxData.map(item => {
                      return (item.GYSMC = item.GYSMC.split(key)
                        .flatMap(str => [<span style={{ color: '#3361ff' }}>{key}</span>, str])
                        .slice(1));
                    });
                    let ryxxData = JSON.parse(ryxx);
                    ryxxData.map(item => {
                      return (item.RYMC = item.RYMC.split(key)
                        .flatMap(str => [<span style={{ color: '#3361ff' }}>{key}</span>, str])
                        .slice(1));
                    });
                    if (xmxxData.length > 0) {
                      titleDataList.push('项目');
                    }
                    if (wdxxData.length > 0) {
                      titleDataList.push('文档');
                    }
                    if (ysxxData.length > 0) {
                      titleDataList.push('预算');
                    }
                    if (gysxxData.length > 0) {
                      titleDataList.push('供应商');
                    }
                    if (ryxxData.length > 0) {
                      titleDataList.push('人员');
                    }
                    this.setState({
                      //标题
                      titleDataList,
                      //项目信息
                      xmxxData,
                      //预算信息
                      ysxxData,
                      //文档信息
                      wdxxData,
                      //供应商信息
                      gysxxData,
                      //人员信息
                      ryxxData,
                      totalrowsGys,
                      totalrowsRy,
                      totalrowsWd,
                      totalrowsXm,
                      totalrowsYs,
                    });
                    setTimeout(() => {
                      this.setState({
                        isSpinning: false,
                      });
                    }, 100);
                  }
                }
              })
              .catch(e => {
                message.error('全局搜索失败', 1);
              });
          }
        })
        .catch(e => {
          message.error('用户信息查询失败', 1);
          console.error('QueryUserRole', e);
          this.setState({
            isSpinning: false,
          });
        });
    };
    this.debounce(fn, 500);
  };

  getMoreRes = (title, type) => {
    const { keyWord } = this.state;
    let params = {
      content: keyWord,
      paging: -1,
      //ALL|全部；XM|项目；WD|文档；YS|预算；GYS|供应商；RY|人员；
      queryType: title,
      sort: '',
      totalGys: -1,
      totalRy: -1,
      totalWd: -1,
      totalXm: -1,
      totalYs: -1,
    };
    if (type === '收起') {
      params.current = 1;
      params.pageSize = 5;
      params.paging = 1;
    }
    const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const { role = '', zyrole = '' } = res;
          params.js = zyrole === '暂无' || role.includes('领导') ? role : zyrole;
          GlobalSearch({ ...params })
            .then(res => {
              if (res?.code === 1) {
                const {
                  xmxx,
                  ysxx,
                  wdxx,
                  gysxx,
                  ryxx,
                  totalrowsGys,
                  totalrowsRy,
                  totalrowsWd,
                  totalrowsXm,
                  totalrowsYs,
                } = res;
                if (title === 'XM') {
                  let xmxxData = JSON.parse(xmxx);
                  xmxxData.map(item => {
                    return (item.XMMC = item.XMMC.split(keyWord)
                      .flatMap(str => [<span style={{ color: '#3361ff' }}>{keyWord}</span>, str])
                      .slice(1));
                  });
                  this.setState({
                    //项目信息
                    xmxxData,
                    xmxxDataMoreFlag: true,
                  });
                }
                if (type === '收起') {
                  this.setState({
                    xmxxDataMoreFlag: false,
                  });
                }
                if (title === 'YS') {
                  let ysxxData = JSON.parse(ysxx);
                  ysxxData.map(item => {
                    return (item.YSXM = item.YSXM.split(keyWord)
                      .flatMap(str => [<span style={{ color: '#3361ff' }}>{keyWord}</span>, str])
                      .slice(1));
                  });
                  this.setState({
                    //项目信息
                    ysxxData,
                    ysxxDataMoreFlag: true,
                  });
                }
                if (type === '收起') {
                  this.setState({
                    ysxxDataMoreFlag: false,
                  });
                }
                if (title === 'WD') {
                  let wdxxDataInit = JSON.parse(wdxx);
                  let wdxxData = [];
                  wdxxDataInit.map(item => {
                    const { DFJ = {} } = item;
                    // console.log('DFJ.items', JSON.parse(DFJ));
                    JSON.parse(DFJ).items.length &&
                      JSON.parse(DFJ)?.items.map((i, index) => {
                        // console.log('i', i);
                        const [id, title] = i;
                        if (title.includes(keyWord)) {
                          let wdxxobj = {};
                          wdxxobj.wdid = item.ID;
                          wdxxobj.xmmc = item.XMMC;
                          // wdxxobj.bb = item.BB
                          wdxxobj.id = id;
                          wdxxobj.titleinit = title;
                          wdxxobj.title = title
                            .split(keyWord)
                            .flatMap(str => [
                              <span style={{ color: '#3361ff' }}>{keyWord}</span>,
                              str,
                            ])
                            .slice(1);
                          wdxxData.push(wdxxobj);
                        }
                      });
                  });
                  // console.log('wdxxDatawdxxData', wdxxData);
                  this.setState({
                    //项目信息
                    wdxxData,
                    wdxxDataMoreFlag: true,
                  });
                }
                if (type === '收起') {
                  this.setState({
                    wdxxDataMoreFlag: false,
                  });
                }
                if (title === 'GYS') {
                  let gysxxData = JSON.parse(gysxx);
                  gysxxData.map(item => {
                    return (item.GYSMC = item.GYSMC.split(keyWord)
                      .flatMap(str => [<span style={{ color: '#3361ff' }}>{keyWord}</span>, str])
                      .slice(1));
                  });
                  this.setState({
                    //项目信息
                    gysxxData,
                    gysxxDataMoreFlag: true,
                  });
                }
                if (type === '收起') {
                  this.setState({
                    gysxxDataMoreFlag: false,
                  });
                }
                if (title === 'RY') {
                  let ryxxData = JSON.parse(ryxx);
                  ryxxData.map(item => {
                    return (item.RYMC = item.RYMC.split(keyWord)
                      .flatMap(str => [<span style={{ color: '#3361ff' }}>{keyWord}</span>, str])
                      .slice(1));
                  });
                  this.setState({
                    //项目信息
                    ryxxData,
                    ryxxDataMoreFlag: true,
                  });
                }
                if (type === '收起') {
                  this.setState({
                    ryxxDataMoreFlag: false,
                  });
                }
              }
            })
            .catch(e => {
              message.error('全局搜索失败', 1);
            });
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryUserRole', e);
      });
  };

  closeModal = () => {
    const { closeModal } = this.props;
    closeModal();
    this.setState({
      isSearch: false,
    });
  };

  downlown = (id, title, wdid) => {
    axios({
      method: 'POST',
      url: queryFileStream,
      responseType: 'blob',
      data: {
        objectName: 'TWD_XM',
        columnName: 'DFJ',
        id: wdid,
        title: title,
        extr: id,
      },
    })
      .then(res => {
        const href = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.download = title;
        a.href = href;
        a.click();
      })
      .catch(err => {
        message.error(err);
      });
  };

  render() {
    const {
      isSpinning,
      //标题
      titleDataList = [],
      //项目信息
      xmxxData = [],
      //预算信息
      ysxxData = [],
      //文档信息
      wdxxData = [],
      //供应商信息
      gysxxData = [],
      //人员信息
      ryxxData = [],
      totalrowsGys,
      totalrowsRy,
      totalrowsWd,
      totalrowsXm,
      totalrowsYs,
      suffixVisable = false,
      xmxxDataMoreFlag = false,
      ysxxDataMoreFlag = false,
      wdxxDataMoreFlag = false,
      gysxxDataMoreFlag = false,
      ryxxDataMoreFlag = false,
      isSearch = false,
    } = this.state;
    const {
      visible,
      dictionary: {},
      closeModal,
      authorities: { TGYS_GYSRYQX, V_GYSRYQX },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Modal
          wrapClassName="searchModal-modify"
          style={{ top: '120px' }}
          width={'860px'}
          title={null}
          mask={false}
          zIndex={9999999}
          bodyStyle={{
            padding: '0',
          }}
          // onOk={e => this.handleFormValidate(e)}
          onCancel={() => this.closeModal()}
          maskClosable={true}
          footer={null}
          visible={visible}
        >
          <Spin
            spinning={isSpinning}
            style={{ maxHeight: '100%' }}
            tip="加载中"
            wrapperClassName="searchModal-box-spin"
          >
            <div>
              <Input
                autoFocus
                className="searchModal-input"
                placeholder="可查询项目、预算、文档、供应商、人员"
                onFocus={() =>
                  this.setState({
                    suffixVisable: true,
                  })
                }
                onBlur={() =>
                  this.setState({
                    suffixVisable: false,
                  })
                }
                onChange={e => this.globalSearch(e)}
                suffix={
                  <i
                    style={{ display: suffixVisable ? '' : 'none', paddingRight: '24px' }}
                    className="iconfont icon-search-name icon-personal"
                  />
                }
              />
              <Divider className="searchModal-divider" />
              {xmxxData?.length > 0 ||
              ysxxData?.length > 0 ||
              wdxxData?.length > 0 ||
              gysxxData?.length > 0 ||
              ryxxData?.length > 0 ? (
                <div className="searchRes-div">
                  <div className="res-title">
                    {titleDataList?.map((item, index) => {
                      // console.log('item', item);
                      return (
                        <>
                          <div className="title">{item}</div>
                          <div className="content-box">
                            {item === '项目' &&
                              xmxxData?.map(xmxx => {
                                return (
                                  <div className="content">
                                    <img className="icon" src={xmxxIcon} />
                                    <Link
                                      style={{ fontWeight: 400, color: '#333333' }}
                                      to={{
                                        pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                                          JSON.stringify({
                                            xmid: xmxx.ID,
                                          }),
                                        )}`,
                                        state: {
                                          // routes: [{ name: '项目列表', pathname: location.pathname }],
                                        },
                                      }}
                                      className="table-link-strong"
                                    >
                                      &nbsp;&nbsp;
                                      <span onClick={() => this.closeModal()}>{xmxx.XMMC}</span>
                                    </Link>
                                  </div>
                                );
                              })}
                            {item === '项目' &&
                              totalrowsXm > 5 &&
                              (xmxxDataMoreFlag ? (
                                <div className="more" onClick={() => this.getMoreRes('XM', '收起')}>
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    收起&nbsp;
                                    <Icon type="up" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ) : (
                                <div className="more" onClick={() => this.getMoreRes('XM')}>
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    更多&nbsp;
                                    <Icon type="down" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ))}
                            {item === '文档' &&
                              wdxxData?.map(wdxx => {
                                return (
                                  <div className="content">
                                    <img className="icon" src={wdxxIcon} />
                                    <Tooltip title={wdxx.title} placement="topLeft">
                                      <a
                                        style={{
                                          fontWeight: 400,
                                          color: '#333',
                                          overflow: 'hidden',
                                          whiteSpace: 'nowrap',
                                          textOverflow: 'ellipsis',
                                        }}
                                        onClick={() =>
                                          this.downlown(wdxx.id, wdxx.titleinit, wdxx.wdid)
                                        }
                                      >
                                        &nbsp;&nbsp;{wdxx.title}
                                      </a>
                                    </Tooltip>
                                    <Tooltip title={wdxx.xmmc} placement="topLeft">
                                      <span
                                        style={{
                                          color: '#c0c4cc',
                                          fontSize: '14px',
                                          overflow: 'hidden',
                                          whiteSpace: 'nowrap',
                                          textOverflow: 'ellipsis',
                                          cursor: 'default',
                                        }}
                                      >
                                        &nbsp;&nbsp;(所属项目：{wdxx.xmmc})
                                      </span>
                                    </Tooltip>
                                  </div>
                                );
                              })}
                            {item === '文档' &&
                              totalrowsWd > 5 &&
                              (wdxxDataMoreFlag ? (
                                <div className="more" onClick={() => this.getMoreRes('WD', '收起')}>
                                  收起&nbsp;
                                  <Icon type="up" className="label-selector-arrow" />
                                </div>
                              ) : (
                                <div className="more" onClick={() => this.getMoreRes('WD')}>
                                  更多&nbsp;
                                  <Icon type="down" className="label-selector-arrow" />
                                </div>
                              ))}
                            {item === '预算' &&
                              ysxxData?.map(ysxx => {
                                return (
                                  <div className="content">
                                    <img className="icon" src={ysxxIcon} />
                                    <Link
                                      style={{ color: '#3361ff' }}
                                      to={{
                                        pathname: `/pms/manage/BudgetDetail/${EncryptBase64(
                                          JSON.stringify({
                                            fromKey: ysxx.YSLX,
                                            budgetID: ysxx.ID,
                                            routes: [],
                                          }),
                                        )}`,
                                        state: { routes: [] },
                                      }}
                                      onClick={() => this.closeModal()}
                                      className="table-link-strong"
                                    >
                                      &nbsp;&nbsp;{ysxx.YSXM}
                                    </Link>
                                  </div>
                                );
                              })}
                            {item === '预算' &&
                              totalrowsYs > 5 &&
                              (ysxxDataMoreFlag ? (
                                <div className="more" onClick={() => this.getMoreRes('YS', '收起')}>
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    收起&nbsp;
                                    <Icon type="up" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ) : (
                                <div className="more" onClick={() => this.getMoreRes('YS')}>
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    更多&nbsp;
                                    <Icon type="down" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ))}
                            {item === '供应商' &&
                              gysxxData?.map(gysxx => {
                                return (
                                  <div className="content">
                                    <img className="icon" src={gysxxIcon} />
                                    <Link
                                      style={{ fontWeight: 400, color: '#333333' }}
                                      to={{
                                        pathname: `/pms/manage/SupplierDetail/${EncryptBase64(
                                          JSON.stringify({ splId: gysxx.ID }),
                                        )}`,
                                        state: {
                                          // routes: [{ name: '供应商列表', pathname: location.pathname }],
                                        },
                                      }}
                                      className="table-link-strong"
                                    >
                                      &nbsp;&nbsp;
                                      <span onClick={() => this.closeModal()}>{gysxx.GYSMC}</span>
                                    </Link>
                                  </div>
                                );
                              })}
                            {item === '供应商' &&
                              totalrowsGys > 5 &&
                              (gysxxDataMoreFlag ? (
                                <div
                                  className="more"
                                  onClick={() => this.getMoreRes('GYS', '收起')}
                                >
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    收起&nbsp;
                                    <Icon type="up" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ) : (
                                <div className="more" onClick={() => this.getMoreRes('GYS')}>
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    更多&nbsp;
                                    <Icon type="down" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ))}
                            {item === '人员' &&
                              ryxxData?.map(ryxx => {
                                return (
                                  <div className="content">
                                    <img className="icon" src={ryxxIcon} />
                                    <Link
                                      to={{
                                        pathname:
                                          '/pms/manage/staffDetail/' +
                                          EncryptBase64(
                                            JSON.stringify({
                                              ryid: ryxx.ID,
                                            }),
                                          ),
                                        state: {
                                          // routes: [{ name: '人员列表', pathname: location.pathname }]
                                        },
                                      }}
                                    >
                                      &nbsp;&nbsp;
                                      <span onClick={() => this.closeModal()}>{ryxx.RYMC}</span>
                                    </Link>
                                  </div>
                                );
                              })}
                            {item === '人员' &&
                              totalrowsRy > 5 &&
                              (ryxxDataMoreFlag ? (
                                <div className="more" onClick={() => this.getMoreRes('RY', '收起')}>
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    收起&nbsp;
                                    <Icon type="up" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ) : (
                                <div className="more" onClick={() => this.getMoreRes('RY')}>
                                  <a style={{ fontWeight: 400, color: '#606266' }}>
                                    更多&nbsp;
                                    <Icon type="down" className="label-selector-arrow" />
                                  </a>
                                </div>
                              ))}
                          </div>
                          <Divider
                            style={{ display: index === titleDataList.length - 1 ? 'none' : '' }}
                            className="content-divider"
                          />
                        </>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="searchModal-div">
                  <div>
                    <img className="searchModal-img" src={searchModalIcon} alt="" />
                  </div>
                  <div style={{ paddingTop: '12px' }}>
                    <span className="searchModal-span">
                      {isSearch ? '暂无数据' : '随时随地，搜索项目相关信息'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(Form.create()(searchModal));
