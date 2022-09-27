import React from 'react';
import {Button, Input, Select, Row, Col, Tooltip, message} from 'antd';
import {connect} from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
import {FetchQueryLifecycleStuff, FetchQueryOAUrl} from "../../../../services/pmsServices";

const {Option} = Select;

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
    // console.log("item", item);
    this.props.handleMessageEdit(item);
  }

  getOAUrl = (item, xmid) => {
    FetchQueryOAUrl({
      sxid: item.sxid,
      xmmc: xmid,
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

  render() {

    const {type, status, item, xmid} = this.props;
    // console.log("sxmcsxmcsxmc", sxmc)
    return (
      <div>
        {
          type.includes("信息录入") ? (status === " " ? <Tooltip title="录入">
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-file-fillout" onClick={() => this.handleFillOut(item)}/>
            </Tooltip>
            : <Tooltip title="修改">
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-edit" onClick={() => this.handleMessageEdit(item)}/>
            </Tooltip>) : ''
        }
        {
          type.includes("流程") ? (status === " " ?
            <Tooltip title="发起">
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-send" onClick={() => this.handleSend(item)}/>
            </Tooltip> : <Tooltip title="查看">
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-see" rel="noopener noreferrer" target="_blank"
                 onClick={() => this.getOAUrl(item, xmid)}/>
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
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-upload" onClick={this.handleUpload}/>
            </Tooltip> : <Tooltip title="修改">
              <a style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-edit" onClick={this.handleEdit}/>
            </Tooltip>) : ''
        }
      </div>
    );
  }
}

export default Tooltips;
