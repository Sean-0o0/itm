const exceptionRoutes = require('./Exception');
const exceptionRoutesConfig = exceptionRoutes.routes;
const loginRoutes = require('./login');
const loginRoutesConfig = loginRoutes.routes;
const testPageRoutes = require('./testPage');
const testPageRoutesConfig = testPageRoutes.routes;
const mainPageRoutes = require('./workPlatForm/mainPage');
const mainPageRoutesConfig = mainPageRoutes.routes;
const singlePageRoutes = require('./workPlatForm/singlePage');
const singlePageRoutesConfig = singlePageRoutes.routes;

const getRoutes = () => {
  const routes = {
    exceptionRoutesConfig, // 异常信息的相关路由信息
    loginRoutesConfig, // 登录页面相关路由信息
    testPageRoutesConfig, // 测试demo的相关路由信息
    mainPageRoutesConfig, // 主页面相关路由信息
    singlePageRoutesConfig, // 单页面的路由信息
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
