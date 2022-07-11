/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable import/first */
/* eslint-disable jsx-a11y/anchor-is-valid */

/* eslint-disable react/jsx-indent */
import React from 'react';
import { Form, Row, Col, Select, Button, Input, message, Radio, Modal, Tag, Tree, Checkbox, Rate, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { FetchObjectQuery } from '../../../../../../services/sysCommon/index';
import { FetchqueryEventImportDetail, FetcheventMaintenance, FetchQueryMotFactorTree, FetchqueryAvailableIndex, FetchQueryMotFactorInfo } from '../../../../../../services/motProduction';
import { getDictKey } from '../../../../../../utils/dictUtils';
import EventCalcRuleData from './EventCalcRuleData';
import InputTreeModal from '../../MotFactorIndex/RightMainContent/InputTreeModal';
import ImportInformation from './ImportInformation';
import ReleaseRule from './ReleaseRule'
import moment from 'moment';

// 日期份选择控件
import 'moment/locale/zh-cn';
import { isEqual } from 'lodash';
const { Option } = Select;
/**
 * 右侧配置主要内容
 */

class RightMainContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yzflData: [],
      inputTreeData: '',
      visibleType: '',
      visible: false,
      modalTips: '',
      // newTagList: [],
      syfw: '',
      visibleYYB: false,
      checkedKeys: [],
      bqData: [],
      treeData: [],
      nrmbTreeData: [],
      fffw: [],
      calcRuleData: [],
      clickKey: '',
      jsonMsg: [],
      jsonTask: [],
      loading: false,
      jsfsType: '',
      zbData: [],
      drxxTableData: [],
      inputTreeType: false,
      inputTreeLength: 0,
      position: {},
      mblx: '',
      variableRecord: [],
      nrmbList: [],
      factorData: [],
    };
  }
  componentDidMount() {
    this.fetchYzflrData();
    if (this.props.tgtTp !== '') {
      this.fetchFactorTree(this.props.tgtTp);
    }
    this.fetchTableData(this.props.eventInfoData[0], this.props.sjID);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.eventInfoData, this.props.eventInfoData)) {

      this.fetchTableData(nextProps.eventInfoData[0], nextProps.sjID);
      this.fetchFactorTree(nextProps.tgtTp);
    }
  }

  //获取因子树
  fetchFactorTree = async (value) => {
    const tgtTp = value;
    let dicfactorData = [];
    await FetchObjectQuery(
      {
        "cols": "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
        "current": 1,
        "cxtj": "DIC_CL==MOT_SBRD_STG&&TGT_TP==" + tgtTp,
        "pageSize": 100,
        "paging": 1,
        "serviceid": "motDic",
        "sort": "",
        "total": -1
      }
    ).then(res => {
      const { data } = res
      if (data.length > 0) {
        dicfactorData = data;
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })

    let factorData = [];
    FetchQueryMotFactorTree({ tgtTp: tgtTp }).then((ret = {}) => {
      const { records = [] } = ret;
      if (records && records.length > 0) {
        factorData = records;
        factorData.forEach((item, index) => {
          const tags = dicfactorData.filter(Item => Item.DIC_CODE === item.fctrCl);
          item.fctrCl = tags[0].DIC_NOTE;
        });
        this.handleOnkeyWordFactor(factorData, '');
        this.setState({ factorData });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  }
  handleOnkeyWordFactor = (Data, keyWord) => {
    const factorData = Data === '' ? this.state.factorData : Data;
    const treeData = [];
    const newTreeList = factorData.filter((item) => {
      if (item.fctrNm.indexOf(keyWord) !== -1) {
        return true;
      }
      return false;
    });
    newTreeList.forEach((item) => {
      let Item = {};
      if (treeData.length === 0) {
        Item = { title: item.fctrCl, key: treeData.length, children: [{ title: item.fctrNm, id: item.fctrId, key: 0, strtUseSt: item.strtUseSt }] };
        treeData.push(Item);
      } else {
        const newTreeList = treeData.filter((treeItem) => {
          if (treeItem.title.indexOf(item.fctrCl) !== -1) {
            return true;
          }
          return false;
        });
        if (newTreeList.length === 0) {
          Item = { title: item.fctrCl, key: treeData.length, children: [{ title: item.fctrNm, id: item.fctrId, key: 0, strtUseSt: item.strtUseSt }] };
          treeData.push(Item);
        } else {
          const index = newTreeList[0].key;
          const childrenItem = { title: item.fctrNm, id: item.fctrId, key: treeData[index].children.length, strtUseSt: item.strtUseSt };
          treeData[index].children.push(childrenItem);
        }
      }
    });
    this.setState({ treeData });
  }
  fetchYzflrData = async (mblx) => {
    let tgtTp = '';
    if (mblx !== undefined && mblx !== '') {
      tgtTp = mblx;
    } else {
      tgtTp = this.props.tgtTp;
    }
    await FetchObjectQuery(
      {
        "cols": "DIC_CL,DIC_CODE,DIC_NM,DIC_NOTE,ID,TGT_TP",
        "current": 1,
        "cxtj": "DIC_CL==MOT_SBRD_STG&&TGT_TP==" + tgtTp,
        "pageSize": 100,
        "paging": 1,
        "serviceid": "motDic",
        "sort": "",
        "total": -1
      }
    ).then(res => {
      const { data, code } = res
      if (code > 0) {
        this.setState({ yzflData: data });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
  }
  fetchTableData = (data, sjID) => {
    if (data !== undefined) {
      const { gxyybDatas, dictionary = {} } = this.props;
      const { [getDictKey('fffw')]: fffwDicts = [] } = dictionary;
      let fffw = [];
      //dstrRng分发范围
      if (data.dstrRng === '3') {
        fffw = ['1', '2'];
      } else if (data.dstrRng === '5') {
        fffw = ['1', '4'];
      } else {
        fffwDicts.forEach((item) => {
          if (item.ibm === data.dstrRng) {
            fffw.push(item.ibm);
          }
        });
      }
      const newTagList = [];
      let syfw = '';
      if (data.avlRng !== '') {
        const bq = data.avlRng.split(',');
        bq.forEach((item, index) => {
          gxyybDatas.forEach((Item) => {
            if (item === Item.yybid) {
              // newTagList.push({
              //   bqmc: Item.yybmc,
              //   checked: true,
              //   index,
              //   id: Item.yybid,
              // });
              const str = `  ${Item.yybmc}`;
              syfw = syfw.concat(str);
            }
          });
        });
        this.setState({ syfw, checkedKeys: bq });
      }
      let calcRuleData = data.jsonCalcRule !== '' && data.jsonCalcRule !== undefined ? JSON.parse(data.jsonCalcRule) : [];
      calcRuleData.forEach((item = {}) => {
        if (item.FCTR && Array.isArray(item.FCTR)) {
          item.FCTR.forEach((ele = {}) => {
            if(Array.isArray(ele.FCTR_VAR)&&ele.FCTR_VAR.length===0){
              ele.FCTR_VAR = '';
            }
          })
        }
      })
      const zbData = data.idxJson !== '' && data.idxJson !== undefined ? JSON.parse(data.idxJson) : [];
      const jsfsType = data.cmptMode !== undefined ? data.cmptMode : '';
      if (calcRuleData.length > 0) {
        calcRuleData.forEach((item) => {
          if (item.FCTR.length > 0) {
            item.FCTR.forEach((Item) => {
              Item.COND_NO = item.COND_NO;
            });
          }
        });
      }
      const inputTreeData = data.cntntTmpl !== '' && data.cntntTmpl !== undefined ? data.cntntTmpl : '';
      const mblx = data.tgtTp !== '' ? data.tgtTp : '';
      this.setState({ mblx, fffw, calcRuleData, clickKey: 0, zbData, jsfsType });

      this.FetchqueryAvailableIndex(this.props.tgtTp, data.jsonCalcRule, inputTreeData, zbData, jsfsType);
      //计算方式为3是导入 不可能为3
      if (jsfsType === '3') {
        this.FetchqueryEventImportDetail(sjID, data.tgtTp);
      }
    }
  }
  FetchqueryAvailableIndex = (tgtTp, value, inputTreeData, zbData, jsfsType) => {
    const prams = {
      tgtTp,
      evntCmptRule: value,
    };

    FetchqueryAvailableIndex(prams).then((ret = {}) => {
      const { code, variableRecord } = ret;
      if (code > 0 && variableRecord.length > 0) {
        this.setNrmbTreeData(variableRecord, zbData, inputTreeData, jsfsType);
        this.setState({ variableRecord });
      }
    }).catch(((error) => {
      // const variableRecord = [{
      //   'fctrId': "105",
      //   'fctrNm': "督导因子",
      //   'varCode': "CJRQ",
      //   'varCodeUse': "${CJRQ}",
      //   'varDesc': "创建日期",
      //   'varDescUse': "${创建日期}",
      //   'varNo': "1"
      // }]
      // this.setNrmbTreeData(variableRecord, zbData, inputTreeData, jsfsType);
      message.error(!error.success ? error.message : error.note);
    }));
  }

  setNrmbTreeData = (variableRecord, zbData, inputTreeData, jsfsType) => {
    const nrmbList = JSON.parse(JSON.stringify(variableRecord))
    const nrmbTreeData = [];
    if (jsfsType === '3' && zbData.length > 0) {
      zbData.forEach((item) => {
        const newTreeList = nrmbList.filter(treeItem => treeItem.varDesc === item.IDX_DESC);
        if (newTreeList.length === 0) {
          const data = { fctrNm: '事件指标', varCode: item.IDX_CODE, varDesc: item.IDX_DESC };
          nrmbList.push(data);
        }
      });
    }
    nrmbList.forEach((item) => {
      let Item = {};
      if (nrmbTreeData.length === 0) {
        Item = { title: item.fctrNm, key: nrmbTreeData.length, children: [{ title: item.varDesc, key: 0 }] };
        nrmbTreeData.push(Item);
      } else {
        const newTreeList = nrmbTreeData.filter((treeItem) => {
          if (treeItem.title.indexOf(item.fctrNm) !== -1) {
            return true;
          }
          return false;
        });
        if (newTreeList.length === 0) {
          Item = {
            title: item.fctrNm, key: nrmbTreeData.length,
            children: [{ title: item.varDesc, key: 0 }]
          };
          nrmbTreeData.push(Item);
        } else {
          const index = newTreeList[0].key;
          const childrenItem = { title: item.varDesc, key: nrmbTreeData[index].children.length };
          nrmbTreeData[index].children.push(childrenItem);
        }
      }
    });
    if (inputTreeData !== undefined && inputTreeData !== '') {
      for (const item of nrmbList) {
        const re = new RegExp(`\\\${${item.varCode}}`, 'g');
        inputTreeData = inputTreeData.replace(re, `\${${item.varDesc}}`);
      }
    }
    this.setState({ inputTreeData: inputTreeData || '', nrmbTreeData, nrmbList });
    //this.setState({});
  }
  FetchqueryEventImportDetail = (sjID, mblx) => {
    const prams = {
      evntId: sjID,
      tgtTp: mblx,
    };
    FetchqueryEventImportDetail(prams).then((ret = {}) => {
      const { code, records } = ret;
      let drxxTableData = [];
      if (code > 0) {
        drxxTableData = records;
        this.setState({ drxxTableData });
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  }
  setType = (value) => {
    this.props.setType(value);
  }
  //点击了编辑
  clickEdit = () => {
    this.props.setType(false);
  }
  //点击提交 修改弹窗中的信息
  clickPreserve = (value) => {
    this.setState({
      visibleType: value,
      visible: true,
      modalTips: '是否保存页面上的修改？',
    });
  }
  //点击取消页面修改
  clickCancel = (value) => {
    this.setState({
      visibleType: value,
      visible: true,
      modalTips: '是否取消页面上的修改？',
    });
  }
  //提交页面修改
  handleOk = (e) => {
    const { eventInfoData, sjID } = this.props;
    const { visibleType } = this.state;
    this.setState({
      visible: false,
    });
    e.preventDefault();
    if (visibleType === '1') { // 保存按钮
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.createFun(values);
        }
      });
    } else { // 取消按钮
      if (this.props.addType === 'add') {
        this.props.fetchCompanyName();
      }
      this.fetchTableData(eventInfoData[0], sjID);
      this.props.setType(true);
    }
  }
  //验证后提交修改
  createFun = (values) => {
    const { tgtTp, sjID } = this.props;
    const { inputTreeData, mblx, fffw, calcRuleData, jsonMsg, jsonTask, zbData, jsfsType, nrmbList } = this.state;

    const task = fffw.filter(Item => Item === '1');
    const msg = fffw.filter(Item => Item === '2' || Item === '4');
    //云 督导类型的目标类形只有3
    // const msgValue = mblx === '3' || jsfsType === '3' ? undefined : this.releaseRule.getMsgFormData();
    // const taskValue = mblx === '3' || jsfsType === '3' ? undefined : this.releaseRule.getTaskFormData();
    const msgValue = undefined;
    const taskValue = undefined;
    let dstrRng = 0;
    fffw.forEach((item) => {
      dstrRng += Number(item);
    });
    let evntCmptRule = [];
    let taskAlotRule = {};
    let type = true;
    if (taskValue !== undefined) {
      if (taskValue.SJYQ === undefined) {
        message.error('任务分配规则的时间要求不允许为空!');
        type = false;
      }
      if (taskValue.RWYQ === '') {
        message.error('任务分配规则的任务要求不允许为空!');
        type = false;
      }
      if (taskValue.FWLB === '') {
        message.error('任务分配规则的服务类别不允许为空!');
        type = false;
      }
      if (taskValue.RWSFSH === '') {
        message.error('任务分配规则的任务是否审核不允许为空!');
        type = false;
      }
      if (taskValue.TS === '') {
        message.error('任务分配规则的天数不允许为空!');
        type = false;
      }
      if (mblx !== '2') {
        if (taskValue.FPGZ.length === 0) {
          message.error('任务分配规则的分配规则不允许为空！');
          type = false;
        } else {
          taskAlotRule.ALOT_TP = { ALOT_RULE_TP: taskValue.FPGZ[0], SEC_ALOT_TP: taskValue.FPGZ[1] || '0' };
          taskAlotRule.ALOT_RULE = [];
          if (taskValue.FPGZ.indexOf('1') > -1) {
            if (task.length > 0 && jsonTask.length === 0) {
              message.error('任务分配规则的已选关系不允许为空!');
              type = false;
            } else {
              const alotTp = taskValue.FPGZ.indexOf('1') + 1;
              jsonTask.forEach(item => {
                const { RLT_TP, PRI } = item;
                taskAlotRule.ALOT_RULE.push({ ALOT_TP: alotTp, RLT_TP, PRI, ROLE_ID: '', TEAM_ID: '', EMPE_CL: '' });
              });
            }
          }
          if (taskValue.FPGZ.indexOf('2') > -1) {
            if (taskValue.JSPJFP.length === 0) {
              message.error('任务分配规则的角色平均分配不允许为空!');
              type = false;
            } else {
              const alotTp = taskValue.FPGZ.indexOf('2') + 1;
              taskValue.JSPJFP.forEach((val, i) => {
                taskAlotRule.ALOT_RULE.push({ ALOT_TP: alotTp, PRI: i, RLT_TP: '', ROLE_ID: val, TEAM_ID: '', EMPE_CL: '' });
              });
            }
          }
          if (taskValue.FPGZ.indexOf('3') > -1) {
            if (taskValue.TDPJFP.length === 0) {
              message.error('任务分配规则的团队平均分配不允许为空!');
              type = false;
            } else {
              const alotTp = taskValue.FPGZ.indexOf('3') + 1;
              taskValue.TDPJFP.forEach((val, i) => {
                taskAlotRule.ALOT_RULE.push({ ALOT_TP: alotTp, PRI: i, RLT_TP: '', ROLE_ID: '', TEAM_ID: val, EMPE_CL: '' });
              });
            }
          }
          if (taskValue.FPGZ.indexOf('4') > -1) {
            if (taskValue.RYLBPJFP.length === 0) {
              message.error('任务分配规则的人员类别平均分配不允许为空!');
              type = false;
            } else {
              const alotTp = taskValue.FPGZ.indexOf('4') + 1;
              taskValue.RYLBPJFP.forEach((val, i) => {
                taskAlotRule.ALOT_RULE.push({ ALOT_TP: alotTp, PRI: i, RLT_TP: '', ROLE_ID: '', TEAM_ID: '', EMPE_CL: val });
              });
            }
          }
        }
      }
    }
    if (msgValue !== undefined) {
      if (msgValue.XXLM === '') {
        message.error('消息推送规则的消息栏目不允许为空!');
        type = false;
      }
      if (msgValue.XXCL === '') {
        message.error('消息推送规则的消息策略不允许为空!');
        type = false;
      }
      if (msgValue.YXSJ === '') {
        message.error('消息推送规则的有效时间不允许为空!');
        type = false;
      }
      if (msgValue.XXSFSH === '') {
        message.error('消息推送规则的消息是否审核不允许为空!');
        type = false;
      }
    }

    if (calcRuleData.length > 0) {
      calcRuleData.forEach((item) => {
        if (item.FCTR === '' || item.FCTR.length === 0) {
          message.error('规则定义错误，请检查！');
          type = false;
        }
      });
    }
    if (inputTreeData === '' || inputTreeData === undefined) {
      message.error('内容模板不能为空!');
      type = false;
    }
    if (!type) {
      return;
    }
    if (calcRuleData.length > 0) {
      evntCmptRule = calcRuleData;
      evntCmptRule.forEach((item) => {
        item.FCTR.forEach((Item) => {
          delete Item.COND_NO;
        });
      });
    }

    let cntntTmpl = inputTreeData;
    for (const item of nrmbList) {
      const re = new RegExp(`\\\${${item.varDesc}}`, 'g');
      cntntTmpl = cntntTmpl.replace(re, `\${${item.varCode}}`);
    }
    jsonMsg.forEach((item) => {
      let nr = item.TMPL_CNTNT;
      for (const item of nrmbList) {
        const re = new RegExp(`\\\${${item.varDesc}}`, 'g');
        nr = nr.replace(re, `\${${item.varCode}}`);
      }
      item.TMPL_CNTNT = nr;
    });

    //督导的目标类型只有3
    const prams = {
      oprTp: sjID !== '' ? 2 : 1,
      evntId: sjID !== '' ? sjID : '',
      evntNm: values.YZMC,
      evntDesc: values.SJMS,
      ruleExpl: values.GZSM,
      sbrdStg: values.SSJD,
      cmptMode: values.JSFS,
      impt: values.ZYCD,
      wthrRcd: '0',
      wthrRvwTask: task.length === 0 ? '0' : taskValue.RWSFSH,
      wthrRvwMsg: msg.length === 0 ? '0' : msgValue.XXSFSH,
      avlRng: '1',
      avlStfTp: '',
      cntntTmpl,
      alowDefRng: '0',
      dstrRng: '0',
      taskRqmt: taskValue !== undefined ? taskValue.RWYQ : '',
      execTmRqmt: taskValue !== undefined ? taskValue.SJYQ : '',
      execTmRqmtDays: taskValue !== undefined && taskValue.SJYQ === '99' ? taskValue.TS : '',
      srvcTp: taskValue !== undefined ? taskValue.FWLB : '',
      msgCol: msgValue !== undefined ? msgValue.XXLM : '',
      msgSttg: msgValue !== undefined ? msgValue.XXCL : '',
      msgVldTmLgth: msgValue !== undefined ? msgValue.YXSJ : '',
      msgPreSndTm: msgValue !== undefined ? moment(msgValue.YFSSJ).format('HH:mm:ss') : '',
      evntCmptRule: calcRuleData.length === 0 || jsfsType === '3' ? '' : JSON.stringify(evntCmptRule),
      taskAlotRule: mblx === '2' ? '' : JSON.stringify(taskAlotRule),
      msgSndRule: msg.length === 0 || jsonMsg.length === 0 ? '' : JSON.stringify(jsonMsg),
      tgtTp,
      idxJson: zbData.length === 0 ? '' : JSON.stringify(zbData),
    };
    FetcheventMaintenance(prams).then((ret = {}) => {
      const { code, note } = ret;
      if (code > 0) {
        message.success('操作成功！');
        this.props.setType(true);
        this.props.setData('addType', '');
        this.props.fetchCompanyName(note);
      }
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  setData = (field, value) => {
    this.setState({
      [field]: value,
    });
    if (field === 'calcRuleData') {
      this.FetchqueryAvailableIndex(this.props.tgtTp, '');
    }
    if (field === 'jsfsType' && value === '3' && this.props.addType !== 'add') {
      this.FetchqueryEventImportDetail(this.props.sjID, value);
    }
    if (field === 'zbData') {
      const { variableRecord, inputTreeData, jsfsType } = this.state;
      this.setNrmbTreeData(variableRecord, value, inputTreeData, jsfsType);
    }
  };
  setInputTreeData = (value, position) => {
    const { inputTreeData } = this.state;
    const str = `\${${value}}`;
    let newData = inputTreeData;
    if (newData === '' || newData === undefined) {
      newData = str;
    } else if (position.start === position.end) {
      newData = newData.slice(0, position.start) + str + newData.slice(position.start);
    } else {
      newData = newData.slice(0, position.start) + str + newData.slice(position.end);
    }
    this.setState({
      inputTreeData: newData,
      inputTreeType: true,
      inputTreeLength: str.length,
      position,
    });
  };

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }
  //处理提交事件
  handleOkYYB = () => {
    const { checkedKeys } = this.state;
    const { gxyybDatas } = this.props;
    const yybList = [];
    checkedKeys.forEach((item) => {
      const tags = gxyybDatas.filter(Item => Item.yybid === item);
      yybList.push(tags[0]);
    });
    // const newTagList = [];
    const checkedKeysList = [];
    yybList.forEach((item) => {
      let flag = true;
      checkedKeys.forEach((Item) => {
        if (item.fid === Item) {
          flag = false;
        }
      });
      if (flag) {
        // newTagList.push({
        //   bqmc: item.yybmc,
        //   id: item.yybid,
        //   checked: true,
        // });
        checkedKeysList.push(item.yybid);
      }
    });
    this.setState({ checkedKeys: checkedKeysList, visibleYYB: false });
  }
  handleCancelYYB = () => {
    this.setState({
      visibleYYB: false,
    });
  }
  onChange = (value) => {
    const { calcRuleData, inputTreeData } = this.state;
    const ruleData = calcRuleData.length === 0 ? '' : JSON.stringify(calcRuleData);
    this.setState({
      mblx: value,
    });
    this.fetchYzflrData(value);
    this.fetchFactorTree(value);
    this.FetchqueryAvailableIndex(value, ruleData, inputTreeData);
  }
  onChangeFB = (value) => {
    this.setState({
      fffw: value,
    });
  }
  onCalcRuleDelect = (value, key) => {
    const { calcRuleData, inputTreeData } = this.state;
    if (value === '') {
      calcRuleData.splice(key, 1);
      calcRuleData.forEach((item, index) => {
        if (index >= key) {
          item.COND_NO = (Number(item.COND_NO) - 1).toString();
          item.FCTR.forEach((fctrItem) => {
            fctrItem.COND_NO = (Number(fctrItem.COND_NO) - 1).toString();
          });
        }
      });
    } else {
      calcRuleData[key].FCTR.splice(value, 1);
    }
    this.setState({ calcRuleData });
    if (calcRuleData.length === 0) {
      this.FetchqueryAvailableIndex(this.props.tgtTp, '', inputTreeData);
    } else {
      this.FetchqueryAvailableIndex(this.props.tgtTp, JSON.stringify(calcRuleData), inputTreeData);
    }
  }
  onCalcRuleAdd = () => {
    const { calcRuleData, inputTreeData } = this.state;
    const clickKey = calcRuleData.length;
    const item = {
      COND_NO: (calcRuleData.length + 1).toString(),
      FCTR: [],
    };
    calcRuleData.push(item);
    this.setState({ clickKey, calcRuleData });
    this.FetchqueryAvailableIndex(this.props.tgtTp, JSON.stringify(calcRuleData), inputTreeData);
  }
  setCalcRuleData = (foctorId) => {
    const { calcRuleData, clickKey, inputTreeData } = this.state;
    if (calcRuleData.length === 0) {
      message.error('请先增加并集条件!');
    } else {
      FetchQueryMotFactorInfo({ fctrId: foctorId }).then((ret = {}) => {
        const { records = [] } = ret;
        if (records && records.length > 0) {
          const FCTR_VAR = [];
          const varData = records[0].fctrVar !== '' ? JSON.parse(records[0].fctrVar) : [];
          if (varData.length > 0) {
            varData.forEach((item) => {
              const varItem = {
                VAR_VAL: '',
                ...item,
              };
              FCTR_VAR.push(varItem);
            });
          }
          const FCTR = calcRuleData[clickKey].FCTR;
          const fctrItem = {
            FCTR_NO: (calcRuleData[clickKey].FCTR.length + 1).toString(),
            FCTR_ID: records[0].fctrId,
            FCTR_NM: records[0].fctrNm,
            FCTR_VAR: FCTR_VAR.length > 0 ? FCTR_VAR : '',
            COND_NO: calcRuleData[clickKey].COND_NO,
          };
          FCTR.push(fctrItem);
          calcRuleData[clickKey].FCTR = FCTR.length > 0 ? FCTR : '';
          this.setState({ calcRuleData });
          this.FetchqueryAvailableIndex(this.props.tgtTp, JSON.stringify(calcRuleData), inputTreeData);
        }
      }).catch(((error) => {
        message.error(!error.success ? error.message : error.note);
      }));
    }
  }
  onChangeInput = (value, indexFCTR, index) => {
    const { calcRuleData, clickKey, inputTreeData } = this.state;
    calcRuleData[clickKey].FCTR[indexFCTR].FCTR_VAR[index].VAR_VAL = value;
    this.setState({ calcRuleData });
    this.FetchqueryAvailableIndex(this.props.tgtTp, JSON.stringify(calcRuleData), inputTreeData);
  }
  onChangeSelect = (value, indexFCTR, index) => {
    const { calcRuleData, clickKey, inputTreeData } = this.state;
    calcRuleData[clickKey].FCTR[indexFCTR].FCTR_VAR[index].VAR_VAL = value;
    this.setState({ calcRuleData });
    this.FetchqueryAvailableIndex(this.props.tgtTp, JSON.stringify(calcRuleData), inputTreeData);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, yzflData, inputTreeData, visible, modalTips, visibleYYB, checkedKeys,
      bqData, treeData, nrmbTreeData, mblx, calcRuleData, clickKey, inputTreeType,
      inputTreeLength, position, jsfsType, fffw, variableRecord, drxxTableData } = this.state;
    const { dictionary = {}, type, eventInfoData, gxyybTree, addType, sjID } = this.props;

    const { [getDictKey('tgtTp')]: tgtTpDicts = [],//目标类型
      [getDictKey('jsms')]: jsfsDicts = [],        //计算方式
      [getDictKey('zycd')]: zycdDicts = [],        //重要程度
      [getDictKey('zdyfw')]: zdyfwDicts = [],      //规则定义的范围
      [getDictKey('fffw')]: fffwDicts = []
    } = dictionary; // MOT字典
    const optionsZDYFW = [];
    const sfDicts = [{ ibm: '0', note: '否' }, { ibm: '1', note: '是' }];
    zdyfwDicts.forEach((item) => {
      optionsZDYFW.push({ label: `允许${item.note}修改`, value: item.ibm });
    });
    const optionsFFFW = [{ label: fffwDicts[0].note, value: fffwDicts[0].ibm }];
    if (mblx === '1') {
      const tags = fffwDicts.filter(Item => Item.ibm === '2');
      optionsFFFW.push({ label: tags[0].note, value: tags[0].ibm });
    } else if (mblx === '2') {
      const tags = fffwDicts.filter(Item => Item.ibm === '4');
      optionsFFFW.push({ label: tags[0].note, value: tags[0].ibm });
    }
    let tpMc = '';          //目标类型
    let flMc = '';          //所属阶段
    let jsms = '';          //计算方式名称
    let importantCount = 0; //重要程度星星总数
    let importantLevel = 0; //重要程度星星数量
    const zdyfw = [];
    let Data = '';
    let zjcfsj = '';
    //eventInfoData  初始化数据
    if (eventInfoData.length > 0) {
      Data = eventInfoData[0];
      tgtTpDicts.forEach((item) => {
        if (item.ibm === Data.tgtTp) {
          tpMc = item.note;
        }
      });
      yzflData.forEach((item) => {
        if (item.DIC_CODE === Data.sbrdStg) {
          flMc = item.DIC_NOTE;
        }
      });
      jsfsDicts.forEach((item) => {
        if (item.ibm === Data.cmptMode) {
          jsms = item.note;
        }
      });
      if (zycdDicts.length > 0) {
        importantCount = zycdDicts.length;
        importantLevel = Data.impt;
      }
      sfDicts.forEach((item) => {
        if (item.ibm === Data.wthrRcd) {
          zjcfsj = item.note;
        }
      });
      zdyfwDicts.forEach((item) => {
        if (item.ibm === Data.alowDefRng || Data.alowDefRng === '3') {
          zdyfw.push(item.ibm);
        }
      });
    }

    return (
      <Form className="factor-variable-form" style={{ height: '100%' }}>
        <Scrollbars autoHide style={{ width: '100%' }} >
          <Row style={{ borderBottom: '1px solid #e8e8e8', display: 'flex' }}>
            {type ? <span className="factor-title" style={{ position: 'relative', top: 8, width: '90%' }}>{Data.evntNm}</span>
              : (
                <Form.Item style={{ marginBottom: '1.132rem', marginLeft: '2.72rem', width: '80%' }}>
                  {getFieldDecorator('YZMC', { initialValue: Data.evntNm !== undefined ? Data.evntNm : '' })(<Input maxLength={25} style={{ width: '240px', color: '#333333', fontWeight: 'bold', fontSize: 16, border: type ? 0 : '' }} />)}
                </Form.Item>
              )}
            <span style={{ display: 'inline-flex', float: 'right' }}>
              {type ? <Button className="factor-bottom m-btn-border-headColor" style={{ margin: '0.544rem 4.6rem 1.32rem' }} loading={loading} onClick={() => this.clickEdit()} >编辑</Button>
                : <Button style={{ textAlign: 'center', margin: '0.544rem 4.08rem 1.32rem' }} className="factor-bottom m-btn-border-headColor" htmlType="submit" onClick={() => this.clickPreserve('1')} >提交</Button>}
              {type ? '' : (<Button size="default" className="mot-cancel-btn" style={{ marginTop: '0.544rem', marginRight: '4.08rem' }} onClick={() => this.clickCancel('2')} >取消</Button>)}
            </span>
          </Row>
          <Row style={{ paddingBottom: 20 }}>
            <div className="factor-content-title">基本信息</div>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span>目标类型：{tpMc}</span>
                  : (
                    <Form.Item label={(<span>目标类型</span>)}>
                      {getFieldDecorator('MBLX', { initialValue: Data.tgtTp !== undefined ? Data.tgtTp : '', rules: [{ required: true, message: '基本信息的目标类型不允许为空!' }] })(<Select
                        style={{ width: '20%', minWidth: '140px' }}
                        onChange={this.onChange}
                        disabled={addType !== 'add'}
                      >
                        {tgtTpDicts.map(item => <Option value={item.ibm}>{item.note}</Option>)}
                      </Select>)}
                    </Form.Item>
                  )}
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span>所属阶段：{flMc}</span>
                  : (
                    <Form.Item label={(<span>所属阶段</span>)}>
                      {getFieldDecorator('SSJD', { initialValue: Data.sbrdStg !== undefined ? Data.sbrdStg : '', rules: [{ required: true, message: '基本信息的所属阶段不允许为空!' }] })
                        (<Select
                          style={{ width: '45%', minWidth: '140px', textAlign: 'center' }}
                        >
                          {yzflData.map(item => <Option value={item.DIC_CODE}>{item.DIC_NOTE}</Option>)}
                        </Select>)}
                    </Form.Item>
                  )}
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span>计算方式：{jsms}</span>
                  : (
                    <Form.Item label={(<span>计算方式</span>)}>
                      {getFieldDecorator('JSFS', { initialValue: Data.cmptMode !== undefined ? Data.cmptMode : '', rules: [{ required: true, message: '基本信息的计算方式不允许为空!' }] })
                        (<Radio.Group style={{ marginTop: '0.5rem' }} onChange={e => this.setData('jsfsType', e.target.value)} >
                          {jsfsDicts.map(item => (mblx === '3' && item.ibm === '2' ? '' :
                            <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>))}</Radio.Group>)}
                    </Form.Item>
                  )}
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span>重要程度：
                  <Rate style={{ fontSize: '16px' }} disable count={importantCount} value={+importantLevel} /></span>
                  : (
                    <Form.Item label={(<span >重要程度</span>)}>
                      {getFieldDecorator('ZYCD',
                        {
                          initialValue: Data.impt !== undefined ? Number(Data.impt) : 1,
                          rules: [{ required: true, message: '基本信息的重要程度不允许为空!' }]
                        })
                        (<Rate style={{ fontSize: '16px', marginTop: '0.3rem', }} count={+importantCount} />)}
                    </Form.Item>
                  )}
              </div>
            </Col>

            {jsfsType === '3' || mblx === '3' ? '' : (
              <Col xs={24} sm={12} md={12} lg={12}>
                <div className={type ? 'factor-item' : ''}>
                  {type ? <span>记录最近触发时间：{zjcfsj}</span>
                    : (
                      <Form.Item label={(<span>记录最近触发时间</span>)}>
                        {getFieldDecorator('ZJCFSJ', { initialValue: mblx === '3' ? '0' : Data.wthrRcd !== undefined ? Data.wthrRcd : '0', rules: [{ required: true, message: '基本信息的最近触发时间不允许为空!' }] })(<Radio.Group disabled={mblx === '3'} >
                          {sfDicts.map(item => <Radio className="mot-radio" value={item.ibm}>{item.note}</Radio>)}</Radio.Group>)}
                      </Form.Item>
                    )}
                </div>
              </Col>
            )}
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span style={{ whiteSpace: 'pre-line' }}>事件描述：{Data.evntDesc}</span>
                  : (
                    <Form.Item label={(<span>事件描述</span>)} style={{ marginRight: '2.6rem' }}>
                      {getFieldDecorator('SJMS', { initialValue: Data.evntDesc !== undefined ? Data.evntDesc : '', rules: [{ required: true, message: '基本信息的事件描述不允许为空!' }] })(<Input.TextArea maxLength={100} autoSize={{ minRows: 2, maxRows: 4 }} />)}
                    </Form.Item>
                  )}
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={type ? 'factor-item' : ''}>
                {type ? <span style={{ whiteSpace: 'pre-line' }}>规则说明：{Data.ruleExpl}</span>
                  : (
                    <Form.Item label={(<span>规则说明</span>)} style={{ marginRight: '2.6rem' }}>
                      {getFieldDecorator('GZSM', { initialValue: Data.ruleExpl !== undefined ? Data.ruleExpl : '', rules: [{ required: true, message: '基本信息的规则说明不允许为空!' }] })
                        (<Input.TextArea maxLength={100} autoSize={{ minRows: 2, maxRows: 4 }} />)}
                    </Form.Item>
                  )}
              </div>
            </Col>
          </Row>
          {
            <Row style={{ paddingBottom: 20 }}>
              <div className="factor-content-title">规则定义
                {mblx === '3' ? '' :
                  <span className="event-check">{getFieldDecorator('ZDYFW', { initialValue: zdyfw })
                    (<Checkbox.Group disabled={type} options={optionsZDYFW} className={type ? 'mot-yyb-check' : ''} />)}
                  </span>
                }
              </div>
              <EventCalcRuleData type={type} data={calcRuleData} treeData={treeData} clickKey={clickKey} setCalcRuleData={this.setCalcRuleData} setData={this.setData}
                onCalcRuleDelect={this.onCalcRuleDelect} onCalcRuleAdd={this.onCalcRuleAdd}
                onChangeInput={this.onChangeInput} onChangeSelect={this.onChangeSelect}
                handleOnkeyWordFactor={this.handleOnkeyWordFactor} />
            </Row>
          }
          <Row style={{ paddingBottom: 20 }}>
            <div className="factor-content-title">内容模板</div>
            <InputTreeModal type={type} inputTreeType={inputTreeType} inputTreeLength={inputTreeLength}
              position={position} data={inputTreeData} bqData={bqData} treeData={nrmbTreeData}
              setInputTreeData={this.setInputTreeData} setData={this.setData} xskz={false} />
          </Row>
          {/* {mblx === '3' || jsfsType === '3' ? '' : (
            <Row style={{ paddingBottom: 20 }}>
              <div className="factor-content-title">发布规则<span className="event-check">{getFieldDecorator('FFFW', { initialValue: fffw })(<Checkbox.Group disabled={type} options={optionsFFFW} onChange={this.onChangeFB} className={type ? 'mot-yyb-check' : ''} />)}</span></div>
              <ReleaseRule type={type} data={Data} treeData={nrmbTreeData} fffw={fffw}
                mblx={mblx} variableRecord={variableRecord} setData={this.setData}
                dictionary={dictionary} ref={(c) => { this.releaseRule = c; }} />
            </Row>
          )} */}
          {jsfsType === '3' && addType !== 'add' ? <ImportInformation type={type} sjID={sjID} mblx={mblx} Data={drxxTableData} setData={this.setData} FetchqueryEventImportDetail={this.FetchqueryEventImportDetail} /> : ''}
          <Modal
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width="500px"
            getContainer={false}
          >
            <p>{modalTips}</p>
          </Modal>
          <Modal
            visible={visibleYYB}
            onOk={this.handleOkYYB}
            onCancel={this.handleCancelYYB}
            width="500px"
            getContainer={false}
          >
            <p style={{ height: '500px', overflowY: 'auto' }}><Tree
              blockNode
              checkable
              checkedKeys={checkedKeys}
              treeData={gxyybTree.datas}
              defaultExpandAll
              onCheck={this.onCheck}
              className="mot-tree"
            />
            </p>
          </Modal>
        </Scrollbars>
      </Form >
    );
  }
}

export default Form.create()(RightMainContent);
