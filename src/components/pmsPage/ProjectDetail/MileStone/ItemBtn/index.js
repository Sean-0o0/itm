import React from 'react';
import {
  CreateOperateHyperLink,
  FetchQueryHTXXByXQTC,
  FetchQueryOAUrl,
  FetchQueryOwnerWorkflow,
  FetchQueryWpsWDXX,
  GetApplyListProvisionalAuth,
  QueryIteContractFlow,
  QueryXCContractInfo,
  RemindSubProjectFinish,
} from '../../../../../services/pmsServices';
import BridgeModel from '../../../../Common/BasicModal/BridgeModel';
import { message, Popover, Modal, Spin, Tooltip, Empty, Icon } from 'antd';
import config from '../../../../../utils/config';
import axios from 'axios';
import BidInfoUpdate from '../../../LifeCycleManagement/BidInfoUpdate';
import AssociatedFile from '../../../LifeCycleManagement/AssociatedFile';
import ContractSigning from '../../../LifeCycleManagement/ContractSigning';
import ContractInfoUpdate from '../../../LifeCycleManagement/ContractInfoUpdate';
import PaymentProcess from '../../../LifeCycleManagement/PaymentProcess';
import { EncryptBase64 } from '../../../../Common/Encrypt';
import EnterBidInfoModel from '../../../HardwareItems/EnterBidInfoModel';
import AgreementEnterModel from '../../../HardwareItems/AgreementEnterModel';
import PollResultEnterModel from '../../../HardwareItems/PollResultEnterModel';
import DemandInitiated from '../../../HardwareItems/DemandInitiated';
import EditBidInfoModel from '../../../HardwareItems/EditBidInfoModel';
import IterationContract from './IterationContract';
import AssociationContract from './AssociationContract';
import { FetchQueryHardwareTendersAndContract } from '../../../../../services/projectManage';
import SoftwarePaymentWHT from './SoftwarePaymentWHT';
import AssociationInitiatedProcess from './AssociationInitiatedProcess';
import SoftwarePaymentYHT from './SoftwarePaymentYHT';
import AssociationOAContract from './AssociationOAContract';
import ProjectApprovalApplicate from './ProjectApprovalApplicate';
import BidInfoMod from './BidInfoMod';

const { api } = config;
const { confirm } = Modal;
const {
  pmsServices: { getStreamByLiveBos },
} = api;
let timer = null;

class ItemBtn extends React.Component {
  state = {
    //Livebos弹窗
    lbModalUrl: '#',
    lbModalTitle: '',
    //上传弹窗
    uploadVisible: false,
    //流程发起弹窗
    sendVisible: false,
    //信息录入修改
    xxlrxgVisible: false,
    //员工评价开启
    ygpjVisible: false,
    //信息修改
    editMessageVisible: false, //合同
    bidInfoModalVisible: false, //中标
    bidInfoMod: {
      visible: false,
      type: 'ADD',
      xmid: -1,
    }, //中标
    contractInfoMod_RLFWRW: {
      visible: false,
      type: 'ADD',
      xmid: -1,
    }, //合同
    //信息修改url
    editMessageUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
    editModelUrl:
      '/OperateProcessor?operate=TXMXX_XMXX_INTERFACE_MODOTHERINFO&Table=TXMXX_XMXX&XMID=5&LCBID=18',
    editModelVisible: false,
    //付款流程发起弹窗显示
    paymentModalVisible: false,
    //合同签署流程发起
    contractSigningVisible: false,
    //信委会立案流程查看
    xwhyaModalVisible: false,
    src: '',
    hardWareBidModalVisible: false,
    hardWareContrastModalVisible: false,
    xbjglrModalVisible: false,
    xqfqModalVisible: false, //需求发起
    currentFileList: [], //查看的文档列表
    fileLoading: false, //获取查看的文档列表的加载状态
    fklcLoading: false, //获取付款流程列表的加载状态
    jumpLoading: false, //付款流程列表跳转加载状态
    currentFklcList: [], //查看的付款流程列表
    oackzttxVisible: false, //oa流程查看-异常填写弹窗
    oackzttxPopoverVisible: false, //oa流程查看-Popover弹窗
    fklcPopoverVisible: false, //oa流程查看-Popover弹窗
    ddhtxxlr: {
      visible: false, //弹窗显隐
      xmid: -1,
      type: 'ADD',
    }, //迭代合同信息录入弹窗
    rjhtxxData: {
      //软件合同信息优化新增的字段
      list: [], //查看展示的列表
      popoverVisible: false, //Popover弹窗
      loading: false, //加载状态
      curHtxxid: -1, //当前合同信息id
    },
    glhtModalVisible: false,
    curYkbid: '',
    glhtid: '', //关联合同有数据时回显
    yjhtxxData: {
      //硬件合同信息优化新增的字段
      list: [], //查看展示的列表
      popoverVisible: false, //Popover弹窗
      loading: false, //加载状态
      curHtxxid: -1, //当前合同信息id
      curFlowid: -1, //当前流程id
    },
    rjfysplcwhtModalVisible: false, //软件费用审批流程-无合同
    isDdhtqslc: false, //是否迭代合同签署流程
    glyfqlcModalVisible: false, //关联已发起流程弹窗
    rjfysplcyhtModalVisible: false, //软件费用审批流程-有合同
    glOAhtModalVisible: false, //关联OA合同弹窗
    glOAhtData: {}, //关联OA合同弹窗所需数据
    projectApprovalApplicateModalVisible: false, //项目立项申请弹窗
  };
  // timer = null;

  componentDidMount() {
    window.addEventListener('message', this.handleIframePostMessage);
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleIframePostMessage);
    // clearTimeout(timer);
  }
  // 防抖
  debounce = (fn, waits = 500) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn();
    }, waits);
  };
  //监听弹窗状态-按钮
  handleIframePostMessage = event => {
    if (typeof event.data !== 'string' && event.data.operate === 'close') {
      this.setState({
        hardWareBidModalVisible: false,
        hardWareContrastModalVisible: false,
        xbjglrModalVisible: false,
      });
    }
    if (typeof event.data !== 'string' && event.data.operate === 'success') {
      this.setState({
        hardWareBidModalVisible: false,
        hardWareContrastModalVisible: false,
        xbjglrModalVisible: false,
      });
      //刷新数据
      this.props.refresh();
      // this.debounce(() => {
      //   message.success(this.state.lbModalTitle + '成功', 1);
      // });
    }
  };

  //Livebos弹窗参数
  getParams = (objName, oprName, data) => {
    let Loginname = String(JSON.parse(sessionStorage.getItem('user')).loginName);
    return {
      attribute: 0,
      authFlag: 0,
      objectName: objName,
      operateName: oprName,
      parameter: data,
      userId: Loginname,
    };
  };

  //获取Livebos弹窗链接
  getLink = (params, urlState) => {
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          this.setState({
            [urlState]: url,
          });
        }
      })
      .catch(error => {
        message.error('livebos链接创建失败', 1);
        console.error(!error.success ? error.message : error.note);
      });
  };

  //文档上传修改
  getWdscxg = (done, item) => {
    //上传、重新上传
    const scxg = (item, type = '') => {
      let params = this.getParams('TWD_XM', 'TWD_XM_INTERFACE_UPLOD', [
        {
          name: 'XMMC',
          value: item.xmid,
        },
        {
          name: 'LCBMC',
          value: item.lcbid,
        },
        {
          name: 'SXID',
          value: item.sxid,
        },
      ]);
      if (type === 'MOD') {
        if (item.sxmc === '中标公告') {
          params = this.getParams('TXMXX_ZBGG', 'TXMXX_ZBGG_MOD', [
            {
              name: 'XMMC2',
              value: item.xmid,
            },
          ]);
        }
      } else {
        if (item.sxmc === '中标公告') {
          params = this.getParams('TXMXX_ZBGG', 'TXMXX_ZBGG_Add', [
            {
              name: 'XMMC2',
              value: item.xmid,
            },
          ]);
        }
      }
      this.setState({
        uploadVisible: true,
        lbModalTitle: item.sxmc + (type === 'MOD' ? '修改' : '上传'),
      });
      this.getLink(params, 'lbModalUrl');
    };
    //获取文档
    const getFileList = item => {
      this.setState({
        fileLoading: true,
      });
      FetchQueryWpsWDXX({
        lcb: Number(item.lcbid),
        sxid: Number(item.sxid),
        xmmc: Number(item.xmid),
      })
        .then(res => {
          if (res?.success) {
            const { url, zxwdmc, zxwd } = res.record;
            let arr = [...JSON.parse(url)];
            if (zxwdmc && zxwdmc !== '' && zxwd && zxwd !== '') {
              arr = [
                ...arr,
                {
                  zxwd,
                  zxwdmc,
                },
              ];
            }
            this.setState({
              currentFileList: arr,
              fileLoading: false,
            });
          }
        })
        .catch(e => {
          message.error('文档信息获取失败', 1);
        });
    };
    //文档预览 - 下载
    const wdyl = (name, url) => {
      var link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.click();
      window.URL.revokeObjectURL(link.href);
    };

    //跳转在线文档
    const jumpToZxwd = url => {
      window.open(url);
    };

    const reoprMoreContent = (
      <div className="list">
        <div className="item" onClick={() => scxg(item, 'MOD')} key="上传新文档">
          {/* 上传新文档 */}
          修改
        </div>
      </div>
    );
    const documentContent = (
      <Spin tip="加载中" spinning={this.state.fileLoading} size="small">
        <div className="list" style={this.state.fileLoading ? { minHeight: 40 } : {}}>
          {this.state.currentFileList.map(x =>
            x.zxwd ? (
              <Tooltip title={x.zxwdmc} placement="topLeft" key={x.zxwdmc}>
                <div className="item" onClick={() => jumpToZxwd(x.zxwd)}>
                  {x.zxwdmc}
                </div>
              </Tooltip>
            ) : (
              <Tooltip title={x[1]} placement="topLeft" key={x[0]}>
                <div className="item" onClick={() => wdyl(x[1], x[2])}>
                  {x[1]}
                </div>
              </Tooltip>
            ),
          )}
          {this.state.currentFileList.length === 0 && (
            <Empty
              style={{ margin: 0 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
            />
          )}
        </div>
      </Spin>
    );

    //权限控制
    const {
      // isLeader = false,
      isMember = false,
      isMnger = false,
      isFXMJL = false,
      isEnd = false,
    } = this.props.auth;
    const allAuth = () => {
      if (done)
        return (
          <div className="opr-more">
            <Popover
              placement="bottomRight"
              title={null}
              content={documentContent}
              overlayClassName="document-list-content-popover"
              trigger="click"
            >
              <div className="reopr-btn" onClick={() => getFileList(item)}>
                查看
              </div>
            </Popover>
            <Popover
              placement="bottom"
              title={null}
              content={reoprMoreContent}
              overlayClassName="btn-more-content-popover"
            >
              <div className="reopr-more">
                <i className="iconfont icon-more2" />
              </div>
            </Popover>
          </div>
        );
      return (
        <div className="opr-btn" onClick={() => scxg(item)}>
          上传
        </div>
      );
    };
    const onlyCk = () => {
      if (done)
        return (
          <div className="opr-more">
            <Popover
              placement="bottomRight"
              title={null}
              content={documentContent}
              overlayClassName="document-list-content-popover"
              trigger="click"
            >
              <div className="reopr-btn" onClick={() => getFileList(item)}>
                查看
              </div>
            </Popover>
          </div>
        );
      return '';
    };

    if (isEnd) {
      //终止了，不能操作
      return onlyCk();
    } else if (isMnger) {
      return allAuth();
    } else if (isMember || isFXMJL) {
      if (done) return onlyCk();
      return allAuth();
    } else {
      return onlyCk();
    }
  };

  //信息录入修改
  getXxlrxg = (done, item) => {
    //权限控制
    const { isEnd = false } = this.props.auth || {};
    const xxlrxg = (item, type = '') => {
      let params = {};
      if (type === 'MOD') {
        if (item.sxmc === '软件合同信息录入') {
          this.setState({
            editMessageVisible: true,
          });
          return;
        }
        if (item.sxmc === '中标信息录入') {
          this.setState({
            bidInfoMod: {
              visible: true,
              type: 'UPDATE',
              xmid: item.xmid,
            },
          });
          return;
        }
      } else {
        if (item.sxmc === '软件合同信息录入') {
          params = this.getParams('V_HTXX', 'V_HTXX_ADD', [
            {
              name: 'XMMC',
              value: item.xmid,
            },
          ]);
        }
        if (item.sxmc === '中标信息录入') {
          this.setState({
            bidInfoMod: {
              visible: true,
              type: 'ADD',
              xmid: item.xmid,
            },
          });
          return;
        }
      }
      this.setState({
        lbModalTitle: item.sxmc,
        xxlrxgVisible: true,
      });
      this.getLink(params, 'lbModalUrl');
    };
    if (done) {
      if (item.sxmc === '软件合同信息录入') {
        const htxxck = async () => {
          try {
            this.setState({
              rjhtxxData: {
                ...this.state.rjhtxxData,
                loading: true,
              },
            });
            // 查询供应商下拉列表、合同信息
            const htxxRes = await FetchQueryHTXXByXQTC({
              xmmc: Number(item.xmid),
            });
            if (htxxRes.success) {
              const htxxData = [...htxxRes.record];
              let htxxList = htxxData.reduce((acc, cur) => {
                if (acc.findIndex(x => x.htxxid === cur.htxxid) === -1) {
                  return [...acc, cur];
                }
                return acc;
              }, []);
              this.setState({
                rjhtxxData: {
                  ...this.state.rjhtxxData,
                  list: htxxList,
                  loading: false,
                },
              });
            }
          } catch (error) {
            console.error('查询供应商下拉列表、合同信息', error);
            this.setState({
              rjhtxxData: {
                ...this.state.rjhtxxData,
                loading: false,
              },
            });
          }
        };

        const htxxxg = id => {
          this.setState({
            editMessageVisible: true,
            rjhtxxData: {
              ...this.state.rjhtxxData,
              curHtxxid: id,
              popoverVisible: false,
            },
          });
        };
        const reoprMoreContent = (
          <div className="list">
            <div className="item" onClick={() => xxlrxg(item)} key="录入">
              录入
            </div>
          </div>
        );
        const documentContent = (
          <Spin tip="加载中" spinning={this.state.rjhtxxData.loading} size="small">
            <div className="list" style={this.state.rjhtxxData.loading ? { minHeight: 40 } : {}}>
              {this.state.rjhtxxData.list?.map(x => (
                <div
                  className="item"
                  key={x.htxxid}
                  style={{
                    height: 'unset',
                    lineHeight: 'unset',
                    marginBottom: 0,
                    paddingTop: 4,
                    paddingBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Tooltip title={x.htbt} placement="topLeft" key={x.htxxid}>
                    <div className="subject" style={{ color: '#1f1f1f' }}>
                      {x.htbt}
                    </div>
                  </Tooltip>
                  {/* 终止了，不能操作 */}
                  {!isEnd && (
                    <div className="opr-btn" onClick={() => htxxxg(x.htxxid)}>
                      修改
                    </div>
                  )}
                </div>
              ))}
              {this.state.rjhtxxData.list.length === 0 && (
                <Empty
                  style={{ margin: 0 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                />
              )}
            </div>
          </Spin>
        );
        return (
          <div className="opr-more">
            <Popover
              placement="bottomRight"
              title={null}
              content={documentContent}
              overlayClassName="document-list-content-popover"
              trigger="click"
              visible={this.state.rjhtxxData.popoverVisible}
              onVisibleChange={v =>
                this.setState({ rjhtxxData: { ...this.state.rjhtxxData, popoverVisible: v } })
              }
            >
              <div className="reopr-btn" onClick={() => htxxck(item)}>
                查看
              </div>
            </Popover>
            {/* 终止了，不能操作 */}
            {!isEnd && (
              <Popover
                placement="bottom"
                title={null}
                content={reoprMoreContent}
                overlayClassName="btn-more-content-popover"
              >
                <div className="reopr-more">
                  <i className="iconfont icon-more2" />
                </div>
              </Popover>
            )}
          </div>
        );
      }
      return (
        <div className="opr-more">
          <div className="reopr-btn" onClick={() => xxlrxg(item, 'MOD')}>
            修改
          </div>
        </div>
      );
    }
    //终止了，不能操作
    if (isEnd) return '';
    return (
      <div className="opr-btn" onClick={() => xxlrxg(item)}>
        录入
      </div>
    );
  };

  //硬件中标信息录入、合同信息录入
  getYjxxlr = (done, item, isBid = true) => {
    //权限控制
    const { isEnd = false } = this.props.auth || {};
    //终止了，不能操作
    if (isEnd) return '';
    const lrxg = (item, isBid = true, type) => {
      if (isBid)
        this.setState({
          hardWareBidModalVisible: true,
          lbModalUrl: type,
          lbModalTitle: '硬件中标信息' + (type === 'ADD' ? '录入' : '修改'),
        });
      else {
        this.setState({
          hardWareContrastModalVisible: true,
          lbModalUrl: type,
          lbModalTitle: '硬件合同信息' + (type === 'ADD' ? '录入' : '修改'),
        });
      }
    };
    const reoprMoreCotent = (
      <div className="list">
        <div className="item">
          <div className="reopr-btn" onClick={() => lrxg(item, isBid, 'UPDATE')}>
            修改
          </div>
        </div>
      </div>
    );
    if (done) {
      if (isBid)
        return (
          <div className="opr-more">
            <div className="reopr-btn" onClick={() => lrxg(item, isBid, 'UPDATE')}>
              修改
            </div>
          </div>
        );
      else {
        const htxxck = () => {
          FetchQueryHardwareTendersAndContract({
            xmmc: Number(item.xmid),
            flowId: -1,
            type: 'HTXX',
            flowType: 'CK',
          })
            .then(res => {
              if (res.success) {
                const { htxx = '[]', lcxx = '[]' } = res;
                const htxxData = [...JSON.parse(htxx)];
                const lcxxData = [...JSON.parse(lcxx)];
                let htxxList = htxxData.map(x => ({
                  htxxid: x.ID,
                  flowid: x.GLLC,
                  htbt: `${lcxxData.find(l => l.ID === x.GLLC)?.BT}-${x.QSRQ}`,
                }));
                this.setState({
                  yjhtxxData: {
                    ...this.state.yjhtxxData,
                    list: htxxList,
                    loading: false,
                  },
                });
              }
            })
            .catch(error => {
              console.error('查询合同信息', error);
              this.setState({
                yjhtxxData: {
                  ...this.state.yjhtxxData,
                  loading: false,
                },
              });
            });
        };

        const htxxxg = (id, flowId) => {
          this.setState({
            hardWareContrastModalVisible: true,
            yjhtxxData: {
              ...this.state.yjhtxxData,
              curHtxxid: id,
              curFlowid: flowId,
              popoverVisible: false,
            },
            lbModalUrl: 'UPDATE',
            lbModalTitle: '硬件合同信息修改',
          });
        };

        const reoprMoreContent = (
          <div className="list">
            <div className="item" onClick={() => lrxg(item, isBid, 'ADD')} key="录入">
              录入
            </div>
          </div>
        );
        const documentContent = (
          <Spin tip="加载中" spinning={this.state.yjhtxxData.loading} size="small">
            <div className="list" style={this.state.yjhtxxData.loading ? { minHeight: 40 } : {}}>
              {this.state.yjhtxxData.list?.map(x => (
                <div
                  className="item"
                  key={x.htxxid}
                  style={{
                    height: 'unset',
                    lineHeight: 'unset',
                    marginBottom: 0,
                    paddingTop: 4,
                    paddingBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Tooltip title={x.htbt} placement="topLeft" key={x.htxxid}>
                    <div className="subject" style={{ color: '#1f1f1f' }}>
                      {x.htbt}
                    </div>
                  </Tooltip>
                  <div className="opr-btn" onClick={() => htxxxg(x.htxxid, x.flowid)}>
                    修改
                  </div>
                </div>
              ))}
              {this.state.yjhtxxData.list.length === 0 && (
                <Empty
                  style={{ margin: 0 }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                />
              )}
            </div>
          </Spin>
        );
        return (
          <div className="opr-more">
            <Popover
              placement="bottomRight"
              title={null}
              content={documentContent}
              overlayClassName="document-list-content-popover"
              trigger="click"
              visible={this.state.yjhtxxData.popoverVisible}
              onVisibleChange={v =>
                this.setState({ yjhtxxData: { ...this.state.yjhtxxData, popoverVisible: v } })
              }
            >
              <div className="reopr-btn" onClick={() => htxxck(item)}>
                查看
              </div>
            </Popover>
            <Popover
              placement="bottom"
              title={null}
              content={reoprMoreContent}
              overlayClassName="btn-more-content-popover"
            >
              <div className="reopr-more">
                <i className="iconfont icon-more2" />
              </div>
            </Popover>
          </div>
        );
      }
    }

    return (
      <div className="opr-btn" onClick={() => lrxg(item, isBid, 'ADD')}>
        录入
      </div>
    );
  };

  getHtxxlr = (done, item) => {
    //权限控制
    const { isEnd = false } = this.props.auth || {};
    //录入
    const htxxlr = () => {
      if (this.props.prjBasic?.XMLX === '人力服务入围项目') {
        this.setState({
          contractInfoMod_RLFWRW: {
            visible: true,
            type: 'ADD',
            xmid: item.xmid,
          },
        });
        return;
      } else {
      message.info('请先在OA中进行合同录入，后在系统中进行确认即可', 2);}
    };
    if (done) {
      const htxxck = async () => {
        try {
          this.setState({
            rjhtxxData: {
              ...this.state.rjhtxxData,
              loading: true,
            },
            fklcLoading: true,
          });
          // 查询供应商下拉列表、合同信息
          const htxxRes = await FetchQueryHTXXByXQTC({
            xmmc: Number(item.xmid),
          });
          if (htxxRes.success) {
            const htxxData = [...htxxRes.record];
            let htxxList = htxxData.reduce((acc, cur) => {
              if (acc.findIndex(x => x.htxxid === cur.htxxid) === -1) {
                return [...acc, cur];
              }
              return acc;
            }, []);
            this.setState({
              rjhtxxData: {
                ...this.state.rjhtxxData,
                list: htxxList,
                loading: false,
              },
              fklcLoading: false,
            });
          }
        } catch (error) {
          console.error('查询供应商下拉列表、合同信息', error);
          this.setState({
            rjhtxxData: {
              ...this.state.rjhtxxData,
              loading: false,
            },
            fklcLoading: false,
          });
        }
      };

      const htxxxg = (obj = {}) => {
        if (obj.oahtxxid !== '') {
          window.location.href =
            '/#/pms/manage/InnovationContractEdit/' +
            EncryptBase64(
              JSON.stringify({
                id: obj.oahtxxid,
                routes: this.props.routes ?? [],
                timeStamp: new Date().getTime(),
              }),
            );
        } else {
          //历史数据无关联OA时，弹出关联OA合同弹窗，让用户关联OA合同
          this.setState({
            glOAhtModalVisible: true,
            glOAhtData: obj,
          });
        }
      };
      const reoprMoreContent = (
        <div className="list">
          <div className="item" onClick={htxxlr} key="录入">
            录入
          </div>
        </div>
      );
      const documentContent = (
        <Spin tip="加载中" spinning={this.state.fklcLoading} size="small">
          <div className="list" style={this.state.fklcLoading ? { minHeight: 40 } : {}}>
            {this.state.rjhtxxData.list?.map(x => (
              <div
                className="item"
                key={x.htxxid}
                style={{
                  height: 'unset',
                  lineHeight: 'unset',
                  marginBottom: 0,
                  paddingTop: 4,
                  paddingBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Tooltip title={x.htbt} placement="topLeft" key={x.htxxid}>
                  <div className="subject" style={{ color: '#1f1f1f' }}>
                    {x.htbt}
                  </div>
                </Tooltip>
                {/* 终止了，不能操作 */}
                {!isEnd && (
                  <div className="opr-btn" onClick={() => htxxxg(x)}>
                    修改
                  </div>
                )}
              </div>
            ))}
            {this.state.rjhtxxData.list.length === 0 && (
              <Empty
                style={{ margin: 0 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据"
              />
            )}
          </div>
        </Spin>
      );
      return (
        <div className="opr-more">
          <Popover
            placement="bottomRight"
            title={null}
            content={documentContent}
            overlayClassName="document-list-content-popover"
            trigger="click"
            visible={this.state.rjhtxxData.popoverVisible}
            onVisibleChange={v =>
              this.setState({ rjhtxxData: { ...this.state.rjhtxxData, popoverVisible: v } })
            }
          >
            <div className="reopr-btn" onClick={() => htxxck(item)}>
              查看
            </div>
          </Popover>
          {!isEnd && (
            <Popover
              placement="bottom"
              title={null}
              content={reoprMoreContent}
              overlayClassName="btn-more-content-popover"
            >
              <div className="reopr-more">
                <i className="iconfont icon-more2" />
              </div>
            </Popover>
          )}
        </div>
      );
    }
    //终止了，不能操作
    if (isEnd) return '';
    return (
      <div className="opr-btn" onClick={htxxlr}>
        录入
      </div>
    );
  };
  //迭代合同信息录入
  getDdhtxxlr = (done, item) => {
    //权限控制
    const { isEnd = false } = this.props.auth || {};
    //终止了，不能操作
    if (isEnd) return '';
    const xxlrxg = (item, type = 'ADD') => {
      this.setState({
        ddhtxxlr: {
          ...this.state.ddhtxxlr,
          xmid: item.xmid,
          visible: true,
          type,
        },
      });
    };
    if (done)
      return (
        <div className="opr-more">
          <div className="reopr-btn" onClick={() => xxlrxg(item, 'UPDATE')}>
            修改
          </div>
        </div>
      );
    return (
      <div className="opr-btn" onClick={() => xxlrxg(item)}>
        录入
      </div>
    );
  };

  //询比结果录入
  getXbjglr = (done, item) => {
    //权限控制
    const { isEnd = false } = this.props.auth || {};
    //终止了，不能操作
    if (isEnd) return '';
    const lrxg = (item, type) => {
      this.setState({
        xbjglrModalVisible: true,
        lbModalUrl: type,
        lbModalTitle: '询比结果录入',
      });
    };
    return (
      <div className="opr-btn" onClick={() => lrxg(item, 'ADD')}>
        录入
      </div>
    );
  };

  //员工评价开启
  getCz = (done, item) => {
    //权限控制
    const { isEnd = false } = this.props.auth || {};
    //终止了，不能操作
    if (isEnd) return '';
    const ygpj = item => {
      let params = this.getParams('View_XMRYPF', 'View_XMRYPF_OPENCOMMENT', [
        {
          name: 'XMMC',
          value: item.xmid,
        },
      ]);
      this.setState({
        ygpjVisible: true,
      });
      this.getLink(params, 'lbModalUrl');
    };
    const txzxmwsxx = item => {
      confirm({
        okText: '确认',
        cancelText: '取消',
        title: '提示',
        content: '将提醒未补充完整信息的子项目进行信息补充，请确认是否进行提醒',
        onOk() {
          RemindSubProjectFinish({
            parentId: Number(item.xmid),
          })
            .then(res => {
              if (res?.success) {
                message.success('操作成功', 1);
              }
            })
            .catch(e => {
              console.error('RemindSubProjectFinish', e);
              message.error('操作失败', 1);
            });
        },
        onCancel() {},
      });
    };
    const cz = item => {
      if (item.sxmc === '员工评价开启') {
        ygpj(item);
        return;
      }
      if (item.sxmc === '提醒子项目完善信息') {
        txzxmwsxx(item);
        return;
      }
    };
    return (
      <div className="opr-btn" onClick={() => cz(item)}>
        操作
      </div>
    );
  };

  //流程发起查看
  getLcfqck = (done, item) => {
    //是否付款流程
    const isFklc = item.sxmc === '付款流程';
    //是否 OA流程查看 - 异常填写
    const isOACK = [
      '软件费用审批流程-有合同',
      '软件费用审批流程-无合同',
      '项目立项申请',
      '软件合同签署流程',
      '设备采购有合同',
      '设备采购无合同',
      '框架内硬件采购流程',
      '框架外硬件采购流程',
      '总办会流程',
      '迭代合同签署流程',
    ].includes(item.sxmc);
    //流程类型
    const getLclx = sxmc => {
      switch (sxmc) {
        case '软件费用审批流程-有合同':
          return 'ZSZQ_RJGMHT';
        case '软件费用审批流程-无合同':
          return 'ZSZQ_RJGM';
        case '项目立项申请':
          return 'ZSZQ_XMLXSQ';
        case '软件合同签署流程':
          return 'ZSZQ_XXJSBRCHT';
        case '设备采购有合同':
        case '框架外硬件采购流程':
          return 'ZSZQ_SBCGHT';
        case '设备采购无合同':
        case '框架内硬件采购流程':
          return 'ZSZQ_SBCGWHT';
        case '总办会流程':
          return 'ZSZQ_HYYA';
        default:
          return '';
      }
    };
    //查看
    const lcck = item => {
      if (isFklc) {
        this.setState({
          fklcLoading: true,
        });
        FetchQueryOwnerWorkflow({
          paging: -1,
          current: 1,
          pageSize: 9999,
          total: -1,
          sort: 'XQ',
          xmid: Number(item.xmid),
        })
          .then(ret => {
            const { code = 0, record = [] } = ret;
            if (code === 1) {
              this.setState({
                fklcLoading: false,
                currentFklcList: record.filter(x => x.type === '易快报流程'),
              });
            }
          })
          .catch(error => {
            message.error('流程信息获取失败', 1);
            this.setState({
              fklcLoading: false,
            });
            console.error(!error.success ? error.message : error.note);
          });
        return;
      }
      if (item.sxmc.includes('信委会议案流程')) {
        const { xwhid } = this.props;
        const { isLeader = false, isMnger = false } = this.props.auth;
        if (isLeader && !isMnger) {
          let params = this.getParams('LC_XWHYALC', 'TrackWork', [
            {
              name: 'ID',
              value: Number(xwhid),
            },
          ]);
          this.setState({
            xwhyaModalVisible: true,
          });
          this.getLink(params, 'lbModalUrl'); //
          return;
        }
        this.setState({
          xwhyaModalVisible: true,
          lbModalUrl: `/livebos/ShowWorkflow?wfid=${xwhid}&stepId=3&PopupWin=true&HideCancelBtn=true`,
        });
        return;
      }
      if (item.sxmc === '需求发起') {
        window.location.href = `/#/pms/manage/DemandInfo/${EncryptBase64(
          JSON.stringify({
            xmid: item.xmid,
          }),
        )}`;
        return;
      }
      //查看流程 - 异常填写
      if (isOACK) {
        this.setState({
          fklcLoading: true,
        });
        if (item.sxmc === '迭代合同签署流程') {
          QueryIteContractFlow({ queryType: 2, projectId: Number(item.xmid) })
            .then(res => {
              if (res?.success) {
                const arr = JSON.parse(res.result).map(x => ({
                  ...x,
                  subject: x.BT,
                  url: { url: x.URL },
                }));
                this.setState({
                  fklcLoading: false,
                  currentFklcList: arr,
                });
              }
            })
            .catch(e => {
              message.error('流程信息获取失败', 1);
              this.setState({
                fklcLoading: false,
              });
              console.error(!error.success ? error.message : error.note);
            });
        } else {
          FetchQueryOwnerWorkflow({
            paging: -1,
            current: 1,
            pageSize: 9999,
            total: -1,
            sort: 'XQ',
            xmid: Number(item.xmid),
          })
            .then(ret => {
              const { code = 0, record = [] } = ret;
              if (code === 1) {
                let arr = [];
                if (item.sxmc === '项目立项申请') {
                  arr = record
                    .filter(x => x.type === 'OA流程')
                    .map(x => ({ ...x, url: JSON.parse(x.url) }))
                    .filter(x => getLclx(item.sxmc).includes(x.url.lclx));
                } else {
                  arr = record
                    .filter(x => x.type === 'OA流程')
                    .map(x => ({ ...x, url: JSON.parse(x.url) }))
                    .filter(x => x.url.lclx === getLclx(item.sxmc));
                }

                this.setState({
                  fklcLoading: false,
                  currentFklcList: arr,
                });
              }
            })
            .catch(error => {
              message.error('流程信息获取失败', 1);
              this.setState({
                fklcLoading: false,
              });
              console.error(!error.success ? error.message : error.note);
            });
        }
        return;
      }
      FetchQueryOAUrl({
        sxid: item.sxid,
        xmmc: item.xmid,
      })
        .then((ret = {}) => {
          const { code = 0, record = [] } = ret;
          if (code === 1) {
            window.open(record.url);
          }
        })
        .catch(error => {
          message.error('流程查看失败', 1);
          console.error(!error.success ? error.message : error.note);
        });
    };
    //发起
    const lcfq = item => {
      if (isFklc) {
        //付款流程
        this.setState({
          paymentModalVisible: true,
        });
        // message.info('功能开发中，暂时无法使用', 1);
        return;
      }
      //合同签署流程弹窗
      if (item.sxmc === '软件合同签署流程') {
        this.setState({
          contractSigningVisible: true,
        });
        return;
      }
      //迭代合同签署流程
      if (item.sxmc === '迭代合同签署流程') {
        this.setState({
          contractSigningVisible: true,
          isDdhtqslc: true,
        });
        return;
      }
      //需求发起
      if (item.sxmc === '需求发起') {
        this.setState({
          xqfqModalVisible: true,
        });
        return;
      }
      let params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_LXSQLCFQ', [
        {
          name: 'GLXM',
          value: Number(item.xmid),
        },
      ]);
      if (item.sxmc === '项目立项申请') {
        this.setState({
          projectApprovalApplicateModalVisible: true,
        });
        return;
      }
      if (item.sxmc === '软件费用审批流程-有合同') {
        // params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_SUBMIT_RJGMHT', [
        //   {
        //     name: 'GLXM',
        //     value: Number(item.xmid),
        //   },
        // ]);
        this.setState({
          rjfysplcyhtModalVisible: true,
        });
        return;
      }
      if (item.sxmc === '软件费用审批流程-无合同') {
        //lb弹窗
        // params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_RJGMWHT', [
        //   {
        //     name: 'GLXM',
        //     value: Number(item.xmid),
        //   },
        // ]);
        this.setState({
          rjfysplcwhtModalVisible: true,
        });
        return;
      }
      if (item.sxmc === '申请餐券') {
        params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_CQSQLC', [
          {
            name: 'GLXM',
            value: item.xmid,
          },
        ]);
      }
      if (item.sxmc === '申请权限' || item.sxmc === '申请VPN') {
        params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_VPNSQ', [
          {
            name: 'GLXM',
            value: item.xmid,
          },
        ]);
      }
      if (item.sxmc === '信委会议案流程') {
        params = this.getParams('LC_XWHYALC', 'LC_XWHYALC_TAFQ', [
          {
            name: 'XMMC',
            value: Number(item.xmid),
          },
        ]);
      }
      if (item.sxmc === '会议议案提交' || item.sxmc === '总办会流程') {
        params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_HYYA', [
          {
            name: 'GLXM',
            value: Number(item.xmid),
          },
        ]);
      }
      if (item.sxmc === '设备采购有合同' || item.sxmc === '框架外硬件采购流程') {
        params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_SBCGYHT', [
          {
            name: 'XMMC',
            value: Number(item.xmid),
          },
        ]);
      }
      if (item.sxmc === '设备采购无合同' || item.sxmc === '框架内硬件采购流程') {
        params = this.getParams('TLC_LCFQ', 'TLC_LCFQ_SBCGWHT', [
          {
            name: 'XMMC',
            value: Number(item.xmid),
          },
        ]);
      }
      this.setState({
        lbModalTitle: item.sxmc + '发起',
        sendVisible: true,
      });
      this.getLink(params, 'lbModalUrl');
    };
    //打印
    const lcdy = async item => {
      const { setIsSpinning } = this.props;
      Modal.confirm({
        title: '提示：',
        content: `将批量打印pdf和图片附件，word文件暂不支持批量打印，麻烦您自行打印！`,
        okText: '打印',
        cancelText: '取消',
        onOk: async () => {
          setIsSpinning(true);
          await axios({
            method: 'GET',
            url: getStreamByLiveBos,
            params: {
              xmid: item.xmid,
            },
            responseType: 'blob', // 更改responseType类型为 blob
          })
            .then(res => {
              let blob = new Blob([res.data], { type: 'application/pdf' });
              const src = URL.createObjectURL(blob);
              setIsSpinning(false);
              this.setState(
                {
                  src,
                },
                () => {
                  const printIframe = document.getElementById('Iframe');
                  printIframe.onload = () => {
                    printIframe.contentWindow.print();
                  };
                },
              );
            })
            .catch(err => {
              setIsSpinning(false);
              message.error('流程打印失败', 1);
            });
        },
      });
    };
    //异常填写
    const zttx = (xmid, lclx) => {
      //operate=TLC_OALCXX_ZTBG&Table=TLC_OALCXX&OALCID=
      const params = this.getParams('TLC_OALCXX', 'TLC_OALCXX_ZTBG', [
        {
          name: 'XMID',
          value: Number(xmid),
        },
        {
          name: 'LCLX',
          value: lclx,
        },
      ]);
      this.setState({
        lbModalTitle: '异常填写',
        oackzttxVisible: true,
        oackzttxPopoverVisible: false,
      });
      this.getLink(params, 'lbModalUrl');
    };
    const ddhtqsCotent = () => {
      //关联已发起流程
      const glyfqlc = () => {
        this.setState({
          glyfqlcModalVisible: true,
        });
      };
      return (
        <div className="list">
          <div className="item" onClick={() => lcfq(item)} key="发起新流程">
            发起新流程
          </div>
          <div className="item" onClick={() => glyfqlc()} key="关联已发起流程">
            关联已发起流程
          </div>
        </div>
      );
    };
    const reoprMoreCotent = (
      <div className="list">
        {item.sxmc === '迭代合同签署流程' ? (
          <Popover
            placement="right"
            title={null}
            content={ddhtqsCotent()}
            overlayClassName="btn-more-content-popover"
          >
            <div className="item" key="再次发起">
              再次发起
            </div>
          </Popover>
        ) : (
          <div className="item" onClick={() => lcfq(item)} key="再次发起">
            {item.sxmc === '需求发起' ? '新增发起' : '再次发起'}
          </div>
        )}
        {isOACK && (
          <div className="item" key="异常填写" onClick={() => zttx(item.xmid, getLclx(item.sxmc))}>
            异常填写
            <Tooltip
              title="当OA流程异常时，请补充填写流程异常原因。"
              overlayStyle={{ maxWidth: 'unset' }}
            >
              <Icon type="question-circle-o" style={{ marginLeft: 4 }} />
            </Tooltip>
          </div>
        )}
        {isFklc && (
          <div className="item" onClick={() => lcdy(item)} key="打印流程附件">
            打印流程附件
          </div>
        )}
      </div>
    );
    const fklcNameListContent = () => {
      //参数 url YKB:ID01tMADJLlnj1,Fjg7WPFpfYdA00:0163666569853821,B23075600,138
      //              易快报ID        用户易快报ID                   单据编号   关联合同（有数据时就有）

      //跳转易快报
      const jumpToYKB = url => {
        if (url.includes('YKB:')) {
          const arr = url.split(',');
          const id = arr[0].split(':')[1];
          const userykbid = arr[1];
          this.setState({
            jumpLoading: true,
          });
          GetApplyListProvisionalAuth({
            id,
            userykbid,
          })
            .then(res => {
              this.setState({
                jumpLoading: false,
                fklcPopoverVisible: false,
              });
              window.open(res.url);
            })
            .catch(e => {
              console.error(e);
              message.error('付款流程查看失败', 1);
              this.setState({
                jumpLoading: false,
              });
            });
        }
      };

      //单据编号
      const getDJBH = url => {
        if (url.includes('YKB:')) {
          const arr = url?.split(',') || [];
          if (arr.length > 2) return arr[2];
        }
        return '';
      };

      //开启关联合同弹窗
      const glht = url => {
        if (url.includes('YKB:')) {
          const arr = url.split(',');
          if (arr.length !== 0) {
            const id = arr[0].split(':')[1];
            const glhtid = arr[3];
            this.setState({
              glhtModalVisible: true,
              curYkbid: id,
              glhtid,
            });
          }
        }
      };
      return (
        <Spin tip="跳转中" spinning={this.state.jumpLoading} size="small">
          <Spin tip="加载中" spinning={this.state.fklcLoading} size="small">
            <div
              className="list"
              style={this.state.jumpLoading || this.state.fklcLoading ? { minHeight: 40 } : {}}
            >
              {this.state.currentFklcList.map(x => (
                <div
                  className="item"
                  key={x.subject}
                  onClick={() => jumpToYKB(x.url)}
                  style={{
                    height: 'unset',
                    lineHeight: 'unset',
                    marginBottom: 0,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 'unset',
                      lineHeight: 'unset',
                      marginBottom: 0,
                      paddingTop: 4,
                      paddingBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Tooltip title={x.subject} placement="topLeft" key={x.subject}>
                      <div className="subject">{x.subject}</div>
                    </Tooltip>
                    {this.props.dhtData?.length > 1 && (
                      <div
                        className="opr-btn"
                        key="关联合同"
                        onClick={e => {
                          e.stopPropagation();
                          glht(x.url);
                        }}
                      >
                        关联合同
                        <Tooltip
                          title="可将付款流程和具体的合同信息进行关联"
                          overlayStyle={{ maxWidth: 'unset' }}
                        >
                          <Icon type="question-circle-o" style={{ marginLeft: 4 }} />
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  {getDJBH(x.url) !== '' && <div className="djbh">{getDJBH(x.url)}</div>}
                </div>
              ))}
            </div>
          </Spin>
        </Spin>
      );
    };
    const oaCKListContent = () => {
      const jumpToOA = url => {
        if (url) {
          window.open(url);
        }
      };
      return (
        <Spin tip="加载中" spinning={this.state.fklcLoading} size="small">
          <div className="list" style={this.state.fklcLoading ? { minHeight: 40 } : {}}>
            {this.state.currentFklcList.map(x => (
              <div
                className="item"
                key={x.subject}
                style={{
                  height: 'unset',
                  lineHeight: 'unset',
                  marginBottom: 0,
                  paddingTop: 4,
                  paddingBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Tooltip title={x.subject} placement="topLeft" key={x.subject}>
                  <div className="subject" onClick={() => jumpToOA(x.url?.url)}>
                    {x.subject}
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        </Spin>
      );
    };
    //权限控制
    const { isLeader = false, isMember = false, isMnger = false, isEnd = false } =
      this.props.auth || {};
    if (isLeader && !isMnger) {
      return (
        <div className="opr-more">
          <div className="reopr-btn" onClick={() => lcck(item)}>
            查看
          </div>
        </div>
      );
    } else if (isMember && !isMnger) {
      if (done && item.sxmc === '信委会议案流程') {
        return (
          <div className="opr-more">
            <div className="reopr-btn" onClick={() => lcck(item)}>
              查看
            </div>
          </div>
        );
      }
    }
    if (done)
      return (
        <div className="opr-more">
          {isFklc || isOACK ? (
            <Popover
              placement="bottomRight"
              title={null}
              content={isFklc ? fklcNameListContent() : oaCKListContent()}
              overlayClassName="document-list-content-popover"
              trigger="click"
              visible={isFklc ? this.state.fklcPopoverVisible : this.state.oackzttxPopoverVisible}
              onVisibleChange={
                isFklc
                  ? v => this.setState({ fklcPopoverVisible: v })
                  : v => this.setState({ oackzttxPopoverVisible: v })
              }
            >
              <div className="reopr-btn" onClick={() => lcck(item)}>
                查看
              </div>
            </Popover>
          ) : (
            <div className="reopr-btn" onClick={() => lcck(item)}>
              查看
            </div>
          )}
          {/* 终止了，不能操作 */}
          {!isEnd && (
            <Popover
              placement="bottom"
              title={null}
              content={reoprMoreCotent}
              overlayClassName="btn-more-content-popover"
            >
              <div className="reopr-more">
                <i className="iconfont icon-more2" />
              </div>
            </Popover>
          )}
        </div>
      );
    //终止了，不能操作
    if (isEnd) return '';
    if (item.sxmc === '迭代合同签署流程')
      return (
        <Popover
          placement="bottom"
          title={null}
          content={ddhtqsCotent()}
          overlayClassName="btn-more-content-popover"
        >
          <div className="opr-btn">发起</div>
        </Popover>
      );
    return (
      <div className="opr-btn" onClick={() => lcfq(item)}>
        发起
      </div>
    );
  };

  //按钮事件配置
  getItemBtn = (
    name,
    done,
    item,
    { isLeader = false, isMember = false, isMnger = false, isFXMJL = false, isEnd = false },
  ) => {
    const that = this;
    //！！！ 后边新增事项配置时，注意配置完整
    //全部权限
    const allAuth = () => {
      switch (name) {
        //流程发起
        case '信委会议案流程':
        case '软件费用审批流程-有合同':
        case '软件费用审批流程-无合同':
        case '项目立项申请':
        case '招标方式变更流程':
        case '软件合同签署流程':
        case '申请VPN':
        case '申请权限':
        case '申请餐券':
        case '会议议案提交':
        case '付款流程':
        case '设备采购有合同':
        case '设备采购无合同':
        case '框架内硬件采购流程':
        case '框架外硬件采购流程':
        case '总办会流程':
        case '需求发起':
        case '迭代合同签署流程':
          return that.getLcfqck(done, item);

        //信息录入
        case '中标信息录入':
        case '软件合同信息录入':
          return that.getXxlrxg(done, item);
        case '硬件中标信息录入':
          return that.getYjxxlr(done, item);
        case '硬件合同信息录入':
          return that.getYjxxlr(done, item, false);
        case '询比结果录入':
          return that.getXbjglr(done, item);
        case '迭代合同信息录入':
          return that.getDdhtxxlr(done, item);
        case '合同信息录入':
          return that.getHtxxlr(done, item);

        //文档上传
        case '总办会会议纪要':
        case '总办会提案':
        case '中标公告':
        case '评标报告':
        case '可行性方案':
        case '调研报告':
        case 'UI设计图':
        case '功能清单':
        case '原型图':
        case '需求文档':
        case '开发文档':
        case '系统拓扑图':
        case '系统框架图':
        case '测试文档':
        case '原型设计说明书':
        case '开发测试报告':
        case '系统部署图、逻辑图':
        case '评估报告':
        case '软件系统验收测试报告':
        case '生产安装部署手册':
        case '生产操作及运维手册':
        case '用户手册':
        case '硬件合同':
        case '验收报告':
        case '后评价报告':
          return that.getWdscxg(done, item);

        //操作
        case '员工评价开启':
        case '提醒子项目完善信息':
          return that.getCz(done, item);

        default:
          console.error(`🚀 ~ 该事项名称【${name}】按钮尚未配置`);
          return;
      }
    };
    //已完成时部分人的权限
    const someAuth = () => {
      switch (name) {
        //流程发起
        case '信委会议案流程':
          return that.getLcfqck(done, item);
        //文档上传
        case '总办会会议纪要':
        case '总办会提案':
        case '中标公告':
        case '评标报告':
        case '可行性方案':
        case '调研报告':
        case 'UI设计图':
        case '功能清单':
        case '原型图':
        case '需求文档':
        case '开发文档':
        case '系统拓扑图':
        case '系统框架图':
        case '测试文档':
        case '原型设计说明书':
        case '开发测试报告':
        case '系统部署图、逻辑图':
        case '评估报告':
        case '软件系统验收测试报告':
        case '生产安装部署手册':
        case '生产操作及运维手册':
        case '用户手册':
        case '硬件合同':
        case '验收报告':
        case '后评价报告':
          return that.getWdscxg(done, item);
        default:
          return '';
      }
    };
    //其他无关人员-仅允许查看 已完成的文档
    const onlyDoc = () => {
      switch (name) {
        //文档上传
        case '总办会会议纪要':
        case '总办会提案':
        case '中标公告':
        case '评标报告':
        case '可行性方案':
        case '调研报告':
        case 'UI设计图':
        case '功能清单':
        case '原型图':
        case '需求文档':
        case '开发文档':
        case '系统拓扑图':
        case '系统框架图':
        case '测试文档':
        case '原型设计说明书':
        case '开发测试报告':
        case '系统部署图、逻辑图':
        case '评估报告':
        case '软件系统验收测试报告':
        case '生产安装部署手册':
        case '生产操作及运维手册':
        case '用户手册':
        case '硬件合同':
        case '验收报告':
        case '后评价报告':
          return that.getWdscxg(done, item);
        default:
          return '';
      }
    };
    if (isLeader && !isMnger) {
      //领导权限
      if (!done) return '';
      // if (item.sxmc === '信委会议案流程') return '';
      return someAuth();
    } else if (isFXMJL && !isMnger) {
      //副项目经理权限
      if (['需求发起', '付款流程'].includes(name)) {
        return this.getLcfqck(done, item);
      }
      //以下与项目成员一致
      if (['项目立项', '项目招采'].includes(item.lcb) || item.sxmc === '需求发起') return '';
      if (done) {
        return someAuth();
      }
      return allAuth();
    } else if (isMember && !isMnger) {
      //项目成员权限
      if (['项目立项', '项目招采'].includes(item.lcb) || item.sxmc === '需求发起') return '';
      if (done) {
        return someAuth();
      }
      return allAuth();
    } else if (!isMnger) {
      //其他无关人员权限
      if (!done) return '';
      if (['项目立项', '项目招采'].includes(item.lcb) || item.sxmc === '需求发起') return '';
      return onlyDoc();
    } else {
      //项目经理权限
      return allAuth();
    }
  };

  //成功回调
  onSuccess = name => {
    name && message.success(name + '成功');
    this.props.refresh(); //刷新数据
  };

  render() {
    const {
      lbModalUrl,
      lbModalTitle,
      uploadVisible,
      sendVisible,
      xxlrxgVisible,
      ygpjVisible,
      editMessageVisible,
      bidInfoModalVisible,
      paymentModalVisible,
      contractSigningVisible,
      associatedFileVisible,
      xwhyaModalVisible,
      src,
      hardWareBidModalVisible,
      hardWareContrastModalVisible,
      xbjglrModalVisible,
      xqfqModalVisible,
      oackzttxVisible,
      ddhtxxlr,
      glhtModalVisible,
      curYkbid,
      glhtid,
      yjhtxxData = {},
      rjfysplcwhtModalVisible,
      isDdhtqslc,
      glyfqlcModalVisible,
      rjfysplcyhtModalVisible,
      glOAhtModalVisible,
      glOAhtData,
      projectApprovalApplicateModalVisible,
      bidInfoMod = {
        visible: false,
      },
      contractInfoMod_RLFWRW = {
        visible: false,
      },
    } = this.state;
    const { item, xmmc, xmbh, isHwSltPrj, auth = {}, prjBasic = {} } = this.props;
    //文档上传、修改弹窗
    const uploadModalProps = {
      isAllWindow: 1,
      width: '760px',
      height:
        lbModalTitle === '中标公告上传' || lbModalTitle === '中标公告修改'
          ? '310px'
          : lbModalTitle.includes('验收报告')
          ? '570px'
          : '380px',
      title: lbModalTitle,
      style: { top: '60px' },
      visible: uploadVisible,
      footer: null,
    };

    //流程发起弹窗
    const sendModalProps = {
      isAllWindow: 1,
      title: lbModalTitle,
      width:
        lbModalTitle === '设备采购无合同发起' || lbModalTitle === '设备采购有合同发起'
          ? '1100px'
          : lbModalTitle === '信委会议案流程发起'
          ? '1000px'
          : '864px',
      height: '680px',
      style: { top: '10px' },
      visible: sendVisible,
      footer: null,
    };

    //信息录入、修改弹窗
    const xxlrxgModalProps = {
      isAllWindow: 1,
      width: '864px',
      height: '540px',
      title: lbModalTitle,
      style: { top: '10px' },
      visible: xxlrxgVisible,
      footer: null,
    };

    //员工评价开启弹窗
    const ygpjModalProps = {
      isAllWindow: 1,
      width: '500px',
      height: '240px',
      title: '操作',
      style: { top: '60px' },
      visible: ygpjVisible,
      footer: null,
    };

    //信委会立案流程查看
    const xwhyaModalProps = {
      isAllWindow: 1,
      title: '信委会立案流程查看',
      width: '1000px',
      height: '680px',
      style: { top: '10px' },
      visible: xwhyaModalVisible,
      footer: null,
    };

    //oa流程查看 - 异常填写
    const oackzttxModalProps = {
      isAllWindow: 1,
      title: '异常填写',
      width: '800px',
      height: '380px',
      style: { top: '60px' },
      visible: oackzttxVisible,
      footer: null,
    };

    return (
      <>
        {this.getItemBtn(item.sxmc, item.zxqk !== ' ', item, auth)}

        {/* 需求发起 */}
        {xqfqModalVisible && (
          <DemandInitiated
            xmmc={xmmc}
            xmid={Number(item.xmid)}
            closeModal={() =>
              this.setState({
                xqfqModalVisible: false,
              })
            }
            visible={xqfqModalVisible}
            successCallBack={() => {
              this.setState({
                xqfqModalVisible: false,
              });
              this.props.refresh(); //刷新数据
            }}
          />
        )}

        {/* 硬件中标信息录入 */}
        {hardWareBidModalVisible &&
          (lbModalUrl === 'ADD' ? (
            <EnterBidInfoModel
              xmid={Number(item.xmid)}
              // operateType={lbModalUrl} //type
              visible={hardWareBidModalVisible}
              closeModal={() =>
                this.setState({
                  hardWareBidModalVisible: false,
                })
              }
              onSuccess={() => this.onSuccess(lbModalTitle)}
            />
          ) : (
            <EditBidInfoModel
              xmid={Number(item.xmid)}
              // operateType={lbModalUrl} //type
              visible={hardWareBidModalVisible}
              closeModal={() =>
                this.setState({
                  hardWareBidModalVisible: false,
                })
              }
              onSuccess={() => this.onSuccess(lbModalTitle)}
            />
          ))}

        {/* 硬件询比结果录入 */}
        {xbjglrModalVisible && (
          <PollResultEnterModel
            xmid={Number(item.xmid)}
            visible={xbjglrModalVisible}
            closeModal={() =>
              this.setState({
                xbjglrModalVisible: false,
              })
            }
            onSuccess={() => this.onSuccess(lbModalTitle)}
          ></PollResultEnterModel>
        )}

        {/* 硬件合同信息录入录入 */}
        {hardWareContrastModalVisible && (
          <AgreementEnterModel
            xmid={Number(item.xmid)}
            operateType={lbModalUrl}
            visible={hardWareContrastModalVisible}
            closeModal={() =>
              this.setState({
                hardWareContrastModalVisible: false,
              })
            }
            onSuccess={() => this.onSuccess(lbModalTitle)}
            htxxid={yjhtxxData.curHtxxid}
            flowid={yjhtxxData.curFlowid}
          ></AgreementEnterModel>
        )}

        {/*文档上传、修改弹窗*/}
        {uploadVisible && (
          <BridgeModel
            modalProps={uploadModalProps}
            onSucess={() => {
              this.onSuccess(lbModalTitle);
              this.setState({
                uploadVisible: false,
              });
            }}
            onCancel={() =>
              this.setState({
                uploadVisible: false,
              })
            }
            src={lbModalUrl}
          />
        )}

        {/*流程发起弹窗*/}
        {sendVisible && (
          <BridgeModel
            modalProps={sendModalProps}
            onSucess={() => {
              this.onSuccess('流程发起');
              this.setState({
                sendVisible: false,
              });
            }}
            onCancel={() =>
              this.setState({
                sendVisible: false,
              })
            }
            src={lbModalUrl}
          />
        )}

        {/*信息录入、修改弹窗*/}
        {xxlrxgVisible && (
          <BridgeModel
            modalProps={xxlrxgModalProps}
            onSucess={() => {
              this.onSuccess('信息录入');
              this.setState({
                xxlrxgVisible: false,
              });
            }}
            onCancel={() =>
              this.setState({
                xxlrxgVisible: false,
              })
            }
            src={lbModalUrl}
          />
        )}

        {/*员工评价开启弹窗*/}
        {ygpjVisible && (
          <BridgeModel
            modalProps={ygpjModalProps}
            onSucess={() => {
              this.onSuccess('操作');
              this.setState({ ygpjVisible: false });
            }}
            onCancel={() => this.setState({ ygpjVisible: false })}
            src={lbModalUrl}
          />
        )}

        {/* 信委会立案流程查看 */}
        {xwhyaModalVisible && (
          <BridgeModel
            modalProps={xwhyaModalProps}
            onCancel={() => this.setState({ xwhyaModalVisible: false })}
            onSucess={() => {
              message.success('操作成功', 1);
              this.setState({ ygpjVisible: false });
            }}
            src={lbModalUrl}
          />
        )}

        {/* oa流程查看 - 异常填写 */}
        {oackzttxVisible && (
          <BridgeModel
            modalProps={oackzttxModalProps}
            onCancel={() => this.setState({ oackzttxVisible: false })}
            onSucess={() => {
              this.onSuccess('操作');
              this.setState({ ygpjVisible: false });
            }}
            src={lbModalUrl}
          />
        )}

        {/* 付款流程发起弹窗 */}
        {paymentModalVisible && (
          // {true && (
          <PaymentProcess
            paymentModalVisible={paymentModalVisible}
            // paymentModalVisible={true}
            currentXmid={Number(item.xmid)}
            currentXmmc={xmmc}
            closePaymentProcessModal={() =>
              this.setState({
                paymentModalVisible: false,
              })
            }
            onSuccess={() => this.onSuccess()}
            projectCode={xmbh}
            isHwPrj={isHwSltPrj}
            ddcgje={this.props.ddcgje}
            dhtData={this.props.dhtData}
          />
        )}

        {/*合同信息修改弹窗*/}
        {editMessageVisible && (
          <ContractInfoUpdate
            currentXmid={Number(item.xmid)}
            currentXmmc={xmmc}
            editMessageVisible={editMessageVisible}
            closeMessageEditModal={() =>
              this.setState({
                editMessageVisible: false,
              })
            }
            onSuccess={this.onSuccess}
            htxxid={this.state.rjhtxxData.curHtxxid}
          ></ContractInfoUpdate>
        )}

        {/*合同签署流程弹窗*/}
        {contractSigningVisible && (
          <ContractSigning
            xmjbxxRecord={this.props.xmjbxxRecord}
            currentXmid={Number(item.xmid)}
            currentXmmc={xmmc}
            contractSigningVisible={contractSigningVisible}
            closeContractModal={() =>
              this.setState({
                contractSigningVisible: false,
              })
            }
            onSuccess={() => this.onSuccess('合同签署')}
            xmbh={xmbh}
            isDdhtqslc={isDdhtqslc}
          ></ContractSigning>
        )}

        {/*合同签署流程弹窗*/}
        {associatedFileVisible && (
          <AssociatedFile
            associatedFileVisible={associatedFileVisible}
            closeAssociatedFileModal={() =>
              this.setState({
                associatedFileVisible: false,
              })
            }
            onSuccess={() => this.onSuccess('合同签署')}
          ></AssociatedFile>
        )}

        {/*中标信息修改弹窗*/}
        {bidInfoModalVisible && (
          <BidInfoUpdate
            currentXmid={Number(item.xmid)}
            currentXmmc={xmmc}
            bidInfoModalVisible={bidInfoModalVisible}
            closeBidInfoModal={() =>
              this.setState({
                bidInfoModalVisible: false,
              })
            }
            loginUserId={JSON.parse(sessionStorage.getItem('user')).id}
            onSuccess={() => this.onSuccess('信息修改')}
          ></BidInfoUpdate>
        )}

        {/*中标信息录入修改弹窗*/}
        {bidInfoMod.visible && (
          <BidInfoMod
            visible={bidInfoMod.visible}
            setVisible={v => this.setState({ bidInfoMod: { ...bidInfoMod, visible: v } })}
            type={bidInfoMod.type}
            xmid={bidInfoMod.xmid}
            refresh={this.props.refresh}
          ></BidInfoMod>
        )}

        {/* 迭代合同信息录入弹窗 */}
        <IterationContract
          dataProps={{ modalData: ddhtxxlr }}
          funcProps={{
            setModalData: v => this.setState({ ddhtxxlr: v }),
            refresh: this.props.refresh,
          }}
        />

        {/* 关联合同 */}
        <AssociationContract
          visible={glhtModalVisible}
          ykbid={curYkbid}
          glhtid={glhtid}
          dhtData={this.props.dhtData}
          refresh={this.props.refresh}
          setVisible={v => this.setState({ glhtModalVisible: v })}
        />

        {/* 软件费用审批流程-无合同 */}
        <SoftwarePaymentWHT
          dataProps={{
            visible: rjfysplcwhtModalVisible,
            currentXmid: Number(item.xmid),
            currentXmmc: xmmc,
            xmbh,
          }}
          funcProps={{
            setVisible: v => this.setState({ rjfysplcwhtModalVisible: v }),
            onSuccess: v => this.onSuccess(v),
          }}
        />

        {/* 软件费用审批流程-有合同 */}
        <SoftwarePaymentYHT
          dataProps={{
            visible: rjfysplcyhtModalVisible,
            currentXmid: Number(item.xmid),
            currentXmmc: xmmc,
            xmbh,
          }}
          funcProps={{
            setVisible: v => this.setState({ rjfysplcyhtModalVisible: v }),
            onSuccess: v => this.onSuccess(v),
          }}
        />

        {/* 关联已发起流程弹窗 */}
        <AssociationInitiatedProcess
          visible={glyfqlcModalVisible}
          setVisible={v => this.setState({ glyfqlcModalVisible: v })}
          xmid={Number(item.xmid)}
        />

        {/* 关联OA合同弹窗 */}
        <AssociationOAContract
          visible={glOAhtModalVisible}
          setVisible={v => this.setState({ glOAhtModalVisible: v })}
          htData={{ ...glOAhtData, xmid: Number(item.xmid) }}
          refresh={this.props.refresh}
        />

        {/* 项目立项申请——弹窗 */}
        {projectApprovalApplicateModalVisible && (
          <ProjectApprovalApplicate
            visible={projectApprovalApplicateModalVisible}
            setVisible={v => this.setState({ projectApprovalApplicateModalVisible: v })}
            prjBasic={prjBasic}
            refresh={this.props.refresh}
            xmbh={xmbh}
            currentXmid={Number(item.xmid)}
          />
        )}

        <iframe src={src} id="Iframe" style={{ display: 'none' }} />
      </>
    );
  }
}

export default connect(({ global }) => ({
  userBasicInfo: global.userBasicInfo,
  roleData: global.roleData,
}))(ItemBtn);
