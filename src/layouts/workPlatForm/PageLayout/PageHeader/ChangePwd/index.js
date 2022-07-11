import React from 'react';
import { message } from 'antd';
import BasicModal from '../../../../../components/Common/BasicModal';
import ChangePwdContent from './content';
import { FetchPwd } from '../../../../../services/amslb/user';
import { AES } from '../../../../../utils/aes_utils';
import { APP_SECRET, CLIENTID } from '../../../../../utils/config';

class ChangePwd extends React.Component {
  constructor(props) {
    super(props);
    // 安全等级字典
    this.aqdjDic = {
      0: { label: '', color: '' },
      1: { label: '弱', color: '#AA0033' },
      2: { label: '中等', color: '#FFCC33' },
      3: { label: '安全', color: '#6699CC' },
      4: { label: '高', color: '#008000' },
    };
    this.state = {
      modalVisiable: false,
    };
  }

  componentWillUnmount() {
    this.aqdjDic = null;
  }

  showModal = () => {
    this.setState({
      modalVisiable: true,
    });
  }
  handleCancel = () => {
    const { login, dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/changeLoginStatus',
        payload: {
          ...login,
          loginCode: 0,
        },
      });
    }
    this.setState({
      modalVisiable: false,
    });
  }
  handleOk = () => {
    if (this.myForm) {
      const { validateFieldsAndScroll } = this.myForm;
      if (this.props.getFieldValue) { // 登录页的修改密码
        const userName = this.props.getFieldValue('userName');
        validateFieldsAndScroll((err, values) => {
          if (!err) {
            const { oldPwd, newPwd } = values;
            const validateRes = this.validatePwd(values);
            if (validateRes !== true) {
              message.error(validateRes);
              return false;
            }
            const salt = new Date().getTime();
            const params = {
              passwordSign: '',
              clientId: CLIENTID,
              salt,
            };
            // aas-aes加密
            AES.setSecret(APP_SECRET);
            params.passwordSign = AES.encryptBase64(JSON.stringify([oldPwd, newPwd, userName, salt]));
            FetchPwd({
              ...params,
            }).then((result = {}) => {
              const { code = 0, note } = result;
              if (code > 0) {
                message.success(note);
                this.setState({
                  modalVisiable: false,
                });
              }
            }).catch((error) => {
              message.error(!error.success ? error.message : error.note);
            });
          } else {
            const errKey = Object.keys(err);
            if (errKey && errKey.length > 0) {
              message.error(err[errKey[0]].errors[0].message);
            }
          }
        });
      } else { // 客户头标先的修改密码
        validateFieldsAndScroll((err, values) => {
          if (!err) {
            const { oldPwd, newPwd } = values;
            const validateRes = this.validatePwd(values);
            if (validateRes !== true) {
              message.error(validateRes);
              return false;
            }
            const salt = new Date().getTime();
            const params = {
              passwordSign: '',
              clientId: CLIENTID,
              salt,
            };
            // aas-aes加密
            AES.setSecret(APP_SECRET);
            params.passwordSign = AES.encryptBase64(JSON.stringify([oldPwd, newPwd, salt]));
            FetchPwd({
              ...params,
            }).then((result = {}) => {
              const { code = 0, note } = result;
              if (code > 0) {
                message.success(note);
                this.setState({
                  modalVisiable: false,
                });
              }
            }).catch((error) => {
              message.error(!error.success ? error.message : error.note);
            });
          } else {
            const errKey = Object.keys(err);
            if (errKey && errKey.length > 0) {
              message.error(err[errKey[0]].errors[0].message);
            }
          }
        });
      }
    } else {
      this.setState({
        modalVisiable: false,
      });
    }
  }

  // 获取密码安全等级
  getPwdLevel = (org) => {
    let pwd = '';
    if (typeof org === 'string') {
      pwd = org;
    } else if (org) {
      pwd = org().newPwd || ''; // eslint-disable-line
    }
    if (pwd.length < 6) {
      return 0;
    }
    const regxs = ['.*[0-9]+.*', '.*[a-z]+.*', '.*[A-Z]+.*', '.*[\\W]+.*'];
    let strength = 0;
    let level = 1;
    for (let i = 0; i < regxs.length; i++) {
      if (pwd.match(regxs[i])) {
        strength++;
      }
    }
    switch (strength) {
      case 0:
      case 1: level = 1; break;
      case 2: level = 2; break;
      case 3: level = 3; break;
      case 4:
      default: {
        if (pwd.length >= 14) {
          level = 4;
        } else {
          level = 3;
        }
      }
    }
    return level;
  }

  // 校验密码
  validatePwd = (values) => {
    const { oldPwd, newPwd, reNewPwd } = values;
    const usrPwdStrengthLevel = Number.parseInt(localStorage.getItem('usrPwdStrengthLevel'), 10);
    const usrPwdMinLength = Number.parseInt(localStorage.getItem('usrPwdMinLength'), 10);
    if (!oldPwd) {
      return '密码不可为空';
    }
    if (!newPwd) {
      return '新密码不可为空';
    } else if (newPwd.length < usrPwdMinLength) {
      return `长度不少于${usrPwdMinLength}位`;
    } else if (newPwd === oldPwd) {
      return '不允许使用旧密码';
    }
    const level = this.getPwdLevel(newPwd);
    if (level < usrPwdStrengthLevel) {
      const strength = this.aqdjDic[usrPwdStrengthLevel].label || '';
      return `密码强度至少为 ${strength} （${this.getPwdStrengthTip(usrPwdStrengthLevel)}）`;
    }
    if (!reNewPwd) {
      return '确认密码不可为空';
    } else if (reNewPwd.length < usrPwdMinLength) {
      return `长度不少于${usrPwdMinLength}位`;
    } else if (reNewPwd !== newPwd) {
      return '两次输入的新密码不相同';
    }
    return true;
  }

  getPwdStrengthTip = (strength) => {
    const level = Number.parseInt(strength, 10);
    let tip = '';
    if (level === 1) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的一种';
    } else if (level === 2) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的两种；不能以用户帐号，用户姓名作为开头';
    } else if (level === 3) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的三种；不能以用户帐号，用户姓名作为开头';
    } else if (level === 4) {
      tip = '必须包含数字、小写字母、大写字母或其它特殊符号当中的四种；不能以用户帐号，用户姓名作为开头';
    }
    return tip;
  }

  render() {
    const { userBasicInfo = {} } = this.props;
    const modalProps = {
      width: '40%',
      height: '50rem',
      title: '修改密码',
      visible: this.state.modalVisiable,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <BasicModal {...modalProps}>
        <ChangePwdContent ref={(c) => { this.myForm = c; }} aqdjDic={this.aqdjDic} getPwdLevel={this.getPwdLevel} getPwdStrengthTip={this.getPwdStrengthTip} userBasicInfo={userBasicInfo} />
      </BasicModal>
    );
  }
}
export default ChangePwd;
