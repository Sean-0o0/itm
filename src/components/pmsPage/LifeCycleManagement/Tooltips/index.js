import React from 'react';
import { Button, Input, Select, Row, Col, Tooltip, message, Icon } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
import { FetchQueryLifecycleStuff, FetchQueryOAUrl, FetchQueryOwnerWorkflow, FetchQueryProjectInfoInCycle, GetApplyListProvisionalAuth } from "../../../../services/pmsServices";
import axios from 'axios'
import config from '../../../../utils/config';

const { api } = config;
const { pmsServices: { getStreamByLiveBos } } = api;

const { Option } = Select;

const LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem("user")).id);

class Tooltips extends React.Component {
  state = { src: '', xmUserId: '' };
  componentDidMount() {
    this.fetchQueryProjectInfoInCycle(this.props.xmid);
  }

  //获取项目经理id
  fetchQueryProjectInfoInCycle = (xmid) => {
    FetchQueryProjectInfoInCycle({
      xmmc: xmid,
    }).then(res => {
      this.setState({
        xmUserId: Number(res?.record?.userid),
      });
    });
  };
  handleFillOut = (item) => {
    // console.log("item", item);
    this.props.handleFillOut(item);
  }

  handleUpload = () => {
    this.props.handleUpload();
  }

  handleSend = (item) => {
    this.props.handleSend(item);
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

  handleAuthority = (fn, txt, arg) => {
    if (this.state.xmUserId === LOGIN_USER_ID) {
      if (arg) {
        fn.call(this, arg);
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
  getSpan = txt => <span style={{ color: 'rgba(51, 97, 255, 1)', cursor: 'pointer' }}>{txt}</span>;

  render() {
    const { src } = this.state;
    const { getSpan } = this;
    const { type, status, item, xmid } = this.props;
    item.xmid = xmid;
    return (
      <div className={item.sxmc.includes('付款流程') ? 'rowline-cont' : ''}>
        {item.sxmc.includes('付款流程') && <iframe src={src} id='Iframe' style={{ display: 'none' }} />}
        {
          type.includes("信息录入") ? (status === " " ? <Tooltip title="录入" onClick={this.handleAuthority.bind(this, this.handleFillOut, '录入', item)}>
            <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
              className="iconfont icon-file-fillout" />{getSpan('录入')}
          </Tooltip>
            : <Tooltip title="修改" onClick={this.handleAuthority.bind(this, this.handleMessageEdit, '修改', item)}>
              <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
                className="iconfont icon-edit" />{getSpan('修改')}
            </Tooltip>) : ''
        }
        {
          type.includes("其他") ? (status === " " ? <Tooltip title="操作" onClick={this.handleAuthority.bind(this, this.handleFillOut, '操作', item)}>
            <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
              className="iconfont icon-file-fillout" />{getSpan('操作')}
          </Tooltip>
            : <Tooltip title="操作" onClick={this.handleAuthority.bind(this, this.handleMessageEdit, '操作', item)}>
              <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
                className="iconfont icon-edit" />{getSpan('操作')}
            </Tooltip>) : ''
        }
        {
          type.includes("流程") ? (status === " " ?
            <Tooltip title="发起" onClick={this.handleAuthority.bind(this, this.handleSend, '发起', item)} >
              <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
                className="iconfont icon-send" />{getSpan('发起')}
            </Tooltip> :
            <>
              {item.sxmc.includes('付款流程') && <Tooltip title="打印" onClick={this.print}>
                <a style={{ marginLeft: '2.6rem', color: 'rgba(51, 97, 255, 1)' }} >
                  <Icon type="printer" style={{ marginRight: '0.5952rem' }} />{getSpan('打印')}
                </a>
              </Tooltip>}
              <Tooltip title="查看" onClick={this.handleAuthority.bind(this, this.getOAUrl, '查看', item)}>
                <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
                  className="iconfont icon-see" rel="noopener noreferrer" target="_blank"
                />{getSpan('查看')}
              </Tooltip>
            </>) : ''
        }
        {
          type.includes("文档") ||
            type.includes("信委会") ||
            type.includes("总办会") ||
            type.includes("需求调研") ||
            type.includes("产品设计") ||
            type.includes("系统框架搭建") ||
            type.includes("功能开发") ||
            type.includes("外部系统对接") ||
            type.includes("系统测试") ? (status === " " ?
              <Tooltip title="上传" onClick={this.handleAuthority.bind(this, this.handleUpload, '上传')}>
                <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
                  className="iconfont icon-upload" />{getSpan('上传')}
              </Tooltip> : <Tooltip title="修改" onClick={this.handleAuthority.bind(this, this.handleEdit, '修改')} >
                <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)', marginRight: '0.5952rem' }}
                  className="iconfont icon-edit" />{getSpan('修改')}
              </Tooltip>) : ''
        }
      </div>
    );
  }
}

export default Tooltips;
