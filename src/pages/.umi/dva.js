import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  app.use(require('D:/Work/ApexSoft/Projects/pro-pms-fe/node_modules/dva-immer/dist/index.js')());
  app.model({ namespace: 'global', ...(require('D:/Work/ApexSoft/Projects/pro-pms-fe/src/models/global.js').default) });
app.model({ namespace: 'login', ...(require('D:/Work/ApexSoft/Projects/pro-pms-fe/src/models/login.js').default) });
app.model({ namespace: 'test3', ...(require('D:/Work/ApexSoft/Projects/pro-pms-fe/src/models/testPage/test3.js').default) });
app.model({ namespace: 'mainPage', ...(require('D:/Work/ApexSoft/Projects/pro-pms-fe/src/models/workPlatForm/mainPage/mainPage.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
