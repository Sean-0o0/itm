import React from 'react';
import { Select, message, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import icon_flag from '../../../../image/pms/icon_flag.png';
import { CreateOperateHyperLink } from "../../../../services/pmsServices";
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

const { Option } = Select;

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
      const { code, message, url } = ret;
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
    const { xmid, changeTab, fetchQueryOwnerProjectListUser, item } = this.props;
    message.success(name + "成功");
    fetchQueryOwnerProjectListUser(xmid);
  }


  render() {

    const { item, xmid } = this.props;
    const { riskUrl, riskTitle, riskVisible, } = this.state;
    const riskModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '60rem',
      title: riskTitle,
      style: { top: '10rem' },
      visible: riskVisible,
      footer: null,
    };
    return (
      <div>
        {/*风险信息修改弹窗*/}
        {riskVisible &&
          <BridgeModel modalProps={riskModalProps} onSucess={() => this.onSuccess("修改")} onCancel={this.closeRiskModal}
            src={riskUrl} />}
        {
          item?.fxnr !== "-1" && <div style={{ display: 'flex', alignItems: 'center' }}><i style={{ color: 'red', fontSize: '2.381rem' }}
            className="iconfont icon-warning" />
            <span style={{ color: 'red', marginLeft: '0.5952rem' }}>存在
            </span>
            <Tooltip title="查看风险">
              <Icon type="eye" style={{ color: 'red', marginLeft: '0.5952rem' }} onClick={() => window.location.href = `/#/UIProcessor?Table=V_FXXX&hideTitlebar=true`}></Icon>
            </Tooltip>

          </div>
        }
        {
          item?.fxnr === "-1" && <div style={{ display: 'flex', alignItems: 'center' }}>
            暂无风险
            <Tooltip title="添加风险">
              <Icon type="plus-circle" style={{ color: '#3361ff', marginLeft: '0.5952rem' }} onClick={() => {
                const { userId, loginUserId } = this.props;
                if (Number(userId) === Number(loginUserId)) {
                  this.hanldeRisk(xmid, item);
                } else {
                  message.error(`抱歉，只有当前项目经理可以进行该操作`);
                }
              }}></Icon>
            </Tooltip>

          </div>
        }
      </div>
    );
  }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(ProjectRisk);
