import React, { useState, useEffect, useRef, useContext } from 'react';
import { message, Spin, Tabs, Table, Card, Tooltip, Button } from 'antd';
import { Link } from 'react-router-dom';
import { QueryBudgetProjectDetail } from '../../../../services/pmsServices';
import { momneyFormatter, calculatePercentage } from '../budgetUtils';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { BudgetDetailContext } from '../index';

/**
 * 通用表格
 */
const CustomTable = props => {
  const {} = props;

  const {
    projectData = {},
    budgetType,
    budgetIdRef,
    setIsGlobalLoading,
    setProjectData,
    routes = [],
    isLeader,
    userBasicInfo = {},
  } = useContext(BudgetDetailContext);

  const [curPageNum, setCurPageNum] = useState(1);

  const [pageSize, setPageSize] = useState(20);

  const [tableData, setTableData] = useState([]);

  /** 查询表格数据 */
  const queryhandle = async () => {
    setIsGlobalLoading(true);

    const qyeryParmas = {
      budgetId: budgetIdRef.current,
      budgetType: budgetType,
      current: curPageNum,
      pageSize: pageSize,
      queryType: 'ALL',
    };
    const res = await QueryBudgetProjectDetail(qyeryParmas);
    if (res.code === 1) {
      const { projectResult, budgetResult } = res;
      const projectResultArr = JSON.parse(projectResult);

      const formatProjectResult = projectResultArr.map(item => {
        return {
          key: item.XMID,
          projectId: item.XMID, //项目id
          projectName: item.XMMC, //项目名称
          projectManagerId: item.XMJLID, //项目经理id
          projectManager: item.XMJL, //项目经理
          projectMoney: item.XMJE, //项目金额
          contractMoney: item.HTJE, //合同金额
          payedMoney: item.YFKJE, //已付款金额
          unpayedMoney: item.WFKJE, //未付款金额
          payRate: item.FKL, //付款率
        };
      });
      setTableData(formatProjectResult);
      // console.log('表格数据', formatProjectResult)

      const obj = JSON.parse(budgetResult).length > 0 ? JSON.parse(budgetResult)[0] : [];

      let formatBudgetResult = [];
      switch (budgetType) {
        case 'ZB':
          formatBudgetResult = {
            projectId: obj.YSID, // 预算id
            projectName: obj.YSXM, //预算项目名称
            Tag_approvalTime: obj.NF, //项目立项年份          加了！的要以标签形式展示
            responsiblePeopleId: obj.FZRID, //负责人id
            responsiblePeople: obj.FZR, //负责人
            isInitialApproval: obj.SFSCLX, //是否首次立项       1是2否  加了！的要以标签形式展示
            budgetCategory: obj.YSLB, //预算类别              字典YSFL
            Tag_addOrCarryforward: obj.XZHJZ, //新增或结转    1是2否  加了！的要以标签形式展示
            Tag_softwareDevelopmentOrSystemDocking: obj.RJKFHXTDJ, //  涉及软件开发或系统对接    1是2否  加了！的要以标签形式展示
            projectCategory: obj.YSFL, //项目分类           字典YSLB

            totalMoney: obj.ZYS, //总金额

            executedMoney: obj.YZXYS, //已执行预算
            canExecuteMoney: obj.KZXYS, //可执行预算
            executeRate: obj.ZXL, //执行率

            approvalMoney: obj.YLXYS, //已立项金额
            canApprovalMoney: obj.KLXYS, //可立项金额
            approvalRate: obj.LXL, //立项率

            projectNecessity: obj.XMBYX, //项目必要性
            softwareInvestment: obj.RJTZ, //软件投资
            softwareInvestmentCurYear: obj.RJTZJHZF, //今年计划软件投资
            xinChuang_SoftwareInvestment: obj.XCRJTZ, //信创软件投资
            xinChuang_SoftwareInvestmentCurYear: obj.XCRJTZJHZF, //今年计划信创软件投资
            hardwareServer: obj.YJFWQ, //硬件服务器
            hardwareServerCurYear: obj.YJFWQJHZF, //今年计划硬件服务器
            hardwareNetworkEquipment: obj.YJWLSB, //硬件网络设备
            hardwareNetworkEquipmentCurYear: obj.YJWLSBJHZF, //今年计划硬件网络设备
            hardwareOther: obj.YJQT, //硬件其他
            hardwareOtherCurYear: obj.YJQTJHZF, //今年计划硬件其他
            totalHardwareInvestment: obj.YJTZZJE, //硬件投资总金额
            totalHardwareInvestmentCurYear: obj.YJTZZJEJHZF, //今年计划硬件投资总金额
            xinChuang_HardwareInvestment: obj.XCYJTZ, //信创硬件投资
            xinChuang_HardwareInvestmentCurYear: obj.XCYJTZJHZF, //今年计划信创硬件投资
            totalInvestment: obj.ZTZJHZF, //总投资
            totalInvestmentCurYear: obj.ZTZ, //今年计划总投资
            systemName: obj.XTMC, //系统名称
            projectCategoryDescription: obj.XMFLSM, //项目分类说明
            projectContent: obj.XMNR, //项目内容
            hardwareCloudResourcesConfigure: obj.YJYZYPZ, //硬件云资源配置
            hardwareStorageConfiguration: obj.YJCCPZ, //硬件存储配置
          };
          // console.log('资本的数据', obj, formatBudgetResult);
          setProjectData(formatBudgetResult);
          break;
        case 'FZB':
          formatBudgetResult = {
            projectId: obj.YSID, // 预算id
            projectName: obj.YSXM, //预算项目名称
            Tag_approvalTime: obj.NF, //项目立项年份          加了！的要以标签形式展示
            responsiblePeopleId: obj.FZRID, //负责人id
            responsiblePeople: obj.FZR, //负责人
            maintainCostCategory: obj.WHFYLB, //维护费用类别
            maintenanceAnnualFee: obj.WHNF, // 维护年费

            totalMoney: obj.ZYS, //总金额

            canExecuteMoney: obj.KZXYS, //可执行预算
            // canExecuteMoney: obj.KZXJE, //可执行金额   //可执行预算 = 可执行金额
            executedMoney: obj.YZXYS, //已执行金额
            executeRate: obj.ZXL, //执行率

            approvalMoney: obj.YLXYS, //已立项金额
            canApprovalMoney: obj.KLXYS, //可立项金额
            approvalRate: obj.LXL, //立项率
          };
          // console.log('非资本的数据', obj, formatBudgetResult);
          setProjectData(formatBudgetResult);
          break;
        case 'KY':
          formatBudgetResult = {
            projectId: obj.YSID, // 预算id
            projectName: obj.YSXM, //预算项目名称
            Tag_approvalTime: obj.NF, //项目立项年份          加了！的要以标签形式展示
            responsiblePeopleId: obj.FZRID, //负责人id
            responsiblePeople: obj.FZR, //负责人
            constructionCycle: obj.JSZQ, //建设周期
            Tag_addOrCarryforward: obj.XZHJZ, //新增或结转   字典YSLB   加了！的要以标签形式展示
            capitalBudget: obj.ZBXYS, //资本性预算
            nonCapitalBudget: obj.FZBXYS, //非资本性预算
            humanCost: obj.RLCB, //人力成本
            totalInvestment: obj.ZTZ, //总投资
            currentYearScheduledPay: obj.BNJHZF, //本年计划支付

            totalMoney: obj.ZYS, //总金额

            executedMoney: obj.YZXYS, //已执行预算
            canExecuteMoney: obj.KZXYS, //可执行预算
            executeRate: obj.ZXL, //执行率

            approvalMoney: obj.YLXYS, //已立项金额
            canApprovalMoney: obj.SYYS, //可立项金额
            approvalRate: obj.LXL, //立项率
          };
          // console.log('科研的数据', obj, formatBudgetResult);
          setProjectData(formatBudgetResult);
          break;
      }
    }

    setIsGlobalLoading(false);
  };

  /** 分页数据改变 */
  const paginationChangeHandle = (pagination, filters, sorter, extra) => {
    const { current, pageSize } = pagination;
    setCurPageNum(current);
    setPageSize(pageSize);
  };

  useEffect(() => {
    queryhandle().catch(err => {
      message.error(`查询预算数据失败${err}`);
      setIsGlobalLoading(false);
    });
  }, [curPageNum, pageSize, budgetIdRef.current]);

  //是否显示金额
  const isShowMoney = (fzrId, rowXmjlId) =>
    isLeader ||
    String(userBasicInfo.id) === String(fzrId) ||
    String(userBasicInfo.id) === String(rowXmjlId);

  /** 表格配置 */
  const tableColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      // width: '25%',
      key: 'projectName',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.projectStatus !== '草稿')
          return (
            <Tooltip title={text} placement="topLeft">
              <Link
                style={{ color: '#3361ff' }}
                to={{
                  pathname: `/pms/manage/ProjectDetail/${EncryptBase64(
                    JSON.stringify({
                      xmid: row.projectId,
                    }),
                  )}`,
                  state: {
                    routes,
                  },
                }}
                className="table-link-strong"
              >
                {text}
              </Link>
            </Tooltip>
          );
        return (
          <Tooltip title={text} placement="topLeft">
            <span style={{ cursor: 'default' }}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '项目经理',
      dataIndex: 'projectManager',
      width: '10%',
      key: 'projectManager',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.projectStatus !== '草稿')
          return (
            <Link
              style={{ color: '#3361ff' }}
              to={{
                pathname: `/pms/manage/staffDetail/${EncryptBase64(
                  JSON.stringify({
                    ryid: row.projectManagerId,
                  }),
                )}`,
                state: {
                  routes,
                },
              }}
              className="table-link-strong"
            >
              {text}
            </Link>
          );
        return <span>{text}</span>;
      },
    },
    {
      title: '项目金额（元）',
      dataIndex: 'projectMoney',
      width: '14%',
      key: 'projectMoney',
      ellipsis: true,
      render: (text, row, index) =>
        isShowMoney(projectData.responsiblePeopleId, row.projectManagerId) ? (
          <Tooltip title={text === undefined ? '' : momneyFormatter(text)} placement="topLeft">
            <span style={{ cursor: 'default' }}>
              {text === undefined ? '' : momneyFormatter(text)}
            </span>
          </Tooltip>
        ) : (
          '***'
        ),
    },
    {
      title: '合同金额（元）',
      dataIndex: 'contractMoney',
      width: '14%',
      key: 'contractMoney',
      ellipsis: true,
      render: (text, row, index) =>
        isShowMoney(projectData.responsiblePeopleId, row.projectManagerId) ? (
          <Tooltip title={momneyFormatter(text)} placement="topLeft">
            <span style={{ cursor: 'default' }}>{momneyFormatter(text)}</span>
          </Tooltip>
        ) : (
          '***'
        ),
    },
    {
      title: '已付款金额(元）',
      dataIndex: 'payedMoney',
      width: '14%',
      key: 'payedMoney',
      ellipsis: true,
      render: (text, row, index) =>
        isShowMoney(projectData.responsiblePeopleId, row.projectManagerId) ? (
          <Tooltip title={momneyFormatter(text)} placement="topLeft">
            <span style={{ cursor: 'default' }}>{momneyFormatter(text)}</span>
          </Tooltip>
        ) : (
          '***'
        ),
    },
    {
      title: '未付款金额(元）',
      dataIndex: 'unpayedMoney',
      width: '14%',
      key: 'unpayedMoney',
      ellipsis: true,
      render: (text, row, index) =>
        isShowMoney(projectData.responsiblePeopleId, row.projectManagerId) ? (
          <Tooltip title={momneyFormatter(text)} placement="topLeft">
            <span style={{ cursor: 'default' }}>{momneyFormatter(text)}</span>
          </Tooltip>
        ) : (
          '***'
        ),
    },
    {
      title: '付款率',
      dataIndex: 'payRate',
      width: '7%',
      key: 'payRate',
      ellipsis: true,
      render: (text, row, index) => {
        return isShowMoney(projectData.responsiblePeopleId, row.projectManagerId) ? (
          <Tooltip title={text} placement="topLeft">
            <span style={{ cursor: 'default' }}>
              {text}%
            </span>
          </Tooltip>
        ) : (
          '***'
        );
      },
    },
  ];

  return (
    <div className="Component_CustomTable">
      <div className="Component_CustomTable_title">预算使用情况</div>

      <div className="Component_CustomTable_table">
        <Table
          columns={tableColumns}
          rowKey={'XMID'}
          dataSource={tableData}
          onChange={paginationChangeHandle}
          pagination={{
            current: curPageNum,
            pageSize: pageSize,
            pageSizeOptions: ['20', '40', '50', '100'],
            showSizeChanger: true,
            hideOnSinglePage: false,
            showQuickJumper: true,
            showTotal: val => `共 ${val} 条数据`,
          }}
        ></Table>
      </div>
    </div>
  );
};

export default CustomTable;
