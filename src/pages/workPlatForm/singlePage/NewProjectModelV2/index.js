import React, { Fragment } from 'react';
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
} from 'antd';
import { connect } from 'dva';
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
} from "../../../../services/projectManage";
import { DecryptBase64, EncryptBase64 } from '../../../../components/Common/Encrypt';
import config from '../../../../utils/config';
import LBDialog from 'livebos-frame/dist/LBDialog';
import RiskOutline from './RiskOutline';

const {Option, OptGroup} = Select;
const {api} = config;
const { confirm } = Modal;
const { TreeNode } = TreeSelect;
const { Step } = Steps;

class NewProjectModelV2 extends React.Component {
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
    tags: ['Unremovable', 'Tag 2', 'Tag 3'],
    inputVisible: '-1-1',
    inputValue: '',
    swlxarr: [],
    //项目状态
    projectStatus: "",
    //保存操作类型 草稿/完成
    handleType: -1,
    //当前页面必填项是否全部填写 2基本信息和里程碑信息都填完 0基本信息填完 1里程碑信息填完
    isFinish: -1,
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
      this.setState({ type: true });
    }
    setTimeout(function () {
      _this.fetchInterface()
    }, 300);
  };

  next() {
    //验证项目名称必填，在点击下一步的时候就要验证
    if (this.state.current === 0) {
      let bool = false; //
      this.props.form.validateFields((err, values) => {
        if (err) {
          const errs = Object.keys(err);
          if (errs.includes('projectName')) {
            message.warn("请填写项目名称！", 1);
            bool = true;
            return;
          }
        } else {
          const current = this.state.current + 1;
          this.setState({ current });
          this.isFinish(current - 1);
        }
      });
      if (bool) return;
    } else if (this.state.current === 1) {
      const { mileInfo: { milePostInfo = [] } } = this.state;
      const reg1 = new RegExp("-", "g");
      let flag = 0
      for (let i = 0; i < milePostInfo.length; i++) {
        const jssj = milePostInfo[i].jssj.replace(reg1, "");
        const kssj = milePostInfo[i].kssj.replace(reg1, "");
        if (Number(kssj) > Number(jssj)) {
          message.warn("开始时间需要小于结束时间")
          break;
        } else {
          flag++;
        }
      }
      if (flag === milePostInfo.length) {
        const _this = this;
        const timeList = milePostInfo.filter(item => item.jssj === this.state.tomorrowTime && item.kssj === this.state.nowTime);
        if (timeList && timeList.length > 0) {
          confirm({
            okText: '确认',
            cancelText: '取消',
            title: '提示',
            content: '有里程碑信息的默认起止时间没有修改，是否确认？',
            onOk() {
              const current = _this.state.current + 1;
              _this.setState({ current });
              _this.isFinish(current - 1);
            },
            onCancel() {
            },
          });
        } else {
          const current = _this.state.current + 1;
          _this.setState({ current });
          _this.isFinish(current - 1);
        }
      }
    }
  }

  //是否已经填完所有必填项
  isFinish = (current) => {
    //console.log("current", current)
    if (current === 0) {
      this.basicisFinish(current)
    }
    const { mileInfo: { milePostInfo = [] } } = this.state;
    const reg1 = new RegExp("-", "g");
    let flag = 0
    for (let i = 0; i < milePostInfo.length; i++) {
      const jssj = milePostInfo[i].jssj.replace(reg1, "");
      const kssj = milePostInfo[i].kssj.replace(reg1, "");
      const timeList = milePostInfo.filter(item => item.jssj !== this.state.tomorrowTime && item.kssj !== this.state.nowTime);
      //存在开始时间大于结束时间的数据
      if (Number(kssj) > Number(jssj)) {
        break;
      } else if (timeList && timeList.length === milePostInfo.length) {
        //所有数据都符合开始时间小于结束时间且存在改过默认时间的数据
        flag++;
      }
    }
    if (current === 1 && this.basicisFinish()) {
      if (flag === milePostInfo.length) {
        this.setState({
          isFinish: 2
        })
      } else {
        this.setState({
          isFinish: 0
        })
      }
      // lcbFlag = true;
    } else if (flag === milePostInfo.length && current === 0 && !this.basicisFinish()) {
      this.setState({
        isFinish: 1
      })
    } else if (flag === milePostInfo.length && current === 0 && this.basicisFinish()) {
      this.setState({
        isFinish: 2
      })
    } else if (current === 1 && !this.basicisFinish()) {
      if (flag === milePostInfo.length) {
        this.setState({
          isFinish: 1
        })
      } else {
        this.setState({
          isFinish: -1
        })
      }
    } else if (flag !== milePostInfo.length && current === 1) {
      this.setState({
        isFinish: -1
      })
    }
  }

  basicisFinish = (current) => {
    let basicFlag = false;
    const { basicInfo = {}, budgetInfo = {} } = this.state
    if (basicInfo.projectName !== '' && basicInfo.projectType !== '' && basicInfo.org !== '' && basicInfo.org?.length !== 0 && basicInfo.biddingMethod !== '') {
      if (budgetInfo.budgetProjectId !== '' && budgetInfo.budgetProjectId !== "0" && budgetInfo.projectBudget !== "" && budgetInfo.projectBudget !== null) {
        this.setState({
          isFinish: 0
        })
        basicFlag = true;
      } else if (budgetInfo.budgetProjectId === "0") {
        this.setState({
          isFinish: 0
        })
        basicFlag = true;
      } else {
        this.setState({
          isFinish: -1
        })
      }
    } else {
      this.setState({
        isFinish: -1
      })
    }
    return basicFlag;
  }

  prev() {
    //验证项目名称必填，在点击下一步的时候就要验证
    if (this.state.current === 2) {
      const current = this.state.current - 1;
      this.setState({ current });
      this.isFinish(current + 1);
    } else if (this.state.current === 1) {
      const { mileInfo: { milePostInfo = [] } } = this.state;
      const reg1 = new RegExp("-", "g");
      let flag = 0
      for (let i = 0; i < milePostInfo.length; i++) {
        const jssj = milePostInfo[i].jssj.replace(reg1, "");
        const kssj = milePostInfo[i].kssj.replace(reg1, "");
        if (Number(kssj) > Number(jssj)) {
          message.warn("开始时间需要小于结束时间")
          break;
        } else {
          flag++;
        }
      }
      if (flag === milePostInfo.length) {
        const _this = this;
        const timeList = milePostInfo.filter(item => item.jssj === this.state.tomorrowTime && item.kssj === this.state.nowTime);
        if (timeList && timeList.length > 0) {
          confirm({
            okText: '确认',
            cancelText: '取消',
            title: '提示',
            content: '有里程碑信息的默认起止时间没有修改，是否确认？',
            onOk() {
              const current = _this.state.current - 1;
              _this.setState({ current });
              _this.isFinish(current + 1);
            },
            onCancel() {
            },
          });
        } else {
          const current = _this.state.current - 1;
          _this.setState({ current });
          _this.isFinish(current + 1);
        }
      }
    }
    // //console.log("current", this.state.current)
  }

  fetchInterface = async () => {

    // 查询软件清单
    this.fetchQuerySoftwareList();
    // 查询项目标签
    this.fetchQueryProjectLabel();
    // 查询关联预算项目信息-需先查出关联预算项目再查项目详情
    await this.fetchQueryBudgetProjects({ type: 'NF', year: Number(this.state.budgetInfo.year.format("YYYY")) });

    // 查询组织机构信息-应用部门
    this.fetchQueryOrganizationYYBMInfo();

    // 查询里程碑阶段信息
    this.fetchQueryMilestoneStageInfo({ type: 'ALL' });
    // 查询里程碑事项信息
    this.fetchQueryMatterUnderMilepost({ type: 'ALL', lcbid: 0 });
    // 查询里程碑信息
    this.fetchQueryMilepostInfo({
      type: 1,
      xmid: this.state.basicInfo.projectId,
      biddingMethod: 1,
      budget: 0,
      label: this.state.basicInfo.labelTxt,
      queryType: "ALL"
    });

    // 修改加载状态
    this.setState({ loading: false });
    // 查询岗位信息
    await this.fetchQueryStationInfo();
    // 查询组织机构信息
    await this.fetchQueryOrganizationInfo();
    // 查询人员信息
    await this.fetchQueryMemberInfo();

    // 修改项目时查询项目详细信息
    if (this.state.basicInfo.projectId && this.state.basicInfo.projectId !== -1) {
      await this.fetchQueryProjectDetails({ projectId: this.state.basicInfo.projectId });
    }

    //判断完成状态
    this.isFinish();
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
      const { code = -1, record = '' } = result;
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
        this.setState({
          searchStaffList: [loginUser],
          // loginUser: loginUser,
          staffJobList: rec,
          rygwDictionary: rec,
          rygwSelectDictionary: rec,
          staffInfo: { ...this.state.staffInfo, jobStaffList: arr }
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };


  // 查询里程碑信息
  fetchQueryMilepostInfo(params) {
    return FetchQueryMilepostInfo(params).then((record) => {
      const { code = -1, result = '' } = record;
      const { nowTime, tomorrowTime, mileInfo: { milePostInfo } } = this.state;
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
          this.setState({ milePostInfo, mileInfo: { ...this.state.mileInfo, milePostInfo } })
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
            sxlb.push({ type: 'title' });
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
                let treeDatamini = { children: [] }
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
                  treeDatamini.dropdownStyle = { color: '#666' }
                  treeDatamini.selectable = false;
                  treeDatamini.children = b[item.zdbm]
                }
                childrenDatamini.push(treeDatamini)
              }
              childrenData.key = key;
              childrenData.value = key;
              childrenData.title = item.ysLX;
              childrenData.dropdownStyle = { color: '#666' };
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
        const { code = -1, records = [] } = result;
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
            this.setState({ newMileItemInfo: data, swlxarr: swlxarr });
          }
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 修改项目时查询项目详细信息
  fetchQueryProjectDetails(params) {
    const { staffJobList = [], rygwSelectDictionary = [] } = this.state;
    let newStaffJobList = [];
    return FetchQueryProjectDetails(params)
      .then((result) => {
        const { code = -1, record = [] } = result;
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
              staffInfo: { ...this.state.staffInfo, jobStaffList: arr }
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
          //console.log("searchStaffListsearchStaffList222", searchStaffList)
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
        const { code = -1, record = [] } = result;
        if (code > 0) {
          this.setState({ mileStageList: record });
        }
        //console.log("record", record)
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
  }

  // 查询人员信息
  fetchQueryMemberInfo() {
    return FetchQueryMemberInfo(
      { type: 'ALL' }
    ).then((result) => {
      const { code = -1, record = '' } = result;
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
        this.setState({
          staffList: result,
          organizationStaffTreeList: this.toOrgTree(this.state.organizationList.concat(arr), 0)
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
      const { code = -1, record = [] } = result;
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
          arr.push({ ...e })
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
      const { code = -1, record = [] } = result;
      if (code > 0) {
        const loginUser = this.state.loginUser;
        // 深拷贝
        const arr = [];
        record.forEach(e => {
          // 获取登录用户的部门名称
          if (e.orgId == loginUser.org) {
            loginUser.orgName = e.orgName;
          }
          arr.push({ ...e })
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
      const { code = -1, record = [] } = result;
      if (code > 0) {
        this.setState({ budgetProjectList: this.toItemTree(record) });
        // console.log("备用预算",this.toItemTree(record));
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  // 查询软件清单
  fetchQuerySoftwareList() {
    return FetchQuerySoftwareList({ type: 'ALL' }).then((result) => {
      const { code = -1, record = [] } = result;
      if (code > 0) {
        this.setState({ softwareList: record });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询项目标签
  fetchQueryProjectLabel() {
    return FetchQueryProjectLabel({}).then((result) => {
      const { code = -1, record = [] } = result;
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
    const { match: { params: { params: encryptParams = '' } } } = this.props;
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
          window.parent && window.parent.postMessage({ operate: 'close' }, '*');
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
      this.setState({ height: 400 }, function () {
        this.setState({ searchStaffList: searchStaffList })
      });
    } else {
      this.setState({ height: 0 }, function () {
        this.setState({ searchStaffList: [] })
      });
    }
  };


  stopDrag = (e, index, i) => {
    const { mileInfo: { milePostInfo } } = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const milePost = JSON.parse(JSON.stringify(milePostInfo));

    const mile = milePost[index];
    const matter = mile.matterInfos[i];
    matter.gridLayout = e;
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: milePost } });
  };

  // 验证本项目预算
  handleValidatorProjectBudget = (rule, val, callback) => {
    // 函数节流，防止数据频繁更新，每300毫秒才搜索一次
    const _this = this
    // if (!this.timer) {
    //   this.timer = setTimeout(function(){
    //
    //   },300)
    // }

    this.setState({ budgetInfo: { ...this.state.budgetInfo, projectBudget: val === '' || val === '-' ? 0 : val } });
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
    const { staffInfo: { focusJob, jobStaffList }, checkedStaffKey } = this.state;
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
        staffInfo: { ...this.state.staffInfo, jobStaffList: jobStaffList }
      })
    }
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode disableCheckbox={true} title={item.orgName} key={item.orgId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.orgId} {...item} dataRef={item} />;
    });


  onCheckTreeStaff = (key, node) => {
    this.setState({ checkedStaffKey: key })
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
    const { operateType } = this.state;
    e.preventDefault();
    // if (this.state.isEditMile) {
    //   message.warn("里程碑信息还未保存！");
    //   return
    // }
    //type:0 草稿 type:1 完成
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (err) {
        const errs = Object.keys(err);
        if (errs.includes('projectName')) {
          // message.warn("请填写项目名称！");
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
      staffInfo: { jobStaffList = [] },
      mileInfo: { milePostInfo = [] }
    } = this.state;
    //校验基础信息
    let basicflag = false;
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
    let staffJobParam = [];
    // //console.log("staffJobList保存",staffJobList);
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
    if (projectManager.length === 0) {
      message.warn("项目经理不能为空！");
    } else {
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
      };
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
    }

  };

  makeOperateParams = (params, milePostInfo, staffJobParams, projectManager, type) => {
    this.setState({ loading: true, });
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
    params.type = operateType;
    params.czr = Number(this.state.loginUser.id);
    //资本性预算/非资本性预算
    params.budgetType = this.state.budgetInfo.budgetType;

    this.operateCreatProject(params, type);
  };

  operateCreatProject(params, type) {
    OperateCreatProject(params).then((result) => {
      const { code = -1, note = '', projectId } = result;
      this.setState({ loading: false });
      if (code > 0) {
        sessionStorage.setItem("projectId", projectId);
        sessionStorage.setItem("handleType", type);
        if (this.state.type) {
          window.parent && window.parent.postMessage({ operate: 'success' }, '*');
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

      // //console.log("333333")
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 移动里程碑信息
  moveMilePostInfo = (index, direction) => {
    const { mileInfo: { milePostInfo } } = this.state;
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
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: milePostInfo } });
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
        _this.setState({ isEditMile: false, mileInfo: { ..._this.state.mileInfo, milePostInfo: mile } })
      },
      onCancel() {
      },
    });
  };

  // 保存里程碑信息
  saveMilePostInfo = () => {
    const { mileInfo: { milePostInfo = [] } } = this.state;
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
    this.setState({ isEditMile: false, milePostInfo: mile, mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
  };

  // 删除里程碑信息
  removeMilePostInfo = (index) => {
    const _this = this;
    const { mileInfo: { milePostInfo = [] } } = this.state;
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
        _this.setState({ mileInfo: { ..._this.state.mileInfo, milePostInfo: arr } });
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
    const { mileInfo: { milePostInfo = [] } } = this.state;

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
    //console.log("77777777", mile[index]);
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
    const { mileInfo: { milePostInfo = [] } } = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    // //console.log("milePostInfo", milePostInfo)
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    matterInfo[i].sxlb.push({ sxid: '', sxmc: '', type: 'new' });
    const removeTitleMile = this.removeAllTitle(JSON.parse(JSON.stringify(mile)));
    // //console.log("milePostInfo222", removeTitleMile)
    const arr = this.filterGridLayOut(removeTitleMile);
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: arr } });
  };

  // 移除里程碑类型信息
  removeMilePostTypeInfo = (index, i) => {
    const { mileInfo: { milePostInfo = [] } } = this.state;
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
      this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: arr } });
    } else {
      this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: arr } });
    }
  };

  // 选中新加的里程碑事项信息
  selectMilePostInfoItem = (e, index, i, sx_index) => {
    const { mileInfo: { milePostInfo = [] }, mileItemInfo = [] } = this.state;
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
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
  };

  // 选中新建里程碑的阶段信息
  selectMileStageInfo = async (e, index) => {
    const { mileInfo: { milePostInfo = [] }, mileStageList = [] } = this.state;
    await this.fetchQueryMatterUnderMilepost({ type: 'SINGLE', lcbid: e });
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
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: arr } })
  };

  // 新建里程碑信息
  addMilePostInfo = () => {
    const { mileInfo: { milePostInfo = [] }, nowTime, tomorrowTime } = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    let lcb = { matterInfos: [], lcbmc: '', type: 'new', kssj: nowTime, jssj: tomorrowTime };
    mile.push(lcb);
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
  };

  // 修改里程碑的时间
  changeMilePostInfoTime = (date, index, type) => {
    const { mileInfo: { milePostInfo = [] } } = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const reg1 = new RegExp("-", "g");
    const newDate = date.replace(reg1, "");
    if (type === 'start') {
      // const jssj = mile[index].jssj.replace(reg1, "");
      // if (Number(newDate) > Number(jssj)) {
      //   message.warn("开始时间需要小于结束时间")
      //   return;
      // } else {
      //
      // }
      const diff = moment(mile[index].jssj).diff(mile[index].kssj, 'day')
      mile[index].kssj = date;
      mile[index].jssj = moment(date).add(diff, 'days').format('YYYY-MM-DD');
    } else if (type === 'end') {
      // const kssj = mile[index].kssj.replace(reg1, "");
      // if (Number(newDate) < Number(kssj)) {
      //   message.warn("开始时间需要小于结束时间")
      //   return;
      // } else {
      //   mile[index].jssj = date;
      // }
      mile[index].jssj = date;
    }
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
  };

  onChange = minicurrent => {
    // //console.log('onChange:', minicurrent);
    this.setState({ minicurrent });
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
    // document.getElementById("milePost" + minicurrent).style.backgroundColor='red'
  };

  onScrollHandle = () => {
    const { mileInfo: { milePostInfo = [] } } = this.state;
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

  onChange0 = current => {
    // //console.log("this.state.current", this.state.current)
    // //console.log("index", current)
    let currentindex = this.state.current;
    // //console.log("currentindex", currentindex)
    //验证项目名称必填，在点击下一步的时候就要验证
    if (this.state.current === 0) {
      let bool = false; //为true时结束该函数
      this.props.form.validateFields((err, values) => {
        if (err) {
          const errs = Object.keys(err);
          if (errs.includes('projectName')) {
            message.warn("请填写项目名称！", 1);
            bool = true;
            return;
          }
        } else {
          this.setState({ current });
          this.isFinish(currentindex);
        }
      });
      if (bool) return;
    } else if (this.state.current === 1) {
      const { mileInfo: { milePostInfo = [] } } = this.state;
      const reg1 = new RegExp("-", "g");
      let flag = 0
      for (let i = 0; i < milePostInfo.length; i++) {
        const jssj = milePostInfo[i].jssj.replace(reg1, "");
        const kssj = milePostInfo[i].kssj.replace(reg1, "");
        if (Number(kssj) > Number(jssj)) {
          message.warn("开始时间需要小于结束时间")
          break;
        } else {
          flag++;
        }
      }
      if (flag === milePostInfo.length) {
        const _this = this;
        const timeList = milePostInfo.filter(item => item.jssj === this.state.tomorrowTime && item.kssj === this.state.nowTime);
        if (timeList && timeList.length > 0) {
          confirm({
            okText: '确认',
            cancelText: '取消',
            title: '提示',
            content: '有里程碑信息的默认起止时间没有修改，是否确认？',
            onOk() {
              _this.setState({ current });
              _this.isFinish(currentindex);
            },
            onCancel() {
            },
          });
        } else {
          _this.setState({ current });
          _this.isFinish(currentindex);
        }
      }
    } else {
      this.setState({ current });
      this.isFinish(currentindex);
    }
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    // //console.log(tags);
    this.setState({ tags });
  };

  showInput = (index, i) => {
    // //console.log("iiiii", i)
    // //console.log("index", index)
    this[`${index}inputRef${i}`] = React.createRef();
    // this.setState({inputVisible: i}, () => this.mySelect.focus());
    this.setState({inputVisible: `${index}+${i}`}, () => this[`${index}inputRef${i}`].current.focus());
  };


  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
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
    let newsxlb = { lcb: sxlb[sx_index - 1].lcb, swlx: swlx, sxid: e, sxmc: sxmc, sxzxid: "0", sxzxsx: sx_index, xh: "3" }
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
    // //console.log("arrarr",arr)
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
      const { mileInfo: { milePostInfo = [] }, } = this.state;
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
      //console.log("77777777", mile[index]);
      this.setState({inputVisible: '-1', mileInfo: {...this.state.mileInfo, milePostInfo: mile}});
    }
  }

  removeSwlxMx = (e, index, i) => {
    if (e !== undefined) {
      const { mileInfo: { milePostInfo = [] }, } = this.state;
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
      this.setState({ inputVisible: '-1', mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
    }
  }

  onRygwSelectChange = (e) => {
    // //console.log("eeee",e)
    this.setState({
      onRygwSelectValue: e,
    })
  }

  onRygwSelectConfirm = () => {
    const { staffJobList, rygwDictionary, onRygwSelectValue, rygwSelectDictionary, } = this.state;
    if (onRygwSelectValue !== '') {
      const filter = rygwDictionary.filter(item => item.ibm === onRygwSelectValue)
      staffJobList.push(filter[0]);
      // //console.log("staffJobList",staffJobList)
      // //console.log("rygwSelectDictionary",rygwSelectDictionary)
      let newArr = staffJobList.concat()
      let newArray = rygwDictionary.filter(function (item) {
        return newArr.indexOf(item) === -1
      });
      // let newArray = rygwSelectDictionary.filter(item => item.ibm !== filter[0].ibm)
      // //console.log("newArray", newArray)
      this.setState({
        rygwSelectDictionary: newArray,
        rygwSelect: false,
        onRygwSelectValue: '',
        staffJobList: staffJobList
        // staffJobList: this.sortByKey(staffJobList, 'ibm', true)
      })

    }
    // const flag = staffJobList.filter((item) => {
    //   return filter.includes(item)
    // })
    // if(flag.length>0){
    //   message.warn("已存在"+filter[0].note+"岗位,请勿重复添加！")
    // }else{
    // }
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
      mileInfo: { milePostInfo = [] },
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
      staffInfo: { jobStaffList = [] },
      basicInfo = { software: '' },
      swlxarr = [],
      isFinish = -1,
      rygwDictionary = [],
      rygwSelectDictionary = [],
      rygwSelect = false,
      orgExpendKeys = [],
      ysKZX = 0,
      loginUser = [],
      projectBudgetChangeFlag = false,
    } = this.state;
    // //console.log("orgExpendKeys", orgExpendKeys)
    // //console.log("organizationTreeList", organizationTreeList)
    const {getFieldDecorator} = this.props.form;
    const basicFormItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const budgetFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const steps = [
      {
        title: <span>
          <div style={{color: this.state.current === 0 && '#292929'}}>项目基本及预算信息</div>
          <div style={{fontSize: '12px', color: '#999', fontWeight: 500, lineHeight: '24px'}}>项目信息填写</div>
        </span>,
        content: '',
      },
      {
        title: <span>
          <div>里程碑信息</div>
          <div style={{fontSize: '12px', color: '#999', fontWeight: 500, lineHeight: '24px'}}>里程碑信息填写</div>
        </span>,
      },
      {
        title: <span>
          <div>人员信息</div>
          <div style={{fontSize: '12px', color: '#999', fontWeight: 500, lineHeight: '24px'}}>项目参与人员信息填写</div>
        </span>,
      },
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
            title: '直接采购',
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
      const { id } = item;
      return !milePostInfoIds.includes(id)
    })

    return (
      <Fragment>
        <div className="newProject" style={{ overflow: 'hidden', height: "100%" }}>
          <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large" style={{ height: "100%" }}>
            <div style={{ overflow: 'hidden', height: "100%" }}>
              <div style={{margin: '0 120px 0 120px', height: "11%"}}>
                <Steps current={current} onChange={this.onChange0} type="navigation" style={{height: "100%"}}>
                  {steps.map((item, index) => (
                    <Step key={index} title={item.title}
                          status={isFinish === 2 ? (index === 2 ? 'wait' : 'finish') : (current === index ? (isFinish === index ? 'finish' : 'process') : (isFinish === index ? 'finish' : 'wait'))}/>
                  ))}
                </Steps>
              </div>
              {
                current === 0 && <div className="steps-content"><React.Fragment>
                  <div className="title">
                    {/*<Icon type="caret-down" onClick={() => this.setState({basicInfoCollapse: !basicInfoCollapse})}*/}
                    {/*      style={{fontSize: '2rem', cursor: 'pointer'}}/>*/}
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
                      height: '12px', background: '#3461FF', lineHeight: '19px', margin: '3.5px 3.5px 0 0'
                    }}> </div>基本信息</span>
                  </div>
                  <Form {...basicFormItemLayout} ref={e => this.basicForm = e}
                        onSubmit={e => this.handleFormValidate(e)}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item label="项目名称">
                          {getFieldDecorator('projectName', {
                            rules: [{
                              required: true,
                              message: '请输入项目名称'
                            }],
                            initialValue: basicInfo.projectName
                          })(
                            <Input placeholder="请输入项目名称" onChange={e => {
                              this.setState({ basicInfo: { ...basicInfo, projectName: e.target.value } });
                            }} />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={<span><span style={{
                          fontFamily: 'SimSun, sans-serif',
                          color: '#f5222d',
                          marginRight: '4px',
                          lineHeight: 1
                        }}>*</span>项目类型</span>}>
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
                      <Col span={12}>
                        <Form.Item label="项目标签">
                          {getFieldDecorator('projectLabel', {
                            initialValue: basicInfo.projectLabel
                          })(
                            <TreeSelect
                              multiple
                              showSearch
                              treeNodeFilterProp="title"
                              style={{width: '100%'}}
                              tagRender={item => {
                                return "weqweqwe" + item;
                              }}
                              maxTagCount={2}
                              maxTagTextLength={42}
                              maxTagPlaceholder={extraArr => {
                                return `等${extraArr.length + 2}个`;
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
                      <Col span={12}>
                        <Form.Item label={<span><span style={{
                          fontFamily: 'SimSun, sans-serif',
                          color: '#f5222d',
                          marginRight: '4px',
                          lineHeight: 1
                        }}>*</span>应用部门</span>}>
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
                              maxTagCount={2}
                              maxTagTextLength={42}
                              maxTagPlaceholder={extraArr => {
                                return `等${extraArr.length + 2}个`;
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
                      <Col span={12}>
                        <Form.Item label="关联软件">
                          {getFieldDecorator('software', {
                            initialValue: basicInfo.software
                          })(
                            <Select showSearch
                              onChange={e => {
                                softwareList.forEach(item => {
                                  if (item.id === e) {
                                    this.setState({
                                      basicInfo: { ...basicInfo, software: e, }
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
                      {
                        basicInfo.projectType === 1 ? (
                          <Col span={12}>
                            <Form.Item label={<span><span style={{
                              fontFamily: 'SimSun, sans-serif',
                              color: '#f5222d',
                              marginRight: '4px',
                              lineHeight: 1
                            }}>*</span>采购方式</span>}>
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

                    </Row>


                    {/*</React.Fragment>*/}
                    {/*<React.Fragment>*/}
                    <div className="title">
                      {/*<Icon type="caret-down" onClick={() => this.setState({budgetInfoCollapse: !budgetInfoCollapse})}*/}
                      {/*      style={{fontSize: '2rem', cursor: 'pointer'}}/>*/}
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
                        height: '12px', background: '#3461FF', lineHeight: '19px', margin: '3.5px 3.5px 0 0'
                      }}> </div>预算信息</span>
                    </div>
                    {/*<Form {...budgetFormItemLayout} onSubmit={e => this.handleFormValidate(e)} style={{width: '98%'}}>*/}
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item label="年份">
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
                                _this.fetchQueryBudgetProjects({type: 'NF', year: Number(v.format("YYYY"))});
                              })
                            }}
                                      format="YYYY" mode="year"/>
                          {/*)}*/}
                        </Form.Item>
                      </Col>
                      <Col span={12} className="glys">
                        <Form.Item label={<span><span style={{
                          fontFamily: 'SimSun, sans-serif',
                          color: '#f5222d',
                          marginRight: '4px',
                          lineHeight: 1
                        }}>*</span>关联预算项目</span>}>
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
                              dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
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
                    <Row gutter={24} style={{ display: this.state.budgetInfo.budgetProjectId === '0' ? 'none' : '' }}>
                      <Col span={12}>
                        <Form.Item label="总预算(元)">
                          <InputNumber disabled={true} style={{ width: '100%' }} value={budgetInfo.totalBudget}
                                       precision={0}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="可执行预算(元)">
                          <InputNumber disabled={true} style={{width: '100%'}} value={ysKZX}
                                       precision={0}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12} style={{display: this.state.budgetInfo.budgetProjectId === '0' ? 'none' : ''}}>
                        <Form.Item label="剩余预算(元)">
                          <InputNumber disabled={true} style={{width: '100%'}} value={budgetInfo.relativeBudget}
                                       precision={0}/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label={<span><span style={{
                          fontFamily: 'SimSun, sans-serif',
                          color: '#f5222d',
                          marginRight: '4px',
                          lineHeight: 1
                        }}>*</span>本项目预算(元)</span>}>
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
                            }} style={{ width: '100%' }} onChange={e => {
                              let projectBudgetChangeFlag = false
                              if (e !== this.state.budgetInfo.projectBudget) {
                                projectBudgetChangeFlag = true;
                              }
                              this.setState({
                                projectBudgetChangeFlag,
                                budgetInfo: { ...budgetInfo, projectBudget: e }
                              });
                            }} precision={0}/>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  {/*</Form>*/}
                </React.Fragment></div>
              }
              {
                current === 1 && <div style={{display: 'flex', height: '75%', margin: '12px 0 12px 120px'}}>
                  <Steps progressDot style={{height: '71vh', maxWidth: '200px', margin: '0 auto', padding: '18px 0'}}
                         direction="vertical"
                         current={minicurrent} onChange={this.onChange}>

                    {ministeps.map((item, index) => (
                      <Step status={minicurrent === index ? 'finish' : 'wait'}
                            style={{height: (71 / (ministeps.length * 1.8)) + 'vh'}} key={index} title={item.title}/>
                    ))}
                  </Steps>
                  <div className="steps-content" id="lcbxxClass"
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
                          const { matterInfos = {} } = item;
                          const swlxmcs = matterInfos.map(item => item.swlxmc)
                          swlxarr = swlxarr.filter(item => {
                            const { swlx } = item;
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
                                            <a style={{ color: '#666', marginTop: '2rem', marginLeft: '1rem' }}
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
                                        const { sxlb = {} } = e;
                                        const sxids = sxlb.map(item => item.sxid)
                                        mileItemInfo = mileItemInfo.filter(item => {
                                          const { sxid } = item;
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
                                                <div style={{ width: '100%' }}>
                                                  <Select showSearch
                                                    ref={this[`${index}inputRef${i}`]}
                                                    filterOption={(input, option) =>
                                                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                    onChange={(e) => {
                                                      // //console.log("eeee-cc",e)
                                                      this.setState({ inputValue: e })
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
                                              alignContent: 'center'
                                            }}>
                                              <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignContent: 'center',
                                                paddingLeft: '12px'
                                              }}>
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
                                                                  <Icon type="close" className="icon" />
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
                                                    onChange={(e) => this.setState({ inputValue: e })}
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
                                                         height: '32px',
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
                                                      onChange={(e) => this.setState({ inputValue: e })}
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
                                              <a style={{ color: '#666', marginTop: '2rem', marginLeft: '1rem' }}
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
                                                  <div style={{ width: '100%' }}>
                                                    <Select showSearch
                                                      ref={this[`${index}inputRef${i}`]}
                                                      filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                      }
                                                      // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                      onChange={(e) => {
                                                        // //console.log("eeee-cc",e)
                                                        this.setState({ inputValue: e })
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
                                              alignContent: 'center'
                                            }}>
                                              <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignContent: 'center',
                                                paddingLeft: '12px'
                                              }}>
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
                                                                  <Icon type="close" className="icon" />
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
                                                    onChange={(e) => this.setState({ inputValue: e })}
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
                                                  <div style={{
                                                    display: 'grid',
                                                    alignItems: 'center',
                                                    height: '32px',
                                                    marginTop: '6px'
                                                  }}><Tag
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
                                                      onChange={(e) => this.setState({ inputValue: e })}
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
                current === 2 && <div className="steps-content"><React.Fragment>
                  {/*<div className="title">*/}
                  {/*  <Icon type="caret-down" onClick={() => this.setState({jobStaffInfoCollapse: !jobStaffInfoCollapse})}*/}
                  {/*        style={{fontSize: '2rem', cursor: 'pointer'}}/>*/}
                  {/*  <span style={{paddingLeft: '1.5rem', fontSize: '3rem', color: '#3461FF'}}>人员信息</span>*/}
                  {/*</div>*/}
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
                          //console.log("staffJobList", staffJobList)
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
                                          staffInfo: { ...this.state.staffInfo, jobStaffList: jobStaffList }
                                        });
                                      }
                                    }}
                                    dropdownStyle={{ maxHeight: height, overflow: 'auto' }}
                                    mode="multiple"
                                    style={{ width: '100%' }}
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
                                        staffInfo: { ...this.state.staffInfo, jobStaffList: jobStaffList }
                                      });
                                    }}
                                    dropdownStyle={{ maxHeight: height, overflow: 'auto' }}
                                    mode="multiple"
                                    style={{ width: '100%' }}
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
                        <div style={{ margin: '1.5rem' }}>
                          <Tag
                            style={{ background: '#fff', borderStyle: 'dashed' }}>
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
              {/*<div className="steps-content">{steps[current].content}</div>*/}
              <div className="footer">
                <Button onClick={this.handleCancel}>取消</Button>
                <Button onClick={e => this.handleFormValidate(e, 0)} style={{
                  marginLeft: '2rem',
                  display: this.state.projectStatus === "MOD" ? 'none' : ''
                }}>暂存草稿</Button>
                <div className="steps-action">
                  {current > 0 && (
                    <Button style={{ marginLeft: '2rem' }} onClick={() => this.prev()}>
                      上一步
                    </Button>
                  )}
                  {current < steps.length - 1 && (
                    <Button type="primary" style={{ marginLeft: '2rem' }} onClick={() => this.next()}>
                      下一步
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button style={{ marginLeft: '2rem' }} type="primary"
                      onClick={e => this.handleFormValidate(e, 1)}>
                      完成
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Spin>
        </div >
      </Fragment >
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(NewProjectModelV2));
