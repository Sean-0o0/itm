const prefix = '/single/pms';
exports.routes = [
  {
    path: `${prefix}/`,
    component: './workPlatForm/singlePage',
  },
  {
    path: `${prefix}/ImagePreview`,
    component: './workPlatForm/singlePage/ImagePreview',
  }
];
