export default [
  //planning.v1.queryIndiList 单独弹窗页面
  { code: '506220', key: 'queryIndiList', url: '/planning/v1/queryIndiList', dis: '可选指标列表查询' },

  //planning下页面url
  { code: '506247', key: 'queryAssessPlanList', url: '/planning/v1/queryAssessPlanList', dis: '查询考核方案列表' },

  { code: '506203', key: 'queryLegalNote', url: '/planning/v1/queryLegalNote', dis: '考核方案设计时查询需展示考核说明信息' },
  { code: '506204', key: 'queryOrgList', url: '/planning/v1/queryOrgList', dis: '查询组织机构信息' },
  { code: '506221', key: 'addFuncAssessPlan', url: '/planning/v1/addFuncAssessPlan', dis: '新增职能部门考核方案' },

  //考核跟踪页面
  { code: '506230', key: 'queryAssessTrackPlanDetail', url: '/planning/v1/queryAssessTrackPlanDetail', dis: '考核跟踪方案跟踪指标详情查询' },
  { code: '506231', key: 'queryAssessTrackPlanIndiSched', url: '/planning/v1/queryAssessTrackPlanIndiSched', dis: '考核跟踪方案跟踪指标完成进度' },
  { code: '506232', key: 'queryAssessTrackPlanIndiVal', url: '/planning/v1/queryAssessTrackPlanIndiVal', dis: '考核跟踪方案跟踪指标值变化情况' },
  { code: '506229', key: 'queryAssessTrackPlan', url: '/planning/v1/queryAssessTrackPlan', dis: '考核跟踪方案明细查看' },
  { code: '506227', key: 'addAssessTrackPlan', url: '/planning/v1/addAssessTrackPlan', dis: '考核跟踪方案新增' },
  { code: '506228', key: 'updateAssessTrackPlan', url: '/planning/v1/updateAssessTrackPlan', dis: '考核跟踪方案修改' },
  { code: '506209', key: 'queryAssessPlanFuncDetail', url: '/planning/v1/queryAssessPlanFuncDetail', dis: '职能部门考核方案明细查看' },
  { code: '506209', key: 'queryHisAssessPlanFuncDetail', url: '/planning/v1/queryHisAssessPlanFuncDetail', dis: '职能部门考核方案明细查看--查询历史接口' },
  { code: '506222', key: 'updateFuncAssessPlan', url: '/planning/v1/updateFuncAssessPlan', dis: '修改职能部门考核方案' },



  //意见反馈
  { code: '506213', key: 'queryOptList', url: '/planning/v1/queryOptList', dis: '查询意见反馈列表' },
  { code: '506206', key: 'queryOptionRela', url: '/planning/v1/queryOptionRela', dis: '查询我有权限进行意见反馈的方案' },
  { code: '506207', key: 'queryAssessPlanBusDetail', url: '/planning/v1/queryAssessPlanBusDetail', dis: '业务条线考核方案明细查看' },
  { code: '506207', key: 'queryHisAssessPlanBusDetail', url: '/planning/v1/queryHisAssessPlanBusDetail', dis: '业务条线考核方案明细查看--查询历史接口' },
  { code: '506209', key: 'queryAssessPlanFuncDetail', url: '/planning/v1/queryAssessPlanFuncDetail', dis: '职能部门考核方案明细查看' },
  { code: '506212', key: 'queryOptOprAuth', url: '/planning/v1/queryOptOprAuth', dis: '登录人员意见反馈操作页面按钮权限' },
  { code: '506219', key: 'grantOption', url: '/planning/v1/grantOption', dis: '意见反馈授权' },
  { code: '506221', key: 'addOption', url: '/planning/v1/addOption', dis: '意见反馈新增' },
  { code: '506217', key: 'oprOption', url: '/planning/v1/oprOption', dis: '意见反馈处理' },
  { code: '506215', key: 'updateOption', url: '/planning/v1/updateOption', dis: '意见反馈修改' },
  { code: '506216', key: 'deleteOption', url: '/planning/v1/deleteOption', dis: '意见反馈删除' },
  { code: '506211', key: 'queryHisAssessPlanList', url: '/planning/v1/queryHisAssessPlanList', dis: '查询考核方案历史版本流水' },
  { code: '506218', key: 'updateOprOption', url: '/planning/v1/updateOprOption', dis: '意见反馈处理结果修改' },
  { code: '506248', key: 'createPlanWord', url: '/planning/v1/createPlanWord', dis: '考核方案生成' },

  //考核跟踪首页
  { code: '506235', key: 'queryTrackIndiOrg', url: '/planning/v1/queryTrackIndiOrg', dis: '考核跟踪方案首页各业务指标情况' },
  { code: '506236', key: 'queryTrackIndiFirst', url: '/planning/v1/queryTrackIndiFirst', dis: '考核跟踪首页模块1指标查询' },
  { code: '506237', key: 'queryTrackIndiSecond', url: '/planning/v1/queryTrackIndiSecond', dis: '考核跟踪首页模块2指标查询' },
  { code: '506238', key: 'queryTrackIndiThird', url: '/planning/v1/queryTrackIndiThird', dis: '考核跟踪首页模块3指标查询' },

  //新增业务条线考核方案
  { code: '506205', key: 'queryDefIndi', url: '/planning/v1/queryDefIndi', dis: '考核方案设计时查询基础指标默认展示内容' },
  { code: '506239', key: 'queryUserList', url: '/planning/v1/queryUserList', dis: '查询人员方案' },
  { code: '506201', key: 'addAssessPlan', url: '/planning/v1/addAssessPlan', dis: '新增业务条线考核方案' },
  { code: '506242', key: 'addAssessPlanLegalNote', url: '/planning/v1/addAssessPlanLegalNote', dis: '考核方案法律条文写入' },
  { code: '506202', key: 'updateAssessPlan', url: '/planning/v1/updateAssessPlan', dis: '修改业务条线考核方案' },
  //planning.v1.updateAssessPlan

  //整体规划
  { code: '506223', key: 'queryCompanyPlanYear', url: '/planning/v1/queryCompanyPlanYear', dis: '查询公司当年规划' },
  { code: '506224', key: 'queryCompanyProfitBudget', url: '/planning/v1/queryCompanyProfitBudget', dis: '查询公司当年利润规划表' },
  { code: '506225', key: 'queryCompanyBusplan', url: '/planning/v1/queryCompanyBusplan', dis: '查询公司经营计划' },
  { code: '506243', key: 'queryCompanyBusplanBreak', url: '/planning/v1/queryCompanyBusplanBreak', dis: '查询公司经营计划分解结果详情' },
  { code: '506241', key: 'breakCompanyBusplan', url: '/planning/v1/breakCompanyBusplan', dis: '公司经营计划分解' },
  { code: '506244', key: 'exportCompanyProfitBudget', url: '/planning/v1/exportCompanyProfitBudget', dis: '导出利润预算表' },
  { code: '506245', key: 'exportCompanyPlanYear', url: '/planning/v1/exportCompanyPlanYear', dis: '导出当年公司规划' },
  { code: '506246', key: 'loadAssessPlanData', url: '/planning/v1/loadAssessPlanData', dis: '导入数据后处理过程' },
  // queryCompanyPlanYear queryCompanyProfitBudget queryCompanyBusplan

  // 预算管理
  { code: '516301', key: 'operateBudgetTemplateConf', url: '/budgetManagement/v1/operateBudgetTemplateConf', dis: '预算模板配置:预算新增|修改|删除' },
  { code: '516302', key: 'queryInfoBudgetTemplateConf', url: '/budgetManagement/v1/queryInfoBudgetTemplateConf', dis: '查询预算模板配置' },
  { code: '516303', key: 'queryListBudgetFormula', url: '/budgetManagement/v1/queryListBudgetFormula', dis: '查询预算代码公式列表' },
  { code: '516304', key: 'queryListBudgetCode', url: '/budgetManagement/v1/queryListBudgetCode', dis: '查询预算代码列表' },
  { code: '516305', key: 'operateBudgetFormulaDef', url: '/budgetManagement/v1/operateBudgetFormulaDef', dis: '预算代码公式定义操作' },
  { code: '516306', key: 'operateBudgetProject', url: '/budgetManagement/v1/operateBudgetProject', dis: '预算项目操作' },
  { code: '516307', key: 'queryBudgetFormulaConf', url: '/budgetManagement/v1/queryBudgetFormulaConf', dis: '查询预算公式配置项目' },
  { code: '516308', key: 'queryInfoBudgetFormulaDef', url: '/budgetManagement/v1/queryInfoBudgetFormulaDef', dis: '查询预算代码公式定义' },

  // 经营分析
  { code: '506252', key: 'queryBusAnalBusiness', url: '/planning/v1/queryBusAnalBusiness', dis: '经营分析业务类指标分析' },
  { code: '506253', key: 'queryBusAnalBusinessDril', url: '/planning/v1/queryBusAnalBusinessDril', dis: '经营分析业务类指标钻取' },
  { code: '506254', key: 'queryBusAnalBusinessDetail', url: '/planning/v1/queryBusAnalBusinessDetail', dis: '经营分析业务类指标明细' },
  { code: '506245', key: 'exportWealthDetail', url: '/planning/v1/exportWealthDetail', dis: '导出指标明细' },
  { code: '506248', key: 'queryBusAnalFinanceFirst', url: '/planning/v1/queryBusAnalFinanceFirst', dis: '经营分析财务类核心指标' },
  { code: '506249', key: 'queryBusAnalFinanceSecond', url: '/planning/v1/queryBusAnalFinanceSecond', dis: '经营分析财务类指标分析' },
  { code: '506256', key: 'queryFinanceIndexAnalysis', url: '/planning/v1/queryFinanceIndexAnalysis', dis: '经营分析财务类指标详情选项' },
  { code: '506256', key: 'queryBusAnalFinanceSecondDril', url: '/planning/v1/queryBusAnalFinanceSecondDril', dis: '经营分析财务类指标分析（可选）指标下钻' },

  //考核方案审批流程
  { code: '506257', key: 'queryAssessPlanWfList', url: '/planning/v1/queryAssessPlanWfList', dis: '考核方案审批流程列表查询接口钻' },
  // 2、考核方案审批流程意见列表接口 planning.v1.queryAssessPlanWfOption
  { code: '506258', key: 'queryAssessPlanWfOption', url: '/planning/v1/queryAssessPlanWfOption', dis: '考核方案审批流程意见列表接口' },
  //3、考核方案审批用户可操作按钮查询接口 planning.v1.queryAssessPlanWfAction
  { code: '506259', key: 'queryAssessPlanWfAction', url: '/planning/v1/queryAssessPlanWfAction', dis: '考核方案审批用户可操作按钮查询接口' },
  //4、考核方案流程审批操作接口 planning.v1.auditAssessPlanWf
  { code: '506260', key: 'auditAssessPlanWf', url: '/planning/v1/operateAuditAssessPlanWf', dis: '考核方案流程审批操作接口' },
  //  506260  考核方案意见征求发起,
  { code: '506260 ', key: 'assessPlanOptStart', url: '/planning/v1/assessPlanOptStart', dis: '考核方案意见征求发起' },
  //  506261 考核方案审核流程发起,
  { code: '506261', key: 'assessPlanWfStart', url: '/planning/v1/assessPlanWfStart', dis: '考核方案审核流程发起' },
  //  506262 考核方案发布,
  { code: '506262', key: 'assessPlanRelease', url: '/planning/v1/assessPlanRelease', dis: '考核方案发布' },

  // 经营责任书列表相关接口----------------------------------------------
  // 查询经营责任书列表
  { code: '506264', key: 'queryBusResponList', url: '/planning/v1/queryBusResponList', dis: '查询经营责任书列表' },
  // 新增业务条线经营责任书
  { code: '506265', key: 'addBusRespon', url: '/planning/v1/addBusRespon', dis: '新增业务条线经营责任书' },
  // 修改业务条线经营责任书
  { code: '506266', key: 'updateBusRespon', url: '/planning/v1/updateBusRespon', dis: '修改业务条线经营责任书' },
  // 经营责任书审核流程发起
  { code: '506267', key: 'startBusResponWorkflow', url: '/planning/v1/startBusResponWorkflow', dis: '经营责任书审核流程发起' },
  // 经营责任书明细查看
  { code: '506269', key: 'queryBusResponDetail', url: '/planning/v1/queryBusResponDetail', dis: '经营责任书明细查看' },
  // 经营责任书历史版本明细查看
  { code: '506270', key: 'queryHisBusResponDetail', url: '/planning/v1/queryHisBusResponDetail', dis: '经营责任书历史版本明细查看' },
  // 经营责任书审批流程列表
  { code: '506271', key: 'queryBusResponWfList', url: '/planning/v1/queryBusResponWfList', dis: '经营责任书审批流程列表' },
  // 经营责任书流程审批操作
  { code: '506272', key: 'auditBusResponWorkflow', url: '/planning/v1/auditBusResponWorkflow', dis: '经营责任书流程审批操作' },
  // 经营责任书设计时查询需展示考核说明信息
  { code: '506273', key: 'queryBusResponLegalNote', url: '/planning/v1/queryBusResponLegalNote', dis: '经营责任书设计时查询需展示考核说明信息' },
  // 查询我有权限进行意见反馈的经营责任书
  { code: '506274', key: 'queryBusResponOptionRela', url: '/planning/v1/queryBusResponOptionRela', dis: '查询我有权限进行意见反馈的经营责任书' },
  // 责任书方案pdf/word导出
  { code: '506248', key: 'createPlanWordForBusRespon', url: '/planning/v1/createPlanWordForBusRespon', dis: '责任书方案导出' },

  //行业动态的接口----------------------------------------------------
  //查询行业动态信息
  { code: '506275', key: 'queryIndustryNews', url: '/planning/v1/queryIndustryNews', dis: '查询行业动态信息' },
  //查询授权人员
  { code: '506276', key: 'queryAuthorizedRecycling', url: '/planning/v1/queryAuthorizedRecycling', dis: '查询授权人员' },
  //授权回收
  { code: '506277', key: 'updateAuthorizedRecycling', url: '/planning/v1/updateAuthorizedRecycling', dis: '授权回收' },
  //查询总体配置资源
  { code: '506278', key: 'queryResourceAllocation', url: '/planning/v1/queryResourceAllocation', dis: '查询总体配置资源' },
  //修改总体配置资源
  { code: '506279', key: 'modResourceAllocationDeal', url: '/planning/v1/modResourceAllocationDeal', dis: '修改总体配置资源' },
  //导出配置资源
  { code: '506280', key: 'exportResourceAllocation', url: '/planning/v1/exportResourceAllocation', dis: '修改总体配置资源' },
  //查询行业动态评论信息
  { code: '506281', key: 'queryNewsComment', url: '/planning/v1/queryNewsComment', dis: '查询行业动态评论信息' },
  //编辑行业动态评论信息
  { code: '506281', key: 'modNewsComment', url: '/planning/v1/modNewsComment', dis: '编辑行业动态评论信息' },
  //专项规划详情
  { code: '506282', key: 'querySpecialPlanZXZB', url: '/planning/v1/querySpecialPlanZXZB', dis: '查询专项规划' },
   //子分规划详情
   { code: '506282', key: 'queryDepartmentPlanZFZB', url: '/planning/v1/queryDepartmentPlanZFZB', dis: '查询专项规划' },
   //查询行业动态分类
   { code: '506283', key: 'queryNewsCateg', url: '/planning/v1/queryNewsCateg', dis: '查询行业动态分类' },
   //专项规划
  { code: '506284', key: 'queryTspecial', url: '/planning/v1/queryTspecial', dis: '查询专项规划' },
  //子分规划
  { code: '506285', key: 'queryTdepartment', url: '/planning/v1/queryTdepartment', dis: '查询专项规划' },
];
