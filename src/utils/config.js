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
};
