const prefix = '';
exports.routes = [
  {
    path: `${prefix}/login`,
    models: () => [import('../models/login')],
    component:'../layouts/login',
  },
];
