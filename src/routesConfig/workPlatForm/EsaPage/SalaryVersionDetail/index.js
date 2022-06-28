const prefix = '/salaryVersionDetail';
const suffix = 'versionData';

exports.routes = [
  {
    path: `${prefix}/`,
    models: () => [
      import('../models/workPlatForm/EsaPage/EsaVersion/salaryVersionDetail'),
    ],
    component: '../layouts/workPlatForm/EsaPage/salaryVersionDetail/PageLayout',
    routes: [
      { // 基本信息
        path: `${prefix}/basicInfo/:${suffix}`,
        component: '../components/WorkPlatForm/EsaPage/EsaVersion/VersionConfig/salaryVersionDetail/BasicInfo',
      },
      { // 系统指标代码
        path: `${prefix}/systemIndiCode/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/SystemIndiCode',
      },
      { // 系统指标参数
        path: `${prefix}/systemIndiParams/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/SystemIndiParams',
      },
      { // 提成公式定义
        path: `${prefix}/commissionFormulaDefinition/:${suffix}`,
        models: () => [
          import('../models/workPlatForm/EsaPage/RetailAssessment/SalaryCommissionManage/CommissionFormulaDefinition'),
        ],
        component: './workPlatForm/EsaPage/RetailAssessment/SalaryCommissionManage/CommissionFormulaDefinition',
      },
      { // 提成模板定义
        path: `${prefix}/commissionTmpDef/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/CommissionTmpDef',
      },
      { // 绩效考核指标管理
        path: `${prefix}/assessmentIndiManage/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/AssessmentIndiManage',
      },
      { // 级别考核方案定义
        path: `${prefix}/levelAssessmentDef/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/LevelAssessmentDef',
      },
      { // 薪酬模板公式
        path: `${prefix}/payTmplFmla/:${suffix}`,
        component: './workPlatForm/EsaPage/EsaVersion/LBUiTable/PayTmplFmla',
      },
      { // 薪酬项
        path: `${prefix}/salaryProjectManage/:${suffix}`,
        component: './workPlatForm/EsaPage/RetailAssessment/SalaryManage/SalaryProjectManage',
      },
    ],
  },
];
