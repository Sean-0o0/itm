// 企划
const prefix = '/esa/planning';
exports.routes = [
  { // 考核方案列表
    path: `${prefix}/evaluationSchemeListPage`,
    component: './workPlatForm/planningPage/EvaluationSchemeList',
  },
  // <Route exact path={`${parentUrl}/departmentAssessPlan`} render={props => <DepartmentAssessPlan {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
  { // 新增职能部门
    path: `${prefix}/departmentAssessPlan`,
    component: './workPlatForm/planningPage/SinglePage/AccessPlan/DepartmentAssessPlan',
  },
  { // 修改职能部门
    path: `${prefix}/departmentAssessPlanModify/:params`,
    component: './workPlatForm/planningPage/SinglePage/AccessPlan/DepartmentAssessPlanModify',
  },
  { // 新增业务条线
    // <Route exact path={`${parentUrl}/bussinessAssessment/:params`} render={props => <BussinessAssessment {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
    path: `${prefix}/bussinessAssessment/:params`,
    component: './workPlatForm/planningPage/SinglePage/AccessPlan/BussinessAssessment',
  },
  { // 修改业务条线
    // <Route exact path={`${parentUrl}/bussinessAssessmentModify/:params`} render={props => <BussinessAssessmentModify {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
    path: `${prefix}/bussinessAssessmentModify/:params`,
    component: './workPlatForm/planningPage/SinglePage/AccessPlan/BussinessAssessmentModify',
  },
  { // 意见反馈
    path: `${prefix}/adviceFeedback`,
    component: './workPlatForm/planningPage/AccessPlan/AdviceFeedback',
  },
  { // 考核方案详细说明
    path: `${prefix}/accessPlanDetail/:params`,
    component: './workPlatForm/planningPage/AccessPlan/AccessPlanDetail',
  },
  { // 整体规划
    path: `${prefix}/integratedPlanning`,
    component: './workPlatForm/planningPage/IntegratedPlanning',
  },
  {
    //考核跟踪表页面
    path: `${prefix}/assessmentTrackingTable/:params`,
    component: './workPlatForm/planningPage/AssessmentTracking/AssessmentTrackingTable'
  },
  {
    //考核跟踪首页
    path: `${prefix}/assessmentTrackingPage`,
    component: './workPlatForm/planningPage/AssessmentTracking/AssessmentTrackingPage'
  },
  { // 预算项目管理
    path: `${prefix}/budgetProjectManage`,
    component: './workPlatForm/planningPage/BudgetManage/BudgetProjectManage',
  },
  // { // 有参数经营分析
  //   path: `${prefix}/businessAnalysis/:params`,
  //   component: './workPlatForm/planningPage/BusinessAnalysis/BusinessAnalysisTabs',
  // },
  { // 无参数经营分析-初始化进入页面
    path: `${prefix}/businessAnalysis`,
    component: './workPlatForm/planningPage/BusinessAnalysis/BusinessAnalysisTabs',
  },
  { // 业务类-营业收入-明细页面
    path: `${prefix}/businessIncome/:params`,
    component: './workPlatForm/planningPage/BusinessAnalysis/BussinessIncomePage',
  },
  { // 财富管理
    path: `${prefix}/WealthManagement/:params`,
    component: './workPlatForm/planningPage/BusinessAnalysis/WealthManagement',
  },
  { // 考核方案审批流程
    path: `${prefix}/ApprovalProcess`,
    component: './workPlatForm/planningPage/ApprovalProcessPage',
  },
  { // 经营责任书列表
    path: `${prefix}/busResponListPage`,
    component: './workPlatForm/planningPage/BusResponListPage',
  },
  { // 经营责任书详细页面
    path: `${prefix}/busResponDetail/:params`,
    component: './workPlatForm/planningPage/BusRespon/BusResponDetail',
  },
  { // 意见反馈
    path: `${prefix}/busAdviceFeedback`,
    component: './workPlatForm/planningPage/BusRespon/BusAdviceFeedback',
  },
  { // 新增经营责任书
    // <Route exact path={`${parentUrl}/bussinessAssessment/:params`} render={props => <BussinessAssessment {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
    path: `${prefix}/bussinessResponse/:params`,
    component: './workPlatForm/planningPage/SinglePage/BusRespon/BussinessResponse',
  },
  { // 修改经营责任书
    // <Route exact path={`${parentUrl}/bussinessAssessmentModify/:params`} render={props => <BussinessAssessmentModify {...props} onSubmitOperate={this.onSubmitOperate} onCancelOperate={this.onCancelOperate} />} />
    path: `${prefix}/bussinessResponseModify/:params`,
    component: './workPlatForm/planningPage/SinglePage/BusRespon/BussinessResponseModify',
  },
  { // 经营责任书审批流程
    path: `${prefix}/BusApprovalProcess`,
    component: './workPlatForm/planningPage/BusApprovalProcessPage',
  },

  // 整体规划V2版本-----------------------------------------------------------
  { // 整体规划V2-公司经营计划
    path: `${prefix}/CompanyBusinessPlanV2`,
    component: './workPlatForm/planningPage/IntegratedPlanningV2/CompanyBusinessPlanV2',
  },
  { // 整体规划V2-当年公司规划--总体规划
    path: `${prefix}/CompanyPastPlanV2`,
    component: './workPlatForm/planningPage/IntegratedPlanningV2/CompanyPastPlanV2',
  },
  { // 整体规划V2-利润预算表
    path: `${prefix}/CompanyProfitBudgetV2`,
    component: './workPlatForm/planningPage/IntegratedPlanningV2/CompanyProfitBudgetV2',
  },
  //考核方案列表V2版本----------------------------------------------------------
  { // 高管-考核方案列表
    path: `${prefix}/AssessPlanLeadList`,
    component: './workPlatForm/planningPage/EvaluationSchemeListV2/AssessPlanLeadList',
  },
  { // 总裁助理-考核方案列表
    path: `${prefix}/AssessExecutivePlanList`,
    component: './workPlatForm/planningPage/EvaluationSchemeListV2/AssessExecutivePlan',
  },
  { // 业务条线-考核方案列表
    path: `${prefix}/BussinessAssessmentList`,
    component: './workPlatForm/planningPage/EvaluationSchemeListV2/BussinessAssessmentList',
  },
  { // 职能部门-考核方案列表
    path: `${prefix}/DepartmentAssessPlanList`,
    component: './workPlatForm/planningPage/EvaluationSchemeListV2/DepartmentAssessPlan',
  },
  //考核方案详情页面V2版本----------------------------------------------------------
  { // 高管-考核方案详细说明
    path: `${prefix}/AesaccessPlanDetail/:params`,
    component: './workPlatForm/planningPage/AccessPlanV2/AssessPlanLead/AccessPlanDetail',
  },
  { // 总裁助理-考核方案详细说明
    path: `${prefix}/AssessExecutivePlanDetail/:params`,
    component: './workPlatForm/planningPage/AccessPlanV2/AssessExecutivePlan/AccessPlanDetail',
  },
  { // 业务条线-考核方案详细说明
    path: `${prefix}/BusaccessPlanDetail/:params`,
    component: './workPlatForm/planningPage/AccessPlanV2/BussinessAssessment/AccessPlanDetail',
  },
  { // 职能部门-考核方案详细说明
    path: `${prefix}/DepaccessPlanDetail/:params`,
    component: './workPlatForm/planningPage/AccessPlanV2/DepartmentAssessPlan/AccessPlanDetail',
  },
  //行业动态react页面----------------------------------------------------------
  { // 行业动态
    path: `${prefix}/IndustryDynamics`,
    component: './workPlatForm/planningPage/SinglePage/IndustryDynamics',
  },
  //资源配置react页面----------------------------------------------------------
  { // 资源配置
    path: `${prefix}/ResourceAllocation`,
    component: './workPlatForm/planningPage/ResourceAllocationTabs',
  },
  { // 专项规划详情页
    path: `${prefix}/CompanySpecialPlanning/:params`,
    component: './workPlatForm/planningPage/IntegratedPlanningV2/CompanySpecialPlanning',
  },
  { // 子分规划详情页
    path: `${prefix}/CompanySubPlanning/:params`,
    component: './workPlatForm/planningPage/IntegratedPlanningV2/CompanySubPlanning',
  },
  { // 专项规划
    path: `${prefix}/CompanySpecialList`,
    component: './workPlatForm/planningPage/IntegratedPlanningV2/CompanySpecialList',
  },
  { // 子分规划
    path: `${prefix}/CompanySubList`,
    component: './workPlatForm/planningPage/IntegratedPlanningV2/CompanySubList',
  },
];
