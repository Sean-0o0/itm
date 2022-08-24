import React from 'react';
import {Button, Input, Select, Row, Col, Tooltip} from 'antd';
import {connect} from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';

const {Option} = Select;

class Tooltips extends React.Component {
  state = {};

  handleFillOut = (sxmc) => {
    console.log("sxmc", sxmc);
    this.props.handleFillOut(sxmc);
  }

  handleUpload = () => {
    this.props.handleUpload();
  }

  handleSend = (sxmc) => {
    console.log("sxmc", sxmc);
    this.props.handleSend(sxmc);
  }

  handleEdit = () => {
    this.props.handleEdit();
  }

  handleMessageEdit = (sxmc) => {
    console.log("sxmc", sxmc);
    this.props.handleMessageEdit(sxmc);
  }

  render() {

    const {type, status, sxmc} = this.props;
    console.log("sxmcsxmcsxmc", sxmc)
    return (
      <div>
        {
          type.includes("信息录入") ? (status === " " ? <Tooltip title="录入">
              <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-file-fillout" onClick={() => this.handleFillOut(sxmc)}/>
            </Tooltip>
            : <Tooltip title="修改">
              <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-edit" onClick={() => this.handleMessageEdit(sxmc)}/>
            </Tooltip>) : ''
        }
        {
          type.includes("流程") &&
          <Tooltip title="发起">
            <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
               className="iconfont icon-send" onClick={() => this.handleSend(sxmc)}/>
          </Tooltip>

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
              <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-upload" onClick={this.handleUpload}/>
            </Tooltip> : <Tooltip title="修改">
              <i style={{marginLeft: '0.6rem', color: 'rgba(51, 97, 255, 1)'}}
                 className="iconfont icon-edit" onClick={this.handleEdit}/>
            </Tooltip>) : ''
        }
      </div>
    );
  }
}

export default Tooltips;
