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
  Tree
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
  FetchQueryMatterUnderMilepost
} from "../../../../services/projectManage";
import { DecryptBase64, EncryptBase64 } from '../../../../components/Common/Encrypt';
import config from '../../../../utils/config';
import LBDialog from 'livebos-frame/dist/LBDialog';

const { Option } = Select;
const { api } = config;
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
    operateType: 'ADD', // 操作类型
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
      totalBudget: 0, // 总预算(元)
      relativeBudget: 0, // 可关联总预算(元)
      projectBudget: '' // 本项目预算
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
      biddingMethod: 1
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
    loading: false,  // 是否正在加载
    tags: ['Unremovable', 'Tag 2', 'Tag 3'],
    inputVisible: '-1-1',
    inputValue: '',
    swlxarr: [],
    //项目状态
    projectStatus: '',
  }
  componentDidMount = async () => {
    const _this = this;
    const params = this.getUrlParams();
    if (params.xmid && params.xmid !== -1) {
      console.log("paramsparams", params)
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
      _this.filterJobList()
    }, 300);
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  fetchInterface = async () => {

    // 查询软件清单
    await this.fetchQuerySoftwareList();
    // 查询项目标签
    await this.fetchQueryProjectLabel();
    // 查询关联预算项目信息
    await this.fetchQueryBudgetProjects({ type: 'NF', year: Number(this.state.budgetInfo.year.format("YYYY")) });
    // 查询组织机构信息
    await this.fetchQueryOrganizationInfo();


    // 查询里程碑阶段信息
    await this.fetchQueryMilestoneStageInfo({ type: 'ALL' });
    // 查询里程碑事项信息
    await this.fetchQueryMatterUnderMilepost({ type: 'ALL', lcbid: 0 });
    // 查询里程碑信息
    await this.fetchQueryMilepostInfo({
      type: 1,
      xmid: this.state.basicInfo.projectId,
      biddingMethod: 1,
      budget: 0,
      label: ''
    });

    // 查询人员信息
    await this.fetchQueryMemberInfo();

    // 修改项目时查询项目详细信息
    if (this.state.basicInfo.projectId && this.state.basicInfo.projectId !== -1) {
      await this.fetchQueryProjectDetails({ projectId: this.state.basicInfo.projectId });
    }

    // 修改加载状态
    this.setState({ loading: false });
  };


  // 处理岗位数据
  filterJobList = () => {
    const { dictionary: { RYGW = [] } } = this.props;
    // 初始化各个岗位下对应的员工id的数组
    let arr = [];
    RYGW.forEach(item => {
      arr.push([]);
    });
    // 获取当前登录用户信息
    const loginUser = JSON.parse(window.sessionStorage.getItem('user'));
    loginUser.id = String(loginUser.id);
    arr[9] = [loginUser.id];
    this.setState({
      searchStaffList: [loginUser],
      loginUser: loginUser,
      staffJobList: RYGW,
      staffInfo: { ...this.state.staffInfo, jobStaffList: arr }
    });
    this.fetchInterface();
  };


  // 查询里程碑信息
  fetchQueryMilepostInfo(params) {
    return FetchQueryMilepostInfo(params).then((record) => {
      const { code = -1, result = '' } = record;
      const { nowTime, tomorrowTime } = this.state;
      if (code > 0) {
        let data = JSON.parse(result);

        const arr = this.filterGridLayOut(data);
        if (this.state.operateType === 'ADD') {
          // 赋予初始时间和结束时间
          arr.forEach(item => {
            item.kssj = nowTime;
            item.jssj = tomorrowTime;
          });
        }

        this.setState({ milePostInfo: arr, mileInfo: { ...this.state.mileInfo, milePostInfo: arr } });
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
    //将数组中数据转为键值对结构 (这里的数组和obj会相互引用)
    list.map(el => {
      el.title = el.orgName;
      el.value = el.orgId;
      el.key = el.orgId;
      obj[el.orgId] = el;
    });
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
    return result;
  }

  toItemTree(list, parId) {
    let a = list.reduce((pre, current, index) => {
      pre[current.zdbm] = pre[current.zdbm] || [];
      pre[current.zdbm].push({ key: current.ysID, title: current.ysName, value: current.ysID, ysID: current.ysID, ysKGL: Number(current.ysKGL), ysLB: current.ysLB, ysName: current.ysName, ysZJE: Number(current.ysZJE), zdbm: current.zdbm });
      return pre;
    }, []);

    const treeData = [];
    const indexData = [];
    list.map(item => {
      if (indexData.indexOf(item.zdbm) === -1) {
        indexData.push(item.zdbm)
        if (a[item.zdbm]) {
          let treeDatamini = { children: [] }
          treeDatamini.key = item.zdbm
          treeDatamini.value = item.zdbm
          treeDatamini.title = item.ysLB
          treeDatamini.ysID = item.ysID
          treeDatamini.ysKGL = Number(item.ysKGL)
          treeDatamini.ysLB = item.ysLB
          treeDatamini.ysName = item.ysName
          treeDatamini.ysZJE = Number(item.ysZJE)
          treeDatamini.zdbm = item.zdbm
          treeDatamini.dropdownStyle = { color: '#666' }
          treeDatamini.disabled = true
          treeDatamini.children = a[item.zdbm]
          treeData.push(treeDatamini)
        }
      }

    })
    console.log("treeData", treeData);
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
                arr.push(sx)
              });
            });
            this.setState({ mileItemInfo: arr });
          } else if (params.type === 'SINGLE') {
            console.log("datadata", data)
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
    return FetchQueryProjectDetails(params)
      .then((result) => {
        const { code = -1, record = [] } = result;
        if (code > 0 && record.length > 0) {
          let result = record[0];
          let jobArr = [];
          let searchStaffList = [];
          let memberInfo = JSON.parse(result.memberInfo);
          memberInfo.push({ gw: '10', rymc: result.projectManager });
          memberInfo.forEach(item => {
            let rymc = item.rymc.split(',').map(String);
            jobArr[Number(item.gw) - 1] = rymc;
            rymc.forEach(ry => {
              this.state.staffList.forEach(staff => {
                if (ry == staff.id) {
                  searchStaffList.push(staff);
                }
              })
            })
          });
          let totalBudget = 0;
          let relativeBudget = 0;
          this.state.budgetProjectList.forEach(item => {
            item.children.forEach(i => {
              if (i.key === result.budgetProject) {
                totalBudget = Number(i.ysZJE);
                relativeBudget = Number(i.ysKGL);
              }
            })
          });
          let newOrg = []
          if (result.orgId) {
            newOrg = result.orgId.split(";");
          }
          this.setState({
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
              totalBudget: totalBudget,
              relativeBudget: relativeBudget,
              projectBudget: Number(result.projectBudget)
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
      type: 'ALL'
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
          loginUser: loginUser, organizationList: record, organizationTreeList: this.toOrgTree(arr, 0)
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
        this.setState({ projectLabelList: record });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取url参数
  getUrlParams = () => {
    const { match: { params: { params: encryptParams = '' } } } = this.props;
    const params = JSON.parse(DecryptBase64(encryptParams));
    // console.log("paramsparams", params)
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
      callback('预算超过当前可关联总预算！请注意！');
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
      // console.log(jobStaffList);
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
    return array.sort(function (a, b) {
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
        const { staffJobList } = _this.state;
        const newStaffJobList = staffJobList.filter(item => item.ibm != e);
        _this.setState({ staffJobList: _this.sortByKey(newStaffJobList, 'ibm', true) })
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
    if (type === 0) {
      this.setState({
        operateType: 'SAVE'
      })
    }
    //修改项目的时候隐藏暂存草稿,点完成type传MOD
    console.log("type", type)
    console.log("this.state.projectStatus ===\"MOD\"", this.state.projectStatus)
    if (type === 1 && this.state.projectStatus === 'MOD') {
      this.setState({
        operateType: 'MOD'
      })
    }
    //修改草稿点完成type入参就传ADD
    if (type === 1 && this.state.projectStatus === 'SAVE') {
      console.log("sahdkjasdahsd",)
      this.setState({
        operateType: 'ADD'
      })
    }
    //暂存草稿就还是SAVE
    if (type === 0 && this.state.projectStatus === 'SAVE') {
      this.setState({
        operateType: 'SAVE'
      })
    }
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
          if (err.projectBudget.errors[0].message === '预算超过当前可关联总预算！请注意！') {
            let flag = false; // 是否结束
            confirm({
              okText: '确认',
              cancelText: '取消',
              title: '提示',
              content: '预算超过当前可关联总预算，是否确认？',
              onOk() {
                if (values.projectBudget < 5000) {
                  confirm({
                    okText: '确认',
                    cancelText: '取消',
                    title: '提示',
                    content: '请注意当前的本项目预算单位是元，是否确认？',
                    onOk() {
                      _this.handleSave(values);
                    },
                    onCancel() {
                      flag = true;
                    },
                  });
                } else {
                  _this.handleSave(values);
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
        if (values.projectBudget < 5000) {
          confirm({
            okText: '确认',
            cancelText: '取消',
            title: '提示',
            content: '请注意当前的本项目预算单位是元，是否确认？',
            onOk() {
              _this.handleSave(values);
            },
            onCancel() {
            },
          });
        } else {
          _this.handleSave(values);
        }
      }


    });
  };

  handleSave = (values) => {
    const { basicInfo = {}, budgetInfo = {}, staffJobList = [], staffInfo: { jobStaffList = [] }, mileInfo: { milePostInfo = [] } } = this.state;

    let flag = true; // 日期选择是否符合开始时间小于结束时间
    milePostInfo.forEach(item => {
      if (Number(moment(item.jssj, 'YYYY-MM-DD').format('YYYYMMDD'))
        < Number(moment(item.kssj, 'YYYY-MM-DD').format('YYYYMMDD'))) {
        flag = false;
      }
    });
    if (!flag) {
      message.warn("存在里程碑信息开始时间大于结束时间！");
      return;
    }
    let staffJobParam = [];
    staffJobList.forEach(item => {
      let index = Number(item.ibm);
      if (jobStaffList[index - 1] && jobStaffList[index - 1].length > 0) {
        let param = {
          gw: index,
          rymc: jobStaffList[index - 1].join(',')
        };
        staffJobParam.push(param);
      }
    });
    const staffJobParams = staffJobParam.filter(item => (item.rymc !== ''));
    // 获取项目经理
    const projectManager = staffJobParams.filter(item => (item.gw == 10)) || [];
    if (projectManager.length == 0) {
      message.warn("项目经理不能为空！");
    } else {
      let orgNew = "";
      if (basicInfo.org?.length > 0) {
        basicInfo.org.map((item, index) => {
          orgNew = item.concat(";").concat(orgNew);
        })
      };
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
        budgetProject: Number(budgetInfo.budgetProjectId),
        projectBudget: String(budgetInfo.projectBudget)
      };
      const _this = this;
      const timeList = milePostInfo.filter(item => item.jssj === this.state.tomorrowTime && item.kssj === this.state.nowTime);
      if (timeList && timeList.length > 0) {
        confirm({
          okText: '确认',
          cancelText: '取消',
          title: '提示',
          content: '有里程碑信息的默认起止时间没有修改，是否确认？',
          onOk() {
            _this.makeOperateParams(params, milePostInfo, staffJobParams, projectManager);
          },
          onCancel() {
          },
        });
      } else {
        _this.makeOperateParams(params, milePostInfo, staffJobParams, projectManager);
      }
    }

  };

  makeOperateParams = (params, milePostInfo, staffJobParams, projectManager) => {
    this.setState({ loading: true });
    let milepostInfo = [];
    let matterInfo = [];
    milePostInfo.forEach(item => {
      milepostInfo.push({
        lcb: item.lcblxid,
        jssj: moment(item.jssj, 'YYYY-MM-DD').format('YYYYMMDD'),
        kssj: moment(item.kssj, 'YYYY-MM-DD').format('YYYYMMDD')
      });
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

    params.mileposts = milepostInfo;
    params.matters = matterInfo;
    params.projectManager = Number(projectManager[0].rymc);
    let memberInfo = staffJobParams.filter(item => item.gw != 10);
    memberInfo.forEach(item => {
      item.gw = String(item.gw);
    });
    params.members = memberInfo;
    console.log("params.projectId", this.state.basicInfo.projectId)
    params.projectId = this.state.basicInfo.projectId === undefined || this.state.basicInfo.projectId === '' ? -1 : Number(this.state.basicInfo.projectId);
    console.log("operateType", this.state.operateType)
    params.type = this.state.operateType;
    params.czr = Number(this.state.loginUser.id);

    this.operateCreatProject(params);
  };

  operateCreatProject(params) {
    OperateCreatProject(params).then((result) => {
      const { code = -1, note = '', projectId } = result;
      this.setState({ loading: false });
      if (code > 0) {
        console.log("0000")
        if (this.state.type) {
          console.log("1111")
          window.parent && window.parent.postMessage({ operate: 'success' }, '*');
        } else {
          console.log("22222")
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

      console.log("333333")
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
      item.matterInfos.forEach((e, i) => {
        let sxlb = [];
        e.sxlb.forEach((sx, sx_index) => {
          if (!(sx.type && sx.type === 'title')) {
            sxlb.push(sx);
          }
        });
        e.sxlb = sxlb;
      });
    });

    return mile;
  };

  // 删除里程碑事项信息
  removeMilePostInfoItem = (index, i, sx_index) => {
    const { mileInfo: { milePostInfo = [] } } = this.state;

    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    let sxlb = [];
    matterInfo[i].sxlb.forEach((item, index) => {
      if (index !== sx_index) {
        sxlb.push(item);
      }
    });
    matterInfo[i].sxlb = sxlb;
    const removeTitleMile = this.removeAllTitle(JSON.parse(JSON.stringify(mile)));

    this.setState({
      mileInfo: {
        ...this.state.mileInfo,
        milePostInfo: this.filterGridLayOut(JSON.parse(JSON.stringify(removeTitleMile)))
      }
    });
  };

  // 添加里程碑事项信息-ccccc
  addMilePostInfoItem = (index, i) => {
    const { mileInfo: { milePostInfo = [] } } = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    // console.log("milePostInfo", milePostInfo)
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    matterInfo[i].sxlb.push({ sxid: '', sxmc: '', type: 'new' });
    const removeTitleMile = this.removeAllTitle(JSON.parse(JSON.stringify(mile)));
    // console.log("milePostInfo222", removeTitleMile)
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
    if (type === 'start') {
      mile[index].kssj = date;
    } else if (type === 'end') {
      mile[index].jssj = date;
    }
    this.setState({ mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
  };

  onChange = minicurrent => {
    // console.log('onChange:', minicurrent);
    this.setState({ minicurrent });
    let height = document.getElementById("lcbxxClass")?.scrollHeight;
    // let height222 = document.getElementById("milePost"+minicurrent)
    let heightTotal = 0;
    //滚动到指定高度
    if (minicurrent) {
      for (let i = 0; i < minicurrent; i++) {
        console.log("iiiii", document.getElementById("milePost" + i).offsetHeight)
        heightTotal = heightTotal + document.getElementById("milePost" + i).offsetHeight;
      }
    }
    heightTotal = heightTotal + (7.8 * (minicurrent - 1) + 11.8)
    console.log('height222', heightTotal);
    document.getElementById("lcbxxClass").scrollTo(0, heightTotal)

  };

  onChange0 = current => {
    this.setState({ current });
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    // console.log(tags);
    this.setState({ tags });
  };

  showInput = (index, i) => {
    // console.log("iiiii", i)
    // console.log("index", index)
    this[`${index}inputRef${i}`] = React.createRef();
    // this.setState({inputVisible: i}, () => this.mySelect.focus());
    this.setState({ inputVisible: `${index}+${i}` }, () => this[`${index}inputRef${i}`].current.focus());
  };


  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = (e, index, i, sx_index) => {
    // console.log("sx_index",sx_index)
    //matterInfos
    const { mileInfo: { milePostInfo = [] }, mileItemInfo = [] } = this.state;
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
    this.setState({ inputVisible: '-1', mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
    // console.log("新增后，新增后",this.state.mileInfo.milePostInfo.matterInfos)
  };

  //添加事项
  addSwlx = (e, index) => {
    this.fetchQueryMatterUnderMilepost({ type: 'SINGLE', lcbid: e });
    //添加事项类型
    console.log("eeeee", e)
    console.log("index", index)
    const { mileInfo: { milePostInfo = [] }, } = this.state;
    // 多层数组的深拷贝方式  真暴力哦
    const mile = JSON.parse(JSON.stringify(milePostInfo));
    const matterInfo = mile[index].matterInfos;
    let matterInfos = { swlxmc: "new", sxlb: [] }
    matterInfo.push(matterInfos)
    this.setState({ inputVisible: '-1', mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
    //添加内的流程
  }

  addSwlxMx = (e, index, i, sx_index) => {
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
    console.log("matterInfo", matterInfo);
    const sxlbparam = { type: 'title' };
    matterInfo.map(item => {
      if (item.swlxmc === "new") {
        item.swlxmc = swlxmc
        item.sxlb[0] = sxlbparam;
      }
    })
    this.setState({ inputVisible: '-1', mileInfo: { ...this.state.mileInfo, milePostInfo: mile } });
  }

  // onOrgChange = (e) =>{
  //   const {basicInfo = {}} =this.state
  //   this.setState({
  //     basicInfo:{org:e}
  //   })
  // }
  //
  // onBqChange = (e) =>{
  //   const {basicInfo = {}} =this.state
  //   this.setState({
  //     basicInfo:{projectLabel:e}
  //   })
  // }

  render() {
    const {
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
      swlxarr = []
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const basicFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
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
          <div>基本&预算信息</div>
          <div style={{ fontSize: '2.038rem', color: '#999', lineHeight: '3rem' }}>项目信息填写</div>
        </span>,
        content: '',
      },
      {
        title: <span>
          <div>里程碑信息</div>
          <div style={{ fontSize: '2.038rem', color: '#999', lineHeight: '3rem' }}>里程碑信息填写</div>
        </span>,
      },
      {
        title: <span>
          <div>人员信息</div>
          <div style={{ fontSize: '2.038rem', color: '#999', lineHeight: '3rem' }}>项目参与人员信息填写</div>
        </span>,
      },
    ];
    const ministeps = [];
    // console.log("milePostInfo", milePostInfo)
    milePostInfo.map(item => {
      let params;
      params = {
        title: <div style={{ fontSize: '2.7rem' }}>{item.lcbmc}</div>
      }
      ministeps.push(params)
    })
    return (
      <Fragment>
        <div className="newProject" style={{ overflow: 'hidden', height: "100%" }}>
          <Spin spinning={loading} wrapperClassName="spin" tip="正在努力的加载中..." size="large" style={{ height: "100%" }}>
            <div style={{ overflow: 'hidden', height: "100%" }}>
              <div style={{ margin: '0 20rem 0 20rem', height: "11%" }}>
                <Steps current={current} onChange={this.onChange0} type="navigation" style={{ height: "100%" }}>
                  {steps.map((item, index) => (
                    <Step key={index} title={item.title} />
                  ))}
                </Steps>
              </div>
              {
                current === 0 && <div className="steps-content"><React.Fragment>
                  <div className="title">
                    {/*<Icon type="caret-down" onClick={() => this.setState({basicInfoCollapse: !basicInfoCollapse})}*/}
                    {/*      style={{fontSize: '2rem', cursor: 'pointer'}}/>*/}
                    <span style={{
                      paddingLeft: '1rem',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      borderLeft: '4px solid #3461FF'
                    }}>基本信息</span>
                  </div>
                  <Form {...basicFormItemLayout} ref={e => this.basicForm = e} onSubmit={e => this.handleFormValidate(e)} style={{ width: '98%' }}>
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
                        <Form.Item label="项目类型">
                          {getFieldDecorator('projectType', {
                            rules: [{
                              required: true,
                              message: '请输入项目类型'
                            }],
                            initialValue: basicInfo.projectType
                          })(
                            <Radio.Group onChange={e => {
                              this.setState({ basicInfo: { ...basicInfo, projectType: e.target.value } });
                              this.fetchQueryMilepostInfo({
                                type: e.target.value,
                                xmid: basicInfo.projectId,
                                biddingMethod: basicInfo.biddingMethod,
                                budget: budgetInfo.projectBudget,
                                label: ''
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
                            <Select showSearch
                              showArrow={true}
                              mode="multiple"
                              onChange={e => {
                                console.log("eee", e)
                                this.setState({
                                  basicInfo: { ...basicInfo, projectLabel: e }
                                })
                              }}
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }>
                              {
                                projectLabelList.length > 0 && projectLabelList.map((item, index) => {
                                  return (
                                    <Option key={index} value={item.id}>{item.bqmc}</Option>
                                  )
                                })
                              }
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="应用部门">
                          {getFieldDecorator('org', {
                            rules: [{
                              required: true,
                              message: '请输入应用部门'
                            }],
                            initialValue: basicInfo.org ? basicInfo.org : null
                          })(
                            <TreeSelect
                              multiple
                              showSearch
                              treeNodeFilterProp="title"
                              style={{ width: '100%' }}
                              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                              treeData={organizationTreeList}
                              placeholder="请选择应用部门"
                              treeDefaultExpandAll
                              onChange={e => {
                                console.log("eee", e)
                                this.setState({
                                  basicInfo: { ...basicInfo, org: e }
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
                            <Form.Item label="招标方式">
                              {getFieldDecorator('biddingMethod', {
                                rules: [{
                                  required: true,
                                  message: '请输入招标方式'
                                }],
                                initialValue: basicInfo.biddingMethod
                              })(
                                <Radio.Group onChange={e => {
                                  this.setState({ basicInfo: { ...basicInfo, biddingMethod: e.target.value } });
                                  this.fetchQueryMilepostInfo({
                                    type: basicInfo.projectType,
                                    xmid: this.state.basicInfo.projectId,
                                    biddingMethod: e.target.value,
                                    budget: budgetInfo.projectBudget,
                                    label: ''
                                  });
                                }}>
                                  <Radio value={1}>邀请招标</Radio>
                                  <Radio value={2}>直采</Radio>
                                  <Radio value={3}>公开招标</Radio>
                                </Radio.Group>
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
                        paddingLeft: '1rem',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        borderLeft: '4px solid #3461FF'
                      }}>预算信息</span>
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
                                _this.fetchQueryBudgetProjects({ type: 'NF', year: Number(v.format("YYYY")) });
                              })
                            }}
                            format="YYYY" mode="year" />
                          {/*)}*/}
                        </Form.Item>
                      </Col>
                      <Col span={12} className="glys">
                        <Form.Item label="关联预算项目" required={true}>
                          {getFieldDecorator('budgetProjectId', {
                            rules: [{
                              required: true,
                              message: '请选择关联预算项目'
                            }],
                            initialValue: budgetInfo.budgetProjectId
                          })(
                            <TreeSelect
                              showSearch
                              treeNodeFilterProp="title"
                              style={{ width: '100%' }}
                              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                              treeData={budgetProjectList}
                              placeholder="请选择关联预算项目"
                              // treeDefaultExpandAll
                              onChange={e => {
                                console.log("eeeee", e)
                                budgetProjectList.forEach(item => {
                                  item.children.forEach(i => {
                                    if (i.key === e) {
                                      const _this = this;
                                      if (e === '0') {
                                        this.setState({
                                          budgetInfo: {
                                            ...this.state.budgetInfo,
                                            budgetProjectId: e,
                                            totalBudget: 0,
                                            relativeBudget: 0
                                          }
                                        }, function () {
                                          _this.props.form.resetFields(['projectBudget']);
                                          _this.props.form.validateFields(['projectBudget']);
                                        });
                                      } else {
                                        this.setState({
                                          budgetInfo: {
                                            ...this.state.budgetInfo,
                                            budgetProjectId: e,
                                            totalBudget: Number(i.ysZJE),
                                            relativeBudget: Number(i.ysKGL)
                                          }
                                        }, function () {
                                          _this.props.form.resetFields(['projectBudget']);
                                          _this.props.form.validateFields(['projectBudget']);
                                        });
                                      }
                                    }
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
                            precision={0} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="当前可关联总预算(元)">
                          <InputNumber disabled={true} style={{ width: '100%' }} value={budgetInfo.relativeBudget}
                            precision={0} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item label="本项目预算(元)" required={true}>
                          {getFieldDecorator('projectBudget', {
                            rules: [{
                              required: true,
                              message: '请输入本项目预算(元)'
                            }, {
                              validator: this.handleValidatorProjectBudget
                            }],
                            initialValue: budgetInfo.projectBudget
                          })(
                            <InputNumber onBlur={(e) => {
                              this.fetchQueryMilepostInfo({
                                type: basicInfo.projectType,
                                xmid: this.state.basicInfo.projectId,
                                biddingMethod: basicInfo.biddingMethod,
                                budget: budgetInfo.projectBudget,
                                label: ''
                              });
                            }} style={{ width: '100%' }} precision={0} />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12} style={{ paddingLeft: 0 }}>
                      </Col>
                    </Row>
                  </Form>
                  {/*</Form>*/}
                </React.Fragment></div>
              }
              {
                current === 1 && <div style={{ display: 'flex', height: '75%', margin: '2rem 2rem 2rem 10rem' }}>
                  <Steps progressDot style={{ height: '100rem', width: '15%', padding: '3rem 0' }} direction="vertical"
                    current={minicurrent} onChange={this.onChange}>

                    {ministeps.map((item, index) => (
                      <Step style={{ height: (100 / (ministeps.length * 1.1)) + 'rem' }} key={index} title={item.title} />
                    ))}
                  </Steps>
                  <div className="steps-content" id="lcbxxClass"
                    style={{ overflowY: 'scroll', height: '100%', width: '83%', margin: '0 0 15rem 0' }}>
                    <React.Fragment>
                      {
                        milePostInfo.length > 0 && milePostInfo.map((item, index) => {
                          // console.log("itemitemitem", item)
                          {
                            return (
                              <React.Fragment>
                                {
                                  item.type && item.type === 'new' ? (
                                    <div key={index} className="newMilePost">
                                      <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '14%' }}>
                                          <Select
                                            showSearch
                                            filterOption={(input, option) =>
                                              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={e => this.selectMileStageInfo(e, index)}
                                            placeholder="请选择"
                                            style={{ width: '100%' }}
                                          >
                                            {
                                              mileStageList.length > 0 && mileStageList.map((item, index) => {
                                                return (<Option key={index} value={item.id}>{item.lcbmc}</Option>)
                                              })
                                            }
                                          </Select>
                                        </div>
                                        <div style={{
                                          width: '66%',
                                          marginLeft: '2rem',
                                          position: 'relative',
                                          display: 'flex',
                                          flexDirection: 'row'
                                        }}>
                                          <DatePicker format="YYYY-MM-DD" style={{ width: '21%' }}
                                            value={moment(item.kssj, 'YYYY-MM-DD')}
                                            allowClear={false}
                                            onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'start')}
                                            onFocus={() => this.setState({
                                              isEditMile: true,
                                              isCollapse: false
                                            })} />
                                          <div
                                            style={{
                                              fontSize: '2.5rem',
                                              fontWeight: 'bold',
                                              padding: '2rem 2rem 0 2rem'
                                            }}>~
                                          </div>
                                          <DatePicker format="YYYY-MM-DD" style={{ width: '21%' }}
                                            value={moment(item.jssj, 'YYYY-MM-DD')}
                                            allowClear={false}
                                            onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'end')}
                                            onFocus={() => this.setState({
                                              isEditMile: true,
                                              isCollapse: false
                                            })} />
                                          <div style={{
                                            color: '#f5222d',
                                            fontSize: '3.5rem',
                                            position: 'absolute',
                                            top: '10%',
                                            right: '51.5%'
                                          }}>
                                            *
                                          </div>
                                          <div style={{
                                            color: '#f5222d',
                                            fontSize: '3.5rem',
                                            position: 'absolute',
                                            top: '10%',
                                            right: '77.5%'
                                          }}>
                                            *
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', width: "20%" }}>
                                          <div onClick={() => this.saveMilePostInfo(index)} style={{
                                            cursor: 'pointer',
                                            // width: '5%',
                                            color: 'rgb(52, 97, 255)',
                                            textAlign: 'right',
                                            padding: '1.5rem 1.5rem 0 0'
                                          }}>
                                            保存
                                          </div>
                                          {
                                            <span style={{
                                              padding: '1.5rem 1.5rem 0 0',
                                              cursor: 'pointer',
                                              color: 'rgb(52, 97, 255)',
                                              fontSize: '2.5rem'
                                            }} onClick={() => this.addSwlx(item?.lcblxid, index)}>添加事项</span>
                                          }
                                          <div onClick={() => this.removeMilePostInfo(index)} style={{
                                            cursor: 'pointer',
                                            // width: '5%',
                                            color: '#DE3741',
                                            textAlign: 'right',
                                            padding: '1.5rem 1.5rem 0 0'
                                          }}>
                                            删除
                                          </div>
                                        </div>
                                      </div>
                                      {
                                        item.matterInfos.length > 0 && item.matterInfos.map((e, i) => {
                                          return (
                                            <div className="flow" key={i}
                                              style={{
                                                display: e.swlxmc === "new" && e.sxlb?.length === 0 ? '' : (e.swlxmc !== "new" && e.sxlb?.length === 0 ? 'none' : ''),
                                                margin: i > 0 ? '1rem 3rem 0 3rem' : '0 3rem'
                                              }}>
                                              <div>
                                                {
                                                  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                    if (sx.type && sx.type === 'title' && sx_index === 0) {
                                                      return (
                                                        <div key={String(sx_index + 1)} style={{
                                                          paddingTop: '3rem',
                                                          fontWeight: 'bold',
                                                          fontSize: '2.5rem'
                                                        }}>
                                                          {e.swlxmc || ''}
                                                        </div>
                                                      )
                                                    }
                                                  })
                                                }
                                                {
                                                  e.swlxmc === "new" && (
                                                    <Select showSearch
                                                      ref={this[`${index}inputRef${i}`]}
                                                      filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                      }
                                                      // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                      onChange={(e) => this.setState({ inputValue: e })}
                                                      //milePostInfo[index].matterInfos[i].length
                                                      onBlur={e => this.addSwlxMx(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                      style={{
                                                        width: '20rem',
                                                        marginTop: '0.7rem',
                                                        marginLeft: '1rem'
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
                                                  )
                                                }
                                              </div>
                                              <div>
                                                {
                                                  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                    if (sx.type && sx.type === 'title') {
                                                      return (
                                                        <div key={String(sx_index + 1)}
                                                          style={{ paddingTop: '2rem', fontWeight: 'bold' }}>
                                                        </div>
                                                      )
                                                    }
                                                  })
                                                }
                                              </div>
                                              <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                  {
                                                    e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                      // console.log("sxsxsx",sx)
                                                      if (!sx.type && sx_index !== 0) {
                                                        return (
                                                          <div key={String(sx_index + 1)}
                                                            className={sx.type && sx.type === 'new' ? 'new' : 'item'}>
                                                            {
                                                              <React.Fragment>
                                                                <span title={sx.sxmc}
                                                                  style={{ fontSize: '2.5rem' }}>{sx.sxmc.length > 10 ? (sx.sxmc.substring(0, 10) + '...') : sx.sxmc}</span>
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
                                                  {inputVisible === `${index}+${i}` && (
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
                                                        width: '20rem',
                                                        marginTop: '0.7rem',
                                                        marginLeft: '1rem'
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
                                                  )}
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
                                                          width: '20rem',
                                                          marginTop: '0.7rem',
                                                          marginLeft: '1rem'
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
                                                  <Tag onClick={() => this.showInput(index, i)}
                                                    style={{ background: '#fff', borderStyle: 'dashed' }}>
                                                    <Icon type="plus" /> 新增
                                                  </Tag>
                                                  <span onClick={() => this.removeMilePostTypeInfo(index, i)}
                                                    style={{ cursor: 'pointer', fontSize: '2.5rem' }}>删除本行</span>
                                                </div>
                                              </div>
                                            </div>
                                          )

                                        })
                                      }
                                    </div>
                                  ) : (
                                    <div key={index} className="milePost" id={`milePost${index}`}>
                                      <div className="title">
                                        <div className="left">
                                          <div style={{ marginTop: '2rem' }}>
                                            <span style={{
                                              paddingLeft: '1rem',
                                              fontSize: '2.5rem',
                                              fontWeight: 'bold',
                                              borderLeft: '4px solid #3461FF'
                                            }}>{item.lcbmc}</span>
                                          </div>
                                          <div style={{
                                            paddingLeft: '2rem',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'row'
                                          }}>
                                            <DatePicker format="YYYY-MM-DD" style={{ width: '35%' }}
                                              value={moment(item.kssj, 'YYYY-MM-DD')}
                                              allowClear={false}
                                              onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'start')}
                                              onFocus={() => this.setState({
                                                isEditMile: true,
                                                isCollapse: false
                                              })} />
                                            <div style={{
                                              fontSize: '2.5rem',
                                              fontWeight: 'bold',
                                              padding: '2rem 2rem 0 2rem'
                                            }}>~
                                            </div>
                                            <DatePicker format="YYYY-MM-DD" style={{ width: '35%' }}
                                              value={moment(item.jssj, 'YYYY-MM-DD')}
                                              allowClear={false}
                                              onChange={(date, str) => this.changeMilePostInfoTime(str, index, 'end')}
                                              onFocus={() => this.setState({
                                                isEditMile: true,
                                                isCollapse: false
                                              })} />
                                            <div style={{
                                              color: '#f5222d',
                                              fontSize: '3.5rem',
                                              position: 'absolute',
                                              top: '10%',
                                              right: '18%'
                                            }}>
                                              *
                                            </div>
                                            <div style={{
                                              color: '#f5222d',
                                              fontSize: '3.5rem',
                                              position: 'absolute',
                                              top: '10%',
                                              right: '60%'
                                            }}>
                                              *
                                            </div>
                                          </div>
                                        </div>
                                        {
                                          <div className="right">
                                            {
                                              index > 0 ? (
                                                <span
                                                  style={{
                                                    paddingRight: '1.5rem',
                                                    cursor: 'pointer',
                                                    fontSize: '2.5rem'
                                                  }}
                                                  onClick={() => this.moveMilePostInfo(index, 'top')}>上移</span>
                                              ) : null
                                            }
                                            {
                                              index !== milePostInfo.length - 1 ? (
                                                <span
                                                  style={{
                                                    paddingRight: '1.5rem',
                                                    cursor: 'pointer',
                                                    fontSize: '2.5rem'
                                                  }}
                                                  onClick={() => this.moveMilePostInfo(index, 'down')}>下移</span>
                                              ) : null
                                            }
                                            {
                                              <span style={{
                                                paddingRight: '1.5rem',
                                                cursor: 'pointer',
                                                fontSize: '2.5rem'
                                              }} onClick={() => this.addSwlx(item?.lcblxid, index)}>添加事项</span>
                                            }
                                            {
                                              !item.lcbmc.includes("立项") && !item.lcbmc.includes("实施") && !item.lcbmc.includes("上线")
                                              && <span style={{ cursor: 'pointer', fontSize: '2.5rem' }}
                                                onClick={() => this.removeMilePostInfo(index)}>删除</span>
                                            }

                                          </div>
                                        }

                                      </div>
                                      {
                                        item.matterInfos.length > 0 && item.matterInfos.map((e, i) => {
                                          return (
                                            <div className="flow" key={i}
                                              style={{
                                                display: e.swlxmc === "new" && e.sxlb?.length === 0 ? '' : (e.swlxmc !== "new" && e.sxlb?.length === 0 ? 'none' : ''),
                                                margin: i > 0 ? '1rem 3rem 0 3rem' : '0 3rem'
                                              }}>
                                              {/*<GridLayout isDraggable={false} style={{marginBottom: '2rem'}}*/}
                                              {/*            onDragStop={(e) => this.stopDrag(e, index, i)}*/}
                                              {/*            compactType="horizontal" isBounded={true} isResizable={false}*/}
                                              {/*            className="layout" layout={e.gridLayout} rowHeight={3}*/}
                                              {/*            cols={5}*/}
                                              {/*            width={900}>*/}
                                              <div>
                                                {
                                                  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                    if (sx.type && sx.type === 'title' && sx_index === 0) {
                                                      return (
                                                        <div key={String(sx_index + 1)} style={{
                                                          paddingTop: '3rem',
                                                          fontWeight: 'bold',
                                                          fontSize: '2.5rem'
                                                        }}>
                                                          {e.swlxmc || ''}
                                                        </div>
                                                      )
                                                    }
                                                  })
                                                }
                                                {
                                                  e.swlxmc === "new" && (
                                                    <Select showSearch
                                                      ref={this[`${index}inputRef${i}`]}
                                                      filterOption={(input, option) =>
                                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                      }
                                                      // onChange={e => this.selectMilePostInfoItem(e, index, i, sx_index)}
                                                      onChange={(e) => this.setState({ inputValue: e })}
                                                      //milePostInfo[index].matterInfos[i].length
                                                      onBlur={e => this.addSwlxMx(e, index, i, `${milePostInfo[index].matterInfos[i].sxlb.length}`)}
                                                      style={{
                                                        width: '20rem',
                                                        marginTop: '0.7rem',
                                                        marginLeft: '1rem'
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
                                                  )
                                                }
                                              </div>
                                              <div>
                                                {
                                                  e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                    if (sx.type && sx.type === 'title') {
                                                      return (
                                                        <div key={String(sx_index + 1)}
                                                          style={{ paddingTop: '2rem', fontWeight: 'bold' }}>
                                                        </div>
                                                      )
                                                    }
                                                  })
                                                }
                                              </div>
                                              <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                  {
                                                    e.sxlb?.length > 0 && e.sxlb?.map((sx, sx_index) => {
                                                      // console.log("sxsxsx",sx)
                                                      if (!sx.type && sx_index !== 0) {
                                                        return (
                                                          <div key={String(sx_index + 1)}
                                                            className={sx.type && sx.type === 'new' ? 'new' : 'item'}>
                                                            {
                                                              <React.Fragment>
                                                                <span title={sx.sxmc}
                                                                  style={{ fontSize: '2.5rem' }}>{sx.sxmc.length > 10 ? (sx.sxmc.substring(0, 10) + '...') : sx.sxmc}</span>
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
                                                  {inputVisible === `${index}+${i}` && (
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
                                                        width: '20rem',
                                                        marginTop: '0.7rem',
                                                        marginLeft: '1rem'
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
                                                  )}
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
                                                          width: '20rem',
                                                          marginTop: '0.7rem',
                                                          marginLeft: '1rem'
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
                                                  <Tag onClick={() => this.showInput(index, i)}
                                                    style={{ background: '#fff', borderStyle: 'dashed' }}>
                                                    <Icon type="plus" /> 新增
                                                  </Tag>
                                                  <span onClick={() => this.removeMilePostTypeInfo(index, i)}
                                                    style={{ cursor: 'pointer', fontSize: '2.5rem' }}>删除本行</span>
                                                </div>
                                              </div>
                                            </div>
                                          )

                                        })
                                      }


                                    </div>
                                  )
                                }
                              </React.Fragment>
                            )
                          }

                        })
                      }
                      {
                        <div className="addMilePost" onClick={this.addMilePostInfo}>
                          <Icon type="plus" style={{ fontSize: '1.7rem' }} /><span
                            style={{ paddingLeft: '1rem', fontSize: '2.5rem' }}>新增里程碑</span>
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
                    <div className="job">
                      {
                        staffJobList.length > 0 && staffJobList.map((item, index) => {
                          if (item.ibm === '10') {
                            return (
                              <div className="jobItem">
                                <div className="name"
                                  style={{ color: item.ibm === this.state.staffInfo.focusJob ? '#3461FF' : '' }}><span
                                    style={{ color: '#de3741', paddingRight: '1rem' }}>*</span><span>{item.note}：</span>
                                </div>
                                <div style={{ width: '65%' }}>
                                  <Select
                                    placeholder="请输入名字搜索人员"
                                    value={jobStaffList.length > 0 ? jobStaffList[9] : []}
                                    onBlur={() => this.setState({ height: 0 })}
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
                        staffJobList.map((item, index) => {
                          if (item.ibm !== '10' && item.ibm !== '6') {
                            return (
                              <div className="jobItem">
                                <div className="name"
                                  style={{ color: item.ibm === this.state.staffInfo.focusJob ? '#3461FF' : '' }}>
                                  <Icon onClick={this.removeJob.bind(this, item.ibm)} type="close"
                                    style={{ paddingRight: '1rem', cursor: 'pointer' }} /><span>{item.note}：</span>
                                </div>
                                <div style={{ width: '65%' }}>
                                  <Select
                                    placeholder="请输入名字搜索人员"
                                    value={jobStaffList.length > 0 ? jobStaffList[Number(item.ibm) - 1] : []}
                                    onBlur={() => this.setState({ height: 0 })}
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

                    </div>
                    <div className="button">
                      <Button onClick={this.clickAddStaff} icon="left">添加</Button>
                    </div>
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
                      onClick={e => this.handleFormValidate(e, 1)} style={{ marginLeft: '2rem' }}>
                      完成
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(NewProjectModelV2));
