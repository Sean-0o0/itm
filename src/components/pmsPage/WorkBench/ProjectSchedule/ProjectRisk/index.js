import React from 'react';
import {Button, Input, Select, Row, Col, message} from 'antd';
import {connect} from 'dva';
import {CreateOperateHyperLink} from "../../../../../services/pmsServices";
import BridgeModel from "../../../../Common/BasicModal/BridgeModel";

const {Option} = Select;

const Loginname = localStorage.getItem("firstUserID");

class ProjectRisk extends React.Component {
  state = {
    riskUrl: '/OperateProcessor?operate=TFX_JBXX_ADD&Table=TFX_JBXX&GLXM=5&GLLCB=18',
    riskTitle: '',
    riskVisible: false,
  };

  hanldeRisk = (xmid, item) => {
    ///OperateProcessor?operate=TFX_JBXX_ADD&Table=TFX_JBXX&GLXM=5&GLLCB=18
    let params = {
      "attribute": 0,
      "authFlag": 0,
      "objectName": "TFX_JBXX",
      "operateName": "TFX_JBXX_ADD",
      "parameter": [
        {
          "name": "GLXM",
          "value": xmid,
        },
        {
          "name": "GLLCB",
          "value": item.lcbid,
        },
      ],
      "userId": Loginname
    }
    this.getRiskUrl(params);
    this.setState({
      riskTitle: '修改',
      riskVisible: true,
    });
  }

  //信息录入url
  getRiskUrl = (params, callBack) => {
    CreateOperateHyperLink(params).then((ret = {}) => {
      const {code, message, url} = ret;
      if (code === 1) {
        this.setState({
          riskUrl: url,
          // fillOutVisible: true,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  closeRiskModal = () => {
    this.setState({
      riskVisible: false,
    });
  };

  //成功回调
  onSuccess = (name) => {
    message.success(name + "成功");
  }


  render() {

    const {state, xmid} = this.props;
    // console.log("state", state)
    const {riskUrl, riskTitle, riskVisible,} = this.state;
    const riskModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '60rem',
      title: riskTitle,
      style: {top: '10rem'},
      visible: riskVisible,
      footer: null,
    };
    return (
      <div>
        {/*风险信息修改弹窗*/}
        {riskVisible &&
        <BridgeModel modalProps={riskModalProps} onSucess={() => this.onSuccess("修改")} onCancel={this.closeRiskModal}
                     src={riskUrl}/>}
        {
          Number(state) > 0 && <div style={{display: 'flex'}}><i style={{color: 'red', fontSize: '2.381rem'}}
                                                                 className="iconfont icon-warning"/>
            <a style={{color: 'rgba(215, 14, 25, 1)'}} onClick={() => {
              window.location.href = `/#/UIProcessor?Table=V_FXXX&hideTitlebar=true`;
            }}>&nbsp;存在
            </a>
          </div>
        }
        {
          state === "0" && <div style={{display: 'flex'}}>
            <a style={{color: 'rgba(48, 49, 51, 1)'}} onClick={() => this.hanldeRisk(xmid, state)}>&nbsp;暂无风险</a>
          </div>
        }
      </div>
    );
  }
}

export default connect(({global = {}}) => ({
  authorities: global.authorities,
}))(ProjectRisk);
