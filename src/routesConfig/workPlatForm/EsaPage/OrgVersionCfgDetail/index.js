const prefix = '/orgVersionCfgDetail';
const suffix = 'versionData';

exports.routes = [
  {
    path: `${prefix}/`,
    models: () => [
      import('../models/workPlatForm/EsaPage/EsaVersion/orgVersionCfgDetail'),
    ],
    component: '../layouts/workPlatForm/EsaPage/orgVersionCfgDetail/PageLayout',
    routes: [
      // 绩效考核
      { // 绩效考核方案
        path: `${prefix}/appraisalPlan/:${suffix}`,
        component: './workPlatForm/EsaPage/RetailAssessment/PerformanceAppraisal/AppraisalPlan',
      },
      { // 个人绩效考核方案
        path: `${prefix}/personalAppraisalPlan/:${suffix}`,
        component: './workPlatForm/EsaPage/RetailAssessment/PerformanceAppraisal/PersonalAppraisalPlan',
      },
      { // 薪酬方案设置
        path: `${prefix}/salaryPlanSettings/:${suffix}`,
        models: () => [
          import('../models/workPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryPlanSettings'),
        ],
        component: './workPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryPlanSettings',
      },
      { // 级别方案配置
        path: `${prefix}/levelProgramConfig/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/LevelProgramConfig',
      },
      { // 级别生效方案
        path: `${prefix}/levelEffectProgram/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/LevelEffectProgram',
      },
      { // 营业部提成方式
        path: `${prefix}/orgCommissionMode/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/OrgCommissionMode',
      },
      { // 人员提成方式
        path: `${prefix}/empCommissionMode/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/EmpCommissionMode',
      },
      { // 客户提成方式
        path: `${prefix}/custCommissionMode/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/CustCommissionMode',
      },
    ],
  },
];
