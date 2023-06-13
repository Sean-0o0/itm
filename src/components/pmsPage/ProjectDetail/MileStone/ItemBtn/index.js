import React from 'react';
import {
  CreateOperateHyperLink,
  FetchQueryOAUrl,
  FetchQueryOwnerWorkflow,
  FetchQueryWpsWDXX,
  GetApplyListProvisionalAuth,
  RemindSubProjectFinish,
} from '../../../../../services/pmsServices';
import BridgeModel from '../../../../Common/BasicModal/BridgeModel';
import { message, Popover, Modal, Spin } from 'antd';
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
import { is } from 'immutable';

const Loginname = String(JSON.parse(sessionStorage.getItem('user')).loginName);

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
            // console.log('🚀 ~ FetchQueryWpsWDXX ~ res', JSON.parse(res.record.url));
            this.setState({
              currentFileList: [...JSON.parse(res.record.url)],
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
    const reoprMoreContent = (
      <div className="list">
        <div className="item" onClick={() => scxg(item, 'MOD')} key="上传新文档">
          {/* 上传新文档 */}
          修改
        </div>
      </div>
    );
    const documentContent = (
      <div className="list">
        {this.state.fileLoading ? (
          <Spin tip="加载中" />
        ) : (
          this.state.currentFileList.map(x => (
            <div className="item" key={x[0]} onClick={() => wdyl(x[1], x[2])}>
              {x[1]}
            </div>
          ))
        )}
      </div>
    );

    //权限控制
    const { isLeader = false, isMember = false, isMnger = false } = this.props.auth;
    if ((isLeader && !isMnger) || (!isLeader && !isMember && !isMnger)) {
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
    } else if (isMember && !isMnger) {
      if (done) {
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
      }
    }
    if (done)
      return (
        <div className="opr-more">
          <Popover
            placement="bottomRight"
            title={null}
            content={documentContent}
            overlayClassName="document-list-content-popover"
          >
            <div className="reopr-btn" onMouseEnter={() => getFileList(item)}>
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

  //信息录入修改
  getXxlrxg = (done, item) => {
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
            bidInfoModalVisible: true,
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
          params = this.getParams('View_TBXX', 'View_TBXX_ADD', [
            {
              name: 'XMMC',
              value: item.xmid,
            },
            {
              name: 'LCB',
              value: item.lcbid,
            },
          ]);
        }
      }
      this.setState({
        lbModalTitle: item.sxmc,
        xxlrxgVisible: true,
      });
      this.getLink(params, 'lbModalUrl');
    };
    if (done)
      return (
        <div className="opr-more">
          <div className="reopr-btn" onClick={() => xxlrxg(item, 'MOD')}>
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

  //硬件中标信息录入、合同信息录入
  getYjxxlr = (done, item, isBid = true) => {
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
      return (
        <div className="opr-more">
          <div className="reopr-btn" onClick={() => lrxg(item, isBid, 'ADD')}>
            录入
          </div>
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
        </div>
      );
    }

    return (
      <div className="opr-btn" onClick={() => lrxg(item, isBid, 'ADD')}>
        录入
      </div>
    );
  };

  //询比结果录入
  getXbjglr = (done, item) => {
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
                // console.log('🚀 ~ RemindSubProjectFinish ~ res', res);
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
    //查看
    const lcck = item => {
      if (isFklc) {
        FetchQueryOwnerWorkflow({
          paging: -1,
          current: 1,
          pageSize: 9999,
          total: -1,
          sort: 'XQ',
        })
          .then(ret => {
            const { code = 0, record = [] } = ret;
            if (code === 1) {
              record.forEach(x => {
                if (x.xmid === item.xmid) {
                  if (x.url.includes('YKB:')) {
                    const arr = x.url.split(',');
                    const id = arr[0].split(':')[1];
                    const userykbid = arr[1];
                    GetApplyListProvisionalAuth({
                      id,
                      userykbid,
                    })
                      .then(res => {
                        window.open(res.url);
                      })
                      .catch(e => {
                        console.error(e);
                        message.error('付款流程查看失败', 1);
                      });
                  }
                }
              });
            }
          })
          .catch(error => {
            message.error('流程信息获取失败', 1);
            console.error(!error.success ? error.message : error.note);
          });
        return;
      }
      if (item.sxmc.includes('信委会议案流程')) {
        const { xwhid } = this.props;
        let params = this.getParams('LC_XWHYALC', 'TrackWork', [
          {
            name: 'ID',
            value: Number(xwhid),
          },
        ]);
        this.setState({
          xwhyaModalVisible: true,
        });
        this.getLink(params, 'lbModalUrl');
        return;
      }
      if (item.sxmc === '需求发起') {
        // console.log(item.xmid);
        window.location.href = `/#/pms/manage/DemandInfo/${EncryptBase64(
          JSON.stringify({
            xmid: item.xmid,
          }),
        )}`;
        // window.location.href = `/#/pms/manage/DemandInfo/${EncryptBase64(
        //   JSON.stringify({ a:2,c: 3 })
        // )}`;
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
      //需求发起
      if (item.sxmc === '需求发起') {
        this.setState({
          xqfqModalVisible: true,
        });
        return;
      }
      let params = this.getParams(
        'TLC_LCFQ',
        'TLC_LCFQ_LXSQLCFQ',
        [
          {
            name: 'GLXM',
            value: Number(item.xmid),
          },
        ],
        Loginname,
      );
      if (item.sxmc === '软件费用审批流程-有合同') {
        params = this.getParams(
          'TLC_LCFQ',
          'TLC_LCFQ_SUBMIT_RJGMHT',
          [
            {
              name: 'GLXM',
              value: Number(item.xmid),
            },
          ],
          Loginname,
        );
      }
      if (item.sxmc === '软件费用审批流程-无合同') {
        params = this.getParams(
          'TLC_LCFQ',
          'TLC_LCFQ_RJGMWHT',
          [
            {
              name: 'GLXM',
              value: Number(item.xmid),
            },
          ],
          Loginname,
        );
      }
      if (item.sxmc === '申请餐券') {
        params = this.getParams(
          'TLC_LCFQ',
          'TLC_LCFQ_CQSQLC',
          [
            {
              name: 'GLXM',
              value: item.xmid,
            },
          ],
          Loginname,
        );
      }
      if (item.sxmc === '申请权限' || item.sxmc === '申请VPN') {
        params = this.getParams(
          'TLC_LCFQ',
          'TLC_LCFQ_VPNSQ',
          [
            {
              name: 'GLXM',
              value: item.xmid,
            },
          ],
          Loginname,
        );
      }
      if (item.sxmc === '信委会议案流程') {
        params = this.getParams(
          'LC_XWHYALC',
          'LC_XWHYALC_TAFQ',
          [
            {
              name: 'XMMC',
              value: Number(item.xmid),
            },
          ],
          Loginname,
        );
      }
      if (item.sxmc === '会议议案提交' || item.sxmc === '总办会流程') {
        params = this.getParams(
          'TLC_LCFQ',
          'TLC_LCFQ_HYYA',
          [
            {
              name: 'GLXM',
              value: Number(item.xmid),
            },
          ],
          Loginname,
        );
      }
      if (item.sxmc === '设备采购有合同' || item.sxmc === '框架外硬件采购流程') {
        params = this.getParams(
          'TLC_LCFQ',
          'TLC_LCFQ_SBCGYHT',
          [
            {
              name: 'XMMC',
              value: Number(item.xmid),
            },
          ],
          Loginname,
        );
      }
      if (item.sxmc === '设备采购无合同' || item.sxmc === '框架内硬件采购流程') {
        params = this.getParams(
          'TLC_LCFQ',
          'TLC_LCFQ_SBCGWHT',
          [
            {
              name: 'XMMC',
              value: Number(item.xmid),
            },
          ],
          Loginname,
        );
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
    const reoprMoreCotent = (
      <div className="list">
        <div className="item" onClick={() => lcfq(item)} key="再次发起">
          {item.sxmc === '需求发起' ? '新增发起' : '再次发起'}
        </div>
        {isFklc && (
          <div className="item" onClick={() => lcdy(item)} key="打印流程附件">
            打印流程附件
          </div>
        )}
      </div>
    );
    //权限控制
    const { isLeader = false, isMember = false, isMnger = false } = this.props.auth;
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
          <div className="reopr-btn" onClick={() => lcck(item)}>
            查看
          </div>
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
        </div>
      );
    return (
      <div className="opr-btn" onClick={() => lcfq(item)}>
        发起
      </div>
    );
  };

  //按钮事件配置
  getItemBtn = (name, done, item, { isLeader = false, isMember = false, isMnger = false }) => {
    //！！！ 后边新增事项配置时，注意配置完整
    if (isLeader && !isMnger) {
      if (!done) return '';
      switch (name) {
        //流程发起
        case '信委会议案流程':
          return this.getLcfqck(done, item);
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
          return this.getWdscxg(done, item);
        default:
          console.error(`🚀 ~ 该事项名称【${name}】未配置`);
          return '';
      }
    } else if (isMember && !isMnger) {
      // if (!done && (['项目立项', '项目招采'].includes(item.lcb) || item.sxmc === '需求发起'))
      if (['项目立项', '项目招采'].includes(item.lcb) || item.sxmc === '需求发起') return '';
      if (done) {
        switch (name) {
          //流程发起
          case '信委会议案流程':
            return this.getLcfqck(done, item);

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
            return this.getWdscxg(done, item);

          default:
            return '';
        }
      }
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
          return this.getLcfqck(done, item);

        //信息录入
        case '中标信息录入':
        case '软件合同信息录入':
          return this.getXxlrxg(done, item);
        case '硬件中标信息录入':
          return this.getYjxxlr(done, item);
        case '硬件合同信息录入':
          return this.getYjxxlr(done, item, false);
        case '询比结果录入':
          return this.getXbjglr(done, item);

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
          return this.getWdscxg(done, item);

        //操作
        case '员工评价开启':
        case '提醒子项目完善信息':
          return this.getCz(done, item);

        default:
          return '';
      }
    } else if (!isLeader && !isMember && !isMnger) {
      if (!done) return '';
      if (['项目立项', '项目招采'].includes(item.lcb)) return '';
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
          return this.getWdscxg(done, item);
        default:
          return '';
      }
    } else {
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
          return this.getLcfqck(done, item);

        //信息录入
        case '中标信息录入':
        case '软件合同信息录入':
          return this.getXxlrxg(done, item);
        case '硬件中标信息录入':
          return this.getYjxxlr(done, item);
        case '硬件合同信息录入':
          return this.getYjxxlr(done, item, false);
        case '询比结果录入':
          return this.getXbjglr(done, item);

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
          return this.getWdscxg(done, item);

        //操作
        case '员工评价开启':
        case '提醒子项目完善信息':
          return this.getCz(done, item);

        default:
          console.error(`🚀 ~ 该事项名称【${name}】未配置`);
          return;
      }
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
    } = this.state;
    const { item, xmmc, xmbh, isHwPrj, auth = {} } = this.props;
    // console.log('🚀 ~ file: index.js:1005 ~ ItemBtn ~ render ~ item:', item);

    //文档上传、修改弹窗
    const uploadModalProps = {
      isAllWindow: 1,
      width: '760px',
      height:
        lbModalTitle === '中标公告上传' || lbModalTitle === '中标公告修改' ? '310px' : '380px',
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
          : '864px',
      height: '700px',
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
      style: { top: '60px' },
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
      width: '800px',
      height: '600px',
      style: { top: '60px' },
      visible: xwhyaModalVisible,
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
        {hardWareBidModalVisible && (
          <EnterBidInfoModel
            xmid={Number(item.xmid)}
            operateType={lbModalUrl} //type
            visible={hardWareBidModalVisible}
            closeModal={() =>
              this.setState({
                hardWareBidModalVisible: false,
              })
            }
            onSuccess={() => this.onSuccess(lbModalTitle)}
          ></EnterBidInfoModel>
        )}

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
            // onSucess={this.OnSuccess}
            src={lbModalUrl}
          />
        )}

        {/* 付款流程发起弹窗 */}
        {paymentModalVisible && (
          <PaymentProcess
            paymentModalVisible={paymentModalVisible}
            currentXmid={Number(item.xmid)}
            currentXmmc={xmmc}
            closePaymentProcessModal={() =>
              this.setState({
                paymentModalVisible: false,
              })
            }
            onSuccess={() => this.onSuccess()}
            projectCode={xmbh}
            isHwPrj={isHwPrj}
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
            onSuccess={() => this.onSuccess('信息修改')}
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
        <iframe src={src} id="Iframe" style={{ display: 'none' }} />
      </>
    );
  }
}

export default ItemBtn;
