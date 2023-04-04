import React, {Fragment} from 'react';
import moment from 'moment';
import {
  Tag,
  Steps,
  Input,
  Select,
  DatePicker,
  Icon,
  Radio,
  message,
  Modal,
  Spin,
  Form,
  Row,
  Col,
  InputNumber,
  Button,
  TreeSelect,
  Tree,
  Tooltip,
  Tabs, Divider, Upload, Popconfirm, Table,
} from 'antd';
import {connect} from 'dva';
import GridLayout from 'react-grid-layout';
import {
  FetchQueryProjectDetails,
  FetchQuerySoftwareList,
  FetchQueryProjectLabel,
  FetchQueryOrganizationInfo,
  FetchQueryBudgetProjects,
  OperateCreatProject,
  FetchQueryMilepostInfo,
  FetchQueryMemberInfo,
  FetchQueryMilestoneStageInfo,
  FetchQueryMatterUnderMilepost, FetchQueryStationInfo
} from "../../../services/projectManage";
import {DecryptBase64, EncryptBase64} from '../../Common/Encrypt';
import config from '../../../utils/config';
import LBDialog from 'livebos-frame/dist/LBDialog';
import RiskOutline from './RiskOutline';
import {
  FetchQueryGysInZbxx,
  FetchQueryHTXXByXQTC,
  FetchQueryZBXXByXQTC,
  QueryPaymentAccountList, UpdateHTXX, UpdateProjectOtherInfo, UpdateZbxx
} from "../../../services/pmsServices";
import BridgeModel from "../../Common/BasicModal/BridgeModel";
import TableFullScreen from "../LifeCycleManagement/ContractInfoUpdate/TableFullScreen";
import OthersInfos from "./OthersInfos";

const {Option, OptGroup} = Select;
const {api} = config;
const {confirm} = Modal;
const {TreeNode} = TreeSelect;
const {Step} = Steps;
const {TabPane} = Tabs;

const PASE_SIZE = 10;  //关联供应商选择器分页长度
//-----------付款详情--------------//
const EditableContext = React.createContext(1);

const EditableRow = ({form, index, ...props}) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  )
};
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  save = e => {
    const {record, handleSave, formdecorate} = this.props;
    formdecorate.validateFields(['fkqs' + record['id'], 'bfb' + record['id'], 'fksj' + record['id'], 'fkje' + record['id']], (error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({...record, ...values});
    });

  };

  getTitle = (dataIndex) => {
    switch (dataIndex) {
      case 'fkqs':
        return '期数';
      case 'bfb':
        return '占比';
      case 'fkje':
        return '付款金额';
      case 'fksj':
        return '付款时间';
      case 'zt':
        return '状态';
      default:
        break;
    }
  }
  handleBfbChange = (form, id) => {
    let obj = {};
    obj['fkje' + id] = String(Number(form.getFieldValue('bfb' + id)) * Number(form.getFieldValue('contractValue')))
    form.setFieldsValue({...obj});
    this.save();
  };
  renderItem = (form, dataIndex, record) => {
    switch (dataIndex) {
      case 'fksj':
        return form.getFieldDecorator(dataIndex + record['id'], {
          initialValue: moment(record[dataIndex + record['id']]) || null,
        })(<DatePicker ref={node => (this.input = node)}
                       onChange={(data, dataString) => {
                         const {record, handleSave} = this.props;
                         form.validateFields(['fkqs' + record['id'], 'bfb' + record['id'], 'fksj' + record['id'], 'fkje' + record['id']], (error, values) => {
                           // console.log('values', values);
                           if (error && error[e.currentTarget.id]) {
                             return;
                           }
                           let newValues = {};
                           newValues = {...values};
                           for (let i in newValues) {
                             if (i === 'fksj' + record['id']) {
                               newValues[i] = dataString;
                             }
                           }
                           // this.toggleEdit();
                           handleSave({...record, ...newValues});
                         });
                       }}
        />);
      case 'bfb':
        return form.getFieldDecorator(dataIndex + record['id'], {
          initialValue: String(record[dataIndex + record['id']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.handleBfbChange.bind(this, form, record['id'])}/>);
      case 'fkje':
        return form.getFieldDecorator(dataIndex + record['id'], {
          initialValue: String(record[dataIndex + record['id']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
      default:
        return form.getFieldDecorator(dataIndex + record['id'], {
          initialValue: String(record[dataIndex + record['id']]),
        })(<Input style={{textAlign: 'center'}}
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onBlur={this.save}/>);
    }
  }
  renderCell = form => {
    // this.form = form;
    const {dataIndex, record, children, formdecorate} = this.props;
    const {editing} = this.state;
    return (true ? (
        <Form.Item style={{margin: 0}}>
          {this.renderItem(formdecorate, dataIndex, record)}
        </Form.Item>) :
      <div
        className="editable-cell-value-wrap"
        // onClick={this.toggleEdit}
      >
        {children}
      </div>);
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

function getID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//-----------其他供应商--------------//
const EditableContextQT = React.createContext(2);
const EditableRowQT = ({form, index, ...props}) => {
  return (
    <EditableContextQT.Provider value={form}>
      <tr {...props} />
    </EditableContextQT.Provider>
  )
};
const EditableFormRowQT = Form.create()(EditableRowQT);

class EditableCellQT extends React.Component {
  state = {
    editing: false,
    isGysOpen: false,
    isSkzhOpen: false,
  };
  save = e => {
    const {record, handleSave, formdecorate} = this.props;
    formdecorate.validateFields(['glgys' + record['id'], 'gysmc' + record['id'], 'gysskzh' + record['id']], (error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({'id': record['id'], ...values});
    });
  };

  getTitle = (dataIndex) => {
    switch (dataIndex) {
      case 'gysmc':
        return '供应商名称';
      case 'gysskzh':
        return '供应商收款账号';
      default:
        break;
    }
  }

  onGysChange = (v) => {
    const {record, handleSave, formdecorate} = this.props;
    let obj = {
      ['gysmc' + record['id']]: v
    }
    handleSave({'id': record['id'], ...obj});
  };
  onSkzhChange = (v) => {
    const {record, handleSave, formdecorate} = this.props;
    let obj = {
      ['gysskzh' + record['id']]: v
    }
    handleSave({'id': record['id'], ...obj});
  };

  getFormDec = (form, dataIndex, record) => {
    const {skzhdata, gysdata} = this.props;
    switch (dataIndex) {
      case 'gysmc':
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              required: true,
              message: `${this.getTitle(dataIndex)}不允许空值`,
            },
          ],
          initialValue: record[dataIndex + record['id']],
        })(
          <Select
            style={{width: '100%', borderRadius: '1.1904rem !important'}}
            placeholder="请选择供应商"
            onChange={this.onGysChange}
            showSearch
            open={this.state.isGysOpen}
            onDropdownVisibleChange={(visible) => this.setState({isGysOpen: visible})}
          >
            {
              gysdata?.map((item = {}, ind) => {
                return <Option key={ind} value={item.gysmc}>{item.gysmc}</Option>
              })
            }
          </Select>
        );
      case 'gysskzh':
        return form.getFieldDecorator(dataIndex + record['id'], {
          rules: [
            {
              required: true,
              message: `${this.getTitle(dataIndex)}不允许空值`,
            },
          ],
          initialValue: String(record[dataIndex + record['id']]),
        })(
          <Select
            style={{width: '100%', borderRadius: '1.1904rem !important'}}
            placeholder="请选择供应商收款账号"
            onChange={this.onSkzhChange}
            showSearch
            open={this.state.isSkzhOpen}
            onDropdownVisibleChange={(visible) => this.setState({isSkzhOpen: visible})}
          >
            {
              skzhdata?.map((item = {}, ind) => {
                return <Option key={ind} value={item.khmc}>
                  {item.khmc}
                  {this.state.isSkzhOpen && <div style={{fontSize: '0.6em'}}>{item.yhkh}</div>}
                </Option>
              })
            }
          </Select>
        );
      default:
        return <Input style={{textAlign: 'center'}}
                      ref={node => (this.input = node)}
                      onPressEnter={this.save}
                      onBlur={this.save}/>;
    }
  };

  renderCell = form => {
    const {children, dataIndex, record, formdecorate} = this.props;
    return <Form.Item style={{margin: 0}}>
      {this.getFormDec(formdecorate, dataIndex, record)}
    </Form.Item>
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContextQT.Consumer>{this.renderCell}</EditableContextQT.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}


class EditProjectInfoModel extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    current: 0,
    minicurrent: 0,
    type: false, // 是否是首页跳转过来的
    operateType: '', // 操作类型
    height: 0, // 人员信息下拉框高度设置
    softwareList: [], // 软件清单列表
    projectLabelList: [], // 项目标签列表
    organizationList: [], // 组织机构列表
    organizationTreeList: [], // 树形组织机构列表
    nowTime: moment(new Date()).format("YYYY-MM-DD"), // 当前时间
    tomorrowTime: moment(new Date()).add(1, 'days').format("YYYY-MM-DD"), // 明天时间
    budgetProjectList: [], // 关联预算项目列表
    //预算信息
    budgetInfo: {
      year: moment(new Date()), // 年份
      budgetProjectId: '', // 预算项目id
      budgetProjectName: '',// 预算项目名称
      totalBudget: 0, // 总预算(元)
      relativeBudget: 0, // 可关联总预算(元)
      projectBudget: 0, // 本项目预算
      budgetType: ''
    },
    staffList: [], // 人员信息列表
    searchStaffList: [], // 搜索后的人员信息列表
    organizationStaffTreeList: [], // 组织机构人员列表树形结构
    staffInfo: {
      focusJob: '',  // 准备添加人员的岗位
      jobStaffList: [] // 各个岗位下对应的员工id
    },
    //基础信息
    basicInfo: {
      projectId: -1,
      projectName: '',
      projectType: 1,
      projectLabel: [],
      org: '',
      software: '',
      biddingMethod: 1,
      labelTxt: '',
    },
    //招采信息
    purchaseInfo: {
      //合同金额
      contractValue: 0,
      //签署日期
      signData: moment(new Date).format('YYYY-MM-DD'),
      //付款详情
      paymentInfos: [],
      //中标供应商
      biddingSupplier: '',
      //中标供应商
      biddingSupplierName: '',
      //保证金
      cautionMoney: null,
      //投标保证金
      bidCautionMoney: null,
      //评标报告文件
      file: [],
      //收款账号
      number: '',
      //其他投标供应商
      othersSupplier: [],
      ZT: '',
    },
    mileInfo: {
      milePostInfo: []  // 进行变更操作的里程碑信息
    },
    checkedStaffKey: [], // 选中的人员
    staffJobList: [], // 人员岗位列表
    loginUser: [], // 当前登录用户信息
    mileStageList: [], // 里程碑阶段信息
    milePostInfo: [], // 里程碑信息
    mileItemInfo: [],  // 里程碑事项信息
    newMileItemInfo: [], // 新建里程碑的事项信息
    isCollapse: true, // 是否折叠里程碑更多信息
    isEditMile: true, // 是否在修改里程碑信息
    loading: true,  // 是否正在加载
    tabsKey1Flag: true,//是否需要查询tabs1的数据
    tabsKey2Flag: true,//是否需要查询tabs2的数据
    tabsKey3Flag: true,//是否需要查询tabs3的数据
    tabsKey4Flag: true,//是否需要查询tabs4的数据
    tabsKey: 0, //默认第几个tab
    tags: ['Unremovable', 'Tag 2', 'Tag 3'],
    inputVisible: '-1-1',
    inputValue: '',
    swlxarr: [],
    //项目状态
    projectStatus: "",
    //保存操作类型 草稿/完成
    handleType: -1,
    //人员岗位字典
    rygwDictionary: [],
    //剩余的人员岗位字典
    rygwSelectDictionary: [],
    //人员岗位单选框
    rygwSelect: false,
    //人员岗位单选框的值
    onRygwSelectValue: '',
    //组织机构默认展开的节点
    orgExpendKeys: [],
    //可执行预算
    ysKZX: 0,
    //本项目预算改变标志
    projectBudgetChangeFlag: false,

    //-------招标信息-------------
    gysData: [],
    isSelectorOpen: false,
    addGysModalVisible: false,
    pbbgTurnRed: false,
    fileList: [],
    uploadFileParams: {
      columnName: '',
      documentData: '',
      fileLength: '',
      fileName: '',
      filePath: '',
      id: 0,
      objectName: ''
    },
    //付款详情
    selectedRowIds: [],
    isTableFullScreen: false,
    tableData: [],    //付款详情表格
    //其他供应商
    selectedRowIdsQT: [],
    isTableFullScreenQT: false,
    tableDataQT: [],    //其他供应商详情表格
    skzhData: [], //收款账号
    glgys: [],
    //其他信息
    //获奖信息
    prizeInfoRecord: [],
    //课题信息
    topicInfoRecord: [],
    //需求信息
    requirementInfoRecord: [],
    //合同信息操作类型
    htxxCzlx: 'ADD',
    //合同信息是否展示
    htxxVisiable: false,
    //招标信息操作类型
    zbxxCzlx: 'ADD',
    //中标信息是否展示
    zbxxVisiable: false,
  }
  componentDidMount = async () => {
    const _this = this;
    const params = this.getUrlParams();
    if (params.xmid && params.xmid !== -1) {
      // //console.log("paramsparams", params)
      // 修改项目操作
      this.setState({
        // operateType: 'MOD',
        projectStatus: params.projectStatus,
        basicInfo: {
          ...this.state.basicInfo,
          projectId: Number(params.xmid)
        }
      })
    }
    // 判断是否是首页跳转过来的
    if (params.type) {
      this.setState({type: true});
    }
    setTimeout(function () {
      _this.fetchInterface()
    }, 300);
  };

  fetchInterface = async () => {

    // 查询软件清单
    this.fetchQuerySoftwareList();
    // 查询项目标签
    this.fetchQueryProjectLabel();
    // 查询关联预算项目信息-需先查出关联预算项目再查项目详情
    await this.fetchQueryBudgetProjects({type: 'NF', year: Number(this.state.budgetInfo.year.format("YYYY"))});

    // 查询组织机构信息-应用部门
    this.fetchQueryOrganizationYYBMInfo();

    this.fetchQueryGysInZbxx();
    // 修改加载状态
    this.setState({loading: false});
    //人员信息接口
    // 查询岗位信息 --- 位置不要变就放在这儿
    await this.fetchQueryStationInfo();
    // 查询组织机构信息 --- 位置不要变就放在这儿
    await this.fetchQueryOrganizationInfo();
    // 查询人员信息 --- 位置不要变就放在这儿
    await this.fetchQueryMemberInfo();
    // 修改项目时查询项目详细信息 --- 位置不要变就放在这儿
    if (this.state.basicInfo.projectId && this.state.basicInfo.projectId !== -1) {
      await this.fetchQueryProjectDetails({projectId: this.state.basicInfo.projectId});
    }
    //里程碑信息
    // 查询里程碑阶段信息
    await this.fetchQueryMilestoneStageInfo({type: 'ALL'});
    // 查询里程碑事项信息
    await this.fetchQueryMatterUnderMilepost({type: 'ALL', lcbid: 0});
    // 查询里程碑信息
    await this.fetchQueryMilepostInfo({
      type: 1,
      xmid: this.state.basicInfo.projectId,
      biddingMethod: 1,
      budget: 0,
      label: this.state.basicInfo.labelTxt,
      queryType: "ALL"
    });
    //招采信息
    await this.fetchQueryPaymentAccountList();
    //合同信息
    await this.fetchQueryHTXXByXQTC();
    //招标信息
    await this.fetchQueryZBXXByXQTC();
  };


  // 处理岗位数据
  fetchQueryStationInfo = () => {
    const params = {
      "current": 1,
      "pageSize": 999,
      "paging": 1,
      "sort": "",
      "total": -1,
      "type": "ALL"
    }
    FetchQueryStationInfo(params).then((result) => {
      const {code = -1, record = ''} = result;
      if (code > 0) {
        let rec = JSON.parse(record)
        // 初始化各个岗位下对应的员工id的数组
        let arr = [];
        rec.forEach(item => {
          arr.push([]);
        });
        // 获取当前登录用户信息
        const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
        loginUser.id = String(loginUser.id);
        arr[9] = [loginUser.id];
        console.log("arrarr", arr)
        this.setState({
          searchStaffList: [loginUser],
          // loginUser: loginUser,
          staffJobList: rec,
          rygwDictionary: rec,
          rygwSelectDictionary: rec,
          staffInfo: {...this.state.staffInfo, jobStaffList: arr}
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };


  // 查询里程碑信息
  fetchQueryMilepostInfo(params) {
    return FetchQueryMilepostInfo(params).then((record) => {
      const {code = -1, result = ''} = record;
      const {nowTime, tomorrowTime, mileInfo: {milePostInfo}} = this.state;
      if (code > 0) {
        let data = JSON.parse(result);
        const arr = this.filterGridLayOut(data);
        // //console.log("arr-cccc", arr)
        if (params.queryType === "ALL") {
          //cccccccc
          let hash = {}
          let spliceList = [];
          spliceList = this.state.mileItemInfo.reduce((item, next) => {
            hash[next.swlx] ? '' : hash[next.swlx] = item.push(next);
            return item
          }, []);
          // 赋予初始时间和结束时间
          arr.forEach(item => {
            if (item.kssj === "0") {
              item.kssj = nowTime;

            }
            if (item.jssj === "0") {
              item.jssj = tomorrowTime;
            }
            if (item.matterInfos.length === spliceList.filter((i) => i.lcbid === item.lcblxid).length) {
              item.addSxFlag = false;
            } else {
              item.addSxFlag = true;
            }
            //chenjian-判断是否显示新增按钮 没有可新增的sxlb就不展示
            item.matterInfos.map(item => {
              if (item.sxlb.length - 1 === this.state.mileItemInfo.filter((i) => i.swlx === item.swlxmc).length) {
                item.addFlag = false;
              } else {
                item.addFlag = true;
              }
            })
          });
          //console.log("arr-2222", this.state.mileItemInfo)
          //console.log("arr-cccc", arr)
          // //console.log("this.state.mileInfo", this.state.mileInfo)
          this.setState({milePostInfo: arr, mileInfo: {...this.state.mileInfo, milePostInfo: arr}});
        } else if (params.queryType === "ONLYLX") {
          //预算变更-更改项目立场里程碑里面的事项
          let lxMatterInfos = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].lcbmc === "项目立项") {
              milePostInfo.map(item => {
                if (item.lcbmc === "项目立项") {
                  item.matterInfos = data[i].matterInfos
                }
              })
            }
          }
          this.setState({milePostInfo, mileInfo: {...this.state.mileInfo, milePostInfo}})
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 处理拖拽布局
  filterGridLayOut = (data) => {
    data.forEach(mile => {
      mile.matterInfos.forEach(item => {
        let layout = [];
        let sxlb = [];
        item.sxlb.forEach((e, index) => {
          if (index % 5 === 0) {
            layout.push({
              i: String(6 * parseInt(index / 5) + 1),
              x: 0,
              y: 3 * parseInt(index / 5),
              w: 0.7,
              h: 3,
              static: true
            })
            sxlb.push({type: 'title'});
          }
          sxlb.push(e);
          layout.push({
            i: String(6 * parseInt(index / 5) + parseInt(index % 5) + 2),
            x: 1 + (index % 5),
            y: 3 * parseInt(index / 5),
            w: 1,
            h: 3
          })
        });
        item.sxlb = sxlb;
        item.gridLayout = layout;
      })
    });
    // 深拷贝
    const arr = JSON.parse(JSON.stringify(data));
    return arr;
  };

  //组织机构树状数据
  toOrgTree(list, parId) {
    let obj = {};
    let result = [];
    // //console.log("list",list)
    //将数组中数据转为键值对结构 (这里的数组和obj会相互引用)
    list.map(el => {
      el.title = el.orgName;
      el.value = el.orgId;
      el.key = el.orgId;
      obj[el.orgId] = el;
    });
    // //console.log("objobj",obj)
    for (let i = 0, len = list.length; i < len; i++) {
      let id = list[i].orgFid;
      if (id == parId) {
        result.push(list[i]);
        continue;
      }
      if (obj[id].children) {
        obj[id].children.push(list[i]);
      } else {
        obj[id].children = [list[i]];
      }
    }
    //设置默认展开的节点
    let expend = [];
    let exp = {};
    // //console.log("result",result)
    exp = JSON.parse(JSON.stringify(result[0]));
    exp.children.map(item => {
      delete item.children;
      // if (item.orgName === "公司总部") {
      expend.push(item.orgId);
      // }
    })
    expend.push(exp.orgId)
    this.setState({
      orgExpendKeys: expend
    })
    // //console.log("result-cccc",result)
    return result;
  }

  //标签树状数据
  toLabelTree(list, parId) {
    let obj = {};
    let result = [];
    // //console.log("list",list)
    //将数组中数据转为键值对结构 (这里的数组和obj会相互引用)
    list.map(el => {
      el.title = el.bqmc;
      el.value = el.id;
      el.key = el.id;
      obj[el.id] = el;
    });
    console.log("listlist", list)
    for (let i = 0, len = list.length; i < len; i++) {
      let id = list[i].fid;
      if (id == parId) {
        result.push(list[i]);
        continue;
      }
      if (obj[id].children) {
        obj[id].children.push(list[i]);
      } else {
        obj[id].children = [list[i]];
      }
    }
    // //console.log("result-cccc",result)
    return result;
  }

  //关联项目树状数据
  toItemTree(list, parId) {
    let a = list.reduce((pre, current, index) => {
      pre[current.ysLX] = pre[current.ysLX] || [];
      pre[current.ysLX].push({
        key: current.ysLX,
        title: current.ysLX,
        value: current.ysLX,
        ysID: current.ysID,
        ysKGL: Number(current.ysKGL),
        ysLB: current.ysLB,
        ysName: current.ysName,
        ysZJE: Number(current.ysZJE),
        zdbm: current.zdbm,
        ysLX: current.ysLX,
        ysLXID: current.ysLXID,
        ysKZX: Number(current.ysKZX),
      });
      return pre;
    }, []);
    const treeData = [];
    for (const key in a) {
      const indexData = [];
      const childrenData = [];
      const childrenDatamini = [];
      if (a.hasOwnProperty(key)) {
        if (a[key] !== null) {
          // //console.log("item",a[key]);
          let b = a[key].reduce((pre, current, index) => {
            pre[current.zdbm] = pre[current.zdbm] || [];
            pre[current.zdbm].push({
              key: current.ysID,
              title: current.ysName,
              value: current.ysID + current.ysName,
              ysID: current.ysID,
              ysKGL: Number(current.ysKGL),
              ysLB: current.ysLB,
              ysName: current.ysName,
              ysZJE: Number(current.ysZJE),
              zdbm: current.zdbm,
              ysLX: current.ysLX,
              ysLXID: current.ysLXID,
              ysKZX: Number(current.ysKZX),
            });
            return pre;
          }, []);
          a[key].map(item => {
            if (indexData.indexOf(item.zdbm) === -1) {
              indexData.push(item.zdbm)
              if (b[item.zdbm]) {
                let treeDatamini = {children: []}
                if (item.zdbm === "6") {
                  // //console.log("b[item.zdbm]",b["6"])
                  b[item.zdbm].map(i => {
                    treeDatamini.key = i.ysID
                    treeDatamini.value = i.ysID + i.ysName
                    treeDatamini.title = i.ysName
                    treeDatamini.ysID = i.ysID
                    treeDatamini.ysKGL = Number(i.ysKGL)
                    treeDatamini.ysLB = i.ysLB
                    treeDatamini.ysName = i.ysName
                    treeDatamini.ysZJE = Number(i.ysZJE)
                    treeDatamini.ysKZX = Number(i.ysKZX)
                    treeDatamini.zdbm = i.zdbm
                  })
                  // treeDatamini.dropdownStyle = { color: '#666' }
                  // treeDatamini.selectable=false;
                  // treeDatamini.children = b[item.zdbm]
                } else {
                  treeDatamini.key = item.zdbm
                  treeDatamini.value = item.zdbm + item.ysLB
                  treeDatamini.title = item.ysLB
                  treeDatamini.ysID = item.ysID
                  treeDatamini.ysKGL = Number(item.ysKGL)
                  treeDatamini.ysLB = item.ysLB
                  treeDatamini.ysName = item.ysName
                  treeDatamini.ysLX = item.ysLX
                  treeDatamini.ysLXID = item.ysLXID
                  treeDatamini.ysZJE = Number(item.ysZJE)
                  treeDatamini.ysKZX = Number(item.ysKZX)
                  treeDatamini.zdbm = item.zdbm
                  treeDatamini.dropdownStyle = {color: '#666'}
                  treeDatamini.selectable = false;
                  treeDatamini.children = b[item.zdbm]
                }
                childrenDatamini.push(treeDatamini)
              }
              childrenData.key = key;
              childrenData.value = key;
              childrenData.title = item.ysLX;
              childrenData.dropdownStyle = {color: '#666'};
              childrenData.selectable = false;
              childrenData.children = childrenDatamini;
            }
          })
          treeData.push(childrenData);
        }
      }
    }
    // //console.log("treeData",treeData)
    return treeData;
  }

  // 查询里程碑事项信息
  fetchQueryMatterUnderMilepost(params) {
    return FetchQueryMatterUnderMilepost(params)
      .then((result) => {
        const {code = -1, records = []} = result;
        if (code > 0) {
          const data = JSON.parse(records);
          if (params.type === 'ALL') {
            const arr = [];
            data.forEach(item => {
              item.sxlb.forEach(sx => {
                sx.swlxid = item.swlxid;
                sx.swlx = item.swlx;
                sx.lcbid = item.lcbid;
                arr.push(sx)
              });
            });
            this.setState({mileItemInfo: arr});
            //console.log("arr", arr)
          } else if (params.type === 'SINGLE') {
            // //console.log("datadata", data)
            const idarr = [];
            const swlxarr = [];
            data.forEach(item => {
              let swlxparam = {}
              swlxparam.swlx = item.swlx;
              swlxparam.swlxid = item.swlxid;
              if (idarr.indexOf(swlxparam.swlxid) === -1) {
                idarr.push(item.swlxid);
                swlxarr.push(swlxparam);
              }
            })
            this.setState({newMileItemInfo: data, swlxarr: swlxarr});
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 修改项目时查询项目详细信息
  fetchQueryProjectDetails(params) {
    const {staffJobList = [], rygwSelectDictionary = []} = this.state;
    let newStaffJobList = [];
    return FetchQueryProjectDetails(params)
      .then((result) => {
        const {code = -1, record = []} = result;
        if (code > 0 && record.length > 0) {
          let result = record[0];
          let jobArr = [];
          let searchStaffList = [];
          let memberInfo = JSON.parse(result.memberInfo);
          memberInfo.push({gw: '10', rymc: result.projectManager});
          let arr = [];
          //console.log("memberInfomemberInfo", memberInfo)
          //console.log("this.state.staffList", this.state.staffList)
          memberInfo.forEach(item => {
            let rymc = item.rymc.split(',').map(String);
            jobArr[Number(item.gw) - 1] = rymc;
            rymc.forEach(ry => {
              this.state.staffList.forEach(staff => {
                if (ry === staff.id) {
                  searchStaffList.push(staff);
                }
              })
            })
            // 初始化各个岗位下对应的员工id的数组
            arr[Number(item.gw)] = [item.rymc];
            // 获取当前登录用户信息
            const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
            loginUser.id = String(loginUser.id);
            arr[9] = [loginUser.id];
            this.setState({
              searchStaffList: [loginUser],
              loginUser: loginUser,
              // staffJobList: RYGW,
              staffInfo: {...this.state.staffInfo, jobStaffList: arr}
            });
            //console.log("searchStaffListsearchStaffList", this.state.searchStaffList)
            staffJobList.map(i => {
              if (String(i.ibm) === String(item.gw)) {
                newStaffJobList.push(i)
              }
            })
          });
          //删除newStaffJobList中有的岗位
          // rygwSelectDictionary
          let newArr = newStaffJobList.concat()
          let newArray = rygwSelectDictionary.filter(function (item) {
            return newArr.indexOf(item) === -1
          });
          // //console.log("rygwSelectDictionary",newArray)
          // this.setState({rygwSelectDictionary: newArray, staffJobList: this.sortByKey(newStaffJobList, 'ibm', true)})
          this.setState({rygwSelectDictionary: newArray, staffJobList: newStaffJobList})
          // //console.log("arr",arr)
          // //console.log("budgetProjectList",this.state.budgetProjectList)
          let totalBudget = 0;
          let relativeBudget = 0;
          let ysKZX = 0;
          let budgetProjectName = ""
          if (result.budgetProject === '0') {
            budgetProjectName = "备用预算"
          } else {
            this.state.budgetProjectList.forEach(item => {
              item.children.forEach(ite => {
                ite.children.forEach(i => {
                  if (i.key === result.budgetProject) {
                    budgetProjectName = i.title
                    totalBudget = Number(i.ysZJE);
                    relativeBudget = Number(i.ysKGL);
                    ysKZX = Number(i.ysKZX);
                  }
                })
              })
            });
          }
          //console.log("budgetProjectName", budgetProjectName)
          let newOrg = []
          if (result.orgId) {
            newOrg = result.orgId.split(";");
          }
          console.log("jobArrjobArrjobArr", jobArr)
          this.setState({
            ysKZX: ysKZX,
            searchStaffList: searchStaffList,
            basicInfo: {
              projectId: result.projectId,
              projectName: result.projectName,
              projectType: Number(result.projectType),
              projectLabel: result.projectLabel === '' ? [] : result.projectLabel.split(','),
              org: newOrg,
              software: result.softwareId,
              biddingMethod: Number(result.biddingMethod)
            },
            budgetInfo: {
              year: moment(moment(result.year, 'YYYY').format()),
              budgetProjectId: result.budgetProject,
              budgetProjectName,
              totalBudget: totalBudget,
              relativeBudget: relativeBudget,
              projectBudget: Number(result.projectBudget),
              budgetType: result.budgetType
            },
            staffInfo: {
              focusJob: '',
              jobStaffList: jobArr
            }
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 查询里程碑阶段信息
  fetchQueryMilestoneStageInfo(params) {
    return FetchQueryMilestoneStageInfo(params)
      .then((result) => {
        const {code = -1, record = []} = result;
        if (code > 0) {
          this.setState({mileStageList: record});
        }
        //console.log("record", record)
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 查询人员信息
  fetchQueryMemberInfo() {
    return FetchQueryMemberInfo(
      {type: 'ALL'}
    ).then((result) => {
      const {code = -1, record = ''} = result;
      if (code > 0) {
        const result = JSON.parse(record);
        const arr = [];
        result.forEach(item => {
          let e = {
            orgFid: item.orgId,
            orgId: '_' + item.id,
            orgName: item.name
          };
          arr.push(e);
        });
        let treeRes = this.toOrgTree(this.state.organizationList.concat(arr), 0)
        this.setState({
          staffList: result,
          organizationStaffTreeList: treeRes
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询组织机构信息
  fetchQueryOrganizationInfo() {
    return FetchQueryOrganizationInfo({
      type: 'ZZJG'
    }).then((result) => {
      const {code = -1, record = []} = result;
      if (code > 0) {
        const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
        loginUser.id = String(loginUser.id);
        // 深拷贝
        const arr = [];
        record.forEach(e => {
          // 获取登录用户的部门名称
          if (String(e.orgId) === String(loginUser.org)) {
            loginUser.orgName = e.orgName;
          }
          arr.push({...e})
        });
        this.setState({
          loginUser: loginUser, organizationList: record,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询组织机构信息-应用部门
  fetchQueryOrganizationYYBMInfo() {
    return FetchQueryOrganizationInfo({
      type: 'YYBM'
    }).then((result) => {
      const {code = -1, record = []} = result;
      if (code > 0) {
        const loginUser = this.state.loginUser;
        // 深拷贝
        const arr = [];
        record.forEach(e => {
          // 获取登录用户的部门名称
          if (e.orgId == loginUser.org) {
            loginUser.orgName = e.orgName;
          }
          arr.push({...e})
        });
        this.setState({
          organizationTreeList: this.toOrgTree(arr, 0)
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询关联预算项目信息
  fetchQueryBudgetProjects(params) {
    return FetchQueryBudgetProjects(params).then((result) => {
      const {code = -1, record = []} = result;
      if (code > 0) {
        this.setState({budgetProjectList: this.toItemTree(record)});
        //console.log(this.toItemTree(record));
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询软件清单
  fetchQuerySoftwareList() {
    return FetchQuerySoftwareList({type: 'ALL'}).then((result) => {
      const {code = -1, record = []} = result;
      if (code > 0) {
        this.setState({softwareList: record});
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询项目标签
  fetchQueryProjectLabel() {
    return FetchQueryProjectLabel({}).then((result) => {
      const {code = -1, record = []} = result;
      if (code > 0) {
        // console.log("this.toLabelTree(record,0) ",this.toLabelTree(record,0))
        this.setState({projectLabelList: this.toLabelTree(record, 0)});
        // console.log("this.toLabelTree(record,0) ",this.state.projectLabelList)
        // this.setState({ projectLabelList: record});
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取url参数
  getUrlParams = () => {
    const {match: {params: {params: encryptParams = ''}}} = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    // //console.log("paramsparams", params)
    return params;
  }

  handleCancel = () => {
    const _this = this;
    confirm({
      okText: '确认',
      cancelText: '取消',
      title: '提示',
      content: '确定要取消操作？',
      onOk() {
        if (_this.state.type) {
          window.parent && window.parent.postMessage({operate: 'close'}, '*');
        } else {
          _this.props.closeDialog();
        }
      },
      onCancel() {
      },
    });
  };

  // 查询人员信息
  searchStaff = (val, type) => {
    if (val.length !== 0) {
      let searchStaffList = [];
      let isExist = this.state.staffList.filter(item => item.id == this.state.loginUser.id);
      if (type === 'manage' && isExist.length === 0) {
        searchStaffList.push(this.state.loginUser);
      }
      this.state.staffList.forEach(item => {
        if (item.name.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
          searchStaffList.push(item);
        }
      });
      this.setState({height: 400}, function () {
        this.setState({searchStaffList: searchStaffList})
      });
    } else {
      this.setState({height: 0}, function () {
        this.setState({searchStaffList: []})
      });
    }
  };

  // 验证本项目预算
  handleValidatorProjectBudget = (rule, val, callback) => {
    // 函数节流，防止数据频繁更新，每300毫秒才搜索一次
    const _this = this

    this.setState({budgetInfo: {...this.state.budgetInfo, projectBudget: val === '' || val === '-' ? 0 : val}});
    if (!val) {
      callback();
    }
    if (val > _this.state.budgetInfo.relativeBudget && this.state.budgetInfo.budgetProjectId !== '0') {
      callback('预算超过剩余预算！请注意！');
    } else {
      callback();
    }
    // _this.timer = null

  };

  // 点击添加按钮
  clickAddStaff = () => {
    const {staffInfo: {focusJob, jobStaffList}, checkedStaffKey} = this.state;
    if (focusJob === '') {
      message.warning('请先选择你要添加到的岗位！');
    } else if (checkedStaffKey.length === 0) {
      message.warning('请先选择你要添加的人员！');
    } else if ((jobStaffList[9].length > 0 && focusJob === '10') || (focusJob === '10' && checkedStaffKey.length > 1)) {
      message.warning('项目经理最多一个！');
    } else {
      // //console.log(jobStaffList);
      let arr = jobStaffList[Number(focusJob) - 1] ? jobStaffList[Number(focusJob) - 1] : [];
      let searchStaffList = [];
      checkedStaffKey.forEach(item => {
        arr.push(item.substring(1, item.length));
        // 存到对应下拉数据中
        this.state.staffList.forEach(e => {
          if (e.id == item.substring(1, item.length)) {
            searchStaffList.push(e);
          }
        });
      });
      // 存到对应的数组下
      jobStaffList[Number(focusJob) - 1] = arr;
      this.setState({
        checkedStaffKey: [],
        searchStaffList: searchStaffList,
        staffInfo: {...this.state.staffInfo, jobStaffList: jobStaffList}
      })
    }
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode disableCheckbox={true} title={item.orgName} key={item.orgId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.orgId} {...item} dataRef={item}/>;
    });
  }


  onCheckTreeStaff = (key, node) => {
    this.setState({checkedStaffKey: key})
  };

  // 数组对象排序
  sortByKey = (array, key, order) => {
    return array?.sort(function (a, b) {
      const x = Number(a[key]);
      const y = Number(b[key]);
      if (order) {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      } else {
        return ((x < y) ? ((x > y) ? 1 : 0) : -1)
      }
    })
  };

  // 删除岗位
  removeJob = (e) => {
    const _this = this;
    confirm({
      okText: '确认',
      cancelText: '取消',
      title: '提示',
      content: '确定要删除此岗位？',
      onOk() {
        const {staffJobList, rygwSelectDictionary, rygwDictionary} = _this.state;
        const newStaffJobList = staffJobList.filter(item => item.ibm !== e);
        let newArr = newStaffJobList.concat()
        // //console.log("newArr", newArr)
        // //console.log("rygwDictionary", rygwDictionary)
        let newArray = rygwDictionary.filter(function (item) {
          return newArr.indexOf(item) === -1
        });
        // const filter = rygwDictionary.filter(item => item.ibm === e)
        // rygwSelectDictionary.push(filter[0])
        // //console.log("newArray", newArray)
        // _this.setState({staffJobList: _this.sortByKey(newStaffJobList, 'ibm', true), rygwSelectDictionary: newArray})
        _this.setState({staffJobList: newStaffJobList, rygwSelectDictionary: newArray})
      },
      onCancel() {
      },
    });

  };

  // 保存数据操作
  handleFormValidate = (e, type) => {
    const {operateType} = this.state;
    e.preventDefault();
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('projectName')) {
          message.warn("请填写项目名称！");
          return
        }
        if (errs.includes('org')) {
          message.warn("请选择部门！");
          return
        }
        if (errs.includes('budgetProjectId')) {
          message.warn("请选择关联预算项目！");
          return
        }
        if (errs.includes('projectBudget')) {
          if (err.projectBudget.errors[0].message === '预算超过剩余预算！请注意！') {
            let flag = false; // 是否结束
            confirm({
              okText: '确认',
              cancelText: '取消',
              title: '提示',
              content: '预算超过剩余预算，是否确认？',
              onOk() {
                if (values.projectBudget < 5000 && type === 1) {
                  confirm({
                    okText: '确认',
                    cancelText: '取消',
                    title: '提示',
                    content: '请注意当前的本项目预算单位是元，是否确认？',
                    onOk() {
                      _this.handleSave(values, type);
                    },
                    onCancel() {
                      flag = true;
                    },
                  });
                } else {
                  _this.handleSave(values, type);
                }
              },
              onCancel() {
                flag = true;
              },
            });
            if (flag) {
              return
            }
          } else {
            message.warn(err.projectBudget.errors[0].message);
            return
          }
        }
      } else {
        if (values.projectBudget < 5000 && type === 1) {
          confirm({
            okText: '确认',
            cancelText: '取消',
            title: '提示',
            content: '请注意当前的本项目预算单位是元，是否确认？',
            onOk() {
              _this.handleSave(values, type);
            },
            onCancel() {
            },
          });
        } else {
          _this.handleSave(values, type);
        }
      }
    });
  };


  handleSave = (values, type) => {
    const {
      basicInfo = {},
      budgetInfo = {},
      staffJobList = [],
      staffInfo: {jobStaffList = []},
      mileInfo: {milePostInfo = []},
      purchaseInfo = {},
      fileList = [],
      htxxVisiable = false,
      zbxxVisiable = false,
    } = this.state;
    //校验基础信息
    let basicflag;
    if (basicInfo.projectName !== '' && basicInfo.projectType !== '' && basicInfo.org !== '' && basicInfo.org?.length !== 0 && basicInfo.biddingMethod !== '') {
      if (budgetInfo.budgetProjectId !== '' && budgetInfo.budgetProjectId !== "0" && budgetInfo.projectBudget !== "" && budgetInfo.projectBudget !== null) {
        basicflag = true;
      } else if (budgetInfo.budgetProjectId === "0") {
        basicflag = true;
      } else {
        basicflag = false;
      }
    } else {
      basicflag = false;
    }
    if (!basicflag && type === 1) {
      message.warn("项目基本信息及预算信息未填写完整！");
      return;
    }
    //校验里程碑信息
    let flag = true; // 日期选择是否符合开始时间小于结束时间
    milePostInfo.forEach(item => {
      if (Number(moment(item.jssj, 'YYYY-MM-DD').format('YYYYMMDD'))
        < Number(moment(item.kssj, 'YYYY-MM-DD').format('YYYYMMDD'))) {
        flag = false;
      }
    });
    if (!flag && this.state.type === 1) {
      message.warn("存在里程碑信息开始时间大于结束时间！");
      return;
    }
    if (htxxVisiable) {
      if (purchaseInfo.contractValue === null || purchaseInfo.signData === "") {
        message.warn("招采信息未填写完整！");
        return;
      }
    }
    if (zbxxVisiable) {
      if (purchaseInfo.paymentInfos.length === 0 || purchaseInfo.biddingSupplier === "" || fileList.length === 0 || purchaseInfo.number === "") {
        message.warn("招采信息未填写完整！");
        return;
      }
    }
    let staffJobParam = [];
    // console.log("staffJobList保存",staffJobList);
    staffJobList.forEach(item => {
      let index = Number(item.ibm);
      if (jobStaffList[index - 1] && jobStaffList[index - 1].length > 0) {
        let param = {
          gw: index,
          rymc: jobStaffList[index - 1].join(';')
        };
        staffJobParam.push(param);
      }
    });
    const staffJobParams = staffJobParam.filter(item => (item.rymc !== ''));
    // 获取项目经理
    const projectManager = staffJobParams.filter(item => (item.gw == 10)) || [];
    //去过人员信息tab页面 需要判断项目经理不能为空 没点击过
    if (projectManager.length === 0) {
      message.warn("项目经理不能为空！");
      return;
    }
    let orgNew = "";
    if (basicInfo.org?.length > 0) {
      basicInfo.org.map((item, index) => {
        orgNew = item.concat(";").concat(orgNew);
      })
    }
    ;
    orgNew = orgNew.substring(0, orgNew.length - 1)
    let label = "";
    if (basicInfo.projectLabel?.length > 0) {
      basicInfo.projectLabel.map((item, index) => {
        label = item.concat(";").concat(label);
      })
    }
    ;
    label = label.substring(0, label.length - 1)
    const params = {
      projectName: basicInfo.projectName,
      projectType: basicInfo.projectType,
      projectLabel: label,
      org: orgNew,
      software: Number(basicInfo.software),
      biddingMethod: basicInfo.projectType === 2 ? 0 : Number(basicInfo.biddingMethod),
      year: Number(this.state.budgetInfo.year.format("YYYY")),
      budgetProject: budgetInfo.budgetProjectId === '' ? -1 : Number(budgetInfo.budgetProjectId),
      projectBudget: budgetInfo.projectBudget === null ? 0 : Number(budgetInfo.projectBudget)
    };
    const _this = this;
    const timeList = milePostInfo.filter(item => item.jssj === this.state.tomorrowTime && item.kssj === this.state.nowTime);
    if (budgetInfo.projectBudget > budgetInfo.relativeBudget) {
      confirm({
        okText: '确认',
        cancelText: '取消',
        title: '提示',
        content: '超过当前预算项目的预算，是否确认？',
        onOk() {
          _this.makeOperateParams(params, milePostInfo, staffJobParams, projectManager, type);
        },
        onCancel() {
        },
      });
    } else {
      confirm({
        okText: '确认',
        cancelText: '取消',
        title: '提示',
        content: '确认完成？',
        onOk() {
          _this.makeOperateParams(params, milePostInfo, staffJobParams, projectManager, type);
        },
        onCancel() {
        },
      });
    }
  };

  makeOperateParams = (params, milePostInfo, staffJobParams, projectManager, type) => {
    this.setState({loading: true,});
    // //console.log("statestate", this.state)
    let milepostInfo = [];
    let matterInfo = [];
    milePostInfo.forEach(item => {
      milepostInfo.push({
        lcb: item.lcblxid,
        jssj: moment(item.jssj, 'YYYY-MM-DD').format('YYYYMMDD'),
        kssj: moment(item.kssj, 'YYYY-MM-DD').format('YYYYMMDD')
      });
      // //console.log("item.matterInfos",item.matterInfos)
      item.matterInfos.forEach(i => {
        // X轴升序排序
        let gridLayoutByX = this.sortByKey(i.gridLayout, 'x', true);
        // Y轴升序排序
        let gridLayoutByY = this.sortByKey(gridLayoutByX, 'x', true);
        gridLayoutByY.forEach(grid => {
          let sxlb = i.sxlb[Number(grid.i) - 1];
          if (!(sxlb.type && sxlb.type === 'title')) {
            matterInfo.push({
              sxmc: sxlb.sxid,
              lcb: item.lcblxid
            })
          }
        })
      });
    });
    let operateType = '';
    if (type === 0) {
      this.setState({
        operateType: 'SAVE'
      })
      operateType = 'SAVE';
    }
    //修改项目的时候隐藏暂存草稿,点完成type传MOD
    // //console.log("handleType", type)
    // //console.log("projectStatus", this.state.projectStatus === "")
    // //console.log("projectStatus22", this.state.projectStatus === null)
    if (type === 1 && this.state.projectStatus === 'MOD') {
      this.setState({
        operateType: 'MOD'
      })
      operateType = 'MOD';
    }
    //修改草稿点完成type入参就传ADD
    if (type === 1 && this.state.projectStatus === 'SAVE') {
      this.setState({
        operateType: 'ADD'
      })
      operateType = 'ADD';
    }
    //暂存草稿就还是SAVE
    if (type === 0 && this.state.projectStatus === 'SAVE') {
      this.setState({
        operateType: 'SAVE'
      })
      operateType = 'SAVE';
    }
    if (type === 0 && this.state.projectStatus === "" || this.state.projectStatus === null) {
      this.setState({
        operateType: 'SAVE'
      })
      operateType = 'SAVE';
    }
    if (type === 1 && this.state.projectStatus === "" || this.state.projectStatus === null) {
      this.setState({
        operateType: 'ADD'
      })
      operateType = 'ADD';
    }
    params.mileposts = milepostInfo;
    params.matters = matterInfo;
    params.projectManager = Number(projectManager[0].rymc);
    let memberInfo = staffJobParams.filter(item => item.gw != 10);
    memberInfo.forEach(item => {
      item.gw = String(item.gw);
    });
    params.members = memberInfo;
    // //console.log("params.projectId", this.state.basicInfo.projectId)
    params.projectId = this.state.basicInfo.projectId === undefined || this.state.basicInfo.projectId === '' ? -1 : Number(this.state.basicInfo.projectId);
    // //console.log("operateType", operateType)
    params.type = 'MOD';
    params.czr = Number(this.state.loginUser.id);
    //资本性预算/非资本性预算
    params.budgetType = this.state.budgetInfo.budgetType;

    this.operateCreatProject(params, type);
  };

  updateZBXX() {
    const czrid = JSON.parse(sessionStorage.getItem('user')).id;
    console.log("czridczrid", czrid)
    const {
      tableDataQT,
      gysData,
      purchaseInfo = {},
      uploadFileParams = {},
      staticSkzhData = [],
      zbxxCzlx = 'ADD',
      basicInfo = {}
    } = this.state;
    console.log("purchaseInfopurchaseInfo222", purchaseInfo)
    console.log("glgysglgys", gysData)
    let arr = [...tableDataQT];
    let newArr = [];
    arr.map((item) => {
      let obj = {
        GYSMC: String(gysData?.filter(x => x.gysmc === item[`gysmc${item.id}`])[0]?.id || ''),
        GYSFKZH: "-1"
        // GYSFKZH: String(skzhData?.filter(x => x.khmc === item[`gysskzh${item.id}`])[0]?.id || '')
      };
      newArr.push(obj);
    });
    const {documentData, fileLength, fileName} = uploadFileParams;
    console.log("documentData", documentData)
    let submitdata = {
      columnName: 'PBBG',
      documentData,
      czr_id: czrid,
      fileLength,
      glgys: 0,
      gysfkzh: Number(staticSkzhData?.filter(x => x.khmc === purchaseInfo.number)[0]?.id || ''),
      ijson: JSON.stringify(newArr),
      lybzj: Number(purchaseInfo.cautionMoney),
      objectName: 'TXMXX_ZBXX',
      pbbg: fileName,
      rowcount: tableDataQT.length,
      tbbzj: Number(purchaseInfo.bidCautionMoney),
      // xmmc: Number(basicInfo.projectId),
      xmmc: Number(basicInfo.projectId),
      zbgys: Number(purchaseInfo.biddingSupplier),
      czlx: zbxxCzlx,
    };
    console.log("🚀submitdata", submitdata);
    UpdateZbxx({
      ...submitdata
    }).then(res => {
      if (res?.code === 1) {
        // message.success('中标信息修改成功', 1);
        // onSuccess();
      } else {
        message.error('信息修改失败', 1);
      }
    });
  }

  updateHTXX() {
    const {
      tableData,
      gysData,
      purchaseInfo = {},
      htxxCzlx = 'ADD',
      uploadFileParams = {},
      staticSkzhData = [],
      basicInfo = {}
    } = this.state;
    let arr = [...tableData];
    console.log("purchaseInfo", purchaseInfo)
    console.log("tableDatatableData", tableData)
    arr.forEach(item => {
      for (let i in item) {
        if (i === 'fksj' + item.id) {
          item[i] = moment(item[i]).format('YYYYMMDD');
        } else {
          item[i] = String(item[i]);
        }
      }
    })
    let newArr = [];
    arr.map((item) => {
      let obj = {
        ID: item.id,
        FKQS: item['fkqs' + item.id],
        BFB: item['bfb' + item.id],
        FKJE: item['fkje' + item.id],
        FKSJ: item['fksj' + item.id],
        ZT: purchaseInfo?.ZT === undefined ?'2':purchaseInfo?.ZT,
        GYS: String(purchaseInfo.biddingSupplier)
      };
      newArr.push(obj);
    });
    UpdateHTXX({
      // xmmc: Number(basicInfo.projectId),
      xmmc: Number(basicInfo.projectId),
      json: JSON.stringify(newArr),
      rowcount: tableData.length,
      htje: Number(purchaseInfo.contractValue),
      qsrq: Number(moment(purchaseInfo.signData).format('YYYYMMDD')),
      gysid: Number(purchaseInfo.biddingSupplier),
      czlx: htxxCzlx,
    }).then(res => {
      if (res?.code === 1) {
        // message.success('合同信息修改成功', 1);
        // onSuccess();
      } else {
        message.error('信息修改失败', 1);
      }
    })
    this.setState({tableData: [], tableDataQT: []});
  }

  //其他信息的保存-获奖信息

  prizeInfoCallback = (rec) => {
    console.log("prizeInfoRecord", rec)
    this.setState({
      prizeInfoRecord: rec
    })
  }
  //其他信息的保存-课题信息
  topicInfoCallback = (rec) => {
    console.log("topicInfoRecord", rec)
    this.setState({
      topicInfoRecord: rec
    })
  }
  //其他信息的保存-需求信息
  requirementInfoCallback = (rec) => {
    console.log("requirementInfoRecord", rec)
    this.setState({
      requirementInfoRecord: rec
    })
  }

  updateProjectOtherInfo() {
    const {topicInfoRecord = [], requirementInfoRecord = [], prizeInfoRecord = [], basicInfo = []} = this.state;
    UpdateProjectOtherInfo({
      // xmmc: Number(basicInfo.projectId),
      xmid: Number(basicInfo.projectId),
      //需求信息
      xqjson: JSON.stringify(requirementInfoRecord),
      //获奖信息
      hjjson: JSON.stringify(prizeInfoRecord),
      //课题信息
      ktjson: JSON.stringify(topicInfoRecord),
      xqsl: requirementInfoRecord.length,
      hjsl: prizeInfoRecord.length,
      ktsl: topicInfoRecord.length,
    }).then(res => {
      if (res?.code === 1) {
        // message.success('合同信息修改成功', 1);
        //onSuccess();
      } else {
        message.error('信息修改失败', 1);
      }
    })
  }

  async operateCreatProject(params, type) {
    //更新其他信息
    await this.updateProjectOtherInfo();
    if(this.state.zbxxVisiable){
      //更新招标信息
      await this.updateZBXX();
    }
    if(this.state.htxxVisiable){
      //更新合同信息
      await this.updateHTXX();
    }
    OperateCreatProject(params).then((result) => {
      const {code = -1, note = '', projectId} = result;
      this.setState({loading: false});
      if (code > 0) {
        sessionStorage.setItem("projectId", projectId);
        sessionStorage.setItem("handleType", type);
        if (this.state.type) {
          window.parent && window.parent.postMessage({operate: 'success'}, '*');
        } else {
          this.props.submitOperate();
        }
        const params = {
          projectId: projectId,
        }
        //projectId跳转到生命周期页面
        // window.location.href = `/#/pms/manage/LifeCycleManagement/${EncryptBase64(JSON.stringify(params))}`
        // window.location.href =`/#/pms/manage/LifeCycleManagement/${EncryptBase64(JSON.stringify(params))}`
      } else {
        message.error(note);
      }
    }).catch((error) => {
      this.setState({loading: false});
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 移动里程碑信息
  moveMilePostInfo = (index, direction) => {
    const {mileInfo: {milePostInfo}} = this.state;
    if (direction === 'top') {
      // 上移
      const temp = milePostInfo[index];
      milePostInfo[index] = milePostInfo[index - 1];
      milePostInfo[index - 1] = temp;
    } else if (direction === 'down') {
      // 下移
      const temp = milePostInfo[index];
      milePostInfo[index] = milePostInfo[index + 1];
      milePostInfo[index + 1] = temp;
    }
    this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: milePostInfo}});
  };

  // 取消保存里程碑信息
  cancelSaveMilePostInfo = () => {
    const _this = this;
    confirm({
      okText: '确认',
      cancelText: '取消',
      title: '提示',
      content: '确认取消保存操作？',
      onOk() {
        // 深拷贝
        const mile = JSON.parse(JSON.stringify(_this.state.milePostInfo));
        _this.setState({isEditMile: false, mileInfo: {..._this.state.mileInfo, milePostInfo: mile}})
      },
      onCancel() {
      },
    });
  };

  // 保存里程碑信息
  saveMilePostInfo = () => {
    const {mileInfo: {milePostInfo = []}} = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    mile.forEach(item => {
      if (item.type && item.type === 'new') {
        delete item.type;
      }
      item.matterInfos.forEach(e => {
        let sxlb = [];
        e.sxlb.forEach(sx => {
          if (sx.type && sx.type === 'new') {
            if (sx.sxmc != '' && sx.sxid != '') {
              delete sx.type;
              sxlb.push(sx);
            }
          } else {
            sxlb.push(sx);
          }
        });
        e.sxlb = sxlb;
      })
    });
    this.setState({isEditMile: false, milePostInfo: mile, mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
  };

  // 删除里程碑信息
  removeMilePostInfo = (index) => {
    const _this = this;
    const {mileInfo: {milePostInfo = []}} = this.state;
    confirm({
      okText: '确认',
      cancelText: '取消',
      title: '提示',
      content: '确认要删除里程碑信息吗？',
      onOk() {
        let arr = [];
        milePostInfo.forEach((item, i) => {
          if (i !== index) {
            arr.push(item);
          }
        });
        _this.setState({mileInfo: {..._this.state.mileInfo, milePostInfo: arr}});
      },
      onCancel() {
      },
    });

  };

  // 去除事项列表里面所有的title数据
  removeAllTitle = (data) => {
    const mile = JSON.parse(JSON.stringify(data));

    mile.forEach((item, index) => {
      let indexNum = []
      item.matterInfos.forEach((e, i) => {
        let sxlb = [];
        e.sxlb.forEach((sx, sx_index) => {
          if (!(sx.type && sx.type === 'title')) {
            sxlb.push(sx);
          }
        });
        e.sxlb = sxlb;
        if (e.sxlb.length === 0) {
          indexNum.push(i);
        }
      });
      if (indexNum.length > 0) {
        for (let i = 0; i < indexNum.length; i++) {
          item.matterInfos.splice(indexNum[i], 1)
        }
      }
    });

    return mile;
  };

  // 删除里程碑事项信息
  removeMilePostInfoItem = (index, i, sx_index) => {
    const {mileInfo: {milePostInfo = []}} = this.state;

    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    let matterInfo = mile[index].matterInfos;
    let sxlb = [];
    matterInfo[i].sxlb.forEach((item, index) => {
      if (index !== sx_index) {
        sxlb.push(item);
      }
    });
    matterInfo[i].sxlb = sxlb;
    //console.log("matterInfo[i]", matterInfo[i])
    //chenjian-判断是否显示新增按钮 没有可新增的sxlb就不展示
    if (matterInfo[i].sxlb.filter((i) => i.sxmc).length === this.state.mileItemInfo.filter((i) => i.swlx === matterInfo[i]?.swlxmc).length) {
      matterInfo[i].addFlag = false;
    } else {
      matterInfo[i].addFlag = true;
    }
    //cccccccc
    let hash = {}
    let spliceList = [];
    spliceList = this.state.mileItemInfo.reduce((item, next) => {
      hash[next.swlx] ? '' : hash[next.swlx] = item.push(next);
      return item
    }, []);
    matterInfo = matterInfo.filter((item) =>
      item.sxlb.filter((i) => i.sxmc).length !== 0
    )
    if (matterInfo.length === spliceList.filter((i) => i.lcbid === mile[index].lcblxid).length) {
      mile[index].addSxFlag = false;
    } else {
      mile[index].addSxFlag = true;
    }
    const removeTitleMile = this.removeAllTitle(JSON.parse(JSON.stringify(mile)));
    // //console.log("milePostInfo-ccc",removeTitleMile)
    this.setState({
      mileInfo: {
        ...this.state.mileInfo,
        milePostInfo: this.filterGridLayOut(JSON.parse(JSON.stringify(removeTitleMile)))
      }
    });
    //console.log("88888888", this.state.mileInfo);
  };

  // 添加里程碑事项信息-ccccc
  addMilePostInfoItem = (index, i) => {
    const {mileInfo: {milePostInfo = []}} = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    // //console.log("milePostInfo", milePostInfo)
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    matterInfo[i].sxlb.push({sxid: '', sxmc: '', type: 'new'});
    const removeTitleMile = this.removeAllTitle(JSON.parse(JSON.stringify(mile)));
    // //console.log("milePostInfo222", removeTitleMile)
    const arr = this.filterGridLayOut(removeTitleMile);
    this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: arr}});
  };

  // 移除里程碑类型信息
  removeMilePostTypeInfo = (index, i) => {
    const {mileInfo: {milePostInfo = []}} = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    let newMatterInfo = [];
    matterInfo.forEach((item, mi) => {
      if (mi !== i) {
        newMatterInfo.push(item);
      }
    });
    mile[index].matterInfos = newMatterInfo;
    const removeTitleMile = this.removeAllTitle(JSON.parse(JSON.stringify(mile)));
    const arr = this.filterGridLayOut(removeTitleMile);
    //里程碑下没有里程碑类型信息 则删除里程碑
    if (arr[index].matterInfos.length === 0) {
      let arr = [];
      milePostInfo.forEach((item, i) => {
        if (i !== index) {
          arr.push(item);
        }
      });
      this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: arr}});
    } else {
      this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: arr}});
    }
  };

  // 选中新加的里程碑事项信息
  selectMilePostInfoItem = (e, index, i, sx_index) => {
    const {mileInfo: {milePostInfo = []}, mileItemInfo = []} = this.state;
    let sxmc = '';
    mileItemInfo.forEach(item => {
      if (item.sxid == e) {
        sxmc = item.sxmc;
      }
    });
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    const sxlb = matterInfo[i].sxlb;
    sxlb[sx_index].sxid = e;
    sxlb[sx_index].sxmc = sxmc;
    this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
  };

  // 选中新建里程碑的阶段信息
  selectMileStageInfo = async (e, index) => {
    const {mileInfo: {milePostInfo = []}, mileStageList = []} = this.state;
    await this.fetchQueryMatterUnderMilepost({type: 'SINGLE', lcbid: e});
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const newMileItemInfo = JSON.parse(JSON.stringify(this.state.newMileItemInfo));
    let lcbmc = '';
    mileStageList.forEach(item => {
      if (item.id == e) {
        lcbmc = item.lcbmc;
      }
    });
    let matterInfos = [];
    newMileItemInfo.forEach(item => {
      item.swlxmc = item.swlx;
      matterInfos.push(item);
    });
    mile[index].lcblxid = e;
    mile[index].lcbmc = lcbmc;
    mile[index].matterInfos = matterInfos;
    const removeTitleMile = this.removeAllTitle(JSON.parse(JSON.stringify(mile)));
    const arr = this.filterGridLayOut(removeTitleMile);
    this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: arr}})
  };

  // 新建里程碑信息
  addMilePostInfo = () => {
    const {mileInfo: {milePostInfo = []}, nowTime, tomorrowTime} = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    let lcb = {matterInfos: [], lcbmc: '', type: 'new', kssj: nowTime, jssj: tomorrowTime};
    mile.push(lcb);
    this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
  };

  // 修改里程碑的时间
  changeMilePostInfoTime = (date, index, type) => {
    const {mileInfo: {milePostInfo = []}} = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const reg1 = new RegExp("-", "g");
    const newDate = date.replace(reg1, "");
    if (type === 'start') {
      const diff = moment(mile[index].jssj).diff(mile[index].kssj, 'day')
      mile[index].kssj = date;
      mile[index].jssj = moment(date).add(diff, 'days').format('YYYY-MM-DD');
    } else if (type === 'end') {
      mile[index].jssj = date;
    }
    this.setState({mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
  };

  onChange = minicurrent => {
    // //console.log('onChange:', minicurrent);
    this.setState({minicurrent});
    let heightTotal = 0;
    //滚动到指定高度
    if (minicurrent) {
      for (let i = 0; i < minicurrent; i++) {
        // //console.log("iiiii", document.getElementById("milePost" + i).offsetHeight)
        heightTotal = heightTotal + document.getElementById("milePost" + i).offsetHeight;
      }
    }
    heightTotal = heightTotal + (7.8 * (minicurrent - 1) + 11.8)
    // //console.log('height222', heightTotal);
    document.getElementById("lcbxxClass").scrollTo(0, heightTotal)
  };

  onScrollHandle = () => {
    const {mileInfo: {milePostInfo = []}} = this.state;
    //距离顶部高度
    const scrollTop = this.scrollRef.scrollTop;
    let heightTotal = 0;
    let endHeight = []
    //每个生命周期高度
    for (let i = 0; i < milePostInfo.length; i++) {
      heightTotal = heightTotal + document.getElementById("milePost" + i).offsetHeight;
      const miniHeight = heightTotal
      endHeight.push(miniHeight);
    }
    endHeight.unshift(0);
    const scrollHeight = this.scrollRef.scrollHeight;
    //二分法查出数字所在区间
    let left = 0;
    let right = endHeight.length;
    while (left <= right) {
      let center = Math.floor((left + right) / 2);
      if (scrollTop < endHeight[center]) {
        right = center - 1;
      } else {
        left = center + 1;
      }
    }
    this.setState({
      minicurrent: right,
    })
  }

  showInput = (index, i) => {
    this[`${index}inputRef${i}`] = React.createRef();
    this.setState({inputVisible: `${index}+${i}`}, () => this[`${index}inputRef${i}`].current.focus());
  };

  handleInputConfirm = (e, index, i, sx_index) => {
    //没选的话直接ruturn掉
    if (e === undefined) {
      this.setState({inputVisible: '-1-1'});
      return;
    }
    //matterInfos
    const {mileInfo: {milePostInfo = []}, mileItemInfo = []} = this.state;
    let sxmc = '';
    let swlx = '';
    mileItemInfo.forEach(item => {
      if (item.sxid === e) {
        sxmc = item.sxmc;
        swlx = item.swlxid;
      }
    });
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    const sxlb = matterInfo[i].sxlb;
    let newsxlb = {lcb: sxlb[sx_index - 1].lcb, swlx: swlx, sxid: e, sxmc: sxmc, sxzxid: "0", sxzxsx: sx_index, xh: "3"}
    let flag = 0;
    sxlb.map(item => {
      if (item.sxmc !== newsxlb.sxmc) {
        flag++;
      }
    })
    if (flag === sxlb.length && newsxlb.sxmc) {
      sxlb.push(newsxlb);
    } else if (flag !== sxlb.length) {
      message.warn("已存在,请勿重复添加！")
    }
    // //console.log("milemile",mile)
    mile[index].flag = false;
    const arr = this.filterGridLayOut(mile);
    //console.log("arrarrarrarr", arr)
    arr.forEach(item => {
      //chenjian-判断是否显示新增按钮 没有可新增的sxlb就不展示
      item.matterInfos.map(item => {
        if (item.sxlb.filter((i) => i.sxmc).length === this.state.mileItemInfo.filter((i) => i.swlx === item.swlxmc).length) {
          item.addFlag = false;
        } else {
          item.addFlag = true;
        }
      })
    });
    console.log("arrarr", arr)
    this.setState({inputVisible: '-1', mileInfo: {...this.state.mileInfo, milePostInfo: arr}});
    // //console.log("新增后，新增后",this.state.mileInfo.milePostInfo.matterInfos)
  };

  //添加事项
  addSwlx = (e, index) => {
    // //console.log("eeee",e)
    // //console.log("index",index)
    this.fetchQueryMatterUnderMilepost({type: 'SINGLE', lcbid: e});
    //添加事项类型
    // //console.log("eeeee", e)
    // //console.log("index", index)
    const {mileInfo: {milePostInfo = []},} = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    let matterInfos = {swlxmc: "new", sxlb: []}
    matterInfo.push(matterInfos)
    if (!mile[index].flag || mile[index].flag === undefined) {
      mile[index].flag = true;
      this.setState({inputVisible: '-1', mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
    } else {
      message.warn("请完成当前事项的添加！")
    }
    //添加内的流程
  }

  addSwlxMx = (e, index, i, sx_index) => {
    if (e !== undefined) {
      const {mileInfo: {milePostInfo = []},} = this.state;
      // 多层数组的深拷贝方式  真暴力哦
      const mile = JSON.parse(JSON.stringify(milePostInfo));
      let swlxmc = ""
      this.state.swlxarr.map((mi, mi_index) => {
        if (mi.swlxid === e) {
          swlxmc = mi.swlx;
        }
      })
      const matterInfo = mile[index].matterInfos;
      let flag = false;
      matterInfo.map(item => {
        if (swlxmc === item.swlxmc) {
          flag = true;
        }
      })
      // //console.log("matterInfo", matterInfo);
      if (flag) {
        let num = -1;
        message.warn("已存在,请勿重复添加！")
        matterInfo.map((item, index) => {
          if (item.swlxmc === "new") {
            num = index
          }
        })
        if (num !== -1) {
          matterInfo.splice(num, 1)
        }
      } else {
        const sxlbparam = {type: 'title'};
        matterInfo.map(item => {
          if (item.swlxmc === "new") {
            item.swlxmc = swlxmc
            item.sxlb[0] = sxlbparam;
          }
        })
      }
      //cccccccc
      let hash = {}
      let spliceList = [];
      spliceList = this.state.mileItemInfo.reduce((item, next) => {
        hash[next.swlx] ? '' : hash[next.swlx] = item.push(next);
        return item
      }, []);
      if (matterInfo.length === spliceList.filter((i) => i.lcbid === mile[index].lcblxid).length) {
        mile[index].addSxFlag = false;
      } else {
        mile[index].addSxFlag = true;
      }
      console.log("77777777", mile[index]);
      this.setState({inputVisible: '-1', mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
    }
  }

  removeSwlxMx = (e, index, i) => {
    if (e !== undefined) {
      const {mileInfo: {milePostInfo = []},} = this.state;
      // 多层数组的深拷贝方式  真暴力哦
      const mile = JSON.parse(JSON.stringify(milePostInfo));
      let swlxmc = ""
      this.state.swlxarr.map((mi, mi_index) => {
        if (mi.swlxid === e) {
          swlxmc = mi.swlx;
        }
      })
      const matterInfo = mile[index].matterInfos;
      mile[index].flag = false;
      matterInfo.pop();
      this.setState({inputVisible: '-1', mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
    }
  }

  onRygwSelectChange = (e) => {
    // //console.log("eeee",e)
    this.setState({
      onRygwSelectValue: e,
    })
  }

  onRygwSelectConfirm = () => {
    const {staffJobList, rygwDictionary, onRygwSelectValue, rygwSelectDictionary,} = this.state;
    if (onRygwSelectValue !== '') {
      const filter = rygwDictionary.filter(item => item.ibm === onRygwSelectValue)
      staffJobList.push(filter[0]);
      let newArr = staffJobList.concat()
      let newArray = rygwDictionary.filter(function (item) {
        return newArr.indexOf(item) === -1
      });
      this.setState({
        rygwSelectDictionary: newArray,
        rygwSelect: false,
        onRygwSelectValue: '',
        staffJobList: staffJobList
      })
    }
  }

  tabsCallback = async (key) => {
    this.setState({current: key})
  }

  //招标信息-----------------
  // 查询供应商下拉列表
  fetchQueryGysInZbxx(current, pageSize) {
    return FetchQueryGysInZbxx({
      // paging: 1,
      paging: -1,
      sort: "",
      current,
      pageSize,
      total: -1,
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          gysData: [...rec],
          glgys: [...rec]
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取项目信息
  fetchQueryHTXXByXQTC() {
    const {purchaseInfo = [], basicInfo = []} = this.state;
    return FetchQueryHTXXByXQTC({
      xmmc: Number(basicInfo.projectId),
    }).then(res => {
      let rec = res.record;
      let arr = [];
      if (rec.length > 0) {
        for (let i = 0; i < rec.length; i++) {
          if (rec[i]?.fkxqid !== "") {
            arr.push({
              id: rec[i]?.fkxqid,
              ['fkqs' + rec[i]?.fkxqid]: Number(rec[i]?.fkqs),
              ['bfb' + rec[i]?.fkxqid]: Number(rec[i]?.bfb),
              ['fkje' + rec[i]?.fkxqid]: Number(rec[i]?.fkje),
              ['fksj' + rec[i]?.fkxqid]: rec[i]?.fksj === "" ? moment(new Date()).format('YYYY-MM-DD') : moment(rec[i]?.fksj).format('YYYY-MM-DD'),
            });
          }
        }
        this.setState({
          purchaseInfo: {
            ...purchaseInfo,
            contractValue: Number(rec[0]?.htje),
            signData: rec[0]?.qsrq ? rec[0]?.qsrq : moment(new Date).format('YYYY-MM-DD'),
            paymentInfos: arr,
            ZT: rec[0]?.ZT
          },
          tableData: [...this.state.tableData, ...arr],
          htxxCzlx: rec.length > 0 ? 'UPDATE' : 'ADD',
          htxxVisiable: true,
        });
      } else {
        this.setState({
          htxxVisiable: false,
        })
      }

    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // 获取中标信息
  fetchQueryZBXXByXQTC() {
    const {purchaseInfo, glgys = [], staticSkzhData = [], basicInfo = []} = this.state;
    return FetchQueryZBXXByXQTC({
      xmmc: Number(basicInfo.projectId),
    }).then(res => {
      let rec = res.record;
      if (rec.length > 0) {
        this.setState({
          zbxxVisiable: true,
          zbxxCzlx: rec.length > 0 ? 'UPDATE' : 'ADD',
          purchaseInfo: {
            ...purchaseInfo,
            othersSupplier: arr,
            biddingSupplierName: glgys.filter(x => x.id === rec[0]?.zbgys)[0]?.gysmc || '',
            biddingSupplier: rec[0]?.zbgys,
            bidCautionMoney: Number(rec[0]?.tbbzj),
            cautionMoney: Number(rec[0]?.lybzj),
            number: staticSkzhData.filter(x => x.id === rec[0]?.zbgysfkzh)[0]?.khmc || '',
            pbbg: rec[0]?.pbbg,
          },
          uploadFileParams: {
            columnName: 'PBBG',
            documentData: res.base64 ? res.base64 : "DQoNCg0KDQoxMTExMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIxMTExMjExMTEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjExMTEyDQoyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMTExMTIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy",
            fileLength: 0,
            filePath: '',
            fileName: rec[0]?.pbbg ? rec[0]?.pbbg : "测试.txt",
            id: rec[0]?.zbxxid ? rec[0]?.zbxxid : 0,
            objectName: 'TXMXX_ZBXX'
          },
        });
        if (res.url && res.base64 && rec[0].pbbg) {
          let arrTemp = [];
          arrTemp.push({
            uid: Date.now(),
            name: rec[0].pbbg,
            status: 'done',
            url: res.url,
          });
          this.setState({
            fileList: [...this.state.fileList, ...arrTemp]
          }, () => {
            // console.log('已存在的filList', this.state.fileList);
          });
        }
        let arr = [];
        for (let i = 0; i < rec.length; i++) {
          if (rec[i].gysmc !== "") {
            let id = getID();
            arr.push({
              id,
              [`gysmc${id}`]: glgys.filter(x => x.id === rec[i].gysmc)[0]?.gysmc || '',
            });
          }
        }
        this.setState({
          tableDataQT: [...this.state.tableDataQT, ...arr],
        });
      } else {
        this.setState({
          zbxxVisiable: false,
        })
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  OnGysSuccess = () => {
    this.setState({addGysModalVisible: false});
    this.fetchQueryGysInZbxx();
  }

  //------------付款详情---------------------//
  setSelectedRowIds = (data) => {
    this.setState({
      selectedRowIds: data
    });
  };

  setTableData = (data) => {
    this.setState({
      tableData: data
    }, () => {
      let table1 = document.querySelectorAll(`.tableBox1 .ant-table-body`)[0];
      table1.scrollTop = table1.scrollHeight;
    });
  };

  setTableFullScreen = (visible) => {
    this.setState({
      isTableFullScreen: visible
    });
  };

  //合同信息修改付款详情表格多行删除
  handleMultiDelete = (ids) => {
    const dataSource = [...this.state.tableData];
    for (let j = 0; j < dataSource.length; j++) {
      for (let i = 0; i < ids.length; i++) {
        if (dataSource[j].id === ids[i]) {
          dataSource.splice(j, 1);
        }
      }
    }
    this.setState({tableData: dataSource});
  };

  //合同信息修改付款详情表格单行删除
  handleSingleDelete = (id) => {
    const dataSource = [...this.state.tableData];
    // console.log(dataSource);
    this.setState({tableData: dataSource.filter(item => item.id !== id)});
  };

  handleTableSave = row => {
    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,//old row
      ...row,//rew row
    });
    this.setState({tableData: newData}, () => {
      // console.log('tableData', this.state.tableData);
    });
  };

  //----------------其他供应商-----------------//
  //中标信息表格单行删除
  handleSingleDeleteQT = (id) => {
    const dataSource = [...this.state.tableDataQT];
    this.setState({tableDataQT: dataSource.filter(item => item.id !== id)});
  };
  //中标信息表格多行删除
  handleMultiDeleteQT = (ids) => {
    const dataSource = [...this.state.tableDataQT];
    for (let j = 0; j < dataSource.length; j++) {
      for (let i = 0; i < ids.length; i++) {
        if (dataSource[j].id === ids[i]) {
          dataSource.splice(j, 1);
        }
      }
    }
    this.setState({tableDataQT: dataSource});
  };
  handleTableSaveQT = row => {
    console.log("🚀row", row)
    const newData = [...this.state.tableDataQT];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({tableDataQT: newData}, () => {
      console.log('tableDataQT', this.state.tableDataQT);
    });
  };

  fetchQueryPaymentAccountList() {
    return QueryPaymentAccountList({
      type: 'ALL',
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          skzhData: [...rec],
          staticSkzhData: [...rec]
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  OnSkzhSuccess = () => {
    this.setState({addSkzhModalVisible: false});
    QueryPaymentAccountList({
      type: 'ALL',
    }).then(res => {
      if (res.success) {
        let rec = res.record;
        this.setState({
          skzhData: [...rec]
        });
      }
    });
  }

  render() {
    let {
      tags,
      inputValue,
      inputVisible,
      loading,
      current,
      minicurrent,
      height,
      softwareList = [],
      jobStaffInfoCollapse,
      milePostInfoCollapse,
      mileItemInfo = [],
      projectLabelList = [],
      budgetProjectList = [],
      budgetInfoCollapse,
      mileInfo: {milePostInfo = []},
      organizationTreeList,
      basicInfoCollapse,
      budgetInfo,
      searchStaffList = [],
      mileStageList = [],
      isCollapse = true,
      isEditMile = false,
      organizationStaffTreeList,
      staffJobList = [],
      checkedStaffKey,
      staffInfo: {jobStaffList = []},
      basicInfo = {software: ''},
      swlxarr = [],
      rygwDictionary = [],
      rygwSelectDictionary = [],
      rygwSelect = false,
      orgExpendKeys = [],
      ysKZX = 0,
      loginUser = [],
      projectBudgetChangeFlag = false,

      // 招标信息
      gysData = [],
      isSelectorOpen = false,
      addGysModalVisible = false,
      pbbgTurnRed,
      fileList = [],
      uploadFileParams,
      //付款详情
      selectedRowIds = [],
      isTableFullScreen = false,
      tableData = [],    //付款详情表格
      //其他供应商
      selectedRowIdsQT = [],
      isTableFullScreenQT = false,
      tableDataQT = [],    //其他供应商表格
      skzhData = [],
      staticSkzhData = [],
      glgys = [],
      //招采信息tab数据
      purchaseInfo = {},
      //合同信息是否展示
      htxxVisiable = false,
      zbxxVisiable = false,
    } = this.state;
    const {getFieldDecorator} = this.props.form;
    const tabs = [
      {
        key: 0,
        title: "基本信息",
      },
      {
        key: 1,
        title: "人员信息",
      },
      {
        key: 2,
        title: "里程碑信息",
      },
      {
        key: 3,
        title: "招采信息",
      },
      {
        key: 4,
        title: "其他信息",
      }
    ];
    const tabsdel = [
      {
        key: 0,
        title: "基本信息",
      },
      {
        key: 1,
        title: "人员信息",
      },
      {
        key: 2,
        title: "里程碑信息",
      },
      {
        key: 4,
        title: "其他信息",
      }
    ];
    //采购方式树状数据
    const bindMethodData = [
      {
        title: '公开招标',
        value: '1',
        key: '1',
      }, {
        title: '邀请招标',
        value: '2',
        key: '2',
      },
      {
        title: '非招标方式采购',
        value: '0-2',
        key: '0-2',
        children: [
          {
            title: '直采',
            value: '3',
            key: '3',
          },
          {
            title: '谈判',
            value: '4',
            key: '4',
          },
          {
            title: '竞价',
            value: '5',
            key: '5',
          },
          {
            title: '询比',
            value: '6',
            key: '6',
          },
        ],
      },
    ];
    const ministeps = [];
    // //console.log("milePostInfo", milePostInfo)
    milePostInfo.map(item => {
      let params;
      params = {
        title: <div style={{fontSize: '14px'}}>{item.lcbmc}</div>
      }
      ministeps.push(params)
    })
    // current = 1;

    //过滤里程碑
    const milePostInfoIds = milePostInfo.map(item => item.lcblxid)
    mileStageList = mileStageList.filter(item => {
      const {id} = item;
      return !milePostInfoIds.includes(id)
    })

    const addGysModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      title: '新增供应商',
      width: '120rem',
      height: '90rem',
      style: {top: '20rem'},
      visible: addGysModalVisible,
      footer: null,
    };

    //---------付款详情--------------//
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let newSelectedRowIds = [];
        selectedRows?.forEach(item => {
          newSelectedRowIds.push(item.id);
        })
        this.setState({selectedRowIds: newSelectedRowIds});
      }
    };
    const tableColumns = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>期数</span>,
        dataIndex: 'fkqs',
        width: '13%',
        key: 'fkqs',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>占比</span>,
        dataIndex: 'bfb',
        key: 'bfb',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>付款金额(万元)</span>,
        dataIndex: 'fkje',
        width: '22%',
        key: 'fkje',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>付款时间</span>,
        dataIndex: 'fksj',
        width: '23%',
        key: 'fksj',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>操作</span>,
        dataIndex: 'operator',
        key: 'operator',
        // width: 200,
        // fixed: 'right',
        ellipsis: true,
        render: (text, record) =>
          this.state.tableData.length >= 1 ? (
            <Popconfirm title="确定要删除吗?" onConfirm={() => {
              return this.handleSingleDelete(record.id)
            }}>
              <a style={{color: '#3361ff'}}>删除</a>
            </Popconfirm>
          ) : null,
      }
    ];
    const columns = tableColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          return ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            handleSave: this.handleTableSave,
            key: col.key,
            formdecorate: this.props.form,
          })
        },
      };
    });
    //覆盖默认table元素
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    //---------其他投标供应商--------------//
    const rowSelectionQT = {
      onChange: (selectedRowKeys, selectedRows) => {
        let newSelectedRowIds = [];
        selectedRows?.forEach(item => {
          newSelectedRowIds.push(item.id);
        })
        this.setState({selectedRowIdsQT: newSelectedRowIds});
      }
    };
    const tableColumnsQT = [
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>供应商</span>,
        dataIndex: 'gysmc',
        key: 'gysmc',
        ellipsis: true,
        editable: true,
      },
      {
        title: <span style={{color: '#606266', fontWeight: 500}}>操作</span>,
        dataIndex: 'operator',
        key: 'operator',
        width: 102.81,
        ellipsis: true,
        render: (text, record) =>
          this.state.tableDataQT.length >= 1 ? (
            <Popconfirm title="确定要删除吗?" onConfirm={() => {
              return this.handleSingleDeleteQT(record.id)
            }}>
              <a style={{color: '#3361ff'}}>删除</a>
            </Popconfirm>
          ) : null,
      }
    ];
    const columnsQT = tableColumnsQT.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => {
          return ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            handleSave: this.handleTableSaveQT,
            key: col.key,
            gysdata: [...glgys],
            skzhdata: [...skzhData],
            formdecorate: this.props.form,
          })
        },
      };
    });
    //覆盖默认table元素
    const componentsQT = {
      body: {
        row: EditableFormRowQT,
        cell: EditableCellQT,
      },
    };
    return (
      <Fragment>
        <div className="editProject" style={{overflow: 'hidden', height: "100%"}}>
          <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large" style={{height: "100%"}}>
            <div style={{overflow: 'hidden', height: "100%"}}>
              <div style={{height: "6%"}}>
                <Tabs defaultActiveKey="0" onChange={this.tabsCallback}>
                  {
                    htxxVisiable || zbxxVisiable ? tabs.map(item => {
                      return <TabPane tab={item.title} key={item.key}>
                      </TabPane>
                    }) : tabsdel.map(item => {
                      return <TabPane tab={item.title} key={item.key}>
                      </TabPane>
                    })
                  }
                </Tabs>

              </div>
              {
                // 基本信息
                current == 0 && <div className="steps-content">
                  <React.Fragment>
                    <Form ref={e => this.basicForm = e}>
                      <Row gutter={24}>
                        <Col span={12} style={{paddingRight: '24px'}}>
                          <Form.Item label="项目名称" className="formItem">
                            {getFieldDecorator('projectName', {
                              rules: [{
                                required: true,
                                message: '请输入项目名称'
                              }],
                              initialValue: basicInfo.projectName
                            })(
                              <Input placeholder="请输入项目名称" onChange={e => {
                                this.setState({basicInfo: {...basicInfo, projectName: e.target.value}});
                              }}/>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{paddingLeft: '24px'}}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>项目类型</span>} className="formItem">
                            {getFieldDecorator('projectType', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入项目类型'
                              // }],
                              initialValue: basicInfo.projectType
                            })(
                              <Radio.Group onChange={e => {
                                this.setState({basicInfo: {...basicInfo, projectType: e.target.value}});
                                this.fetchQueryMilepostInfo({
                                  type: e.target.value,
                                  xmid: basicInfo.projectId,
                                  biddingMethod: basicInfo.biddingMethod,
                                  budget: budgetInfo.projectBudget,
                                  label: basicInfo.labelTxt,
                                  queryType: "ALL"
                                });
                              }}>
                                <Radio value={1}>外采项目</Radio>
                                <Radio value={2}>自研项目</Radio>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12} style={{paddingRight: '24px'}}>
                          <Form.Item label="项目标签" className="formItem">
                            {getFieldDecorator('projectLabel', {
                              initialValue: basicInfo.projectLabel
                            })(
                              <TreeSelect
                                multiple
                                showSearch
                                treeNodeFilterProp="title"
                                style={{width: '100%'}}
                                // tagRender={item => {
                                //   return "weqweqwe" + item;
                                // }}
                                maxTagCount={3}
                                maxTagTextLength={42}
                                maxTagPlaceholder={extraArr => {
                                  return `等${extraArr.length + 3}个`;
                                }}
                                dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                treeData={projectLabelList}
                                treeCheckable
                                placeholder="请选择项目标签"
                                // treeDefaultExpandAll
                                // treeDefaultExpandedKeys={orgExpendKeys}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                onChange={(e, nodeArr, extra) => {
                                  //选根节点的话入参就是把这个根节点里面的标签都选上
                                  console.log("extraextra", extra)
                                  let labelTxt = nodeArr.map(x => x);
                                  labelTxt = labelTxt.join(';');
                                  console.log("labelTxt", labelTxt)
                                  console.log("eeeeee", e)
                                  this.setState({
                                    basicInfo: {...basicInfo, projectLabel: e, labelTxt}
                                  });
                                  this.fetchQueryMilepostInfo({
                                    type: basicInfo.projectType,
                                    xmid: basicInfo.projectId,
                                    biddingMethod: basicInfo.biddingMethod,
                                    budget: budgetInfo.projectBudget,
                                    label: labelTxt,
                                    queryType: "ALL"
                                  });
                                }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{paddingLeft: '24px'}}>
                          <Form.Item label="关联软件" className="formItem">
                            {getFieldDecorator('software', {
                              initialValue: basicInfo.software
                            })(
                              <Select showSearch
                                      onChange={e => {
                                        softwareList.forEach(item => {
                                          if (item.id === e) {
                                            this.setState({
                                              basicInfo: {...basicInfo, software: e,}
                                            });
                                          }
                                        })
                                      }}
                                      filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }>
                                {
                                  softwareList.length > 0 && softwareList.map((item, index) => {
                                    return (
                                      <Option key={index} value={item.id}>{item.softName}</Option>
                                    )
                                  })
                                }
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        {
                          basicInfo.projectType === 1 ? (
                            <Col span={12} style={{paddingRight: '24px'}}>
                              <Form.Item label={<span><span style={{
                                fontFamily: 'SimSun, sans-serif',
                                color: '#f5222d',
                                marginRight: '4px',
                                lineHeight: 1
                              }}>*</span>采购方式</span>} className="formItem">
                                {getFieldDecorator('biddingMethod', {
                                  // rules: [{
                                  //   required: true,
                                  //   message: '请输入采购方式'
                                  // }],
                                  initialValue: basicInfo.biddingMethod
                                })(
                                  <TreeSelect
                                    showSearch
                                    dropdownClassName="newproject-treeselect"
                                    treeNodeFilterProp="title"
                                    style={{width: '100%'}}
                                    dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                    treeData={bindMethodData}
                                    placeholder="请选择采购方式"
                                    // treeCheckable
                                    // treeDefaultExpandAll
                                    // getPopupContainer={triggerNode => triggerNode.parentNode}
                                    // treeDefaultExpandedKeys={orgExpendKeys}
                                    onChange={e => {
                                      console.log("请选择采购方式", e)
                                      this.setState({basicInfo: {...basicInfo, biddingMethod: e}});
                                      this.fetchQueryMilepostInfo({
                                        type: basicInfo.projectType,
                                        xmid: this.state.basicInfo.projectId,
                                        biddingMethod: e,
                                        budget: budgetInfo.projectBudget,
                                        label: basicInfo.labelTxt,
                                        queryType: "ALL"
                                      });
                                    }}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                          ) : null
                        }
                        <Col span={12} style={{paddingLeft: basicInfo.projectType === 1 ? '24px' : '12px'}}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>应用部门</span>} className="formItem">
                            {getFieldDecorator('org', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入应用部门'
                              // }],
                              initialValue: basicInfo.org ? basicInfo.org : null
                            })(
                              <TreeSelect
                                multiple
                                showSearch
                                treeNodeFilterProp="title"
                                style={{width: '100%'}}
                                maxTagCount={3}
                                maxTagTextLength={42}
                                maxTagPlaceholder={extraArr => {
                                  return `等${extraArr.length + 3}个`;
                                }}
                                dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
                                treeData={organizationTreeList}
                                placeholder="请选择应用部门"
                                // treeCheckable
                                // treeDefaultExpandAll
                                // getPopupContainer={triggerNode => triggerNode.parentNode}
                                treeDefaultExpandedKeys={orgExpendKeys}
                                onChange={e => {
                                  this.setState({
                                    basicInfo: {...basicInfo, org: e}
                                  })
                                }}
                              />
                            )}

                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={3} style={{paddingRight: '4px'}}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>关联预算</span>} className="formItem">
                            {/*{getFieldDecorator('year', {*/}
                            {/*  initialValue: budgetInfo.year*/}
                            {/*})(*/}
                            <DatePicker value={budgetInfo.year} allowClear={false} ref={picker => this.picker = picker}
                                        onChange={v => {
                                          const _this = this;
                                          this.setState({
                                            budgetInfo: {
                                              ...this.state.budgetInfo,
                                              budgetProjectId: '',
                                              totalBudget: 0,
                                              relativeBudget: 0,
                                              year: v == null ? moment(new Date()) : v
                                            }
                                          }, function () {
                                            _this.props.form.resetFields(['projectBudget']);
                                            _this.props.form.validateFields(['projectBudget']);
                                            _this.fetchQueryBudgetProjects({
                                              type: 'NF',
                                              year: Number(v == null ? moment(new Date()).format("YYYY") : v.format("YYYY"))
                                            });
                                          })
                                        }}
                                        onPanelChange={(v) => {
                                          this.picker.picker.state.open = false;
                                          const _this = this;
                                          this.setState({
                                            budgetInfo: {
                                              ...this.state.budgetInfo,
                                              budgetProjectId: '',
                                              totalBudget: 0,
                                              relativeBudget: 0,
                                              year: v
                                            }
                                          }, function () {
                                            _this.props.form.resetFields(['projectBudget']);
                                            _this.props.form.validateFields(['projectBudget']);
                                            _this.fetchQueryBudgetProjects({
                                              type: 'NF',
                                              year: Number(v.format("YYYY"))
                                            });
                                          })
                                        }}
                                        format="YYYY" mode="year"/>
                            {/*)}*/}
                          </Form.Item>
                        </Col>
                        <Col span={21} style={{paddingLeft: '4px'}}>
                          <Form.Item label=" " colon={false} className="formItem">
                            {getFieldDecorator('budgetProjectId', {
                              // rules: [{
                              //   required: true,
                              //   message: '请选择关联预算项目'
                              // }],
                              initialValue: budgetInfo.budgetProjectName ? budgetInfo.budgetProjectName : null
                            })(
                              <TreeSelect
                                showSearch
                                treeNodeFilterProp="title"
                                style={{width: '100%'}}
                                dropdownClassName="newproject-treeselect"
                                dropdownStyle={{maxHeight: 200, overflow: 'auto'}}
                                treeData={budgetProjectList}
                                placeholder="请选择关联预算项目"
                                // treeDefaultExpandAll
                                onChange={e => {
                                  budgetProjectList.forEach(item => {
                                    item?.children?.forEach(ite => {
                                      if (e === '0备用预算') {
                                        // //console.log("iteiteiteite",ite)
                                        const _this = this;
                                        this.setState({
                                          budgetInfo: {
                                            ...this.state.budgetInfo,
                                            budgetProjectId: ite.ysID,
                                            totalBudget: 0,
                                            relativeBudget: 0,
                                            // projectBudget: 0,
                                            budgetProjectName: '备用预算',
                                            budgetType: '资本性预算'
                                          },
                                          ysKZX: ite.ysKZX,
                                        }, function () {
                                          _this.props.form.resetFields(['projectBudget']);
                                          _this.props.form.validateFields(['projectBudget']);
                                        });
                                      }
                                      ite?.children?.forEach(i => {
                                        if (i.value === e) {
                                          // //console.log("iiiiii",i)
                                          const _this = this;
                                          this.setState({
                                            budgetInfo: {
                                              ...this.state.budgetInfo,
                                              budgetProjectId: i.ysID,
                                              budgetProjectName: i.value,
                                              totalBudget: Number(i.ysZJE),
                                              relativeBudget: Number(i.ysKGL),
                                              budgetType: i.ysLX
                                            },
                                            ysKZX: i.ysKZX,
                                          }, function () {
                                            _this.props.form.resetFields(['projectBudget']);
                                            _this.props.form.validateFields(['projectBudget']);
                                          });
                                        }
                                      })
                                    })
                                  })
                                }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: this.state.budgetInfo.budgetProjectId === '0' ? 'none' : ''}}>
                        <Col span={12} style={{paddingRight: '24px'}}>
                          <Form.Item label="总预算(元)" className="formItem">
                            <InputNumber disabled={true} style={{width: '100%'}} value={budgetInfo.totalBudget}
                                         precision={0}/>
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{paddingLeft: '24px'}}>
                          <Form.Item label="可执行预算(元)" className="formItem">
                            <InputNumber disabled={true} style={{width: '100%'}} value={ysKZX}
                                         precision={0}/>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12} style={{
                          paddingRight: '24px',
                          display: this.state.budgetInfo.budgetProjectId === '0' ? 'none' : ''
                        }}>
                          <Form.Item label="剩余预算(元)" className="formItem">
                            <InputNumber disabled={true} style={{width: '100%'}} value={budgetInfo.relativeBudget}
                                         precision={0}/>
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{paddingLeft: '24px'}}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>本项目预算(元)</span>} className="formItem">
                            {getFieldDecorator('projectBudget', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入本项目预算(元)'
                              // }, {
                              //   validator: this.handleValidatorProjectBudget
                              // }],
                              initialValue: budgetInfo.projectBudget
                            })(
                              <InputNumber onBlur={(e) => {
                                if (projectBudgetChangeFlag) {
                                  this.fetchQueryMilepostInfo({
                                    type: basicInfo.projectType,
                                    xmid: this.state.basicInfo.projectId,
                                    biddingMethod: basicInfo.biddingMethod,
                                    budget: budgetInfo.projectBudget,
                                    label: basicInfo.labelTxt,
                                    queryType: "ONLYLX"
                                  });
                                }
                              }} style={{width: '100%'}} onChange={e => {
                                let projectBudgetChangeFlag = false
                                if (e !== this.state.budgetInfo.projectBudget) {
                                  projectBudgetChangeFlag = true;
                                }
                                this.setState({
                                  projectBudgetChangeFlag,
                                  budgetInfo: {...budgetInfo, projectBudget: e}
                                });
                              }} precision={0}/>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                    {/*</Form>*/}
                  </React.Fragment>
                </div>
              }
              {
                // 里程碑信息
                current == 2 && <div style={{display: 'flex', height: '86%'}}>
                  <Steps progressDot style={{height: '71vh', maxWidth: '200px', margin: '0 auto', padding: '24px'}}
                         direction="vertical"
                         current={minicurrent} onChange={this.onChange}>

                    {ministeps.map((item, index) => (
                      <Step status={minicurrent === index ? 'finish' : 'wait'}
                            style={{height: (71 / (ministeps.length * 1.8)) + 'vh'}} key={index} title={item.title}/>
                    ))}
                  </Steps>
                  <Divider type="vertical" style={{height: 'auto'}}/>
                  <div className="steps-content-2" id="lcbxxClass"
                       style={{
                         overflowY: 'scroll',
                         overflowX: 'hidden',
                         height: '100%',
                         paddingBottom: '18px',
                         width: '80%',
                       }}
                       ref={c => {
                         this.scrollRef = c;
                       }}
                       onScrollCapture={() => this.onScrollHandle()}>
                    <React.Fragment>
                      {
                        milePostInfo.length > 0 && milePostInfo.map((item, index) => {
                          // //console.log("itemitemitem", item)
                          const {matterInfos = {}} = item;
                          const swlxmcs = matterInfos.map(item => item.swlxmc)
                          swlxarr = swlxarr.filter(item => {
                            const {swlx} = item;
                            return !swlxmcs.includes(swlx)
                          })

                          return (
                            <React.Fragment>
                              {
                                item.type && item.type === 'new' ? (
                                  <div key={index} className="newMilePost">
                                    <div style={{
                                      width: '100%',
                                      display: 'flex',
                                      flexDirection: 'row',
                                      padding: '6px 12px 6px 0px'
                                    }}>
                                      <div style={{
                                        width: '80%',
                                        display: 'inline-flex',
                                        paddingLeft: '6px',
                                        alignItems: 'center'
                                      }}>
                                        <div style={{
                                          width: '4px',
                                          height: '12px',
                                          background: '#3461FF',
                                          lineHeight: '19px',
                                          margin: '3.5px 3.5px 0 0'
                                        }}/>
                                        <Select
                                          showSearch
                                          filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                          }
                                          onChange={e => this.selectMileStageInfo(e, index)}
                                          placeholder="请选择"
                                          style={{width: '25%',}}
                                        >
                                          {
                                            mileStageList.length > 0 && mileStageList.map((item, index) => {
                                              return (<Option key={index} value={item.id}>{item.lcbmc}</Option>)
                                            })
                                          }
                                        </Select>
                                      </div>
                                      <div className="right" style={{marginTop: '12px'}}>
                                        {
                                          <Tooltip title="保存">
                                            <a style={{color: '#666', marginTop: '12px', marginLeft: '12px'}}
                                               className="iconfont file-filldone"
                                               onClick={() => this.saveMilePostInfo(index)}/>
                                          </Tooltip>
                                        }
                                        {/* {
                                          <Tooltip title="添加事项">
                                            <a style={{ color: '#666', marginTop: '12px', marginLeft: '1rem' }}
                                              className="iconfont circle-add"
                                              onClick={() => this.addSwlx(item?.lcblxid, index)} />
                                          </Tooltip>
                                        } */}
                                        {
                                          <Tooltip title="删除">
                                            <a style={{color: '#666', marginTop: '12px', marginLeft: '6px'}}
                                               className="iconfont delete"
                                               onClick={() => this.removeMilePostInfo(index)}/>
                                          </Tooltip>
                                        }
                                      </div>
                                    </div>
                                    <div style={{display: 'flex', padding: '6px 0 0 0',}}>
                                      <div style={{
                                        display: 'grid',
                                        alignItems: 'center',
                                        justifyContent: 'end',
                                        width: '10%',
                                      }}>
                                          <span style={{
                                            paddingLeft: '6px',
                                            fontSize: '14px',
                                            lineHeight: '20px',
                                            fontWeight: 500,
                                          }}><span style={{
                                            fontFamily: 'SimSun, sans-serif',
                                            color: '#f5222d',
                                            marginRight: '4px',
                                            lineHeight: 1
                                          }}>
                                          *</span>
                                            时间
                                        </span>
                                      </div>
                                      <div style={{
                                        paddingLeft: '12px',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '270px'
                                      }} id="datePicker">
                                        <DatePicker format="YYYY.MM.DD"
                                                    value={moment(item.kssj, 'YYYY-MM-DD')}
                                                    allowClear={false}
                                                    onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'start')}
                                                    onFocus={() => this.setState({
                                                      isEditMile: true,
                                                      isCollapse: false
                                                    })}/>
                                        <div style={{
                                          fontSize: '14px',
                                          fontWeight: 'bold',
                                          padding: '0 8px',
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}>~
                                        </div>
                                        <DatePicker format="YYYY.MM.DD"
                                                    value={moment(item.jssj, 'YYYY-MM-DD')}
                                                    allowClear={false}
                                                    onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'end')}
                                                    onFocus={() => this.setState({
                                                      isEditMile: true,
                                                      isCollapse: false
                                                    })}/>
                                      </div>
                                    </div>
                                    {
                                      item.matterInfos.length > 0 && item.matterInfos.map((e, i) => {
                                        // //console.log("e.sxlb", e.sxlb)
                                        const {sxlb = {}} = e;
                                        const sxids = sxlb.map(item => item.sxid)
                                        mileItemInfo = mileItemInfo.filter(item => {
                                          const {sxid} = item;
                                          return !sxids.includes(sxid)
                                        })
                                        return (
                                          <div className="flow" key={i}
                                               style={{
                                                 display: e.swlxmc === "new" && e.sxlb?.length === 0 ? '' : (e.swlxmc !== "new" && e.sxlb?.length === 0 ? 'none' : ''),
                                               }}>
                                            <div style={{
                                              width: e.swlxmc === "new" && e.sxlb?.length === 0 ? '100%' : '10%',
                                              alignItems: 'center',
                                              display: 'grid',
                                            }}>
                                              {
                                                e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                  if (sx.type && sx.type === 'title' && sx_index === 0) {
                                                    return (
                                                      <div key={String(sx_index + 1)} style={{
                                                        fontSize: '14px',
                                                        lineHeight: '20px',
                                                        fontWeight: 500,
                                                        textAlign: 'end',
                                                      }}>
                                                        {e.swlxmc || ''}
                                                      </div>
                                                    )
                                                  }
                                                })
                                              }
                                              {e.swlxmc === "new" && (
                                                <div style={{width: '100%'}}>
                                                  <Select showSearch
                                                          ref={this[`${index}inputRef${i}`]}
                                                          filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                          }
                                                    // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                          onChange={(e) => {
                                                            // //console.log("eeee-cc",e)
                                                            this.setState({inputValue: e})
                                                          }}
                                                    //milePostInfo[index].matterInfos[i].length
                                                          onBlur={e => this.addSwlxMx(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                          style={{
                                                            width: '120px',
                                                            marginTop: '6px',
                                                            marginLeft: '6px'
                                                          }}>
                                                    {
                                                      swlxarr.length > 0 && swlxarr.map((mi, mi_index) => {
                                                        // if (mi.swlx === e.swlxmc) {
                                                        return (
                                                          <Option title={mi.swlx} key={mi_index}
                                                                  value={mi.swlxid}>{mi.swlx}</Option>
                                                        )
                                                        // }
                                                      })
                                                    }
                                                  </Select>
                                                  <Tooltip title="取消新增">
                                                    <a style={{color: '#666', marginTop: '12px', marginLeft: '1rem'}}
                                                       className="iconfont delete"
                                                       onClick={e => this.removeSwlxMx(e, index, i)}/>
                                                  </Tooltip>
                                                </div>
                                              )
                                              }
                                            </div>
                                            <div>
                                              {/*{*/}
                                              {/*  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {*/}
                                              {/*    if (sx.type && sx.type === 'title') {*/}
                                              {/*      return (*/}
                                              {/*        <div key={String(sx_index + 1)}*/}
                                              {/*             style={{paddingTop: '12px', fontWeight: 'bold'}}>*/}
                                              {/*        </div>*/}
                                              {/*      )*/}
                                              {/*    }*/}
                                              {/*  })*/}
                                              {/*}*/}
                                            </div>
                                            <div style={{
                                              width: '90%',
                                              display: 'flex',
                                              flexWrap: 'wrap',
                                              alignContent: 'center',
                                            }}>
                                              <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '12px'}}>
                                                {
                                                  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                    // //console.log("sxsxsx",sx)
                                                    if (!sx.type && sx_index !== 0) {
                                                      return (
                                                        <div key={String(sx_index + 1)}
                                                             className={sx.type && sx.type === 'new' ? 'new' : 'item'}>
                                                          {
                                                            <React.Fragment>
                                                              <span title={sx.sxmc}
                                                                    style={{
                                                                      fontSize: '12px',
                                                                      padding: '8px 0',
                                                                      color: '#666666',
                                                                      lineHeight: '16px'
                                                                    }}>{sx.sxmc.length > 10 ? (sx.sxmc.substring(0, 10) + '...') : sx.sxmc}</span>
                                                              {
                                                                <span
                                                                  onClick={() => this.removeMilePostInfoItem(index, i, sx_index)}>
                                                                  <Icon type="close" className="icon"/>
                                                                </span>
                                                              }
                                                            </React.Fragment>
                                                          }

                                                        </div>
                                                      )
                                                    }
                                                  })
                                                }
                                                {inputVisible === `${index}+${i}` ? (
                                                  <Select showSearch
                                                          ref={this[`${index}inputRef${i}`]}
                                                          filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                          }
                                                    // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                          onChange={(e) => this.setState({inputValue: e})}
                                                    //milePostInfo[index].matterInfos[i].length
                                                          onBlur={e => this.handleInputConfirm(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                          style={{
                                                            width: '120px',
                                                            marginTop: '6px',
                                                            marginLeft: '6px'
                                                          }}>
                                                    {
                                                      mileItemInfo.length > 0 && mileItemInfo.map((mi, mi_index) => {
                                                        // //console.log("mileItemInfo.length",mileItemInfo.length)
                                                        if (mi.swlx === e.swlxmc) {
                                                          //console.log("flag")
                                                          return (
                                                            <Option title={mi.sxmc} key={mi_index}
                                                                    value={mi.sxid}>{mi.sxmc}</Option>
                                                          )
                                                        }
                                                      })
                                                    }
                                                  </Select>
                                                ) : (e.sxlb?.length !== 1 && e.swlxmc !== "new" && e.addFlag &&
                                                  <div className='editProject addHover'
                                                       style={{
                                                         display: 'grid',
                                                         alignItems: 'center',
                                                         marginTop: '6px'
                                                       }}>
                                                    <Tag
                                                      style={{background: '#fff', border: 'none'}}>
                                                      <a className="iconfont circle-add"
                                                         style={{fontSize: '14px', color: 'rgb(51, 97, 255)',}}
                                                         onClick={() => this.showInput(index, i)}>新增</a>
                                                    </Tag></div>)
                                                }
                                                {
                                                  e.sxlb?.length === 1 && e.swlxmc !== "new" &&
                                                  (
                                                    <Select showSearch
                                                            ref={this[`${index}inputRef${i}`]}
                                                            filterOption={(input, option) =>
                                                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                      // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                            onChange={(e) => this.setState({inputValue: e})}
                                                      //milePostInfo[index].matterInfos[i].length
                                                            onBlur={e => this.handleInputConfirm(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                            style={{
                                                              width: '120px',
                                                              marginTop: '6px',
                                                              marginLeft: '6px'
                                                            }}>
                                                      {
                                                        mileItemInfo.length > 0 && mileItemInfo.map((mi, mi_index) => {
                                                          if (mi.swlx === e.swlxmc) {
                                                            return (
                                                              <Option title={mi.sxmc} key={mi_index}
                                                                      value={mi.sxid}>{mi.sxmc}</Option>
                                                            )
                                                          }
                                                        })
                                                      }
                                                    </Select>
                                                  )
                                                }
                                              </div>
                                              <div style={{
                                                position: 'absolute',
                                                top: '30%',
                                                right: '0.7%',
                                                color: '#3461FF'
                                              }}>
                                                {/*<Tag*/}
                                                {/*  style={{background: '#fff', borderStyle: 'dashed'}}>*/}
                                                {/*  <a className="iconfont circle-add"*/}
                                                {/*     style={{fontSize: '2.038rem', color: 'rgb(51, 97, 255)',}}*/}
                                                {/*     onClick={() => this.showInput(index, i)}>新增</a>*/}
                                                {/*</Tag>*/}
                                                {/*<span onClick={() => this.removeMilePostTypeInfo(index, i)}*/}
                                                {/*      style={{cursor: 'pointer', fontSize: '2.5rem'}}>删除本行</span>*/}
                                              </div>
                                            </div>
                                          </div>
                                        )

                                      })
                                    }
                                    {item.addSxFlag &&
                                    <div className="addMilePost"
                                         style={{width: 'calc(46% + 3.5rem)', marginTop: '12px'}}
                                         onClick={() => this.addSwlx(item?.lcblxid, index)}>
                                      <Icon type="plus" style={{fontSize: '12px'}}/><span
                                      style={{paddingLeft: '6px', fontSize: '14px'}}>添加事项</span>
                                    </div>
                                    }
                                  </div>
                                ) : (
                                  <div key={index} className="milePost" id={`milePost${index}`}>
                                    <div style={{padding: '6px 12px 6px 0px'}} className='title'>
                                      <div className="left">
                                        <div style={{marginTop: '12px'}}>
                                          <span style={{
                                            paddingLeft: '6px',
                                            fontSize: '14px',
                                            lineHeight: '19px',
                                            fontWeight: 'bold',
                                            color: '#333333',
                                            display: 'flex',
                                            // borderLeft: '4px solid #3461FF'
                                          }}><div style={{
                                            width: '4px',
                                            height: '12px',
                                            background: '#3461FF',
                                            lineHeight: '19px',
                                            margin: '3.5px 3.5px 0 0'
                                          }}> </div>
                                            {item.lcbmc}</span>
                                        </div>
                                      </div>
                                      {
                                        <div className="right" style={{marginTop: '12px',}}>
                                          {
                                            index > 0 ? (
                                              <Tooltip title="上移">
                                                <a style={{color: '#666', marginTop: '12px', marginLeft: '6px'}}
                                                   className="iconfont collapse"
                                                   onClick={() => this.moveMilePostInfo(index, 'top')}/>
                                              </Tooltip>
                                            ) : null
                                          }
                                          {
                                            index !== milePostInfo.length - 1 ? (
                                              <Tooltip title="下移">
                                                <a style={{color: '#666', marginTop: '12px', marginLeft: '6px'}}
                                                   className="iconfont expand"
                                                   onClick={() => this.moveMilePostInfo(index, 'down')}/>
                                              </Tooltip>
                                            ) : null
                                          }
                                          {/* {
                                            <Tooltip title="添加事项">
                                              <a style={{ color: '#666', marginTop: '12px', marginLeft: '1rem' }}
                                                className="iconfont circle-add"
                                                onClick={() => this.addSwlx(item?.lcblxid, index)} />
                                            </Tooltip>
                                          } */}
                                          {
                                            !item.lcbmc.includes("立项") && !item.lcbmc.includes("实施") && !item.lcbmc.includes("上线")
                                            && <Tooltip title="删除">
                                              <a style={{color: '#666', marginTop: '12px', marginLeft: '6px'}}
                                                 className="iconfont delete"
                                                 onClick={() => this.removeMilePostInfo(index)}/>
                                            </Tooltip>
                                          }
                                        </div>
                                      }

                                    </div>
                                    <div style={{display: 'flex', padding: '6px 0 0 0',}}>
                                      <div style={{
                                        display: 'grid',
                                        alignItems: 'center',
                                        justifyContent: 'end',
                                        width: '10%',
                                      }}>
                                          <span style={{
                                            paddingLeft: '6px',
                                            fontSize: '14px',
                                            lineHeight: '20px',
                                            fontWeight: 500,
                                          }}><span style={{
                                            fontFamily: 'SimSun, sans-serif',
                                            color: '#f5222d',
                                            marginRight: '4px',
                                            lineHeight: 1
                                          }}>
                                          *</span>
                                            时间
                                        </span>
                                      </div>
                                      <div style={{
                                        paddingLeft: '12px',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: '270px'
                                      }} id="datePicker">
                                        <DatePicker format="YYYY.MM.DD"
                                                    value={moment(item.kssj, 'YYYY-MM-DD')}
                                                    allowClear={false}
                                                    onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'start')}
                                                    onFocus={() => this.setState({
                                                      isEditMile: true,
                                                      isCollapse: false
                                                    })}/>
                                        <div style={{
                                          fontSize: '14px',
                                          fontWeight: 'bold',
                                          padding: '0 8px',
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}>~
                                        </div>
                                        <DatePicker format="YYYY.MM.DD"
                                                    value={moment(item.jssj, 'YYYY-MM-DD')}
                                                    allowClear={false}
                                                    onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'end')}
                                                    onFocus={() => this.setState({
                                                      isEditMile: true,
                                                      isCollapse: false
                                                    })}/>
                                      </div>
                                      {/* <RiskOutline/> */}
                                    </div>
                                    {
                                      item.matterInfos.length > 0 && item.matterInfos.map((e, i) => {
                                        // //console.log("e.sxlb", e.sxlb)
                                        //过滤已有条目
                                        const {sxlb = {}} = e;
                                        const sxids = sxlb.map(item => item.sxid)
                                        mileItemInfo = mileItemInfo.filter(item => {
                                          const {sxid} = item;
                                          return !sxids.includes(sxid)
                                        })
                                        // //console.log("mileItemInfo", mileItemInfo)
                                        // //console.log("e.swlxmc", e)
                                        return (
                                          <div className="flow" key={i} style={{
                                            display: e.swlxmc === "new" && e.sxlb?.length === 0 ? '' : (e.swlxmc !== "new" && e.sxlb?.length === 0 ? 'none' : ''),
                                          }}>
                                            <div style={{
                                              width: e.swlxmc === "new" && e.sxlb?.length === 0 ? '100%' : '10%',
                                              alignItems: 'center',
                                              display: 'grid',
                                            }}>
                                              {
                                                e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                  if (sx.type && sx.type === 'title' && sx_index === 0) {
                                                    return (
                                                      <div key={String(sx_index + 1)} style={{
                                                        fontSize: '14px',
                                                        lineHeight: '20px',
                                                        fontWeight: 500,
                                                        textAlign: 'end',
                                                      }}>
                                                        {e.swlxmc || ''}
                                                      </div>
                                                    )
                                                  }
                                                })
                                              }
                                              {
                                                e.swlxmc === "new" && (
                                                  <div style={{width: '100%'}}>
                                                    <Select showSearch
                                                            ref={this[`${index}inputRef${i}`]}
                                                            filterOption={(input, option) =>
                                                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                      // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                            onChange={(e) => {
                                                              // //console.log("eeee-cc",e)
                                                              this.setState({inputValue: e})
                                                            }}
                                                      //milePostInfo[index].matterInfos[i].length
                                                            onBlur={e => this.addSwlxMx(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                            style={{
                                                              width: '120px',
                                                              marginTop: '6px',
                                                              marginLeft: '6px'
                                                            }}>
                                                      {
                                                        swlxarr.length > 0 && swlxarr.map((mi, mi_index) => {
                                                          // if (mi.swlx === e.swlxmc) {
                                                          return (
                                                            <Option title={mi.swlx} key={mi_index}
                                                                    value={mi.swlxid}>{mi.swlx}</Option>
                                                          )
                                                          // }
                                                        })
                                                      }
                                                    </Select>
                                                    <Tooltip title="取消新增">
                                                      <a style={{color: '#666', marginTop: '12px', marginLeft: '1rem'}}
                                                         className="iconfont delete"
                                                         onClick={e => this.removeSwlxMx(e, index, i)}/>
                                                    </Tooltip>
                                                  </div>
                                                )
                                              }
                                            </div>
                                            <div>
                                              {/*{*/}
                                              {/*  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {*/}
                                              {/*    if (sx.type && sx.type === 'title') {*/}
                                              {/*      return (*/}
                                              {/*        <div key={String(sx_index + 1)}*/}
                                              {/*             style={{paddingTop: '12px', fontWeight: 'bold'}}>*/}
                                              {/*        </div>*/}
                                              {/*      )*/}
                                              {/*    }*/}
                                              {/*  })*/}
                                              {/*}*/}
                                            </div>
                                            <div style={{
                                              width: '90%',
                                              display: 'flex',
                                              flexWrap: 'wrap',
                                              alignContent: 'center',
                                            }}>
                                              <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '12px',}}>
                                                {
                                                  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                    // //console.log("sxsxsx",sx)
                                                    if (!sx.type && sx_index !== 0) {
                                                      return (
                                                        <div key={String(sx_index + 1)}
                                                             className={sx.type && sx.type === 'new' ? 'new' : 'item'}>
                                                          {
                                                            <React.Fragment>
                                                              <span title={sx.sxmc}
                                                                    style={{
                                                                      fontSize: '12px',
                                                                      padding: '8px 0',
                                                                      color: '#666666',
                                                                      lineHeight: '16px'
                                                                    }}>{sx.sxmc.length > 10 ? (sx.sxmc.substring(0, 10) + '...') : sx.sxmc}</span>
                                                              {
                                                                <span
                                                                  onClick={() => this.removeMilePostInfoItem(index, i, sx_index)}>
                                                                  <Icon type="close" className="icon"/>
                                                                </span>
                                                              }
                                                            </React.Fragment>
                                                          }

                                                        </div>
                                                      )
                                                    }
                                                  })
                                                }
                                                {inputVisible === `${index}+${i}` ? (
                                                  <Select showSearch
                                                          ref={this[`${index}inputRef${i}`]}
                                                          filterOption={(input, option) =>
                                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                          }
                                                    // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                          onChange={(e) => this.setState({inputValue: e})}
                                                    //milePostInfo[index].matterInfos[i].length
                                                          onBlur={e => this.handleInputConfirm(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                          style={{
                                                            width: '120px',
                                                            marginTop: '6px',
                                                            marginLeft: '6px'
                                                          }}>
                                                    {
                                                      mileItemInfo.length > 0 && mileItemInfo.map((mi, mi_index) => {
                                                        if (mi.swlx === e.swlxmc) {
                                                          //console.log("flag")
                                                          return (
                                                            <Option title={mi.sxmc} key={mi_index}
                                                                    value={mi.sxid}>{mi.sxmc}</Option>
                                                          )
                                                        }
                                                      })
                                                    }
                                                  </Select>
                                                ) : (e.sxlb?.length !== 1 && e.swlxmc !== "new" && e.addFlag &&
                                                  <div
                                                    style={{display: 'grid', alignItems: 'center', marginTop: '6px'}}>
                                                    <Tag
                                                      style={{background: '#fff', border: 'none'}}>
                                                      <a className="iconfont circle-add"
                                                         style={{fontSize: '14px', color: 'rgb(51, 97, 255)',}}
                                                         onClick={() => this.showInput(index, i)}>新增</a>
                                                    </Tag></div>)}
                                                {
                                                  e.sxlb?.length === 1 && e.swlxmc !== "new" &&
                                                  (
                                                    <Select showSearch
                                                            ref={this[`${index}inputRef${i}`]}
                                                            filterOption={(input, option) =>
                                                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                      // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                            onChange={(e) => this.setState({inputValue: e})}
                                                      //milePostInfo[index].matterInfos[i].length
                                                            onBlur={e => this.handleInputConfirm(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                            style={{
                                                              width: '120px',
                                                              marginTop: '6px',
                                                              marginLeft: '6px'
                                                            }}>
                                                      {
                                                        mileItemInfo.length > 0 && mileItemInfo.map((mi, mi_index) => {
                                                          if (mi.swlx === e.swlxmc) {
                                                            return (
                                                              <Option title={mi.sxmc} key={mi_index}
                                                                      value={mi.sxid}>{mi.sxmc}</Option>
                                                            )
                                                          }
                                                        })
                                                      }
                                                    </Select>
                                                  )
                                                }
                                              </div>
                                              <div style={{
                                                position: 'absolute',
                                                top: '30%',
                                                right: '0.7%',
                                                color: '#3461FF'
                                              }}>
                                                {/*<Tag*/}
                                                {/*  style={{background: '#fff', borderStyle: 'dashed'}}>*/}
                                                {/*  <a className="iconfont circle-add"*/}
                                                {/*     style={{fontSize: '2.038rem', color: 'rgb(51, 97, 255)',}}*/}
                                                {/*     onClick={() => this.showInput(index, i)}>新增</a>*/}
                                                {/*</Tag>*/}
                                                {/*<span onClick={() => this.removeMilePostTypeInfo(index, i)}*/}
                                                {/*      style={{cursor: 'pointer', fontSize: '2.5rem'}}>删除本行</span>*/}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })
                                    }
                                    {item.addSxFlag &&
                                    <div className="addMilePost"
                                         style={{width: 'calc(46% + 3.5rem)', marginTop: '12px'}}
                                         onClick={() => this.addSwlx(item?.lcblxid, index)}>
                                      <Icon type="plus" style={{fontSize: '12px'}}/><span
                                      style={{paddingLeft: '6px', fontSize: '14px'}}>添加事项</span>
                                    </div>
                                    }

                                  </div>
                                )
                              }
                            </React.Fragment>
                          )


                        })
                      }
                      {
                        <div className="addMilePost" onClick={this.addMilePostInfo}>
                          <Icon type="plus" style={{fontSize: '12px'}}/><span
                          style={{paddingLeft: '6px', fontSize: '14px'}}>新增里程碑</span>
                        </div>
                      }

                    </React.Fragment>
                  </div>
                </div>
              }
              {
                // 人员信息
                current == 1 && <div className="steps-content"><React.Fragment>
                  <div className="staffInfo">
                    <div className="tree">
                      {
                        organizationStaffTreeList.length > 0 &&
                        <Tree
                          defaultExpandedKeys={[11167]}
                          checkable
                          checkedKeys={checkedStaffKey}
                          onCheck={this.onCheckTreeStaff}
                        >
                          {this.renderTreeNodes(organizationStaffTreeList)}
                        </Tree>
                      }

                    </div>
                    <div className="button">
                      <Button style={{border: '1px solid #3461FF', color: '#3461FF'}}
                              onClick={this.clickAddStaff}>添加&nbsp;<a className="iconfont icon-right"
                                                                      style={{
                                                                        fontSize: '12px',
                                                                        color: 'inherit'
                                                                      }}/></Button>
                    </div>
                    <div className="job">
                      {
                        staffJobList.length > 0 && staffJobList.map((item, index) => {
                          console.log("staffJobList", staffJobList)
                          if (item.ibm === '10') {
                            return (
                              <div className="jobItem">
                                <div className="name"
                                     style={{color: item.ibm === this.state.staffInfo.focusJob ? '#3461FF' : ''}}><span
                                  style={{color: '#de3741', paddingRight: '1rem'}}>*</span><span>{item.note}：</span>
                                </div>
                                <div style={{width: '65%'}}>
                                  <Select
                                    placeholder="请输入名字搜索人员"
                                    value={jobStaffList.length > 0 ? jobStaffList[9] : []}
                                    onBlur={() => this.setState({height: 0})}
                                    onSearch={e => this.searchStaff(e, 'manage')}
                                    onFocus={() => this.setState({
                                      staffInfo: {
                                        ...this.state.staffInfo,
                                        focusJob: '10'
                                      }
                                    })}
                                    filterOption={false}
                                    onChange={(e) => {
                                      if (e.length > 1) {
                                        message.warn("项目经理最多一个！");
                                      } else {
                                        let jobStaffList = this.state.staffInfo.jobStaffList;
                                        jobStaffList[9] = e;
                                        this.setState({
                                          height: 0,
                                          staffInfo: {...this.state.staffInfo, jobStaffList: jobStaffList}
                                        });
                                      }
                                    }}
                                    dropdownStyle={{maxHeight: height, overflow: 'auto'}}
                                    mode="multiple"
                                    style={{width: '100%'}}
                                  >
                                    {
                                      searchStaffList.length > 0 && searchStaffList.map((item, index) => {
                                        //console.log("searchStaffList", searchStaffList)
                                        return (
                                          <Select.Option key={index}
                                                         value={item.id}>{item.name}({item.orgName ? item.orgName : loginUser.orgName})</Select.Option>
                                        )
                                      })
                                    }
                                  </Select>
                                </div>
                              </div>
                            )
                          }
                        })
                      }
                      {
                        staffJobList.map((item, index) => {
                          console.log("jobStaffListjobStaffList", jobStaffList)
                          if (item.ibm !== '10') {
                            return (
                              <div className="jobItem">
                                <div className="name"
                                     style={{color: item.ibm === this.state.staffInfo.focusJob ? '#3461FF' : ''}}>
                                  <Icon onClick={this.removeJob.bind(this, item.ibm)} type="close"
                                        style={{paddingRight: '1rem', cursor: 'pointer'}}/><span>{item.note}：</span>
                                </div>
                                <div style={{width: '65%'}}>
                                  <Select
                                    placeholder="请输入名字搜索人员"
                                    value={jobStaffList.length > 0 ? jobStaffList[Number(item.ibm) - 1] : []}
                                    onBlur={() => this.setState({height: 0})}
                                    onSearch={e => this.searchStaff(e, 'staff')}
                                    onFocus={() => this.setState({
                                      staffInfo: {
                                        ...this.state.staffInfo,
                                        focusJob: item.ibm
                                      }
                                    })}
                                    filterOption={false}
                                    onChange={(e) => {
                                      let jobStaffList = this.state.staffInfo.jobStaffList;
                                      jobStaffList[Number(item.ibm) - 1] = e;
                                      this.setState({
                                        height: 0,
                                        staffInfo: {...this.state.staffInfo, jobStaffList: jobStaffList}
                                      });
                                    }}
                                    dropdownStyle={{maxHeight: height, overflow: 'auto'}}
                                    mode="multiple"
                                    style={{width: '100%'}}
                                  >
                                    {
                                      searchStaffList.map((item, index) => {
                                        //console.log("searchStaffList", searchStaffList)
                                        return (
                                          <Select.Option key={index}
                                                         value={item.id}>{item.name}({item.orgName})</Select.Option>
                                        )
                                      })
                                    }
                                  </Select>
                                </div>
                              </div>
                            )
                          }
                        })
                      }
                      {
                        staffJobList.length !== rygwDictionary.length && !rygwSelect &&
                        <div style={{margin: '1.5rem'}}>
                          <Tag
                            style={{background: '#fff', borderStyle: 'dashed'}}>
                            <a className="iconfont circle-add"
                               style={{fontSize: '2.038rem', color: 'rgb(51, 97, 255)',}}
                               onClick={() => {
                                 this.setState({rygwSelect: true})
                               }}>新增岗位</a>
                          </Tag>
                        </div>
                      }
                      {
                        rygwSelect &&
                        <Select showSearch
                                showArrow={true}
                          // mode="multiple"
                                placeholder="请选择岗位"
                                onChange={e => this.onRygwSelectChange(e)}
                                style={{padding: '9px 0 0 12px', width: '25rem'}}
                                onBlur={this.onRygwSelectConfirm}
                                filterOption={(input, option) =>
                                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                          {
                            rygwSelectDictionary.length > 0 && rygwSelectDictionary.map((item, index) => {
                              return (
                                <Option key={item.ibm} value={item.ibm}>{item.note}</Option>
                              )
                            })
                          }
                        </Select>
                      }
                    </div>
                  </div>
                </React.Fragment></div>

              }
              {
                // 招采信息
                current == 3 &&
                <div className="steps-content" style={{
                  display: htxxVisiable || zbxxVisiable ? '' : 'none',
                  overflowY: 'auto',
                  overflowX: 'hidden'
                }}>
                  <React.Fragment>
                    {isTableFullScreen && <TableFullScreen
                      isTableFullScreen={isTableFullScreen}
                      setTableFullScreen={this.setTableFullScreen}
                      setTableData={this.setTableData}
                      setSelectedRowIds={this.setSelectedRowIds}
                      handleMultiDelete={this.handleMultiDelete}
                      columns={columns}
                      components={components}
                      tableData={tableData}
                      rowSelection={rowSelection}
                      selectedRowIds={selectedRowIds}
                    ></TableFullScreen>}
                    <Form ref={e => this.purchaseForm = e}>
                      <Row gutter={24} style={{display: htxxVisiable === false ? 'none' : ''}}>
                        <Col span={12} style={{paddingRight: '24px'}}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>合同金额（元）</span>} className="formItem">
                            {getFieldDecorator('contractValue', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入合同金额'
                              // }],
                              initialValue: purchaseInfo.contractValue
                            })(
                              <Input type='number' placeholder="请输入合同金额" onChange={e => {
                                console.log('请输入合同金额',e.target.value)
                                this.setState({purchaseInfo: {...purchaseInfo, contractValue: e.target.value}});
                              }}/>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{paddingLeft:'24px'}}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>签署日期</span>} className="formItem">
                            {getFieldDecorator('signData', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入项目类型'
                              // }],
                              initialValue: purchaseInfo.signData
                            })(
                              <div style={{
                                width: '270px'
                              }} id="datePicker">
                                <DatePicker format="YYYY-MM-DD"
                                            allowClear={false}
                                            value={moment(purchaseInfo.signData, 'YYYY-MM-DD')}
                                            onChange={(date, dateString) => {
                                              console.log("eeeeee", dateString)
                                              this.setState({purchaseInfo: {...purchaseInfo, signData: dateString}});
                                            }}
                                            onFocus={() => this.setState({
                                              isEditMile: true,
                                              isCollapse: false
                                            })}/>
                              </div>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: zbxxVisiable === false ? 'none' : ''}}>
                        <Col span={24}>
                          <Form.Item label={<span><span style={{color: 'red'}}>*</span>付款详情</span>}>
                            <div>
                              <div className='tableBox2'>
                                <Table
                                  columns={columns}
                                  components={components}
                                  rowKey={record => record.id}
                                  rowClassName={() => 'editable-row'}
                                  dataSource={tableData}
                                  // rowSelection={rowSelection}
                                  scroll={tableData.length > 3 ? {y: 195} : {}}
                                  pagination={false}
                                  style={{paddingBottom: '12px',}}
                                  bordered
                                ></Table>
                                <div style={{
                                  textAlign: 'center',
                                  border: '1px dashed #e0e0e0',
                                  lineHeight: '32px',
                                  height: '32px',
                                  cursor: 'pointer'
                                }} onClick={() => {
                                  let arrData = tableData;
                                  arrData.push({
                                    id: Date.now(),
                                    ['fkqs' + Date.now()]: tableData.length + 1,
                                    ['bfb' + Date.now()]: 0.5,
                                    ['fkje' + Date.now()]: Number(0.5 * Number(purchaseInfo.contractValue)),
                                    ['fksj' + Date.now()]: moment().format('YYYY-MM-DD'),
                                  });
                                  this.setState({
                                    tableData: arrData,
                                    purchaseInfo: {...purchaseInfo, paymentInfos: arrData}
                                  }, () => {
                                    let table2 = document.querySelectorAll(`.tableBox2 .ant-table-body`)[0];
                                    table2.scrollTop = table2.scrollHeight;
                                  });
                                }}>
                                  <span className='addHover'>
                                    <Icon type="plus" style={{fontSize: '12px'}}/>
                                    <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增付款详情</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: zbxxVisiable === false ? 'none' : ''}}>
                        {/*供应商弹窗*/}
                        {
                          addGysModalVisible &&
                          <BridgeModel modalProps={addGysModalProps}
                                       onCancel={() => this.setState({addGysModalVisible: false})}
                                       onSucess={this.OnGysSuccess}
                                       src={localStorage.getItem('livebos') + '/OperateProcessor?operate=View_GYSXX_ADD&Table=View_GYSXX'}/>
                        }
                        <Col span={12} style={{paddingRight: '24px', position: 'relative'}}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>中标供应商</span>} className="formItem">
                            {getFieldDecorator('biddingSupplier', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入合同金额'
                              // }],
                              initialValue: purchaseInfo.biddingSupplierName
                            })(<Select
                              style={{borderRadius: '8px !important'}}
                              placeholder="请选择供应商"
                              className="skzh-box"
                              showSearch
                              // allowClear
                              open={isSelectorOpen}
                              onChange={e => {
                                this.setState({purchaseInfo: {...purchaseInfo, biddingSupplier: e}});
                              }}
                              onDropdownVisibleChange={(visible) => this.setState({isSelectorOpen: visible})}
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }>
                              {
                                gysData?.map((item = {}, ind) => {
                                  return <Option key={ind} value={item.id}>
                                    {item.gysmc}
                                  </Option>
                                })
                              }
                            </Select>)}
                          </Form.Item>
                          <div
                            style={{
                              height: '20px',
                              width: '1px',
                              backgroundColor: '#c7c7c7',
                              // marginLeft: '8px',
                              marginTop: '28px',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '0',
                              right: '60px',
                            }}
                          ></div>
                          <i
                            className="iconfont circle-add"
                            onClick={() => {
                              this.setState({addGysModalVisible: true});
                            }}
                            style={{
                              marginTop: '23px',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '0',
                              right: '32px',
                              color: '#c7c7c7',
                              fontSize: '20px',
                            }}
                          />
                        </Col>
                        <Col span={12} style={{paddingLeft:'24px'}}>
                          <Form.Item label={<span>履约保证金金额（元）</span>} className="formItem">
                            {getFieldDecorator('cautionMoney', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入合同金额'
                              // }],
                              initialValue: purchaseInfo.cautionMoney
                            })(
                              <Input type='number' placeholder="请输入履约保证金金额" onChange={e => {
                                this.setState({purchaseInfo: {...purchaseInfo, cautionMoney: e.target.value}});
                              }}/>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: zbxxVisiable === false ? 'none' : ''}}>
                        <Col span={12} style={{paddingRight: '24px'}}>
                          <Form.Item label={<span> 投标保证金（元）</span>} className="formItem">
                            {getFieldDecorator('projectName', {
                              // rules: [{
                              //   required: true,
                              //   message: '请输入合同金额'
                              // }],
                              initialValue: purchaseInfo.bidCautionMoney
                            })(
                              <Input type='number' placeholder="请输入履约保证金金额" onChange={e => {
                                this.setState({purchaseInfo: {...purchaseInfo, bidCautionMoney: e.target.value}});
                              }}/>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{paddingLeft:'24px'}}>
                          <Form.Item label="评标报告" required
                            // help={pbbgTurnRed ? '请上传合同附件' : ''}
                                     validateStatus={pbbgTurnRed ? 'error' : 'success'}
                          >
                            <Upload
                              className="uploadStyle"
                              action={'/api/projectManage/queryfileOnlyByupload'}
                              onDownload={(file) => {
                                if (!file.url) {
                                  let reader = new FileReader();
                                  reader.readAsDataURL(file.originFileObj);
                                  reader.onload = (e) => {
                                    var link = document.createElement('a');
                                    link.href = e.target.result;
                                    link.download = file.name;
                                    link.click();
                                    window.URL.revokeObjectURL(link.href);
                                  }
                                } else {
                                  // window.location.href=file.url;
                                  var link = document.createElement('a');
                                  link.href = file.url;
                                  link.download = file.name;
                                  link.click();
                                  window.URL.revokeObjectURL(link.href);
                                }

                              }}
                              showUploadList={{
                                showDownloadIcon: true,
                                showRemoveIcon: true,
                                showPreviewIcon: true,
                              }}
                              onChange={(info) => {
                                let fileList = [...info.fileList];
                                fileList = fileList.slice(-1);
                                this.setState({ fileList }, () => {
                                  // console.log('目前fileList', this.state.fileList);
                                });
                                if (fileList.length === 0) {
                                  this.setState({
                                    pbbgTurnRed: true
                                  });
                                } else {
                                  this.setState({
                                    pbbgTurnRed: false
                                  });
                                }
                              }}
                              beforeUpload={(file, fileList) => {
                                // console.log("🚀 ~ file: index.js ~ line 674 ~ BidInfoUpdate ~ render ~ file, fileList", file, fileList)
                                let reader = new FileReader(); //实例化文件读取对象
                                reader.readAsDataURL(file); //将文件读取为 DataURL,也就是base64编码
                                reader.onload = (e) => { //文件读取成功完成时触发
                                  let urlArr = e.target.result.split(',');
                                  console.log('uploadFileParamsuploadFileParams', uploadFileParams);
                                  this.setState({
                                    uploadFileParams: {
                                      ...this.state.uploadFileParams,
                                      documentData: urlArr[1],//获得文件读取成功后的DataURL,也就是base64编码
                                      fileName: file.name,
                                    }
                                  });
                                }
                              }}
                              accept={'.doc,.docx,.xml,.pdf,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                              fileList={[...fileList]}>
                              <Button type="dashed">
                                <Icon type="upload"/>点击上传
                              </Button>
                            </Upload>
                          </Form.Item></Col>
                      </Row>
                      <Row gutter={24} style={{display: zbxxVisiable === false ? 'none' : ''}}>
                        <Col span={24}>
                          <Form.Item label={<span><span style={{
                            fontFamily: 'SimSun, sans-serif',
                            color: '#f5222d',
                            marginRight: '4px',
                            lineHeight: 1
                          }}>*</span>供应商收款账号</span>} className="formItem">
                            {getFieldDecorator('number', {
                              // rules: [{
                              //   required: true,
                              //   message: '请选择关联预算项目'
                              // }],
                              initialValue: purchaseInfo.number
                            })(
                              <Select
                                style={{width: '100%', borderRadius: '1.1904rem !important'}}
                                placeholder="请选择供应商收款账号"
                                onChange={e => {
                                  this.setState({purchaseInfo: {...purchaseInfo, number: e}});
                                }}
                                showSearch
                                open={this.state.isSkzhOpen}
                                onDropdownVisibleChange={(visible) => this.setState({isSkzhOpen: visible})}
                              >
                                {
                                  staticSkzhData?.map((item = {}, ind) => {
                                    return <Option key={ind} value={item.khmc}>
                                      {item.khmc}
                                      {this.state.isSkzhOpen && <div style={{fontSize: '0.6em'}}>{item.yhkh}</div>}
                                    </Option>
                                  })
                                }
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{display: zbxxVisiable === false ? 'none' : ''}}>
                        <Col span={24}>
                          <Form.Item label={'其他投标供应商'}>
                            <div>
                              <div className='tableBox3'>
                                <Table
                                  columns={columnsQT}
                                  components={componentsQT}
                                  rowKey={record => record.id}
                                  rowClassName={() => 'editable-row'}
                                  dataSource={tableDataQT}
                                  // rowSelection={rowSelectionQT}
                                  scroll={tableDataQT.length > 3 ? {y: 195} : {}}
                                  pagination={false}
                                  style={{paddingBottom: '12px',}}
                                  bordered
                                ></Table>
                                <div style={{
                                  textAlign: 'center',
                                  border: '1px dashed #e0e0e0',
                                  lineHeight: '32px',
                                  height: '32px',
                                  cursor: 'pointer'
                                }} onClick={() => {
                                  let arrData = tableDataQT;
                                  let id = getID();
                                  arrData.push({id, [`glgys${id}`]: '', [`gysmc${id}`]: '', [`gysskzh${id}`]: ''});
                                  this.setState({
                                    tableDataQT: arrData,
                                    purchaseInfo: {...purchaseInfo, othersSupplier: arrData}
                                  }, () => {
                                    let table2 = document.querySelectorAll(`.tableBox3 .ant-table-body`)[0];
                                    table2.scrollTop = table2.scrollHeight;
                                  });
                                }}>
                                  <span className='addHover'>
                                    <Icon type="plus" style={{fontSize: '12px'}}/>
                                    <span style={{paddingLeft: '6px', fontSize: '14px'}}>新增投标供应商</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                    {/*</Form>*/}
                  </React.Fragment>
                </div>
              }
              {
                // 其他信息
                current == 4 &&
                <div className="steps-content" style={{ overflowY: 'auto', overflowX: 'hidden'}}>
                  <OthersInfos xmid={basicInfo.projectId} prizeInfoCallback={this.prizeInfoCallback} topicInfoCallback={this.topicInfoCallback}
                               requirementInfoCallback={this.requirementInfoCallback}/></div>
              }
              <div className="footer">
                <Divider/>
                <div style={{padding: '16px 24px'}}>
                  <Button onClick={this.handleCancel}>取消</Button>
                  <div className="steps-action">
                    <Button style={{marginLeft: '12px', backgroundColor: '#3361FF'}} type="primary"
                            onClick={e => this.handleFormValidate(e, 1)}>
                      保存
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </Fragment>
    );
  }
}

export default connect(({global}) => ({
  dictionary: global.dictionary,
}))(Form.create()(EditProjectInfoModel));
