// 薪酬
const prefix = '/esa';
exports.routes = [
    // 薪酬考核导航
    { // 客户经理薪酬考核导航
      path: `${prefix}/accountManager`,
      component: './workPlatForm/EsaPage/RetailAssessment/BusinessNavigation/AccountManager',
    },
    { // 证券经纪人考核薪酬
      path: `${prefix}/assessmentSalary`,
      component: './workPlatForm/EsaPage/RetailAssessment/BusinessNavigation/AssessmentSalary',
    },
    { // 管理服务人员考核
      path: `${prefix}/manageServiceStaff`,
      component: './workPlatForm/EsaPage/RetailAssessment/BusinessNavigation/ManageServiceStaff',
    },
    { // 理财服务人员考核
      path: `${prefix}/financialServiceStaff`,
      component: './workPlatForm/EsaPage/RetailAssessment/BusinessNavigation/FinancialServiceStaff',
    },
    { // 核对薪酬
      path: `${prefix}/checkSalary/:params?`,
      component: './workPlatForm/EsaPage/RetailAssessment/BusinessNavigation/CheckSalary',
    },
    // 薪酬考核导航整合页面
    {
      path: `${prefix}/navigationCommon`,
      component: './workPlatForm/EsaPage/RetailAssessment/BusinessNavigation/NavigationCommon',
    },
    // 绩效考核
    { // 绩效考核方案
      path: `${prefix}/appraisalPlan`,
      component: './workPlatForm/EsaPage/RetailAssessment/PerformanceAppraisal/AppraisalPlan',
    },
    { // 个人绩效考核方案
      path: `${prefix}/personalAppraisalPlan`,
      component: './workPlatForm/EsaPage/RetailAssessment/PerformanceAppraisal/PersonalAppraisalPlan',
    },
    // 薪酬管理
    { // 薪酬项目管理
      path: `${prefix}/salaryProjectManage`,
      component: './workPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryProjectManage',
    },
    { // 薪酬方案设置
      path: `${prefix}/salaryPlanSettings`,
      models: () => [
        import('../models/workPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryPlanSettings'),
      ],
      component: './workPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryPlanSettings',
    },
    // 薪酬提成管理
    { // 提成公式定义
      path: `${prefix}/commissionFormulaDefinition`,
      models: () => [
        import('../models/workPlatForm/EsaPage/RetailAssessment/SalaryCommissionManage/CommissionFormulaDefinition'),
      ],
      component: './workPlatForm/EsaPage/RetailAssessment/SalaryCommissionManage/CommissionFormulaDefinition',
    },
    // 级别考核
    { // 级别考核方案定义
      path: `${prefix}/gradeAssessmentPlanDefinition`,
      component: './workPlatForm/EsaPage/RetailAssessment/GradeAssessment/GradeAssessmentPlanDefinition',
    },
    // 计算规则定义
    { // 系统指标代码
      path: `${prefix}/systemIndicatorCode`,
      component: './workPlatForm/EsaPage/RetailAssessment/ParameterSetting/SystemIndicatorCode',
    },

    // 系统配置
    { // 清洗加工调度
      path: `${prefix}/cleaningProcessingScheduling`,
      component: './workPlatForm/EsaPage/SystemConfiguration/CleaningProcessingScheduling',
    },

    // 人力考评
    { // 考评人员结构配置
      path: `${prefix}/assesstorStructureConfiguration`,
      component: './workPlatForm/EsaPage/HumanAssessment/AssesstorStructureConfiguration',
    },

    // 机构考核
    // 考核方案配置
    { // 考核项管理
      path: `${prefix}/assessmentItemManagement`,
      component: './workPlatForm/EsaPage/OrganizationAssessment/AssessmentPlanConfiguration/AssessmentItemManagement',
    },

    // 薪酬考核版本
    { // 版本配置表
      path: `${prefix}/versionConfig`,
      component: './workPlatForm/EsaPage/EsaVersion/VersionConfig',
    },
    { // 营业部薪酬版本配置表
      path: `${prefix}/orgVersionConfig`,
      component: './workPlatForm/EsaPage/EsaVersion/OrgVersionConfig',
    },
    { // 考核评分列表v1
      path: `${prefix}/evaluation/v1/assessmentList`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v1/AssessmentList',
    },
    { // 考核须知
      path: `${prefix}/evaluation/v1/assessmentNotice/:params`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v1/AssessmentNotice',
    },
    { // 考核表
      path: `${prefix}/evaluation/v1/assessmentTable/:params`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v1/AssessmentTable',
    },
    { // 考核评分列表v2
      path: `${prefix}/evaluation/v2/assessmentList`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v2/AssessmentList',
    },
    { // 各类型打分
      path: `${prefix}/evaluation/v2/variousTypeScore/:params`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v2/VariousTypeScore',
    },
    { // 考评汇总
      path: `${prefix}/evaluation/v2/leaderEvaluate`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v2/LeaderEvaluate',
    },
    { // 职能考评
      path: `${prefix}/evaluation/v3/BusEvaluate`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v3/BusEvaluate',
    },
    { // 部门考评
      path: `${prefix}/evaluation/v3/DepEvaluate`,
      component: './workPlatForm/EsaPage/AssessmentEvaluation/v3/DepEvaluate',
    },
];

