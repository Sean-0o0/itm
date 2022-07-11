const prefix = '';
// 其他不相干路由
exports.routes = [
  
  { // 业务导航
    path: `${prefix}/staffAdmission`,
    // models: () => [import('../models/workPlatForm/mainPage/staff/staffAdmission')],
    component:'./workPlatForm/mainPage/businessNavigate/staffAdmission',
  },

  { // 正在开发中
    path: `${prefix}/WarningPage`,
    component: '../components/Common/WarningPage',
  },
  
];
