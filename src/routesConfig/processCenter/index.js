const prefix = '/processCenter';
exports.routes = [
  {
    path: `${prefix}/proAnalysis`,
    component:'./processCenter/ProAnalysis',
  },
  {
    path: `${prefix}/accountList`,
    component:'./processCenter/AccountList',
  },
]
