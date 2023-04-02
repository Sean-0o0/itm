import { Popover } from 'antd';
import React, { useEffect, useState } from 'react';

class ItemBtn extends React.Component {
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
    //流程发起弹窗
    sendVisible: false,
    //流程发起url
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
    editMessageVisible: false, //合同
    bidInfoModalVisible: false, //中标
    defMsgModifyModalVisible: false, //默认
    currentXmmc: '',
    //信息修改url
    editMessageUrl: '/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX',
    editMessageTitle: '',
    editModelUrl:
      '/OperateProcessor?operate=TXMXX_XMXX_INTERFACE_MODOTHERINFO&Table=TXMXX_XMXX&XMID=5&LCBID=18',
    editModelTitle: '',
    editModelVisible: false,
    //付款流程发起弹窗显示
    paymentModalVisible: false,
    //合同签署流程发起
    contractSigningVisible: false,
    //项目编码 -合同签署流程发起
    xmbh: '',
  };

  componentDidMount() {
    // this.fetchQueryProjectInfoInCycle(this.props.xmid);
  }

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
  //文档上传修改
  getWdscxg = done => {
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
          <div className="reopr-btn">重新上传</div>
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
    return <div className="opr-btn">上传</div>;
  };
  //信息录入修改
  getXxlrxg = (done, item) => {
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
          <div className="reopr-btn">修改</div>
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
    return <div className="opr-btn">录入</div>;
  };
  //员工评价开启
  getygpjkq = (done, item) => {
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
          <div className="reopr-btn">修改操作</div>
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
    return <div className="opr-btn">操作</div>;
  };
  getItemBtn = (name, done, item) => {
    switch (name) {
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
      case '中标信息录入':
        return this.getXxlrxg(done, item);
      case '员工评价开启':
        return this.getygpjkq(done, item);
      case '合同信息录入':
        return this.getXxlrxg(done, item);
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
        return this.getWdscxg(done);
      default:
        console.error('未配置tooltip');
        return;
    }
  };
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

  //成功回调
  onSuccess = name => {
    message.success(name + '成功');
    this.reflush();
  };

  render() {
    const uploadModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '50%',
      height: uploadTitle === '中标公告上传' || uploadTitle === '中标公告修改' ? '50rem' : '78rem',
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
      height: '115rem',
      style: { top: '5rem' },
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
      width: '40%',
      height: '53rem',
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
      currentXmmc,
      bidInfoModalVisible,
      paymentModalVisible,
      defMsgModifyModalVisible,
      ygpjVisible,
      ygpjUrl,
      contractSigningVisible,
      associatedFileVisible,
      xmbh,
    } = this.state;
    const { item } = this.props;
    return (
      <>
        {this.getItemBtn(item.sxmc, item.zxqk !== ' ', item)}
        {/*文档上传弹窗*/}
        {uploadVisible && (
          <BridgeModel
            modalProps={uploadModalProps}
            onSucess={() => this.onSuccess('文档上传')}
            onCancel={this.closeUploadModal}
            src={uploadUrl}
          />
        )}
        {/*文档修改弹窗*/}
        {editVisible && (
          <BridgeModel
            modalProps={editModalProps}
            onSucess={() => this.onSuccess('文档上传修改')}
            onCancel={this.closeEditModal}
            src={uploadUrl}
          />
        )}
        {/*流程发起弹窗*/}
        {sendVisible && (
          <BridgeModel
            modalProps={sendModalProps}
            onSucess={() => this.onSuccess('流程发起')}
            onCancel={this.closeSendModal}
            src={sendUrl}
          />
        )}
        {/*信息录入弹窗*/}
        {fillOutVisible && (
          <BridgeModel
            modalProps={fillOutModalProps}
            onSucess={() => this.onSuccess('信息录入')}
            onCancel={this.closeFillOutModal}
            src={fillOutUrl}
          />
        )}
        {/*员工评价开启弹窗*/}
        {ygpjVisible && (
          <BridgeModel
            modalProps={ygpjModalProps}
            onSucess={() => this.onSuccess('操作')}
            onCancel={() => this.setState({ ygpjVisible: false })}
            src={ygpjUrl}
          />
        )}
        {/*默认信息修改弹窗*/}
        {defMsgModifyModalVisible && (
          <BridgeModel
            modalProps={editMessageModalProps}
            onSucess={() => this.onSuccess('信息修改')}
            onCancel={this.closeDefMsgModifyModal}
            src={editMessageUrl}
          />
        )}
        {/*阶段信息修改弹窗*/}
        {editModelVisible && (
          <div>
            <BridgeModel
              modalProps={editModelModalProps}
              onSucess={() => this.onSuccess('信息修改')}
              onCancel={this.closeModelEditModal}
              src={editModelUrl}
            />
          </div>
        )}
        {/* 付款流程发起弹窗 */}
        {paymentModalVisible && (
          <PaymentProcess
            paymentModalVisible={paymentModalVisible}
            fetchQueryLifecycleStuff={this.fetchQueryLifecycleStuff}
            currentXmid={
              Number(this.state.xmid) !== 0
                ? Number(this.state.xmid)
                : Number(this.props.params.projectId) ||
                  Number(this.state.operationListData[0].xmid)
            }
            currentXmmc={currentXmmc}
            closePaymentProcessModal={this.closePaymentProcessModal}
            onSuccess={() => this.onSuccess('流程发起')}
            projectCode={xmbh}
          />
        )}
        {/*合同信息修改弹窗*/}
        {editMessageVisible && (
          <ContractInfoUpdate
            currentXmid={
              Number(this.state.xmid) !== 0
                ? Number(this.state.xmid)
                : Number(this.props.params.projectId) ||
                  Number(this.state.operationListData[0].xmid)
            }
            currentXmmc={currentXmmc}
            editMessageVisible={editMessageVisible}
            closeMessageEditModal={this.closeMessageEditModal}
            onSuccess={() => this.onSuccess('信息修改')}
          ></ContractInfoUpdate>
        )}
        {/*合同签署流程弹窗*/}
        {contractSigningVisible && (
          <ContractSigning
            currentXmid={
              Number(this.state.xmid) !== 0
                ? Number(this.state.xmid)
                : Number(this.props.params.projectId) ||
                  Number(this.state.operationListData[0].xmid)
            }
            currentXmmc={currentXmmc}
            contractSigningVisible={contractSigningVisible}
            closeContractModal={this.closeContractModal}
            onSuccess={() => this.onSuccess('合同签署')}
            xmbh={xmbh}
          ></ContractSigning>
        )}
        {/*合同签署流程弹窗*/}
        {associatedFileVisible && (
          <AssociatedFile
            associatedFileVisible={associatedFileVisible}
            closeAssociatedFileModal={this.closeAssociatedFileModal}
            onSuccess={() => this.onSuccess('合同签署')}
          ></AssociatedFile>
        )}
        {/*中标信息修改弹窗*/}
        {bidInfoModalVisible && (
          <BidInfoUpdate
            currentXmid={
              Number(this.state.xmid) !== 0
                ? Number(this.state.xmid)
                : Number(this.props.params.projectId) ||
                  Number(this.state.operationListData[0].xmid)
            }
            currentXmmc={currentXmmc}
            bidInfoModalVisible={bidInfoModalVisible}
            closeBidInfoModal={this.closeBidInfoModal}
            loginUserId={JSON.parse(sessionStorage.getItem('user')).id}
            onSuccess={() => this.onSuccess('信息修改')}
          ></BidInfoUpdate>
        )}
      </>
    );
  }
}

export default ItemBtn;
