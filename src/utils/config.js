const getAPIs = require('./api').default;

module.exports = {
  name: 'C5',
  APP_SECRET: 'apex.aas.app.webapi',
  CLIENTID: 'c5::pc',
  prefix: '',
  suffix: '',
  ptlx: 'c5::pc',
  logo: '/logo.png',
  footerText: '武汉顶点软件有限公司 © 2018',
  api: getAPIs && getAPIs(),
  isCas: false, // 否是开启单点登录
  //wps预览插件地址
  // 开发
  PluginsUrl: 'http://192.168.4.159:6011/wps/jsplugins.xml',
  // 测试
  // PluginsUrl: 'http://10.52.181.35:8011/wps/jsplugins.xml',
  // 生产1
  // PluginsUrl: 'http://10.56.36.46:8011/wps/jsplugins.xml',
  // 生产2
  // PluginsUrl: 'http://10.56.36.47:8011/wps/jsplugins.xml',
};
