import React from 'react';
import { Button, Input, Select, Row, Col, Tooltip, message } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
import {FetchQueryLifecycleStuff, FetchQueryOAUrl} from "../../../../services/pmsServices";

const { Option } = Select;

class Tooltips extends React.Component {
  state = {};

  handleFillOut = (item) => {
    // console.log("item", item);
    this.props.handleFillOut(item);
  }

  handleUpload = () => {
    this.props.handleUpload();
  }

  handleSend = (item) => {
    // console.log("item", item);
    this.props.handleSend(item);
  }

  handleEdit = () => {
    this.props.handleEdit();
  }

  handleMessageEdit = (item) => {
    this.props.handleMessageEdit(item);
  }

  getOAUrl = (item) => {
    console.log(item);
    FetchQueryOAUrl({
      sxid: item.sxid,
      xmmc: item.xmid,
    }).then((ret = {}) => {
      const {code = 0, record = []} = ret;
      if (code === 1) {
        // console.log("record",record)
        window.open(record.url)
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleAuthority = (fn, txt, arg) => {
    const { userId, loginUserId } = this.props;
    if (Number(userId) === Number(loginUserId)) {
      if (arg) {
        fn.call(this, arg);
      } else {
        fn.call(this);
      }
    } else {
      message.error(`抱歉，只有当前项目经理可以进行${txt}操作`);
    }
  }

  render() {
    const {type, status, item, xmid} = this.props;
    item.xmid = xmid;
    return (
      <div>
        {
          type.includes("信息录入") ? (status === " " ? <Tooltip title="录入">
            <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)' }}
              className="iconfont icon-file-fillout" onClick={this.handleAuthority.bind(this, this.handleFillOut, '录入', item)} />
          </Tooltip>
            : <Tooltip title="修改">
              <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)' }}
                className="iconfont icon-edit" onClick={this.handleAuthority.bind(this, this.handleMessageEdit, '修改', item)} />
            </Tooltip>) : ''
        }
        {
          type.includes("流程") ? (status === " " ?
            <Tooltip title="发起">
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-send" onClick={this.handleAuthority.bind(this, this.handleSend, '发起', item)}/>
            </Tooltip> : <Tooltip title="查看">
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-see" rel="noopener noreferrer" target="_blank"
                 onClick={this.handleAuthority.bind(this, this.getOAUrl, '查看', item)}/>
            </Tooltip>) : ''
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
              <Tooltip title="上传">
                <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)' }}
                  className="iconfont icon-upload" onClick={this.handleAuthority.bind(this, this.handleUpload, '上传')} />
              </Tooltip> : <Tooltip title="修改">
                <a style={{ marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)' }}
                  className="iconfont icon-edit" onClick={this.handleAuthority.bind(this, this.handleEdit, '修改')} />
              </Tooltip>) : ''
        }
      </div>
    );
  }
}

export default Tooltips;
