import { Popover } from 'antd';
import React from 'react';
import { CreateOperateHyperLink } from '../../../../../services/pmsServices';
import BridgeModel from '../../../../Common/BasicModal/BridgeModel';
import { message } from 'antd';
import BidInfoUpdate from '../../../LifeCycleManagement/BidInfoUpdate';
import AssociatedFile from '../../../LifeCycleManagement/AssociatedFile';
import ContractSigning from '../../../LifeCycleManagement/ContractSigning';
import ContractInfoUpdate from '../../../LifeCycleManagement/ContractInfoUpdate';
import PaymentProcess from '../../../LifeCycleManagement/PaymentProcess';
const Loginname = String(JSON.parse(sessionStorage.getItem('user')).loginName);
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
  };

  componentDidMount() {}

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

  getLink = (params, urlState) => {
    CreateOperateHyperLink(params)
      .then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          this.setState(
            {
              [urlState]: url,
            },
            () => {
              console.log(this.state[urlState]);
            },
          );
        }
      })
      .catch(error => {
        console.error(!error.success ? error.message : error.note);
      });
  };

  //文档上传修改
  getWdscxg = (done, item) => {
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
    if (done)
      return (
        <div className="opr-more">
          <div className="reopr-btn" onClick={() => scxg(item, 'MOD')}>
            重新上传
          </div>
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
        if (item.sxmc.includes('合同信息录入')) {
          this.setState({
            editMessageVisible: true,
          });
          return;
        }
        if (item.sxmc.includes('中标信息录入')) {
          this.setState({
            bidInfoModalVisible: true,
          });
          return;
        }
      } else {
        if (item.sxmc.includes('合同信息录入')) {
          params = this.getParams('V_HTXX', 'V_HTXX_ADD', [
            {
              name: 'XMMC',
              value: item.xmid,
            },
          ]);
        }
        if (item.sxmc.includes('中标信息录入')) {
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

  //员工评价开启
  getygpjkq = (done, item) => {
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
    // if (done)
    //   return (
    //     <div className="opr-more">
    //       <div className="reopr-btn" onClick={() => ygpj(item)}>
    //         修改
    //       </div>
    //     </div>
    //   );
    return (
      <div className="opr-btn" onClick={() => ygpj(item)}>
        操作
      </div>
    );
  };

  //流程发起查看
  getLcfqck = (done, item, isFklc = false) => {
    const reoprMoreCotent = (
      <div className="list">
        <div
          className="item"
          onClick={() => {
            // setEditingIndex(id);
            // setDrawerVisible(true);
          }}
        >
          选项123
        </div>
        <div
          className="item"
          onClick={() => {
            // handleMsgDelete(id, content);
          }}
        >
          选项234
        </div>
      </div>
    );
    if (done)
      return (
        <div className="opr-more">
          <div className="reopr-btn">重新发起</div>
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
    return <div className="opr-btn">发起</div>;
  };

  //按钮事件配置
  getItemBtn = (name, done, item) => {
    switch (name) {
      //流程发起
      case '信委会议案流程':
      case '软件费用审批流程-有合同':
      case '软件费用审批流程-无合同':
      case '项目立项申请':
      case '招标方式变更流程':
      case '合同签署流程':
      case '申请VPN':
      case '申请权限':
      case '申请餐券':
      case '会议议案提交':
        return this.getLcfqck(done, item);
      case '付款流程':
        return this.getLcfqck(done, item, true);

      //信息录入
      case '中标信息录入':
      case '合同信息录入':
        return this.getXxlrxg(done, item);

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
        return this.getWdscxg(done, item);

      //其他
      case '员工评价开启':
        return this.getygpjkq(done, item);

      default:
        console.error(`🚀 ~ 该事项名称【${name}】未配置`);
        return;
    }
  };


  //成功回调
  onSuccess = name => {
    message.success(name + '成功');
    this.props.getMileStoneData(); //刷新里程碑数据
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
    } = this.state;

    //文档上传、修改弹窗
    const uploadModalProps = {
      isAllWindow: 1,
      width: '720px',
      height:
        lbModalTitle === '中标公告上传' || lbModalTitle === '中标公告修改' ? '250px' : '600px',
      title: lbModalTitle,
      style: { top: '60px' },
      visible: uploadVisible,
      footer: null,
    };
    //流程发起弹窗
    const sendModalProps = {
      isAllWindow: 1,
      title: lbModalTitle,
      width: '864px',
      height: '700px',
      style: { top: '60px' },
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

    const { item, xmmc, xmbh } = this.props;
    // console.log("🚀 ~ file: index.js ~ line 511 ~ ItemBtn ~ render ~ item, xmmc, xmbh", item, xmmc, xmbh)
    return (
      <>
        {/*文档上传、修改弹窗*/}
        {uploadVisible && (
          <BridgeModel
            modalProps={uploadModalProps}
            onSucess={() => this.onSuccess(lbModalTitle)}
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
            onSucess={() => this.onSuccess('流程发起')}
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
            onSucess={() => this.onSuccess('信息录入')}
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
            onSucess={() => this.onSuccess('操作')}
            onCancel={() => this.setState({ ygpjVisible: false })}
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
            onSuccess={() => this.onSuccess('流程发起')}
            projectCode={xmbh}
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
        {this.getItemBtn(item.sxmc, item.zxqk !== ' ', item)}
      </>
    );
  }
}

export default ItemBtn;
