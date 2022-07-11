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
  app.use(require('/Applications/code/cxyw/xyzq/pc/pro-cv-fe/node_modules/dva-immer/dist/index.js')());
  app.model({ namespace: 'global', ...(require('/Applications/code/cxyw/xyzq/pc/pro-cv-fe/src/models/global.js').default) });
app.model({ namespace: 'largeScreen', ...(require('/Applications/code/cxyw/xyzq/pc/pro-cv-fe/src/models/largeScreen/largeScreen.js').default) });
app.model({ namespace: 'login', ...(require('/Applications/code/cxyw/xyzq/pc/pro-cv-fe/src/models/login.js').default) });
app.model({ namespace: 'test3', ...(require('/Applications/code/cxyw/xyzq/pc/pro-cv-fe/src/models/testPage/test3.js').default) });
app.model({ namespace: 'mainPage', ...(require('/Applications/code/cxyw/xyzq/pc/pro-cv-fe/src/models/workPlatForm/mainPage/mainPage.js').default) });
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
