const exceptionRoutes = require('./Exception');
const exceptionRoutesConfig = exceptionRoutes.routes;
const loginRoutes = require('./login');
const loginRoutesConfig = loginRoutes.routes;
const testPageRoutes = require('./testPage');
const testPageRoutesConfig = testPageRoutes.routes;
const mainPageRoutes = require('./workPlatForm/mainPage');
const mainPageRoutesConfig = mainPageRoutes.routes;
const IconFontRoutes = require('./IconFont');
const IconFontRoutesConfig = IconFontRoutes.routes;
const testPaperPanoramaRoutes = require('./workPlatForm/testPaper');
const testPaperPanoramaRoutesConfig = testPaperPanoramaRoutes.routes;
const largeScreenRoutes = require('./largeScreen');
const largeScreenRoutesConfig = largeScreenRoutes.routes;
const taskCenterRoutes = require('./taskCenter');
const taskCenterRoutesConfig = taskCenterRoutes.routes;
const singlePageRoutes = require('./workPlatForm/singlePage');
const singlePageRoutesConfig = singlePageRoutes.routes;
const motProductionRoutes = require('./motProduction');
const motProductionRoutesConfig = motProductionRoutes.routes;
const processCenterRoutes = require('./processCenter');
const processCenterRoutesConfig = processCenterRoutes.routes;
//pms
const pmsPageRoutes = require('./pmsPage');
const pmsPageRoutesConfig = pmsPageRoutes.routes;

const getRoutes = () => {
  const routes = {
    exceptionRoutesConfig, // 异常信息的相关路由信息
    loginRoutesConfig, // 登录页面相关路由信息
    testPageRoutesConfig, //  测试demo的相关路由信息
    mainPageRoutesConfig, // 主页面相关路由信息
    IconFontRoutesConfig, // 图标库路由信息
    testPaperPanoramaRoutesConfig, // 测试
    largeScreenRoutesConfig,//大屏路由信息
    taskCenterRoutesConfig,//任务中心路由信息
    singlePageRoutesConfig, // 单页面的路由信息
    motProductionRoutesConfig, //MOT配置相关路由信息
    processCenterRoutesConfig, //工作流流程分析路由信息
    pmsPageRoutesConfig
  };
  const suffix = '';
  const suffixWithDot = `${suffix ? `.${suffix}` : ''}`;
  if (suffixWithDot) {
    Object.keys(routes).forEach((key) => {
      const routesArr = routes[key];
      routesArr.forEach((item, index) => {
        if (item.path) {
          routesArr[index].path = `${item.path}${suffixWithDot}`;
        }
      });
    });
  }
  return routes;
};

exports.routes = getRoutes;
