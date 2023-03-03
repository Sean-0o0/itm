import React from 'react';
import { Select, message, Icon, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
import {
  CreateOperateHyperLink,
  FetchQueryLifecycleStuff,
  FetchQueryOAUrl,
  FetchQueryOwnerWorkflow,
  FetchQueryProjectInfoInCycle,
  GetApplyListProvisionalAuth
} from "../../../../services/pmsServices";
import axios from 'axios'
import config from '../../../../utils/config';
import BridgeModel from '../../../Common/BasicModal/BridgeModel';

const { api } = config;
const { pmsServices: { getStreamByLiveBos } } = api;

const { Option } = Select;

class Tooltips extends React.Component {
  state = {
    src: '',
    // xmUserId: '',
    txtStyle: {
      marginLeft: '0.6rem',
    },
    xwhlaModalVisible: false,
    xwhlaModalUrl: '#',
  };

  componentDidMount() {
    // this.fetchQueryProjectInfoInCycle(this.props.xmid);
  }

  handleFillOut = (item) => {
    // console.log("item", item);
    this.props.handleFillOut(item);
  }

  handleUpload = () => {
    this.props.handleUpload();
  }

  handleSend = (item, xmbh) => {
    this.props.handleSend(item, xmbh);
  }

  handleEdit = () => {
    this.props.handleEdit();
  }

  handleMessageEdit = (item) => {
    this.props.handleMessageEdit(item);
  }

  getOAUrl = (item) => {
    if (item.sxmc.includes('付款流程')) {

      FetchQueryOwnerWorkflow({
        paging: 1,
        current: 1,
        pageSize: 5,
        total: -1,
        sort: ''
      }).then(ret => {
        const { code = 0, record = [] } = ret;
        if (code === 1) {
          record.forEach(x => {
            if (x.xmid === item.xmid) {
              if (x.url.includes('YKB:')) {
                const arr = x.url.split(',');
                const id = arr[0].split(':')[1];
                const userykbid = arr[1];
                GetApplyListProvisionalAuth({
                  id, userykbid,
                }).then(res => {
                  window.open(res.url);
                }).catch(e => console.error(e));
              }
            }
          })
          console.log(record, item);
        }
      }).catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
      return;
    }
    if (item.sxmc.includes('信委会议案流程')) {
      const { xwhid } = this.props;
      let params = {
        "attribute": 0,
        "authFlag": 0,
        "objectName": "LC_XWHYALC",
        "operateName": "View",
        "parameter": [
          {
            "name": "ID",
            "value": Number(xwhid),
          }
        ],
        "userId": String(JSON.parse(sessionStorage.getItem("user")).loginName),
      }
      CreateOperateHyperLink(params).then((ret = {}) => {
        const { code, message, url } = ret;
        if (code === 1) {
          this.setState({
            xwhlaModalVisible: true,
            xwhlaModalUrl: url
          })
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
      return;
    }
    FetchQueryOAUrl({
      sxid: item.sxid,
      xmmc: item.xmid,
    }).then((ret = {}) => {
      const { code = 0, record = [] } = ret;
      if (code === 1) {
        window.open(record.url)
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleAuthority = (fn, txt, ...arg) => {
    const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem("user")).id);
    // console.log(Number(this.props.userId), LOGIN_USER_ID, this.props);
    if (Number(this.props?.userId || this.props?.projectInfo?.userid) === LOGIN_USER_ID) {
      if (arg.length !== 0) {
        fn.call(this, ...arg);
      } else {
        fn.call(this);
      }
    } else {
      message.error(`抱歉，只有当前项目经理可以进行${txt}操作`);
    }
  }

  print = async () => {
    const { xmid } = this.props;
    await axios({
      method: 'GET',
      url: getStreamByLiveBos,
      params: {
        xmid: xmid
      },
      responseType: 'blob' // 更改responseType类型为 blob
    }).then(res => {
      let blob = new Blob([res.data], { type: 'application/pdf' });
      const src = URL.createObjectURL(blob);
      this.setState({
        src
      }, () => {
        const printIframe = document.getElementById("Iframe");
        printIframe.onload = (() => {
          printIframe.contentWindow.print();
        })
      })
    }).catch(err => {
      message.error(err)
    })
  }
  getSpan = txt => <span style={{ marginLeft: '0.5952rem' }}>{txt}</span>;
  //流程发起查看
  getLcfqck = (status, item, isFklc = false) => {
    const { xmbh } = this.props;
    // console.log("🚀 ~ file: index.js ~ line 151 ~ Tooltips ~ xmbh", xmbh)
    // status === ' '
    if (status === ' ') {
      return (
        <div title="发起" onClick={this.handleAuthority.bind(this, this.handleSend, '发起', item, xmbh)}>
          <a style={this.state.txtStyle} className="iconfont icon-send">{this.getSpan('发起')}</a>
        </div>
      );
    } else {
      let menu = "";
      //是否为付款流程
      if (isFklc) {
        menu = (
          <Menu>
            <Menu.Item>
              <div title="重新发起" onClick={this.handleAuthority.bind(this, this.handleSend, '重新发起', item, xmbh)}>
                <a style={this.state.txtStyle} className="iconfont icon-send">{this.getSpan('重新发起')}</a>
              </div>
            </Menu.Item>
            <Menu.Item>
              <div title="打印" onClick={this.print}>
                <a style={this.state.txtStyle} className="iconfont icon-print" >{this.getSpan('打印')}</a>
              </div>
            </Menu.Item>
          </Menu>
        );
      } else {
        menu = (
          <Menu>
            <Menu.Item>
              <div title="重新发起" onClick={this.handleAuthority.bind(this, this.handleSend, '重新发起', item, xmbh)}>
                <a style={this.state.txtStyle} className="iconfont icon-send">{this.getSpan('重新发起')}</a>
              </div>
            </Menu.Item>
          </Menu>
        );
      }
      const xwhlaModalProps = {
        isAllWindow: 1,
        // defaultFullScreen: true,
        title: '信委会立案流程查看',
        width: '120rem',
        height: '90rem',
        style: { top: '20rem' },
        visible: this.state.xwhlaModalVisible,
        footer: null,
      };
      return (<>
        {
          this.state.xwhlaModalVisible &&
          <BridgeModel modalProps={xwhlaModalProps}
            onCancel={() => this.setState({ xwhlaModalVisible: false })}
            // onSucess={this.OnSuccess}
            src={this.state.xwhlaModalUrl} />
        }
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div title="查看" onClick={this.handleAuthority.bind(this, this.getOAUrl, '查看', item)}>
            <a style={this.state.txtStyle} className="iconfont icon-see" rel="noopener noreferrer" target="_blank"
            >{this.getSpan('查看')}</a>
          </div>
          <Dropdown overlay={menu} overlayClassName='tooltip-dropdown'>
            <i style={{ color: 'rgba(51, 97, 255, 1)', marginLeft: '1.5rem' }}
              className="iconfont icon-more">
            </i>
          </Dropdown>
        </div>
      </>

      );
    }

  };
  //文档上传修改
  getWdscxg = (status, item) => {
    if (status === ' ')
      return (
        <div title="上传" onClick={this.handleAuthority.bind(this, this.handleUpload, '上传')}>
          <a style={this.state.txtStyle} className="iconfont icon-upload">{this.getSpan('上传')}</a>
        </div>
      );
    return (
      <div title="修改" onClick={this.handleAuthority.bind(this, this.handleEdit, '修改')} >
        <a style={this.state.txtStyle} className="iconfont icon-edit">{this.getSpan('修改')}</a>
      </div>
    );
  };
  //信息录入修改
  getXxlrxg = (status, item) => {
    if (status === ' ')
      return (
        <div title="录入" onClick={this.handleAuthority.bind(this, this.handleFillOut, '录入', item)}>
          <a style={this.state.txtStyle} className="iconfont icon-file-fillout">{this.getSpan('录入')}</a>
        </div>
      );
    return (
      <div title="修改" onClick={this.handleAuthority.bind(this, this.handleMessageEdit, '修改', item)}>
        <a style={this.state.txtStyle} className="iconfont icon-edit">{this.getSpan('修改')}</a></div>
    );
  };
  //员工评价开启
  getCz = (status, item) => {
    if (status === ' ')
      return (
        <div title="操作" onClick={this.handleAuthority.bind(this, this.handleFillOut, '操作', item)}>
          <a style={this.state.txtStyle} className="iconfont icon-file-fillout">{this.getSpan('操作')}</a>
        </div>
      );
    return (
      <div title="操作" onClick={this.handleAuthority.bind(this, this.handleMessageEdit, '操作', item)}>
        <a style={this.state.txtStyle} className="iconfont icon-edit">{this.getSpan('操作')}</a>
      </div>
    )
  }
  getToolTip = (name, status, item) => {
    switch (name) {
      case '信委会议案流程':
        return this.getLcfqck(status, item);
      case '总办会会议纪要':
        return this.getWdscxg(status, item);
      case '总办会提案':
        return this.getWdscxg(status, item);
      case '软件费用审批流程-有合同':
      case '软件费用审批流程-无合同':
        return this.getLcfqck(status, item);
      case '项目立项申请':
        return this.getLcfqck(status, item);
      case '中标信息录入':
        return this.getXxlrxg(status, item);
      case '中标公告':
        return this.getWdscxg(status, item);
      case '招标方式变更流程':
        return this.getLcfqck(status, item);
      case '评标报告':
        return this.getWdscxg(status, item);
      case '合同信息录入':
        return this.getXxlrxg(status, item);
      case '合同签署流程':
        return this.getLcfqck(status, item);
      case '可行性方案':
        return this.getWdscxg(status, item);
      case '调研报告':
        return this.getWdscxg(status, item);
      case '申请VPN':
        return this.getLcfqck(status, item);
      case '申请权限':
        return this.getLcfqck(status, item);
      case '申请餐券':
        return this.getLcfqck(status, item);
      case 'UI设计图':
        return this.getWdscxg(status, item);
      case '功能清单':
        return this.getWdscxg(status, item);
      case '原型图':
        return this.getWdscxg(status, item);
      case '需求文档':
        return this.getWdscxg(status, item);
      case '开发文档':
        return this.getWdscxg(status, item);
      case '系统拓扑图':
        return this.getWdscxg(status, item);
      case '系统框架图':
        return this.getWdscxg(status, item);
      case '测试文档':
        return this.getWdscxg(status, item);
      case '员工评价开启':
        return this.getCz(status, item);
      case '原型设计说明书':
        return this.getWdscxg(status, item);
      case '开发测试报告':
        return this.getWdscxg(status, item);
      case '系统部署图、逻辑图':
        return this.getWdscxg(status, item);
      case '评估报告':
        return this.getWdscxg(status, item);
      case '软件系统验收测试报告':
        return this.getWdscxg(status, item);
      case '生产安装部署手册':
        return this.getWdscxg(status, item);
      case '生产操作及运维手册':
        return this.getWdscxg(status, item);
      case '用户手册':
        return this.getWdscxg(status, item);
      case '付款流程':
        return this.getLcfqck(status, item, true);
      case '会议议案提交':
        return this.getLcfqck(status, item);
      default: console.error('未配置tooltip'); return;
    }
  }

  render() {
    const { status, item, xmid } = this.props;
    item.xmid = xmid;
    const name = item.sxmc; //事项名称
    return (
      <div className='tooltip-hover'>
        {this.getToolTip(name, status, item)}
      </div>
    );
  }
}

export default Tooltips;
