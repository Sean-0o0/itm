const prefix = '';
exports.routes = [
  {
    path: `${prefix}/403`,
    component: './Exception/403',
  },
  {
    path: `${prefix}/404`,
    component: './Exception/404',
  },
  {
    path: `${prefix}/500`,
    component: './Exception/500',
  },
];
